package com.tactik.tactik_api.service;

import com.tactik.tactik_api.dto.*;
import com.tactik.tactik_api.model.*;
import com.tactik.tactik_api.repository.*;
import com.tactik.tactik_api.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TeamRepository teamRepository;
    private final ClubRepository clubRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PlayerRepository playerRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, TeamRepository teamRepository, ClubRepository clubRepository, RevokedTokenRepository revokedTokenRepository, PlayerRepository playerRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.teamRepository = teamRepository;
        this.clubRepository = clubRepository;
        this.revokedTokenRepository = revokedTokenRepository;
        this.playerRepository = playerRepository;
    }

public AuthResponseDto register(RegisterRequestDto request) {

        var club = Club.builder()
            .clubName(request.getClubName())
            .city(request.getCity())
            .colors(request.getColors())
            .badgeUrl(request.getBadgeUrl()) // <--- Aquí guardamos la URL de Cloudinary
            .subscriptionPlan("FREE")
            .isActive(true)
            .build();

    clubRepository.save(club);

    // 1. Creamos un nuevo usuario con los datos que llegan desde el frontend
    User user = new User();
    user.setName(request.getName());
    user.setSurname(request.getSurname());
    user.setBirthday(request.getBirthday());
    user.setDni(request.getDni());
    user.setTelephone(request.getTelephone());
    user.setEmail(request.getEmail().toLowerCase());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.ADMIN);
    user.setClub(club);

    // 2. Guardamos en la base de datos
    userRepository.save(user);

    String jwtToken = jwtService.generateToken(user.getUsername());

    return AuthResponseDto.builder()
            .token(jwtToken)
            .build();
    }

    public AuthResponseDto registerCoach(CoachRegisterRequestDto request) {
        // 1. Comprobamos si el código de invitación existe
        Team team = teamRepository.findByInvitationCode(request.getInvitationCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código de invitación inválido o equipo no encontrado"));

        // 2. Fichamos al entrenador y lo vestimos con la equipación de su nuevo Club
        var coach = User.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dni(request.getDni())
                .telephone(request.getTelephone())
                .birthday(request.getBirthday())
                .role(Role.COACH)
                .club(team.getClub())
                .build();

        userRepository.save(coach);

        // 3. Le damos las llaves del estadio (Token)
        var jwtToken = jwtService.generateToken(coach.getUsername());
        return new AuthResponseDto(jwtToken);
    }

    public AuthResponseDto registerPlayer(PlayerRegisterRequestDto request) {
        // 1. Validar si el email o DNI ya existen (añade tus validaciones habituales aquí)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // 2. Buscar la ficha deportiva usando el código TAC-XXXX
        Player player = playerRepository.findByFamilyInviteCode(request.getInvitationCode())
                .orElseThrow(() -> new RuntimeException("Código de invitación inválido o no encontrado"));

        // OPCIONAL: Comprobar si esa ficha ya tiene un usuario vinculado para evitar dobles registros
        if (player.getUserAccount() != null) {
            throw new RuntimeException("Esta ficha ya está vinculada a una cuenta de usuario.");
        }

        // 3. Crear la cuenta de usuario (User)
        User user = User.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dni(request.getDni())
                .telephone(request.getTelephone())
                .birthday(request.getBirthday())
                .role(Role.PLAYER) // Asignamos el rol de jugador
                .build();

        User savedUser = userRepository.save(user);

        // 4. Vincular el usuario a la ficha deportiva y actualizar la fecha de nacimiento
        player.setUserAccount(savedUser);

        // Aquí es donde recuperamos el cumpleaños que borramos en el alta del entrenador
        if (request.getBirthday() != null) {
            player.setBirthDate(request.getBirthday());
        }

        if (request.getPhotoUrl() != null && !request.getPhotoUrl().isEmpty()) {
            player.setPhotoUrl(request.getPhotoUrl());
        } else {
            // Foto por defecto si no suben ninguna (puedes poner la ruta a un avatar gris genérico)
            player.setPhotoUrl("https://ui-avatars.com/api/?name=" + request.getName() + "+" + request.getSurname() + "&background=random");
        }

        playerRepository.save(player);

        // 5. Generar y devolver el token JWT
        String jwtToken = jwtService.generateToken(savedUser.getEmail());
        return AuthResponseDto.builder()
                .token(jwtToken)
                .build();
    }

    public AuthResponseDto authenticate(AuthRequestDto request) {
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
        return AuthResponseDto.builder()
                .token(jwtToken)
                .build();
    }

    public void logout(String token) {
        if (!revokedTokenRepository.existsByToken(token)) {
            RevokedToken revokedToken = RevokedToken.builder()
                    .token(token)
                    .build();
            revokedTokenRepository.save(revokedToken);
        }
    }

}