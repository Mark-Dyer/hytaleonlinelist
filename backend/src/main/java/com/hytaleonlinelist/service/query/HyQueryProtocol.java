package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

/**
 * HyQuery Protocol implementation (UDP port 5520)
 * Native Hytale server query protocol using the game port
 *
 * Protocol:
 * - Request: "HYQUERY\0" + query_type (0x00=basic, 0x01=full)
 * - Response: "HYREPLY\0" + response_type + data (Little Endian, length-prefixed strings)
 */
@Component
public class HyQueryProtocol implements ServerQueryProtocol {

    private static final Logger log = LoggerFactory.getLogger(HyQueryProtocol.class);

    private static final byte[] REQUEST_MAGIC = "HYQUERY\0".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] RESPONSE_MAGIC = "HYREPLY\0".getBytes(StandardCharsets.US_ASCII);
    private static final byte TYPE_BASIC = 0x00;

    @Override
    public QueryProtocol getProtocolType() {
        return QueryProtocol.HYQUERY;
    }

    @Override
    public int getDefaultPort() {
        return 5520;
    }

    @Override
    public QueryResult query(String host, int port, int timeoutMs) {
        long startTime = System.currentTimeMillis();

        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setSoTimeout(timeoutMs);
            InetAddress address = InetAddress.getByName(host);

            // Create request: MAGIC + query_type
            byte[] request = new byte[REQUEST_MAGIC.length + 1];
            System.arraycopy(REQUEST_MAGIC, 0, request, 0, REQUEST_MAGIC.length);
            request[REQUEST_MAGIC.length] = TYPE_BASIC;

            // Send request
            socket.send(new DatagramPacket(request, request.length, address, port));

            // Receive response
            byte[] responseBuffer = new byte[65535];
            DatagramPacket response = new DatagramPacket(responseBuffer, responseBuffer.length);
            socket.receive(response);

            long responseTime = System.currentTimeMillis() - startTime;

            return parseResponse(response.getData(), response.getLength(), responseTime);

        } catch (SocketTimeoutException e) {
            log.debug("HyQuery timeout for {}:{}", host, port);
            return QueryResult.failure(QueryProtocol.HYQUERY, "Timeout");
        } catch (Exception e) {
            log.debug("HyQuery error for {}:{} - {}", host, port, e.getMessage());
            return QueryResult.failure(QueryProtocol.HYQUERY, e.getMessage());
        }
    }

    @Override
    public boolean isApplicable(String host, int port) {
        return true;
    }

    private QueryResult parseResponse(byte[] data, int length, long responseTime) {
        try {
            if (length < RESPONSE_MAGIC.length + 1) {
                return QueryResult.failure(QueryProtocol.HYQUERY, "Response too short");
            }

            ByteBuffer buf = ByteBuffer.wrap(data, 0, length).order(ByteOrder.LITTLE_ENDIAN);

            // Validate response magic "HYREPLY\0"
            byte[] magic = new byte[RESPONSE_MAGIC.length];
            buf.get(magic);
            for (int i = 0; i < RESPONSE_MAGIC.length; i++) {
                if (magic[i] != RESPONSE_MAGIC[i]) {
                    return QueryResult.failure(QueryProtocol.HYQUERY, "Invalid response magic");
                }
            }

            // Skip response type byte
            buf.get();

            // Parse response fields (length-prefixed strings, little-endian ints)
            String serverName = readString(buf);
            String motd = readString(buf);
            int onlinePlayers = buf.getInt();
            int maxPlayers = buf.getInt();
            int serverPort = buf.getInt();
            String version = readString(buf);

            log.debug("HyQuery success: {} - {} players/{} max, version {}",
                serverName, onlinePlayers, maxPlayers, version);

            return QueryResult.success(onlinePlayers, maxPlayers, serverName, version, motd,
                responseTime, QueryProtocol.HYQUERY);

        } catch (Exception e) {
            log.debug("HyQuery parse error: {}", e.getMessage());
            return QueryResult.failure(QueryProtocol.HYQUERY, "Parse error: " + e.getMessage());
        }
    }

    /**
     * Read a length-prefixed string (2-byte little-endian length + UTF-8 data)
     */
    private String readString(ByteBuffer buf) {
        int length = buf.getShort() & 0xFFFF;
        if (length == 0) {
            return "";
        }
        byte[] bytes = new byte[length];
        buf.get(bytes);
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
