package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.MatchEventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MatchEventRequestDto {
    private Integer matchMinute;
    private MatchEventType eventType;
    private Long primaryPlayerId;
    private Long secondaryPlayerId;
}
