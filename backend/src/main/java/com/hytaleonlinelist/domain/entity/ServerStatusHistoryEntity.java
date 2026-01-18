package com.hytaleonlinelist.domain.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "server_status_history", indexes = {
    @Index(name = "idx_status_history_server_id", columnList = "server_id"),
    @Index(name = "idx_status_history_recorded_at", columnList = "recorded_at"),
    @Index(name = "idx_status_history_server_recorded", columnList = "server_id, recorded_at")
})
public class ServerStatusHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    private ServerEntity server;

    @Column(name = "is_online", nullable = false)
    private Boolean isOnline;

    @Column(name = "player_count", nullable = false)
    private Integer playerCount = 0;

    @Column(name = "max_players")
    private Integer maxPlayers;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(name = "query_protocol", length = 20)
    @Enumerated(EnumType.STRING)
    private QueryProtocol queryProtocol;

    @Column(name = "error_message", length = 255)
    private String errorMessage;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    @PrePersist
    protected void onCreate() {
        recordedAt = Instant.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ServerEntity getServer() {
        return server;
    }

    public void setServer(ServerEntity server) {
        this.server = server;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public Integer getPlayerCount() {
        return playerCount;
    }

    public void setPlayerCount(Integer playerCount) {
        this.playerCount = playerCount;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Integer getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Integer responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public QueryProtocol getQueryProtocol() {
        return queryProtocol;
    }

    public void setQueryProtocol(QueryProtocol queryProtocol) {
        this.queryProtocol = queryProtocol;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
    }
}
