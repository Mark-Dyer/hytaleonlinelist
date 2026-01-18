package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.ServerStatusHistoryEntity;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.domain.repository.ServerStatusHistoryRepository;
import com.hytaleonlinelist.dto.response.ServerStatusHistoryResponse;
import com.hytaleonlinelist.dto.response.ServerUptimeResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for server status and uptime information
 */
@Service
public class ServerStatusService {

    private final ServerRepository serverRepository;
    private final ServerStatusHistoryRepository historyRepository;

    public ServerStatusService(
        ServerRepository serverRepository,
        ServerStatusHistoryRepository historyRepository
    ) {
        this.serverRepository = serverRepository;
        this.historyRepository = historyRepository;
    }

    /**
     * Get uptime statistics for a server
     */
    @Transactional(readOnly = true)
    public ServerUptimeResponse getUptimeStats(UUID serverId) {
        ServerEntity server = serverRepository.findById(serverId)
            .orElseThrow(() -> new ResourceNotFoundException("Server not found with id: " + serverId));

        Instant now = Instant.now();
        Instant since24h = now.minus(24, ChronoUnit.HOURS);
        Instant since7d = now.minus(7, ChronoUnit.DAYS);

        // Calculate 24h uptime
        long total24h = historyRepository.countTotalPingsSince(serverId, since24h);
        long online24h = historyRepository.countOnlinePingsSince(serverId, since24h);
        double uptime24h = total24h > 0 ? (online24h * 100.0) / total24h : 0.0;

        // Calculate 7d uptime
        long total7d = historyRepository.countTotalPingsSince(serverId, since7d);
        long online7d = historyRepository.countOnlinePingsSince(serverId, since7d);
        double uptime7d = total7d > 0 ? (online7d * 100.0) / total7d : 0.0;

        // Get average response time (24h)
        Double avgResponseTime = historyRepository.getAverageResponseTime(serverId, since24h);

        return new ServerUptimeResponse(
            serverId,
            Math.round(uptime24h * 10.0) / 10.0,  // Round to 1 decimal
            Math.round(uptime7d * 10.0) / 10.0,
            avgResponseTime != null ? avgResponseTime.intValue() : null,
            total24h,
            server.getIsOnline(),
            server.getLastPingedAt()
        );
    }

    /**
     * Get status history for a server (for charts)
     */
    @Transactional(readOnly = true)
    public List<ServerStatusHistoryResponse> getStatusHistory(UUID serverId, int hours) {
        if (!serverRepository.existsById(serverId)) {
            throw new ResourceNotFoundException("Server not found with id: " + serverId);
        }

        // Cap at 168 hours (7 days)
        hours = Math.min(hours, 168);
        Instant since = Instant.now().minus(hours, ChronoUnit.HOURS);

        List<ServerStatusHistoryEntity> history = historyRepository.findByServerIdSince(serverId, since);

        return history.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private ServerStatusHistoryResponse toResponse(ServerStatusHistoryEntity entity) {
        return new ServerStatusHistoryResponse(
            entity.getIsOnline(),
            entity.getPlayerCount(),
            entity.getMaxPlayers(),
            entity.getResponseTimeMs(),
            entity.getQueryProtocol() != null ? entity.getQueryProtocol().name() : null,
            entity.getRecordedAt()
        );
    }
}
