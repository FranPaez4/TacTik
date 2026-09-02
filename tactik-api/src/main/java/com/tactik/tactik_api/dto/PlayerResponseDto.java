package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.PlayerStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PlayerResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private Integer dorsalNumber;
    private String position;
    private PlayerStatus status;
    private String familyInviteCode;
    private Long teamId;
    private LocalDate birthDate;
    private String photoUrl;
}
