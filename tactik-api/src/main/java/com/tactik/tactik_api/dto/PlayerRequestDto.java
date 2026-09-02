package com.tactik.tactik_api.dto;

import com.tactik.tactik_api.model.PlayerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class PlayerRequestDto {
   private String firstName;
   private String lastName;
   private Integer dorsalNumber;
   private String position;
   private PlayerStatus status;
}
