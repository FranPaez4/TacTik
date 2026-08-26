package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.PlayerRequestDto;
import com.tactik.tactik_api.dto.PlayerResponseDto;
import com.tactik.tactik_api.model.Player;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.repository.PlayerRepository;
import com.tactik.tactik_api.repository.TeamRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public PlayerService(PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    public PlayerResponseDto createPlayer(PlayerRequestDto request) {

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + request.getTeamId()));

        // Construimos el jugador con los datos del DTO
        Player player = new Player();
        player.setFirstName(request.getFirstName());
        player.setLastName(request.getLastName());
        player.setDorsalNumber(request.getDorsalNumber());
        player.setPosition(request.getPosition());
        player.setBirthDate(request.getBirthDate());
        // 1. Generamos el código aleatorio de 6 caracteres
        String codigoGenerado = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        player.setFamilyInviteCode(codigoGenerado);

        player.setTeam(team);

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
        return new PlayerResponseDto(
                player.getId(),
                player.getFirstName(),
                player.getLastName(),
                player.getDorsalNumber(),
                player.getPosition(),
                player.getBirthDate(),
                player.getFamilyInviteCode(),
                player.getTeam().getId() // Sacamos el ID del equipo asociado
        );
    }

    @Transactional
    public PlayerResponseDto updatePlayer(Long id, PlayerRequestDto requestDTO) {
        // 1. Buscamos al jugador, si no existe lanzamos error
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con el ID: " + id));

        // 2. Actualizamos sus datos básicos
        player.setFirstName(requestDTO.getFirstName());
        player.setLastName(requestDTO.getLastName());
        player.setDorsalNumber(requestDTO.getDorsalNumber());
        player.setPosition(requestDTO.getPosition());
        player.setBirthDate(requestDTO.getBirthDate());

        // 3. Verificamos si hay que cambiarlo de equipo
        if (requestDTO.getTeamId() != null) {
            Team team = teamRepository.findById(requestDTO.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + requestDTO.getTeamId()));
            player.setTeam(team);
        }

        // 4. Guardamos los cambios en la base de datos
        Player updatedPlayer = playerRepository.save(player);

        // 5. Devolvemos el DTO actualizado
        return new PlayerResponseDto(
                updatedPlayer.getId(),
                updatedPlayer.getFirstName(),
                updatedPlayer.getLastName(),
                updatedPlayer.getDorsalNumber(),
                updatedPlayer.getPosition(),
                updatedPlayer.getBirthDate(),
                updatedPlayer.getFamilyInviteCode(),
                updatedPlayer.getTeam() != null ? updatedPlayer.getTeam().getId() : null
        );
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