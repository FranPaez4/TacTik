package com.tactik.tactik_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class PlayerRequestDTO {
   private String firstName;
   private String lastName;
   private Integer dorsalNumber;
   private String position;
   private LocalDate birthDate;
   private String familyInviteCode;
   private Long teamId;
}
