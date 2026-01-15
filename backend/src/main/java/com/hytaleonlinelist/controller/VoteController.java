package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.dto.response.VoteResponse;
import com.hytaleonlinelist.dto.response.VoteStatusResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.security.EmailVerified;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.VoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;
    private final UserRepository userRepository;

    public VoteController(VoteService voteService, UserRepository userRepository) {
        this.voteService = voteService;
        this.userRepository = userRepository;
    }

    @PostMapping("/server/{serverId}")
    @EmailVerified
    public ResponseEntity<VoteResponse> voteForServer(
            @PathVariable UUID serverId,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        VoteResponse response = voteService.voteForServer(serverId, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/server/{serverId}/status")
    public ResponseEntity<VoteStatusResponse> getVoteStatus(
            @PathVariable UUID serverId,
            @AuthenticationPrincipal UserPrincipal principal) {

        boolean hasVoted = voteService.hasVotedToday(serverId, principal.id());
        return ResponseEntity.ok(new VoteStatusResponse(hasVoted));
    }
}
