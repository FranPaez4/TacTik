package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.AbsenceRequestDto;
import com.tactik.tactik_api.dto.AbsenceResponseDto;
import com.tactik.tactik_api.dto.TrainingRequestDto;
import com.tactik.tactik_api.dto.TrainingResponseDto;
import com.tactik.tactik_api.model.Absence;
import com.tactik.tactik_api.model.Player;
import com.tactik.tactik_api.model.Team;
import com.tactik.tactik_api.model.Training;
import com.tactik.tactik_api.repository.PlayerRepository;
import com.tactik.tactik_api.repository.TeamRepository;
import com.tactik.tactik_api.repository.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    private final TrainingRepository trainingRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public TrainingService(TrainingRepository trainingRepository, TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.trainingRepository = trainingRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    @Transactional
    public TrainingResponseDto createTraining(TrainingRequestDto requestDTO) {
        // 1. Buscamos el equipo al que pertenece el entrenamiento
        Team team = teamRepository.findById(requestDTO.getTeamId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + requestDTO.getTeamId()));

        // 2. Creamos la entidad Training y mapeamos los datos del DTO
        Training training = new Training();
        training.setDateTime(requestDTO.getDateTime());
        training.setDurationMinutes(requestDTO.getDurationMinutes());
        training.setLocalisation(requestDTO.getLocalisation());
        training.setObjective(requestDTO.getObjective());
        training.setMaterial(requestDTO.getMaterial());
        training.setWarmUp(requestDTO.getWarmUp());
        training.setMainPart(requestDTO.getMainPart());
        training.setTeam(team);

        // 3. Guardamos el entrenamiento en la base de datos
        Training savedTraining = trainingRepository.save(training);

        // 4. Transformamos la entidad guardada en un ResponseDto para devolverlo
        return mapToResponseDto(savedTraining);
    }

    public TrainingResponseDto getTrainingById(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrenamiento no encontrado con el ID: " + id));
        return mapToResponseDto(training);
    }

    public List<TrainingResponseDto> getTrainingsByTeam(Long teamId) {
        List<Training> trainings = trainingRepository.findByTeamId(teamId);
        return trainings.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrainingResponseDto updateTraining(Long id, TrainingRequestDto requestDTO) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrenamiento no encontrado con el ID: " + id));

        // Actualizamos los datos
        training.setDateTime(requestDTO.getDateTime());
        training.setDurationMinutes(requestDTO.getDurationMinutes());
        training.setLocalisation(requestDTO.getLocalisation());
        training.setObjective(requestDTO.getObjective());
        training.setMaterial(requestDTO.getMaterial());
        training.setWarmUp(requestDTO.getWarmUp());
        training.setMainPart(requestDTO.getMainPart());

        // Si cambia de equipo
        if (requestDTO.getTeamId() != null && !training.getTeam().getId().equals(requestDTO.getTeamId())) {
            Team team = teamRepository.findById(requestDTO.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + requestDTO.getTeamId()));
            training.setTeam(team);
        }

        Training updatedTraining = trainingRepository.save(training);
        return mapToResponseDto(updatedTraining);
    }

    @Transactional
    public void deleteTraining(Long id) {
        if (!trainingRepository.existsById(id)) {
            throw new RuntimeException("Entrenamiento no encontrado con el ID: " + id);
        }
        trainingRepository.deleteById(id);
    }

    @Transactional
    public TrainingResponseDto registerAbsences(Long trainingId, List<AbsenceRequestDto> absencesDto) {
        // 1. Buscamos el entrenamiento
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Entrenamiento no encontrado con el ID: " + trainingId));

        // 2. Limpiamos las faltas anteriores (por si el entrenador corrige la lista)
        // El orphanRemoval = true de la entidad borrará estas faltas de la BD automáticamente
        training.getAbsences().clear();

        // 3. Recorremos la lista que envía el móvil y creamos las entidades Absence
        for (AbsenceRequestDto dto : absencesDto) {
            Player player = playerRepository.findById(dto.getPlayerId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado con el ID: " + dto.getPlayerId()));

            Absence absence = new Absence();
            absence.setTraining(training);
            absence.setPlayer(player);
            absence.setReason(dto.getReason());

            // Añadimos la falta al entrenamiento
            training.getAbsences().add(absence);
        }

        // 4. Guardamos el entrenamiento (gracias al CascadeType.ALL, se guardan las faltas solas)
        Training updatedTraining = trainingRepository.save(training);

        // 5. Devolvemos el entrenamiento actualizado
        return mapToResponseDto(updatedTraining);
    }

    private TrainingResponseDto mapToResponseDto(Training training) {
        return new TrainingResponseDto(
                training.getId(),
                training.getDateTime(),
                training.getDurationMinutes(),
                training.getLocalisation(),
                training.getObjective(),
                training.getMaterial(),
                training.getWarmUp(),
                training.getMainPart(),
                training.getTeam().getId(),

                // Mapeamos la nueva lista de faltas (Absence) a nuestro nuevo Dto
                training.getAbsences().stream()
                        .map(absence -> new AbsenceResponseDto(
                                absence.getPlayer().getId(),
                                absence.getReason()
                        ))
                        .collect(Collectors.toList())
        );
    }
}