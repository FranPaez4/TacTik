package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.MatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchEventRepository extends JpaRepository<MatchEvent, Long> {

    List<MatchEvent> findByMatchId(Long matchId);
}
