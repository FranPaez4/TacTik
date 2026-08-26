package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.MatchPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Long> {

    List<MatchPlayer> findByMatchId(Long matchId);
}
