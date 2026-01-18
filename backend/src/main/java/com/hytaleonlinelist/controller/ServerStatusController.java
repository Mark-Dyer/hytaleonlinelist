package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.dto.response.ServerStatusHistoryResponse;
import com.hytaleonlinelist.dto.response.ServerUptimeResponse;
import com.hytaleonlinelist.service.ServerStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for server status and uptime information
 */
@RestController
@RequestMapping("/api/servers/{serverId}/status")
public class ServerStatusController {

    private final ServerStatusService statusService;

    public ServerStatusController(ServerStatusService statusService) {
        this.statusService = statusService;
    }

    /**
     * Get uptime statistics for a server
     * Includes 24h and 7d uptime percentages, average response time
     */
    @GetMapping("/uptime")
    public ResponseEntity<ServerUptimeResponse> getUptime(@PathVariable UUID serverId) {
        return ResponseEntity.ok(statusService.getUptimeStats(serverId));
    }

    /**
     * Get status history for a server (for charts)
     *
     * @param serverId Server UUID
     * @param hours    Number of hours of history to retrieve (max 168 = 7 days)
     */
    @GetMapping("/history")
    public ResponseEntity<List<ServerStatusHistoryResponse>> getHistory(
        @PathVariable UUID serverId,
        @RequestParam(defaultValue = "24") int hours
    ) {
        return ResponseEntity.ok(statusService.getStatusHistory(serverId, hours));
    }
}
