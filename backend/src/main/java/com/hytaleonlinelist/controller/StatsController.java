package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.dto.response.StatsResponse;
import com.hytaleonlinelist.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<StatsResponse> getPlatformStats() {
        StatsResponse stats = statsService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }
}
