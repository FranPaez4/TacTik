package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.MatchType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MatchResponseDto {
    private Long id;
    private LocalDateTime dateTime;
    private String localisation;
    private String opponent;
    private Boolean isHome;
    private Integer durationMinutes;
    private MatchType matchType;
    private Integer ourGoals;
    private Integer opponentGoals;
    private Long teamId;

    // Aquí van incrustadas las listas de convocados y los eventos
    private List<MatchPlayerResponseDto> calledUpPlayers;
    private List<MatchEventResponseDto> events;
}