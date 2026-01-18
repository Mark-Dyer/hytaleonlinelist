package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.*;

/**
 * Basic Ping Protocol - Simple connectivity check (like Unix ping)
 * Uses multiple methods to check if server is reachable:
 * 1. ICMP echo (via InetAddress.isReachable)
 * 2. TCP connect to game port
 *
 * Note: This only checks connectivity, not actual server status or player counts.
 */
@Component
public class BasicPingProtocol implements ServerQueryProtocol {

    private static final Logger log = LoggerFactory.getLogger(BasicPingProtocol.class);

    @Override
    public QueryProtocol getProtocolType() {
        return QueryProtocol.BASIC_PING;
    }

    @Override
    public int getDefaultPort() {
        return 5520; // Default Hytale game port
    }

    @Override
    public QueryResult query(String host, int port, int timeoutMs) {
        long startTime = System.currentTimeMillis();

        try {
            InetAddress address = InetAddress.getByName(host);

            // Method 1: ICMP-style ping (requires root on some systems, falls back to TCP port 7)
            if (address.isReachable(timeoutMs)) {
                long responseTime = System.currentTimeMillis() - startTime;
                log.info("BasicPing ICMP success for {}: {}ms", host, responseTime);
                // null playerCount = unknown (basic ping doesn't retrieve player info)
                return QueryResult.success(null, null, "", "", "",
                    responseTime, QueryProtocol.BASIC_PING);
            }

            // Method 2: TCP connect to the game port
            return tryTcpConnect(host, port, timeoutMs, startTime);

        } catch (Exception e) {
            log.debug("BasicPing error for {}:{} - {}", host, port, e.getMessage());
            return QueryResult.failure(QueryProtocol.BASIC_PING, e.getMessage());
        }
    }

    @Override
    public boolean isApplicable(String host, int port) {
        return true; // Always applicable as last resort fallback
    }

    /**
     * Try TCP connection to the game port
     */
    private QueryResult tryTcpConnect(String host, int port, int timeoutMs, long startTime) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), timeoutMs);
            long responseTime = System.currentTimeMillis() - startTime;

            log.debug("BasicPing TCP success for {}:{}: {}ms", host, port, responseTime);
            // null playerCount = unknown (basic ping doesn't retrieve player info)
            return QueryResult.success(null, null, "", "", "",
                responseTime, QueryProtocol.BASIC_PING);

        } catch (Exception e) {
            log.debug("BasicPing TCP failed for {}:{} - {}", host, port, e.getMessage());
            return QueryResult.failure(QueryProtocol.BASIC_PING, "Host unreachable");
        }
    }
}
