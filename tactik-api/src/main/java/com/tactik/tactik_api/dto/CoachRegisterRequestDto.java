package com.tactik.tactik_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class CoachRegisterRequestDto {
    String name;
    String surname;
    String email;
    String password;
    String dni;
    String telephone;
    LocalDate birthday;
    String invitationCode;


}
