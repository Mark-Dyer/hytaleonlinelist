package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.VoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<VoteEntity, UUID> {

    @Query("SELECT v FROM VoteEntity v WHERE v.server.id = :serverId AND v.user.id = :userId AND v.voteDate = :date")
    Optional<VoteEntity> findTodayVote(
            @Param("serverId") UUID serverId,
            @Param("userId") UUID userId,
            @Param("date") LocalDate date
    );

    boolean existsByServerIdAndUserIdAndVoteDate(UUID serverId, UUID userId, LocalDate voteDate);

    long countByServerId(UUID serverId);

    @Query("SELECT v FROM VoteEntity v JOIN FETCH v.server WHERE v.user.id = :userId ORDER BY v.votedAt DESC")
    Page<VoteEntity> findByUserIdWithServer(@Param("userId") UUID userId, Pageable pageable);
}
