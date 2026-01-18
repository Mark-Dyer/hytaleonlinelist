package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.*;
import java.nio.ByteBuffer;
import java.security.SecureRandom;

/**
 * QUIC Ping Protocol - Check if a QUIC server is listening on the game port
 *
 * Sends a minimal QUIC Initial packet and checks for any QUIC response.
 * This doesn't establish a full connection, just verifies the server responds to QUIC.
 *
 * Hytale uses QUIC over UDP on port 5520.
 */
@Component
public class QuicPingProtocol implements ServerQueryProtocol {

    private static final Logger log = LoggerFactory.getLogger(QuicPingProtocol.class);
    private static final SecureRandom random = new SecureRandom();

    // QUIC version 1 (RFC 9000)
    private static final int QUIC_VERSION_1 = 0x00000001;

    // Minimum QUIC Initial packet size (must be at least 1200 bytes per RFC 9000)
    private static final int MIN_INITIAL_PACKET_SIZE = 1200;

    @Override
    public QueryProtocol getProtocolType() {
        return QueryProtocol.QUIC;
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

            // Send QUIC Initial packet
            byte[] initialPacket = createQuicInitialPacket();
            socket.send(new DatagramPacket(initialPacket, initialPacket.length, address, port));

            // Wait for any response
            byte[] responseBuffer = new byte[2048];
            DatagramPacket response = new DatagramPacket(responseBuffer, responseBuffer.length);

            try {
                socket.receive(response);
                long responseTime = System.currentTimeMillis() - startTime;

                // Check if response looks like a QUIC packet (has long header with version)
                if (isQuicResponse(response.getData(), response.getLength())) {
                    log.info("QUIC ping success for {}:{} - {}ms", host, port, responseTime);
                    // null playerCount = unknown (QUIC ping doesn't retrieve player info)
                    return QueryResult.success(null, null, "", "", "",
                        responseTime, QueryProtocol.QUIC);
                } else {
                    log.debug("QUIC ping got non-QUIC response for {}:{}", host, port);
                    return QueryResult.failure(QueryProtocol.QUIC, "Non-QUIC response");
                }

            } catch (SocketTimeoutException e) {
                log.debug("QUIC ping timeout for {}:{}", host, port);
                return QueryResult.failure(QueryProtocol.QUIC, "Timeout");
            }

        } catch (Exception e) {
            log.debug("QUIC ping error for {}:{} - {}", host, port, e.getMessage());
            return QueryResult.failure(QueryProtocol.QUIC, e.getMessage());
        }
    }

    @Override
    public boolean isApplicable(String host, int port) {
        return true;
    }

    /**
     * Create a minimal QUIC Initial packet
     *
     * Format (Long Header):
     * - Header Form (1 bit) = 1 (Long Header)
     * - Fixed Bit (1 bit) = 1
     * - Long Packet Type (2 bits) = 0 (Initial)
     * - Reserved (2 bits) = 0
     * - Packet Number Length (2 bits) = 0 (1 byte)
     * - Version (4 bytes)
     * - Destination Connection ID Length (1 byte)
     * - Destination Connection ID (variable)
     * - Source Connection ID Length (1 byte)
     * - Source Connection ID (variable)
     * - Token Length (variable-length integer)
     * - Length (variable-length integer)
     * - Packet Number (1-4 bytes)
     * - Payload (CRYPTO frame with ClientHello, but we send minimal/empty)
     * - Padding to reach 1200 bytes minimum
     */
    private byte[] createQuicInitialPacket() {
        ByteBuffer buffer = ByteBuffer.allocate(MIN_INITIAL_PACKET_SIZE);

        // First byte: Long Header (1), Fixed (1), Initial type (00), Reserved (00), PN Length (00)
        // = 11000000 = 0xC0
        buffer.put((byte) 0xC0);

        // Version (4 bytes) - QUIC v1
        buffer.putInt(QUIC_VERSION_1);

        // Destination Connection ID Length (1 byte) + ID (8 bytes random)
        byte[] dcid = new byte[8];
        random.nextBytes(dcid);
        buffer.put((byte) dcid.length);
        buffer.put(dcid);

        // Source Connection ID Length (1 byte) + ID (8 bytes random)
        byte[] scid = new byte[8];
        random.nextBytes(scid);
        buffer.put((byte) scid.length);
        buffer.put(scid);

        // Token Length (variable-length integer) = 0
        buffer.put((byte) 0x00);

        // Length field (variable-length integer) - remaining bytes including packet number
        // We'll pad to exactly MIN_INITIAL_PACKET_SIZE
        int currentPos = buffer.position();
        int lengthFieldSize = 2; // We'll use 2-byte encoding
        int packetNumberSize = 1;
        int remainingForPayload = MIN_INITIAL_PACKET_SIZE - currentPos - lengthFieldSize - packetNumberSize;

        // 2-byte variable-length integer: 01xxxxxx xxxxxxxx (14 bits)
        int lengthValue = packetNumberSize + remainingForPayload;
        buffer.put((byte) (0x40 | ((lengthValue >> 8) & 0x3F)));
        buffer.put((byte) (lengthValue & 0xFF));

        // Packet Number (1 byte)
        buffer.put((byte) 0x00);

        // Padding frame (type 0x00) to reach minimum size
        while (buffer.position() < MIN_INITIAL_PACKET_SIZE) {
            buffer.put((byte) 0x00);
        }

        return buffer.array();
    }

    /**
     * Check if response looks like a QUIC packet
     * QUIC packets have specific header formats we can validate
     */
    private boolean isQuicResponse(byte[] data, int length) {
        if (length < 5) {
            return false;
        }

        byte firstByte = data[0];

        // Check for Long Header (bit 7 = 1) or Short Header (bit 7 = 0)
        boolean isLongHeader = (firstByte & 0x80) != 0;

        if (isLongHeader) {
            // Long header: check Fixed Bit (bit 6 should be 1)
            if ((firstByte & 0x40) == 0) {
                return false;
            }

            // Check version field (bytes 1-4)
            int version = ((data[1] & 0xFF) << 24) |
                         ((data[2] & 0xFF) << 16) |
                         ((data[3] & 0xFF) << 8) |
                         (data[4] & 0xFF);

            // Valid if version is QUIC v1, v2, or version negotiation (0)
            return version == 0x00000001 || version == 0x6b3343cf || version == 0x00000000;
        } else {
            // Short header: Fixed Bit (bit 6) should be 1
            return (firstByte & 0x40) != 0;
        }
    }
}
