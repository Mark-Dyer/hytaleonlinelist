package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.QueryProtocol;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.ServerStatusHistoryEntity;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.domain.repository.ServerStatusHistoryRepository;
import com.hytaleonlinelist.health.ScheduledTasksHealthIndicator;
import com.hytaleonlinelist.service.query.QueryResult;
import com.hytaleonlinelist.service.query.ServerQueryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

/**
 * Scheduled service for monitoring server status
 * Processes servers in parallel batches for optimal performance
 */
@Service
public class ServerStatusSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(ServerStatusSchedulerService.class);

    private static final int BATCH_SIZE = 50;
    private static final int THREAD_POOL_SIZE = 10;
    private static final int HISTORY_RETENTION_DAYS = 30;

    private final ServerRepository serverRepository;
    private final ServerStatusHistoryRepository historyRepository;
    private final ServerQueryService queryService;
    private final ScheduledTasksHealthIndicator healthIndicator;
    private final ExecutorService executorService;

    public ServerStatusSchedulerService(
        ServerRepository serverRepository,
        ServerStatusHistoryRepository historyRepository,
        ServerQueryService queryService,
        ScheduledTasksHealthIndicator healthIndicator
    ) {
        this.serverRepository = serverRepository;
        this.historyRepository = historyRepository;
        this.queryService = queryService;
        this.healthIndicator = healthIndicator;
        this.executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
    }

    /**
     * Process a batch of servers every minute
     * Servers are processed in parallel for better performance
     */
    @Scheduled(fixedRate = 60000)
    public void processServerBatch() {
        List<ServerEntity> servers = serverRepository.findServersNeedingPing(
            PageRequest.of(0, BATCH_SIZE)
        );

        if (servers.isEmpty()) {
            log.debug("No servers to process");
            return;
        }

        log.info("Starting server status check batch: {} servers (parallel)", servers.size());
        long startTime = System.currentTimeMillis();

        // Query all servers in parallel - rely on protocol-level timeouts (3s × 4 protocols = 12s max)
        List<CompletableFuture<ServerQueryResult>> futures = servers.stream()
            .map(server -> CompletableFuture.supplyAsync(
                () -> queryServer(server),
                executorService
            ).exceptionally(ex -> {
                 log.warn("Query error for {}: {}", server.getName(), ex.getMessage());
                 return new ServerQueryResult(server, QueryResult.failure(QueryProtocol.FAILED, ex.getMessage()));
             }))
            .toList();

        // Wait for ALL queries to complete before saving
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        // Collect results
        List<ServerQueryResult> results = futures.stream()
            .map(CompletableFuture::join)
            .toList();

        // Batch save all results
        saveResultsBatch(results);

        long elapsed = System.currentTimeMillis() - startTime;
        log.info("Completed server status check batch: {} servers in {}ms", servers.size(), elapsed);

        // Record successful run for health monitoring
        healthIndicator.recordServerPingRun();
    }

    /**
     * Query a single server and return the result with the server
     */
    private ServerQueryResult queryServer(ServerEntity server) {
        QueryResult result = queryService.queryServer(server);
        return new ServerQueryResult(server, result);
    }

    /**
     * Batch save all server updates and history records
     * Note: Not using @Transactional here as it's called from the same class
     * and would bypass the proxy. saveAll handles transactions internally.
     */
    private void saveResultsBatch(List<ServerQueryResult> results) {
        List<ServerEntity> serversToSave = new ArrayList<>();
        List<ServerStatusHistoryEntity> historyToSave = new ArrayList<>();
        Instant now = Instant.now();

        int onlineCount = 0;
        int offlineCount = 0;

        for (ServerQueryResult sqr : results) {
            ServerEntity server = sqr.server();
            QueryResult result = sqr.result();

            // Update server status
            server.setIsOnline(result.online());
            server.setLastPingedAt(now);

            if (result.online()) {
                onlineCount++;
                // Always update player counts from result
                // HyQuery/Nitrado provide actual data, QUIC/BasicPing return null
                // null = show "N/A" on UI (we don't know the player count)
                server.setPlayerCount(result.playerCount());
                server.setMaxPlayers(result.maxPlayers());
                server.setPreferredQueryProtocol(result.protocol());
                log.debug("Server {} is ONLINE via {} - {} players",
                    server.getName(), result.protocol(),
                    result.playerCount() != null ? result.playerCount() : "N/A");
            } else {
                offlineCount++;
                log.debug("Server {} is OFFLINE: {}", server.getName(), result.errorMessage());
            }

            serversToSave.add(server);

            // Create history record
            ServerStatusHistoryEntity history = new ServerStatusHistoryEntity();
            history.setServer(server);
            history.setIsOnline(result.online());
            history.setPlayerCount(result.playerCount());
            history.setMaxPlayers(result.maxPlayers());
            history.setResponseTimeMs(result.online() ? (int) result.responseTimeMs() : null);
            history.setQueryProtocol(result.protocol());
            history.setErrorMessage(result.errorMessage());
            history.setRecordedAt(now);

            historyToSave.add(history);
        }

        // Batch save all at once - saveAll handles its own transaction
        serverRepository.saveAll(serversToSave);
        serverRepository.flush(); // Force immediate write to DB
        historyRepository.saveAll(historyToSave);
        historyRepository.flush();

        log.info("Batch saved: {} online, {} offline, {} history records",
            onlineCount, offlineCount, historyToSave.size());
    }

    /**
     * Clean up old history records daily at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupOldHistory() {
        Instant cutoff = Instant.now().minus(HISTORY_RETENTION_DAYS, ChronoUnit.DAYS);
        int deleted = historyRepository.deleteOlderThan(cutoff);
        log.info("Cleaned up {} old status history records (older than {} days)",
            deleted, HISTORY_RETENTION_DAYS);

        // Record successful run for health monitoring
        healthIndicator.recordCleanupRun();
    }

    /**
     * Update uptime percentages for all servers hourly
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void updateUptimePercentages() {
        log.info("Updating uptime percentages for all servers");

        List<ServerEntity> servers = serverRepository.findAll();
        Instant since24h = Instant.now().minus(24, ChronoUnit.HOURS);

        List<ServerEntity> updatedServers = new ArrayList<>();

        for (ServerEntity server : servers) {
            try {
                long totalPings = historyRepository.countTotalPingsSince(server.getId(), since24h);
                if (totalPings > 0) {
                    long onlinePings = historyRepository.countOnlinePingsSince(server.getId(), since24h);
                    double uptime = (onlinePings * 100.0) / totalPings;
                    server.setUptimePercentage(Math.round(uptime * 10.0) / 10.0);
                    updatedServers.add(server);
                }
            } catch (Exception e) {
                log.error("Error calculating uptime for server {}: {}", server.getId(), e.getMessage());
            }
        }

        // Batch save all updated servers
        if (!updatedServers.isEmpty()) {
            serverRepository.saveAll(updatedServers);
        }

        log.info("Completed uptime percentage update for {} servers", updatedServers.size());

        // Record successful run for health monitoring
        healthIndicator.recordUptimeCalculationRun();
    }

    /**
     * Internal record to pair a server with its query result
     */
    private record ServerQueryResult(ServerEntity server, QueryResult result) {}
}
