package com.tactik.tactik_api.dto;

import jakarta.validation.constraints.NotBlank;

public record TeamRequestDTO(
        @NotBlank(message = "El nombre del equipo es obligatorio")
        String name,
        String category,
        String season,
        String coachName


) {
}
