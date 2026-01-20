package com.hytaleonlinelist.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Scheduled service for managing claim expiration and cleanup.
 */
@Service
public class ClaimExpirationSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(ClaimExpirationSchedulerService.class);

    private static final int CLAIM_RETENTION_DAYS = 90;

    private final ServerClaimService claimService;

    public ClaimExpirationSchedulerService(ServerClaimService claimService) {
        this.claimService = claimService;
    }

    /**
     * Mark expired pending claims as EXPIRED.
     * Runs every 5 minutes.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void expirePendingClaims() {
        try {
            int expired = claimService.expirePendingClaims();
            if (expired > 0) {
                log.info("Scheduled job: Marked {} pending claims as expired", expired);
            }
        } catch (Exception e) {
            log.error("Error expiring pending claims", e);
        }
    }

    /**
     * Clean up old completed claims.
     * Runs daily at 3 AM.
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupOldClaims() {
        try {
            int deleted = claimService.cleanupOldClaims(CLAIM_RETENTION_DAYS);
            if (deleted > 0) {
                log.info("Scheduled job: Cleaned up {} old claims (older than {} days)",
                        deleted, CLAIM_RETENTION_DAYS);
            }
        } catch (Exception e) {
            log.error("Error cleaning up old claims", e);
        }
    }
}
