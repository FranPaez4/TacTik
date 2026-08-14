package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.PlayerRequestDTO;
import com.tactik.tactik_api.dto.PlayerResponseDTO;
import com.tactik.tactik_api.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    // Inyección de dependencias por constructor
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    // 1. POST: Dar de alta a un nuevo jugador
    @PostMapping
    public ResponseEntity<PlayerResponseDTO> createPlayer(@RequestBody PlayerRequestDTO request) {
        PlayerResponseDTO createdPlayer = playerService.createPlayer(request);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    // 2. GET: Obtener todos los jugadores de una categoría específica

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<PlayerResponseDTO>> getPlayersByCategory(@PathVariable String categoryName) {
        List<PlayerResponseDTO> players = playerService.getPlayersByCategory(categoryName);
        return ResponseEntity.ok(players);
    }

    // 3. DELETE: Eliminar a un jugador de la base de datos
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerResponseDTO> updatePlayer(
            @PathVariable Long id,
            @RequestBody PlayerRequestDTO requestDTO) {

        PlayerResponseDTO updatedPlayer = playerService.updatePlayer(id, requestDTO);
        return ResponseEntity.ok(updatedPlayer);
    }
}