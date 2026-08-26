package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.AbsenceRequestDto;
import com.tactik.tactik_api.dto.TrainingRequestDto;
import com.tactik.tactik_api.dto.TrainingResponseDto;
import com.tactik.tactik_api.service.TrainingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PostMapping
    public ResponseEntity<TrainingResponseDto> createTraining(@RequestBody TrainingRequestDto requestDTO) {
        TrainingResponseDto createdTraining = trainingService.createTraining(requestDTO);

        return new ResponseEntity<>(createdTraining, HttpStatus.CREATED);
    }

    // 1. Ver un entrenamiento concreto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<TrainingResponseDto> getTrainingById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getTrainingById(id));
    }

    // 2. Ver TODOS los entrenamientos de un equipo
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TrainingResponseDto>> getTrainingsByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(trainingService.getTrainingsByTeam(teamId));
    }

    // 3. Actualizar un entrenamiento
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}")
    public ResponseEntity<TrainingResponseDto> updateTraining(
            @PathVariable Long id,
            @RequestBody TrainingRequestDto requestDTO) {
        return ResponseEntity.ok(trainingService.updateTraining(id, requestDTO));
    }

    // 4. Borrar un entrenamiento
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        trainingService.deleteTraining(id);
        return ResponseEntity.noContent().build();
    }

    // 5. Pasar lista: Registrar las ausencias de un entrenamiento
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @PutMapping("/{id}/absences")
    public ResponseEntity<TrainingResponseDto> registerAbsences(
            @PathVariable Long id,
            @RequestBody List<AbsenceRequestDto> absencesDto) {

        TrainingResponseDto updatedTraining = trainingService.registerAbsences(id, absencesDto);
        return ResponseEntity.ok(updatedTraining);
    }
}