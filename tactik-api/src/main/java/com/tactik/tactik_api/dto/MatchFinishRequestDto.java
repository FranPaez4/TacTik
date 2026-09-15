package com.tactik.tactik_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MatchFinishRequestDto {
    private Integer homeScore;
    private Integer awayScore;
    private List<MatchPlayerRequestDto> players;
    private List<MatchEventRequestDto> events;
}
