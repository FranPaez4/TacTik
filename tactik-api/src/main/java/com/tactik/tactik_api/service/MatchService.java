package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.*;
import com.tactik.tactik_api.model.*;
import com.tactik.tactik_api.repository.MatchRepository;
import com.tactik.tactik_api.repository.PlayerRepository;
import com.tactik.tactik_api.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    // --- 1. CREAR PARTIDO (Previa de la semana) ---
    @Transactional
    public MatchResponseDto createMatch(MatchRequestDto requestDto) {
        Team team = teamRepository.findById(requestDto.getTeamId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + requestDto.getTeamId()));

        Match match = new Match();
        match.setDateTime(requestDto.getDateTime());
        match.setLocalisation(requestDto.getLocalisation());
        match.setOpponent(requestDto.getOpponent());
        match.setIsHome(requestDto.getIsHome());
        match.setDurationMinutes(requestDto.getDurationMinutes());
        match.setMatchType(requestDto.getMatchType());

        // Al crear el partido, el marcador siempre empieza 0-0
        match.setOurGoals(0);
        match.setOpponentGoals(0);
        match.setTeam(team);

        Match savedMatch = matchRepository.save(match);
        return mapToResponseDto(savedMatch);
    }

    // --- 2. VER UN PARTIDO POR ID ---
    public MatchResponseDto getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con el ID: " + id));
        return mapToResponseDto(match);
    }

    // --- 3. VER TODOS LOS PARTIDOS DE UN EQUIPO (Para el calendario) ---
    public List<MatchResponseDto> getMatchesByTeam(Long teamId) {
        List<Match> matches = matchRepository.findByTeamId(teamId);
        return matches.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // --- 4. BORRAR PARTIDO ---
    @Transactional
    public void deleteMatch(Long id) {
        if (!matchRepository.existsById(id)) {
            throw new RuntimeException("Partido no encontrado con el ID: " + id);
        }
        matchRepository.deleteById(id);
    }

    private MatchResponseDto mapToResponseDto(Match match) {

        // 1. Traducir la lista de jugadores convocados/titulares
        List<MatchPlayerResponseDto> playersDto = match.getCalledUpPlayers().stream()
                .map(mp -> new MatchPlayerResponseDto(
                        mp.getId(),
                        mp.getPlayer().getId(),
                        mp.getRole(),
                        mp.getTacticalPosition()
                ))
                .collect(Collectors.toList());

        // 2. Traducir la línea de tiempo del partido (Eventos)
        List<MatchEventResponseDto> eventsDto = match.getEvents().stream()
                .map(me -> new MatchEventResponseDto(
                        me.getId(),
                        me.getMatchMinute(),
                        me.getEventType(),
                        me.getPrimaryPlayer().getId(),
                        // Si hay un jugador secundario (cambio), sacamos su ID. Si no, null.
                        me.getSecondaryPlayer() != null ? me.getSecondaryPlayer().getId() : null
                ))
                .collect(Collectors.toList());

        // 3. Montar el paquete final con toda la información
        return new MatchResponseDto(
                match.getId(),
                match.getDateTime(),
                match.getLocalisation(),
                match.getOpponent(),
                match.getIsHome(),
                match.getDurationMinutes(),
                match.getMatchType(),
                match.getOurGoals(),
                match.getOpponentGoals(),
                match.getTeam().getId(),
                playersDto,
                eventsDto
        );
    }

    // --- 5. ACTUALIZAR PARTIDO  ---
    @Transactional
    public MatchResponseDto updateMatch(Long id, MatchRequestDto requestDto) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con el ID: " + id));

        // Actualizamos los datos generales
        match.setDateTime(requestDto.getDateTime());
        match.setLocalisation(requestDto.getLocalisation());
        match.setOpponent(requestDto.getOpponent());
        match.setIsHome(requestDto.getIsHome());
        match.setDurationMinutes(requestDto.getDurationMinutes());
        match.setMatchType(requestDto.getMatchType());

        // Si por algún casual cambias el partido a otro equipo que gestiones
        if (requestDto.getTeamId() != null && !match.getTeam().getId().equals(requestDto.getTeamId())) {
            Team team = teamRepository.findById(requestDto.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + requestDto.getTeamId()));
            match.setTeam(team);
        }

        Match updatedMatch = matchRepository.save(match);
        return mapToResponseDto(updatedMatch);
    }

    // --- 6. GESTIONAR CONVOCATORIA Y ALINEACIÓN ---
    @Transactional
    public MatchResponseDto updateCallUp(Long matchId, List<MatchPlayerRequestDto> callUpList) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con el ID: " + matchId));

        // 1. Limpiamos la convocatoria anterior por si hay cambios de última hora
        match.getCalledUpPlayers().clear();

        // 2. Añadimos los nuevos jugadores con su rol y posición
        for (MatchPlayerRequestDto dto : callUpList) {
            Player player = playerRepository.findById(dto.getPlayerId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado con el ID: " + dto.getPlayerId()));

            MatchPlayer matchPlayer = new MatchPlayer();
            matchPlayer.setMatch(match);
            matchPlayer.setPlayer(player);
            matchPlayer.setRole(dto.getRole());
            matchPlayer.setTacticalPosition(dto.getTacticalPosition());

            match.getCalledUpPlayers().add(matchPlayer);
        }

        // 3. Guardamos el partido
        Match updatedMatch = matchRepository.save(match);
        return mapToResponseDto(updatedMatch);
    }

    // --- 7. REGISTRAR EVENTOS DEL PARTIDO (Goles, Cambios, Tarjetas) ---
    @Transactional
    public MatchResponseDto updateMatchEvents(Long matchId, List<MatchEventRequestDto> eventsList) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con el ID: " + matchId));

        // 1. Limpiamos los eventos anteriores por si el entrenador corrige el acta
        match.getEvents().clear();

        // 2. Registramos los nuevos eventos minuto a minuto
        for (MatchEventRequestDto dto : eventsList) {
            MatchEvent event = new MatchEvent();
            event.setMatch(match);
            event.setMatchMinute(dto.getMatchMinute());
            event.setEventType(dto.getEventType());

            // El protagonista (quien marca, recibe tarjeta o entra al campo)
            Player primaryPlayer = playerRepository.findById(dto.getPrimaryPlayerId())
                    .orElseThrow(() -> new RuntimeException("Jugador principal no encontrado con ID: " + dto.getPrimaryPlayerId()));
            event.setPrimaryPlayer(primaryPlayer);

            // Si es un cambio, habrá un jugador secundario
            if (dto.getSecondaryPlayerId() != null) {
                Player secondaryPlayer = playerRepository.findById(dto.getSecondaryPlayerId())
                        .orElseThrow(() -> new RuntimeException("Jugador secundario no encontrado con ID: " + dto.getSecondaryPlayerId()));
                event.setSecondaryPlayer(secondaryPlayer);
            }

            match.getEvents().add(event);
        }

        // 3. Guardamos el acta actualizada
        Match updatedMatch = matchRepository.save(match);
        return mapToResponseDto(updatedMatch);
    }
}