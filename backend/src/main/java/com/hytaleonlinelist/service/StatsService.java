package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.repository.ReviewRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.domain.repository.VoteRepository;
import com.hytaleonlinelist.dto.response.StatsResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatsService {

    private final ServerRepository serverRepository;
    private final VoteRepository voteRepository;
    private final ReviewRepository reviewRepository;

    public StatsService(ServerRepository serverRepository,
                       VoteRepository voteRepository,
                       ReviewRepository reviewRepository) {
        this.serverRepository = serverRepository;
        this.voteRepository = voteRepository;
        this.reviewRepository = reviewRepository;
    }

    public StatsResponse getPlatformStats() {
        long totalServers = serverRepository.count();
        Long onlineServers = serverRepository.countOnlineServers();
        Long totalPlayers = serverRepository.getTotalOnlinePlayers();
        // Use vote_count from servers table (includes imported votes)
        Long totalVotes = serverRepository.getTotalVoteCount();
        long totalReviews = reviewRepository.count();

        return new StatsResponse(
                totalServers,
                onlineServers != null ? onlineServers : 0L,
                totalPlayers != null ? totalPlayers : 0L,
                totalVotes != null ? totalVotes : 0L,
                totalReviews
        );
    }
}
