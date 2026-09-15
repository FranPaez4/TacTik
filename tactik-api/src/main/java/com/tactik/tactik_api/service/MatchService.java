package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.*;
import com.tactik.tactik_api.model.*;
import com.tactik.tactik_api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final MatchPlayerRepository matchPlayerRepository;
    private final MatchEventRepository matchEventRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository, PlayerRepository playerRepository, UserRepository userRepository, MatchPlayerRepository matchPlayerRepository, MatchEventRepository matchEventRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
        this.matchPlayerRepository = matchPlayerRepository;
        this.matchEventRepository = matchEventRepository;
    }

    // --- 1. CREAR PARTIDO (Previa de la semana) ---
    @Transactional
    public MatchResponseDto createMatch(MatchRequestDto requestDto, String coachEmail) {
        // 1. Buscamos al entrenador por su email
        User coach = userRepository.findByEmail(coachEmail)
                .orElseThrow(() -> new RuntimeException("Entrenador no encontrado con email: " + coachEmail));

        // 2. Comprobamos que el entrenador tenga un equipo asignado
        if (coach.getTeam() == null) {
            throw new RuntimeException("El entrenador no tiene un equipo asignado");
        }
        Team team = coach.getTeam(); // Sacamos el equipo directamente del entrenador

        Match match = new Match();
        match.setDateTime(requestDto.getDateTime());
        match.setLocalisation(requestDto.getLocalisation());
        match.setOpponent(requestDto.getOpponent());
        match.setHome(requestDto.getIsHome());
        match.setDurationMinutes(requestDto.getDurationMinutes());
        match.setMatchType(requestDto.getMatchType());

        match.setHomeScore(0);
        match.setAwayScore(0);
        match.setTeam(team); // Le asignamos el equipo automáticamente

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
                match.getHome(),
                match.getDurationMinutes(),
                match.getMatchType(),
                match.getHomeScore(),
                match.getAwayScore(),
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
        match.setHome(requestDto.getIsHome());
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

    public List<MatchResponseDto> getMatchesByCoachEmail(String email) {
        User coach = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));

        if (coach.getTeam() == null) {
            return java.util.Collections.emptyList();
        }

        // Asumo que tienes un findByTeamId en tu MatchRepository
        List<Match> matches = matchRepository.findByTeamId(coach.getTeam().getId());

        return matches.stream()
                .map(this::mapToResponseDto) // O como se llame tu mapeador
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void finishMatch(Long matchId, MatchFinishRequestDto request) {

        // 1. Buscamos el partido y actualizamos el marcador final y el estado
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        // (Asumiendo que tienes homeScore y awayScore en tu entidad Match)
        match.setHomeScore(request.getHomeScore());
        match.setAwayScore(request.getAwayScore());
        match.setStatus("FINALIZADO"); // O como manejes el estado en tu entidad

        matchRepository.save(match);

        // 2. Guardamos la alineación (Quién jugó y en qué posición)
        if (request.getPlayers() != null) {
            for (MatchPlayerRequestDto playerDto : request.getPlayers()) {
                Player player = playerRepository.findById(playerDto.getPlayerId())
                        .orElseThrow(() -> new RuntimeException("Jugador no encontrado: " + playerDto.getPlayerId()));

                MatchPlayer matchPlayer = new MatchPlayer();
                matchPlayer.setMatch(match);
                matchPlayer.setPlayer(player);
                matchPlayer.setRole(playerDto.getRole()); // Tu Enum (TITULAR/SUPLENTE)
                matchPlayer.setTacticalPosition(playerDto.getTacticalPosition());

                matchPlayerRepository.save(matchPlayer);
            }
        }

        // 3. Guardamos los eventos (Goles, Tarjetas, Cambios) para la línea de tiempo
        if (request.getEvents() != null) {
            for (MatchEventRequestDto eventDto : request.getEvents()) {
                MatchEvent event = new MatchEvent();
                event.setMatch(match);
                event.setMatchMinute(eventDto.getMatchMinute());
                event.setEventType(eventDto.getEventType()); // Tu Enum (GOAL, YELLOW...)

                // Asignamos el jugador principal (el que marca, ve la tarjeta o entra al campo)
                if (eventDto.getPrimaryPlayerId() != null) {
                    Player primary = playerRepository.findById(eventDto.getPrimaryPlayerId()).orElse(null);
                    event.setPrimaryPlayer(primary);
                }

                // Asignamos el jugador secundario (solo se usa en cambios: el que sale del campo)
                if (eventDto.getSecondaryPlayerId() != null) {
                    Player secondary = playerRepository.findById(eventDto.getSecondaryPlayerId()).orElse(null);
                    event.setSecondaryPlayer(secondary);
                }

                matchEventRepository.save(event);
            }
        }
    }
}