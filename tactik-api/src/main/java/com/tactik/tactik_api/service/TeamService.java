package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.TeamResponseDTO;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.repository.TeamRepository;
import com.tactik.tactik_api.dto.TeamRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public TeamResponseDTO createTeam(TeamRequestDTO request) {
        Team team = new Team();
        team.setName(request.name());
        team.setCategory(request.category());
        team.setSeason(request.season());
        team.setCoachName(request.coachName());


        Team savedTeam = teamRepository.save(team);


        return new TeamResponseDTO(
                savedTeam.getId(),
                savedTeam.getName(),
                savedTeam.getCategory(),
                savedTeam.getSeason(),
                savedTeam.getCoachName()
        );
    }

        public List<TeamResponseDTO> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .map(team -> new TeamResponseDTO(
                        team.getId(),
                        team.getName(),
                        team.getCategory(),
                        team.getSeason(),
                        team.getCoachName()
                ))
                .collect(Collectors.toList());
    }


}
