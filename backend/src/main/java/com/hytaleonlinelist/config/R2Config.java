package com.hytaleonlinelist.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
@ConditionalOnProperty(prefix = "cloudflare.r2", name = "enabled", havingValue = "true")
public class R2Config {

    private final R2Properties r2Properties;

    public R2Config(R2Properties r2Properties) {
        this.r2Properties = r2Properties;
    }

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                r2Properties.getAccessKeyId(),
                r2Properties.getSecretAccessKey()
        );

        return S3Client.builder()
                .endpointOverride(URI.create(r2Properties.getEndpoint()))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.of("auto"))
                .forcePathStyle(true)
                .build();
    }
}
