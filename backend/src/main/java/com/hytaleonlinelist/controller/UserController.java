package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.dto.request.UpdateProfileRequest;
import com.hytaleonlinelist.dto.response.ProfileResponse;
import com.hytaleonlinelist.dto.response.UserVoteResponse;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse profile = userService.getProfile(principal.id());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse profile = userService.updateProfile(principal.id(), request);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/votes")
    public ResponseEntity<Page<UserVoteResponse>> getMyVotes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        Page<UserVoteResponse> votes = userService.getMyVotes(principal.id(), pageable);
        return ResponseEntity.ok(votes);
    }
}
