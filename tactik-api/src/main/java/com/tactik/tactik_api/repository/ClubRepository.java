package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    boolean existsByClubName(String clubName);
}