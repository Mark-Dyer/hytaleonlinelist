package com.hytaleonlinelist.health;

import com.hytaleonlinelist.config.R2Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

/**
 * Health indicator for Cloudflare R2 storage.
 * Checks if the configured bucket is accessible.
 */
@Component
@ConditionalOnBean(S3Client.class)
public class R2StorageHealthIndicator implements HealthIndicator {

    private static final Logger log = LoggerFactory.getLogger(R2StorageHealthIndicator.class);

    private final S3Client s3Client;
    private final R2Properties r2Properties;

    public R2StorageHealthIndicator(S3Client s3Client, R2Properties r2Properties) {
        this.s3Client = s3Client;
        this.r2Properties = r2Properties;
    }

    @Override
    public Health health() {
        try {
            String bucketName = r2Properties.getBucketName();

            HeadBucketRequest request = HeadBucketRequest.builder()
                    .bucket(bucketName)
                    .build();

            s3Client.headBucket(request);

            return Health.up()
                    .withDetail("bucket", bucketName)
                    .withDetail("endpoint", r2Properties.getEndpoint())
                    .build();

        } catch (S3Exception e) {
            log.warn("R2 storage health check failed: {}", e.getMessage());

            return Health.down()
                    .withDetail("error", e.getMessage())
                    .withDetail("bucket", r2Properties.getBucketName())
                    .withDetail("statusCode", e.statusCode())
                    .build();

        } catch (Exception e) {
            log.error("R2 storage health check failed with unexpected error", e);

            return Health.down()
                    .withDetail("error", e.getMessage())
                    .withDetail("errorType", e.getClass().getSimpleName())
                    .build();
        }
    }
}
