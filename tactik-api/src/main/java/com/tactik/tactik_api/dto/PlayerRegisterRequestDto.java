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
public class PlayerRegisterRequestDto {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String dni;
    private String telephone;
    private LocalDate birthday;
    private String invitationCode;
    private String photoUrl;
}