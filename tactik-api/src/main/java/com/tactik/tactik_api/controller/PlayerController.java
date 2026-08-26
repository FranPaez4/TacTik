package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.PlayerRequestDto;
import com.tactik.tactik_api.dto.PlayerResponseDto;
import com.tactik.tactik_api.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PostMapping
    public ResponseEntity<PlayerResponseDto> createPlayer(@RequestBody PlayerRequestDto request) {
        PlayerResponseDto createdPlayer = playerService.createPlayer(request);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    // 2. GET: Obtener todos los jugadores de una categoría específica

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<PlayerResponseDto>> getPlayersByCategory(@PathVariable String categoryName) {
        List<PlayerResponseDto> players = playerService.getPlayersByCategory(categoryName);
        return ResponseEntity.ok(players);
    }

    // GET: Obtener jugadores por nombre

    @GetMapping("/search")
    public ResponseEntity<List<PlayerResponseDto>> searchPlayers(@RequestParam String name) {
        List<PlayerResponseDto> players = playerService.searchPlayersByName(name);
        return ResponseEntity.ok(players);
    }

    // 3. DELETE: Eliminar a un jugador de la base de datos
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}")
    public ResponseEntity<PlayerResponseDto> updatePlayer(
            @PathVariable Long id,
            @RequestBody PlayerRequestDto requestDTO) {

        PlayerResponseDto updatedPlayer = playerService.updatePlayer(id, requestDTO);
        return ResponseEntity.ok(updatedPlayer);
    }
}