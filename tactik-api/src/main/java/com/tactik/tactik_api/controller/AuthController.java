package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.AuthRequestDTO;
import com.tactik.tactik_api.dto.AuthResponseDTO;
import com.tactik.tactik_api.dto.RegisterRequestDTO;
import com.tactik.tactik_api.service.AuthService;
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
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        // Recibe el JSON del frontend y se lo pasa al metodo register
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponseDTO> authenticate(@RequestBody AuthRequestDTO request) {
        // Recibe el JSON del frontend y se lo pasa al metodo authenticate
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
