package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.AuthRequestDTO;
import com.tactik.tactik_api.dto.AuthResponseDTO;
import com.tactik.tactik_api.dto.RegisterRequestDTO;
import com.tactik.tactik_api.model.Role;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.UserRepository;
import com.tactik.tactik_api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

public AuthResponseDTO register(RegisterRequestDTO request) {
    // 1. Creamos un nuevo usuario con los datos que llegan desde el frontend
    User user = new User();
    user.setName(request.getName());
    user.setSurname(request.getSurname());
    user.setBirthday(request.getBirthday());
    user.setDni(request.getDni());
    user.setTelephone(request.getTelephone());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.COACH);

    // 2. Guardamos al entrenador en la base de datos
    userRepository.save(user);

    String jwtToken = jwtService.generateToken(user.getUsername());

    return AuthResponseDTO.builder()
            .token(jwtToken)
            .build();
    }

    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        // 1. El AuthenticationManager comprueba mágicamente si el email y la contraseña coinciden
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Si el paso anterior no da error, significa que las credenciales son correctas. Buscamos al usuario.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // 3. Generamos un nuevo token
        String jwtToken = jwtService.generateToken(user.getUsername());

        // 4. Se lo mandamos al frontend
        return AuthResponseDTO.builder()
                .token(jwtToken)
                .build();
    }

}