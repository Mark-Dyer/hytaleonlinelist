package com.hytaleonlinelist.service.verification;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Verifies server ownership by checking for a verification file
 * uploaded to the server's website.
 */
@Component
public class FileUploadVerifier implements ServerVerifier {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadVerifier.class);

    private static final String VERIFICATION_FILE_NAME = "hol-verify.txt";
    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    private final HttpClient httpClient;

    public FileUploadVerifier() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(TIMEOUT)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    @Override
    public VerificationMethod getMethod() {
        return VerificationMethod.FILE_UPLOAD;
    }

    @Override
    public boolean isAvailable(ServerEntity server) {
        // File upload verification requires a website URL
        String websiteUrl = server.getWebsiteUrl();
        return websiteUrl != null && !websiteUrl.isBlank() &&
               (websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://"));
    }

    @Override
    public String getInstructions(ServerEntity server, String token) {
        String baseUrl = normalizeUrl(server.getWebsiteUrl());

        return """
            To verify ownership using file upload verification:

            1. Create a file named: %s

            2. The file should contain ONLY this verification code:
               %s

            3. Upload the file to the root of your website so it's accessible at:
               %s/%s

            4. Click the "Verify" button below once the file is uploaded.

            5. After successful verification, you can delete the file.

            Note: The file must be publicly accessible (no login required).
            """.formatted(VERIFICATION_FILE_NAME, token, baseUrl, VERIFICATION_FILE_NAME);
    }

    @Override
    public VerificationResult verify(ServerEntity server, String token) {
        String baseUrl = normalizeUrl(server.getWebsiteUrl());
        String verificationUrl = baseUrl + "/" + VERIFICATION_FILE_NAME;

        logger.info("Attempting file upload verification for server {} at URL: {}",
                server.getId(), verificationUrl);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(verificationUrl))
                    .timeout(TIMEOUT)
                    .GET()
                    .header("User-Agent", "HytaleOnlineList-Verifier/1.0")
                    .build();

            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                logger.info("File upload verification failed for server {} - file not found (404)",
                        server.getId());
                return new VerificationResult(false,
                        "Verification file not found. Please ensure you uploaded '" +
                        VERIFICATION_FILE_NAME + "' to the root of your website.");
            }

            if (response.statusCode() != 200) {
                logger.warn("File upload verification failed for server {} - HTTP status: {}",
                        server.getId(), response.statusCode());
                return new VerificationResult(false,
                        "Could not access verification file. HTTP status: " + response.statusCode());
            }

            String content = response.body().trim();

            // Check if the file contains the exact token
            if (content.equals(token)) {
                logger.info("File upload verification successful for server {}", server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your website ownership has been confirmed.");
            }

            // Also accept if the token is contained in the file (in case of extra whitespace)
            if (content.contains(token) && content.length() < token.length() + 10) {
                logger.info("File upload verification successful for server {} (with whitespace)",
                        server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your website ownership has been confirmed.");
            }

            logger.info("File upload verification failed for server {} - token mismatch",
                    server.getId());
            return new VerificationResult(false,
                    "Verification file found but content doesn't match. " +
                    "Please ensure the file contains only the verification code.");

        } catch (Exception e) {
            logger.error("Error during file upload verification for server {}: {}",
                    server.getId(), e.getMessage());
            return new VerificationResult(false,
                    "Could not access your website. Please ensure it's accessible and try again.");
        }
    }

    /**
     * Normalize the website URL (remove trailing slash, etc.).
     */
    private String normalizeUrl(String url) {
        if (url == null) return "";
        url = url.trim();
        // Remove trailing slash
        while (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url;
    }
}
