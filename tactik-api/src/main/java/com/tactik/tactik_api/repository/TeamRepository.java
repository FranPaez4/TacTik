package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByInvitationCode(String invitationCode);
}
