package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.TeamRequestDTO;
import com.tactik.tactik_api.dto.TeamResponseDTO;
import com.tactik.tactik_api.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamResponseDTO> createTeam(@Valid @RequestBody TeamRequestDTO request) {
        TeamResponseDTO createdTeam = teamService.createTeam(request);

        return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<TeamResponseDTO>> getAllTeams() {
        List<TeamResponseDTO> teams = teamService.getAllTeams();

        return ResponseEntity.ok(teams);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> updateTeam(@PathVariable Long id, @RequestBody TeamRequestDTO request) {
        TeamResponseDTO updatedTeam = teamService.updateTeam(id, request);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}