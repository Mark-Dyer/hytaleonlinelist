package com.hytaleonlinelist.domain.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "votes", indexes = {
    @Index(name = "idx_votes_server_id", columnList = "server_id"),
    @Index(name = "idx_votes_user_id", columnList = "user_id"),
    @Index(name = "idx_votes_voted_at", columnList = "voted_at")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_votes_server_user_date", columnNames = {"server_id", "user_id", "vote_date"})
})
public class VoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    private ServerEntity server;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "voted_at", nullable = false, updatable = false)
    private Instant votedAt;

    @Column(name = "vote_date", nullable = false, updatable = false)
    private LocalDate voteDate;

    @PrePersist
    protected void onCreate() {
        votedAt = Instant.now();
        voteDate = LocalDate.now();
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

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Instant getVotedAt() {
        return votedAt;
    }

    public void setVotedAt(Instant votedAt) {
        this.votedAt = votedAt;
    }

    public LocalDate getVoteDate() {
        return voteDate;
    }

    public void setVoteDate(LocalDate voteDate) {
        this.voteDate = voteDate;
    }
}
