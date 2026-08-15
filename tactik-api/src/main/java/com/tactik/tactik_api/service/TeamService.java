package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.TeamResponseDto;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.repository.TeamRepository;
import com.tactik.tactik_api.dto.TeamRequestDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public TeamResponseDto createTeam(TeamRequestDto request) {
        Team team = new Team();
        team.setName(request.name());
        team.setCategory(request.category());
        team.setSeason(request.season());
        team.setCoachName(request.coachName());


        Team savedTeam = teamRepository.save(team);


        return new TeamResponseDto(
                savedTeam.getId(),
                savedTeam.getName(),
                savedTeam.getCategory(),
                savedTeam.getSeason(),
                savedTeam.getCoachName()
        );
    }

        public List<TeamResponseDto> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .map(team -> new TeamResponseDto(
                        team.getId(),
                        team.getName(),
                        team.getCategory(),
                        team.getSeason(),
                        team.getCoachName()
                ))
                .collect(Collectors.toList());
    }

    // Metodo para actualizar un equipo existente
    public TeamResponseDto updateTeam(Long id, TeamRequestDto request) {
        // 1. Buscamos el equipo por su ID. Si no existe, lanzamos una excepción.
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + id));

        // 2. Actualizamos los campos con los nuevos datos del frontend
        team.setName(request.name());
        team.setCategory(request.category());
        team.setSeason(request.season());
        team.setCoachName(request.coachName());

        // 3. Guardamos los cambios en PostgreSQL
        Team updatedTeam = teamRepository.save(team);

        // 4. Devolvemos el DTO actualizado al controlador
        return new TeamResponseDto(
                updatedTeam.getId(),
                updatedTeam.getName(),
                updatedTeam.getCategory(),
                updatedTeam.getSeason(),
                updatedTeam.getCoachName()
        );
    }

    // Metodo para eliminar un equipo de la base de datos
    public void deleteTeam(Long id) {
        // 1. Comprobamos si el equipo existe antes de intentar borrarlo
        if (!teamRepository.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado con el ID: " + id);
        }

        // 2. Si existe, lo eliminamos.
        teamRepository.deleteById(id);
    }
}
