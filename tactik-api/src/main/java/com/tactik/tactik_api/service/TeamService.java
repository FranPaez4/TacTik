package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.TeamResponseDto;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.TeamRepository;
import com.tactik.tactik_api.dto.TeamRequestDto;
import com.tactik.tactik_api.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public TeamResponseDto createTeam(TeamRequestDto request) {

        String email = Objects.requireNonNull(SecurityContextHolder
                .getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getClub() == null) {
            throw new RuntimeException("El usuario no pertenece a ningún club");
        }

        Team team = new Team();
        team.setName(request.name());
        team.setCategory(request.category());
        team.setSeason(request.season());
        team.setCoachName(request.coachName());

        team.setClub(user.getClub());

        String invitationCode = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        team.setInvitationCode(invitationCode);


        Team savedTeam = teamRepository.save(team);


        return new TeamResponseDto(
                savedTeam.getId(),
                savedTeam.getName(),
                savedTeam.getCategory(),
                savedTeam.getSeason(),
                savedTeam.getCoachName(),
                savedTeam.getInvitationCode()
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
                        team.getCoachName(),
                        team.getInvitationCode()
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
                updatedTeam.getCoachName(),
                updatedTeam.getInvitationCode()
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
