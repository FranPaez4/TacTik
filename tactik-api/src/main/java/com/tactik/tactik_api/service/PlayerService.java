package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.PlayerRequestDto;
import com.tactik.tactik_api.dto.PlayerResponseDto;
import com.tactik.tactik_api.model.Player;
import com.tactik.tactik_api.model.PlayerStatus;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.PlayerRepository;
import com.tactik.tactik_api.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;

    public PlayerService(PlayerRepository playerRepository, UserRepository userRepository) {
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
    }

    public PlayerResponseDto createPlayer(PlayerRequestDto request) {
        // 1. Identificamos al usuario logueado por su token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User coach = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Extraemos SU equipo (Seguridad total, sin depender de React)
        Team team = coach.getTeam();
        if (team == null) {
            throw new RuntimeException("El usuario no tiene ningún equipo asignado en la base de datos.");
        }

        // 3. Construimos el jugador
        Player player = new Player();
        player.setFirstName(request.getFirstName());
        player.setLastName(request.getLastName());
        player.setDorsalNumber(request.getDorsalNumber());
        player.setPosition(request.getPosition());

        // 4. Estado por defecto si no lo mandan
        player.setStatus(request.getStatus() != null ? request.getStatus() : PlayerStatus.DISPONIBLE);

        // 5. Código de invitación automático (ej: 8A4F9B)
        String codigoGenerado = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        player.setFamilyInviteCode(codigoGenerado);

        player.setTeam(team);

        // 6. Guardamos y devolvemos
        Player savedPlayer = playerRepository.save(player);
        return mapToDTO(savedPlayer);
    }

    public List<PlayerResponseDto> getPlayersByCategory(String category) {

        List<Player> players = playerRepository.findByTeamCategory(category);

        return players.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Jugador no encontrado con el ID: " + id);
        }
        playerRepository.deleteById(id);
    }

    private PlayerResponseDto mapToDTO(Player player) {
        PlayerResponseDto dto = new PlayerResponseDto();
        dto.setId(player.getId());
        dto.setFirstName(player.getFirstName());
        dto.setLastName(player.getLastName());
        dto.setDorsalNumber(player.getDorsalNumber());
        dto.setPosition(player.getPosition());
        dto.setStatus(player.getStatus());
        dto.setFamilyInviteCode(player.getFamilyInviteCode());
        dto.setPhotoUrl(player.getPhotoUrl());

        if (player.getBirthDate() != null) {
            dto.setBirthDate(player.getBirthDate());
        }

        if (player.getTeam() != null) {
            dto.setTeamId(player.getTeam().getId());
        }

        return dto;
    }

    public List<PlayerResponseDto> getPlayersByCoachEmail(String email) {
        // 1. Buscamos al entrenador en la base de datos
        User coach = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));

        // 2. Si el entrenador no tiene equipo, devolvemos una lista vacía (como te pasaba antes en pgAdmin)
        if (coach.getTeam() == null) {
            return java.util.Collections.emptyList();
        }

        // 3. Buscamos los jugadores que pertenezcan al ID de ese equipo
        List<Player> players = playerRepository.findByTeamId(coach.getTeam().getId());

        // 4. Los mapeamos a DTO para enviarlos al frontend
        return players.stream()
                .map(this::mapToDTO) // Usa tu método mapToDTO que ya tienes en esta clase
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public PlayerResponseDto updatePlayer(Long id, PlayerRequestDto requestDTO) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con el ID: " + id));

        player.setFirstName(requestDTO.getFirstName());
        player.setLastName(requestDTO.getLastName());
        player.setDorsalNumber(requestDTO.getDorsalNumber());
        player.setPosition(requestDTO.getPosition());

        if (requestDTO.getStatus() != null) {
            player.setStatus(requestDTO.getStatus());
        }

        Player updatedPlayer = playerRepository.save(player);
        return mapToDTO(updatedPlayer);
    }

    // Añadimos un metodo para buscar jugadores por nombre o apellido
    public List<PlayerResponseDto> searchPlayersByName(String name) {
        // Le pasamos el "name" dos veces porque busca en firstName o en lastName
        List<Player> players = playerRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);

        return players.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}