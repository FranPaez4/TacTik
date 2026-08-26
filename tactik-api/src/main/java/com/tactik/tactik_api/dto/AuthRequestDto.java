package com.tactik.tactik_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuthRequestDto {
    @NotBlank(message = "El email no puede estar en blanco")
    private String email;

    @NotBlank(message = "La contraseña no puede estar en blanco")
    private String password;
}
