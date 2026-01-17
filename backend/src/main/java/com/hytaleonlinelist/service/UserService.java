package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.entity.VoteEntity;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.domain.repository.VoteRepository;
import com.hytaleonlinelist.dto.request.UpdateProfileRequest;
import com.hytaleonlinelist.dto.response.ProfileResponse;
import com.hytaleonlinelist.dto.response.UserVoteResponse;
import com.hytaleonlinelist.exception.ConflictException;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    public UserService(UserRepository userRepository, VoteRepository voteRepository) {
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if username is being changed and if it's already taken
        if (request.username() != null && !request.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.username())) {
                throw new ConflictException("Username already taken");
            }
            user.setUsername(request.username());
        }

        // Update avatar URL if provided
        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl().isEmpty() ? null : request.avatarUrl());
        }

        // Update bio if provided
        if (request.bio() != null) {
            user.setBio(request.bio().isEmpty() ? null : request.bio());
        }

        userRepository.save(user);

        return toProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public Page<UserVoteResponse> getMyVotes(UUID userId, Pageable pageable) {
        Page<VoteEntity> votes = voteRepository.findByUserIdWithServer(userId, pageable);

        return votes.map(vote -> new UserVoteResponse(
                vote.getId().toString(),
                vote.getServer().getName(),
                vote.getServer().getSlug(),
                vote.getServer().getIconUrl(),
                vote.getVotedAt().toString()
        ));
    }

    private ProfileResponse toProfileResponse(UserEntity user) {
        return new ProfileResponse(
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getRole().name(),
                user.isEmailVerified(),
                user.getCreatedAt().toString()
        );
    }
}
