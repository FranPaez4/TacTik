package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.TeamRequestDto;
import com.tactik.tactik_api.dto.TeamResponseDto;
import com.tactik.tactik_api.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PostMapping
    public ResponseEntity<TeamResponseDto> createTeam(@Valid @RequestBody TeamRequestDto request) {
        TeamResponseDto createdTeam = teamService.createTeam(request);

        return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<TeamResponseDto>> getAllTeams() {
        List<TeamResponseDto> teams = teamService.getAllTeams();

        return ResponseEntity.ok(teams);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}")
    public ResponseEntity<TeamResponseDto> updateTeam(@PathVariable Long id, @RequestBody TeamRequestDto request) {
        TeamResponseDto updatedTeam = teamService.updateTeam(id, request);
        return ResponseEntity.ok(updatedTeam);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}