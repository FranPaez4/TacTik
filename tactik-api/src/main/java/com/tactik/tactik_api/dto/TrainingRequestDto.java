package com.tactik.tactik_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class TrainingRequestDto {

    private LocalDateTime dateTime;
    private Integer durationMinutes;
    private String localisation;
    private String objective;
    private String material;
    private String warmUp;
    private String mainPart;
    private Long teamId;
}
