package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.entity.VoteEntity;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.domain.repository.VoteRepository;
import com.hytaleonlinelist.dto.response.VoteResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.exception.VoteAlreadyExistsException;
import com.hytaleonlinelist.mapper.VoteMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class VoteService {

    private final VoteRepository voteRepository;
    private final ServerRepository serverRepository;
    private final ServerService serverService;
    private final VoteMapper voteMapper;

    public VoteService(VoteRepository voteRepository,
                      ServerRepository serverRepository,
                      ServerService serverService,
                      VoteMapper voteMapper) {
        this.voteRepository = voteRepository;
        this.serverRepository = serverRepository;
        this.serverService = serverService;
        this.voteMapper = voteMapper;
    }

    @Transactional
    public VoteResponse voteForServer(UUID serverId, UserEntity user) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        LocalDate today = LocalDate.now();

        // Check if user already voted today
        if (voteRepository.existsByServerIdAndUserIdAndVoteDate(serverId, user.getId(), today)) {
            throw new VoteAlreadyExistsException("You have already voted for this server today");
        }

        VoteEntity vote = new VoteEntity();
        vote.setServer(server);
        vote.setUser(user);

        VoteEntity saved = voteRepository.save(vote);

        // Increment server vote count
        serverService.incrementVoteCount(serverId);

        return voteMapper.toResponse(saved);
    }

    public boolean hasVotedToday(UUID serverId, UUID userId) {
        return voteRepository.existsByServerIdAndUserIdAndVoteDate(serverId, userId, LocalDate.now());
    }
}
