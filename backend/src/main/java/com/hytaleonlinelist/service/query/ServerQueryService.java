package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Multi-protocol server query orchestrator
 * Tries multiple query protocols with fallback strategy
 */
@Service
public class ServerQueryService {

    private static final Logger log = LoggerFactory.getLogger(ServerQueryService.class);

    // 3 second timeout per protocol (4 protocols = 12s max total)
    private static final int DEFAULT_TIMEOUT_MS = 3000;

    private final List<ServerQueryProtocol> protocols;

    public ServerQueryService(
        HyQueryProtocol hyQueryProtocol,
        NitradoQueryProtocol nitradoQueryProtocol,
        QuicPingProtocol quicPingProtocol,
        BasicPingProtocol basicPingProtocol
    ) {
        // Order matters - try protocols in priority order
        this.protocols = List.of(
            hyQueryProtocol,      // HyQuery plugin (UDP 5520) - full server info
            nitradoQueryProtocol, // Nitrado Query plugin (HTTPS 5523) - full server info
            quicPingProtocol,     // QUIC ping (UDP 5520) - confirms Hytale server responds
            basicPingProtocol     // Fallback connectivity check (ICMP/TCP)
        );
    }

    /**
     * Query a server using the best available protocol
     *
     * @param server The server to query
     * @return Query result with status information
     */
    public QueryResult queryServer(ServerEntity server) {
        String host = server.getIpAddress();
        int gamePort = server.getPort();
        Integer queryPort = server.getQueryPort();

        // If server has a preferred protocol that worked before, try it first
        if (server.getPreferredQueryProtocol() != null &&
            server.getPreferredQueryProtocol() != QueryProtocol.FAILED) {
            QueryResult result = tryPreferredProtocol(server, host, gamePort, queryPort);
            if (result.online()) {
                return result;
            }
            // Preferred protocol failed, fall through to try others
        }

        // Try each protocol in order
        return tryAllProtocols(host, gamePort, queryPort);
    }

    /**
     * Try the server's preferred (cached) protocol first
     */
    private QueryResult tryPreferredProtocol(ServerEntity server, String host, int gamePort, Integer queryPort) {
        QueryProtocol preferred = server.getPreferredQueryProtocol();

        for (ServerQueryProtocol protocol : protocols) {
            if (protocol.getProtocolType() == preferred) {
                int port = determinePort(protocol, gamePort, queryPort);
                QueryResult result = protocol.query(host, port, DEFAULT_TIMEOUT_MS);
                if (result.online()) {
                    log.debug("Preferred protocol {} succeeded for {}:{}", preferred, host, port);
                    return result;
                }
                break;
            }
        }

        return QueryResult.failure(preferred, "Preferred protocol failed");
    }

    /**
     * Try all protocols in order until one succeeds
     */
    private QueryResult tryAllProtocols(String host, int gamePort, Integer queryPort) {
        for (ServerQueryProtocol protocol : protocols) {
            int port = determinePort(protocol, gamePort, queryPort);

            if (!protocol.isApplicable(host, port)) {
                continue;
            }

            try {
                QueryResult result = protocol.query(host, port, DEFAULT_TIMEOUT_MS);
                if (result.online()) {
                    log.debug("Protocol {} succeeded for {}:{}", protocol.getProtocolType(), host, port);
                    return result;
                }
            } catch (Exception e) {
                log.debug("Protocol {} threw exception for {}:{} - {}",
                    protocol.getProtocolType(), host, port, e.getMessage());
            }
        }

        // All protocols failed
        log.debug("All protocols failed for {}:{}", host, gamePort);
        return QueryResult.failure(QueryProtocol.FAILED, "All query protocols failed");
    }

    /**
     * Determine which port to use for a protocol
     */
    private int determinePort(ServerQueryProtocol protocol, int gamePort, Integer queryPort) {
        // HyQuery, QUIC, and BasicPing use the game port directly
        if (protocol.getProtocolType() == QueryProtocol.HYQUERY ||
            protocol.getProtocolType() == QueryProtocol.QUIC ||
            protocol.getProtocolType() == QueryProtocol.BASIC_PING) {
            return gamePort;
        }

        // If a custom query port is set, use it for other query protocols
        if (queryPort != null) {
            return queryPort;
        }

        // Use protocol's default port
        return protocol.getDefaultPort();
    }

    /**
     * Query a server by host and port directly (for testing)
     */
    public QueryResult queryServer(String host, int port) {
        return tryAllProtocols(host, port, null);
    }
}
