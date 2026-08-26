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

public class RegisterRequestDto {
    private String name;
    private String surname;
    private LocalDate birthday;
    private String dni;
    private String telephone;
    private String email;
    private String password;
    // Club
    private String clubName;
    private String city;
    private String colors;
    private String badgeUrl;

}
