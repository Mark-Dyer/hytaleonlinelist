package com.hytaleonlinelist.service.verification;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;
import com.hytaleonlinelist.service.query.QueryResult;
import com.hytaleonlinelist.service.query.ServerQueryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Verifies server ownership by checking if the verification token
 * appears in the server's MOTD (Message of the Day).
 */
@Component
public class MotdVerifier implements ServerVerifier {

    private static final Logger logger = LoggerFactory.getLogger(MotdVerifier.class);

    private final ServerQueryService queryService;

    public MotdVerifier(ServerQueryService queryService) {
        this.queryService = queryService;
    }

    @Override
    public VerificationMethod getMethod() {
        return VerificationMethod.MOTD;
    }

    @Override
    public boolean isAvailable(ServerEntity server) {
        // MOTD verification is always available if we can query the server
        return server.getIpAddress() != null && !server.getIpAddress().isBlank();
    }

    @Override
    public String getInstructions(ServerEntity server, String token) {
        return """
            To verify ownership using MOTD verification:

            1. Add the following code to your server's MOTD or server description:
               HOL-%s

            2. Make sure your server is online and accessible at:
               %s:%d

            3. Click the "Verify" button below once the code is added.

            4. After successful verification, you can remove the code from your MOTD.

            Note: The verification code expires in 48 hours.
            """.formatted(token, server.getIpAddress(), server.getPort());
    }

    @Override
    public VerificationResult verify(ServerEntity server, String token) {
        String expectedCode = "HOL-" + token;

        logger.info("Attempting MOTD verification for server {} with token {}",
                server.getId(), token);

        try {
            // Query the server to get current MOTD/description
            QueryResult result = queryService.queryServer(server);

            if (!result.online()) {
                logger.warn("Failed to query server {} for MOTD verification: {}",
                        server.getId(), result.errorMessage());
                return new VerificationResult(false,
                        "Could not connect to server. Please ensure your server is online and try again.");
            }

            // Check if the MOTD contains our verification code
            String motd = result.motd();
            if (motd != null && motd.contains(expectedCode)) {
                logger.info("MOTD verification successful for server {}", server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your server ownership has been confirmed.");
            }

            // Also check the server name in case they added it there
            String serverName = result.serverName();
            if (serverName != null && serverName.contains(expectedCode)) {
                logger.info("MOTD verification successful (found in server name) for server {}",
                        server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your server ownership has been confirmed.");
            }

            logger.info("MOTD verification failed for server {} - code not found", server.getId());
            return new VerificationResult(false,
                    "Verification code not found in server MOTD. " +
                    "Please ensure you added 'HOL-" + token + "' to your server's MOTD and try again.");

        } catch (Exception e) {
            logger.error("Error during MOTD verification for server {}: {}",
                    server.getId(), e.getMessage());
            return new VerificationResult(false,
                    "An error occurred while verifying. Please try again later.");
        }
    }
}
