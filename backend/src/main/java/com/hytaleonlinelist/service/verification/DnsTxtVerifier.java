package com.hytaleonlinelist.service.verification;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;
import java.util.regex.Pattern;

/**
 * Verifies server ownership by checking for a DNS TXT record
 * containing the verification token.
 */
@Component
public class DnsTxtVerifier implements ServerVerifier {

    private static final Logger logger = LoggerFactory.getLogger(DnsTxtVerifier.class);

    // Pattern to identify IP addresses vs domain names
    private static final Pattern IP_PATTERN = Pattern.compile(
        "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$"
    );

    @Override
    public VerificationMethod getMethod() {
        return VerificationMethod.DNS_TXT;
    }

    @Override
    public boolean isAvailable(ServerEntity server) {
        // DNS verification requires a domain name, not an IP address
        String address = server.getIpAddress();
        if (address == null || address.isBlank()) {
            return false;
        }
        // Check if it's NOT an IP address (i.e., it's a domain)
        return !IP_PATTERN.matcher(address).matches();
    }

    @Override
    public String getInstructions(ServerEntity server, String token) {
        String domain = extractDomain(server.getIpAddress());

        return """
            To verify ownership using DNS verification:

            1. Add a TXT record to your domain's DNS settings:

               Host/Name: _hol-verify.%s
               Type: TXT
               Value: %s

               OR add to your root domain:

               Host/Name: %s
               Type: TXT
               Value: hol-verify=%s

            2. Wait for DNS propagation (usually 5-15 minutes, can take up to 48 hours).

            3. Click the "Verify" button below once the DNS record is active.

            Note: You can remove the TXT record after successful verification.
            """.formatted(domain, token, domain, token);
    }

    @Override
    public VerificationResult verify(ServerEntity server, String token) {
        String domain = extractDomain(server.getIpAddress());

        logger.info("Attempting DNS TXT verification for server {} (domain: {}) with token {}",
                server.getId(), domain, token);

        try {
            // First, try looking for _hol-verify subdomain
            String subdomainRecord = "_hol-verify." + domain;
            if (checkTxtRecord(subdomainRecord, token)) {
                logger.info("DNS TXT verification successful for server {} via subdomain record",
                        server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your domain ownership has been confirmed.");
            }

            // Then try the root domain with hol-verify= prefix
            if (checkTxtRecordWithPrefix(domain, "hol-verify=" + token)) {
                logger.info("DNS TXT verification successful for server {} via root domain record",
                        server.getId());
                return new VerificationResult(true,
                        "Verification successful! Your domain ownership has been confirmed.");
            }

            logger.info("DNS TXT verification failed for server {} - record not found", server.getId());
            return new VerificationResult(false,
                    "DNS TXT record not found. Please ensure you've added the TXT record and " +
                    "waited for DNS propagation (this can take up to 48 hours).");

        } catch (Exception e) {
            logger.error("Error during DNS TXT verification for server {}: {}",
                    server.getId(), e.getMessage());
            return new VerificationResult(false,
                    "An error occurred while checking DNS records. Please try again later.");
        }
    }

    /**
     * Extract the domain from a server address (removes port if present).
     */
    private String extractDomain(String address) {
        if (address == null) return "";
        // Remove port if present
        int colonIndex = address.lastIndexOf(':');
        if (colonIndex > 0) {
            address = address.substring(0, colonIndex);
        }
        return address.toLowerCase();
    }

    /**
     * Check if a DNS TXT record exists with the exact token value.
     */
    private boolean checkTxtRecord(String domain, String expectedValue) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");

            DirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"TXT"});
            Attribute txtAttr = attrs.get("TXT");

            if (txtAttr != null) {
                NamingEnumeration<?> values = txtAttr.getAll();
                while (values.hasMore()) {
                    String value = values.next().toString();
                    // Remove quotes if present
                    value = value.replaceAll("^\"|\"$", "");
                    if (value.equals(expectedValue)) {
                        ctx.close();
                        return true;
                    }
                }
            }
            ctx.close();
        } catch (NamingException e) {
            logger.debug("DNS lookup failed for {}: {}", domain, e.getMessage());
        }
        return false;
    }

    /**
     * Check if a DNS TXT record exists that contains the expected prefix value.
     */
    private boolean checkTxtRecordWithPrefix(String domain, String expectedValue) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");

            DirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"TXT"});
            Attribute txtAttr = attrs.get("TXT");

            if (txtAttr != null) {
                NamingEnumeration<?> values = txtAttr.getAll();
                while (values.hasMore()) {
                    String value = values.next().toString();
                    // Remove quotes if present
                    value = value.replaceAll("^\"|\"$", "");
                    if (value.equals(expectedValue) || value.contains(expectedValue)) {
                        ctx.close();
                        return true;
                    }
                }
            }
            ctx.close();
        } catch (NamingException e) {
            logger.debug("DNS lookup failed for {}: {}", domain, e.getMessage());
        }
        return false;
    }
}
