package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;

/**
 * Interface for server query protocol implementations
 */
public interface ServerQueryProtocol {

    /**
     * Get the protocol type this implementation handles
     */
    QueryProtocol getProtocolType();

    /**
     * Get the default port for this protocol
     */
    int getDefaultPort();

    /**
     * Query a server using this protocol
     *
     * @param host Server hostname or IP address
     * @param port Port to query on
     * @param timeoutMs Timeout in milliseconds
     * @return Query result with server status
     */
    QueryResult query(String host, int port, int timeoutMs);

    /**
     * Check if this protocol is applicable for the given server
     */
    boolean isApplicable(String host, int port);
}
