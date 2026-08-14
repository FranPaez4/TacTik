package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {

    List<Training> findByTeamId(Long teamId);
}
