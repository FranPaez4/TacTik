package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.AuthRequestDto;
import com.tactik.tactik_api.dto.AuthResponseDto;
import com.tactik.tactik_api.dto.RegisterRequestDto;
import com.tactik.tactik_api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto request) {
        // Recibe el JSON del frontend y se lo pasa al metodo register
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register-coach")
    public ResponseEntity<AuthResponseDto> registerCoach(
            @RequestBody com.tactik.tactik_api.dto.CoachRegisterRequestDto request
    ) {
        return ResponseEntity.ok(authService.registerCoach(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponseDto> authenticate( @Valid @RequestBody AuthRequestDto request) {
        // Recibe el JSON del frontend y se lo pasa al metodo authenticate
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            final String jwt = authHeader.substring(7);
            authService.logout(jwt);
            return ResponseEntity.ok("Sesión cerrada de forma segura");
        }
        return ResponseEntity.badRequest().body("No se encontró ningún token para revocar");
    }


}
