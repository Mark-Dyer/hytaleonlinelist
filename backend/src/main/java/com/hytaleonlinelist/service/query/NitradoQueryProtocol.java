package com.hytaleonlinelist.service.query;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hytaleonlinelist.domain.entity.QueryProtocol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Nitrado Query Protocol implementation (HTTPS port 5523)
 * REST API provided by Nitrado hosting for Hytale servers
 */
@Component
public class NitradoQueryProtocol implements ServerQueryProtocol {

    private static final Logger log = LoggerFactory.getLogger(NitradoQueryProtocol.class);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();

    @Override
    public QueryProtocol getProtocolType() {
        return QueryProtocol.NITRADO;
    }

    @Override
    public int getDefaultPort() {
        return 5523;
    }

    @Override
    public QueryResult query(String host, int port, int timeoutMs) {
        long startTime = System.currentTimeMillis();

        try {
            // Nitrado Query plugin endpoint
            String url = String.format("https://%s:%d/Nitrado/Query", host, port);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofMillis(timeoutMs))
                .header("Accept", "application/x.hytale.nitrado.query+json;version=1")
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            long responseTime = System.currentTimeMillis() - startTime;

            if (response.statusCode() != 200) {
                return QueryResult.failure(QueryProtocol.NITRADO, "HTTP " + response.statusCode());
            }

            return parseResponse(response.body(), responseTime);

        } catch (Exception e) {
            log.debug("Nitrado query error for {}:{} - {}", host, port, e.getMessage());
            return QueryResult.failure(QueryProtocol.NITRADO, e.getMessage());
        }
    }

    @Override
    public boolean isApplicable(String host, int port) {
        // Nitrado servers typically have this API available
        return true;
    }

    private QueryResult parseResponse(String json, long responseTime) {
        try {
            JsonNode root = objectMapper.readTree(json);

            String serverName = "";
            String version = "";
            String motd = "";
            int numPlayers = 0;
            int maxPlayers = 0;

            // Format 1: Flat response (common API wrapper format)
            // { "online", "serverName", "players", "maxPlayers", "version", "motd" }
            if (root.has("online")) {
                boolean online = root.get("online").asBoolean();
                if (!online) {
                    return QueryResult.failure(QueryProtocol.NITRADO, "Server offline");
                }
                serverName = getTextOrDefault(root, "serverName", "");
                version = getTextOrDefault(root, "version", "");
                motd = getTextOrDefault(root, "motd", "");
                numPlayers = getIntOrDefault(root, "players", 0);
                maxPlayers = getIntOrDefault(root, "maxPlayers", 0);
            }
            // Format 2: Official Nitrado Query plugin format
            // { "Server": { "Name", "Version", "MaxPlayers" }, "Universe": { "CurrentPlayers" } }
            else if (root.has("Server")) {
                JsonNode server = root.get("Server");
                serverName = getTextOrDefault(server, "Name", "");
                version = getTextOrDefault(server, "Version", "");
                maxPlayers = getIntOrDefault(server, "MaxPlayers", 0);

                if (root.has("Universe")) {
                    JsonNode universe = root.get("Universe");
                    numPlayers = getIntOrDefault(universe, "CurrentPlayers", 0);
                }
            }

            return QueryResult.success(numPlayers, maxPlayers, serverName, version, motd,
                responseTime, QueryProtocol.NITRADO);

        } catch (Exception e) {
            return QueryResult.failure(QueryProtocol.NITRADO, "Parse error: " + e.getMessage());
        }
    }

    private String getTextOrDefault(JsonNode node, String field, String defaultValue) {
        if (node.has(field) && !node.get(field).isNull()) {
            return node.get(field).asText();
        }
        return defaultValue;
    }

    private int getIntOrDefault(JsonNode node, String field, int defaultValue) {
        if (node.has(field) && !node.get(field).isNull()) {
            return node.get(field).asInt();
        }
        return defaultValue;
    }
}
