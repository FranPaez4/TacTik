package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.AbsenceReason;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AbsenceResponseDto {
    private Long id;
    private AbsenceReason reason;
}
