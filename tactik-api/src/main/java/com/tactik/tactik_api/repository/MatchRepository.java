package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    // Para buscar todos los partidos de un equipo concreto
    List<Match> findByTeamId(Long teamId);
}