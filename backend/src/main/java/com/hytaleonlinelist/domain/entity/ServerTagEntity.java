package com.hytaleonlinelist.domain.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "server_tags", indexes = {
    @Index(name = "idx_server_tags_server_id", columnList = "server_id"),
    @Index(name = "idx_server_tags_tag", columnList = "tag")
})
public class ServerTagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    private ServerEntity server;

    @Column(name = "tag", nullable = false, length = 50)
    private String tag;

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

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
