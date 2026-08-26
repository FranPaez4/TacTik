package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.MatchEventRequestDto;
import com.tactik.tactik_api.dto.MatchPlayerRequestDto;
import com.tactik.tactik_api.dto.MatchRequestDto;
import com.tactik.tactik_api.dto.MatchResponseDto;
import com.tactik.tactik_api.service.MatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    // 1. Crear partido
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PostMapping
    public ResponseEntity<MatchResponseDto> createMatch(@RequestBody MatchRequestDto requestDto) {
        return new ResponseEntity<>(matchService.createMatch(requestDto), HttpStatus.CREATED);
    }

    // 2. Ver un partido por su ID
    @GetMapping("/{id}")
    public ResponseEntity<MatchResponseDto> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    // 3. Ver todos los partidos de un equipo
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<MatchResponseDto>> getMatchesByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(matchService.getMatchesByTeam(teamId));
    }

    // 4. Actualizar partido
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}")
    public ResponseEntity<MatchResponseDto> updateMatch(@PathVariable Long id, @RequestBody MatchRequestDto requestDto) {
        return ResponseEntity.ok(matchService.updateMatch(id, requestDto));
    }

    // 5. Borrar partido
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Gestionar la convocatoria y alineación del partido
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}/call-up")
    public ResponseEntity<MatchResponseDto> updateCallUp(
            @PathVariable Long id,
            @RequestBody List<MatchPlayerRequestDto> callUpList) {

        return ResponseEntity.ok(matchService.updateCallUp(id, callUpList));
    }

    // 7. Registrar los eventos del partido (Minuto a minuto)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}/events")
    public ResponseEntity<MatchResponseDto> updateMatchEvents(
            @PathVariable Long id,
            @RequestBody List<MatchEventRequestDto> eventsList) {

        return ResponseEntity.ok(matchService.updateMatchEvents(id, eventsList));
    }
}