package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.MatchType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MatchRequestDto {

    private LocalDateTime dateTime;
    private String localisation;
    private String opponent;
    private Boolean isHome;
    private Integer durationMinutes;
    private MatchType matchType;
    private Long teamId;
}
