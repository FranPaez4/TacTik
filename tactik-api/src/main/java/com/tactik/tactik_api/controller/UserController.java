package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.UserProfileResponseDto;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDto> getMyProfile() {
        // 1. Extraemos el email del usuario autenticado a través del token JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // 2. Buscamos al usuario en la base de datos
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 3. Empaquetamos los datos en el DTO
        UserProfileResponseDto profile = UserProfileResponseDto.builder()
                .name(user.getName())
                .clubName(user.getClub() != null ? user.getClub().getClubName() : "Mi Equipo")
                .badgeUrl(user.getClub() != null ? user.getClub().getBadgeUrl() : null)
                .colors(user.getClub() != null ? user.getClub().getColors() : "#10b981")
                .build();

        return ResponseEntity.ok(profile);
    }
}
