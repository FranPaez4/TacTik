package com.tactik.tactik_api.config;

import com.tactik.tactik_api.model.Club;
import com.tactik.tactik_api.model.Role;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.ClubRepository;
import com.tactik.tactik_api.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${tactik.admin.default-password}")
    private String defaultAdminPassword;

    public DataSeeder(UserRepository userRepository, ClubRepository clubRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Creamos el Club Base si no existe
        if (!clubRepository.existsByClubName("TacTik Base")) {
            Club club = Club.builder()
                    .clubName("TacTik Base")
                    .city("Sede Central")
                    .colors("Verde y Blanco")
                    .subscriptionPlan("FREE")
                    .isActive(true)
                    .build();

            clubRepository.save(club);

            // 2. Creamos al Presi (Admin) y lo vinculamos al club
            if (userRepository.findByEmail("admin@tactik.com").isEmpty()) {
                User admin = User.builder()
                        .name("Presi")
                        .surname("TacTik")
                        .email("admin@tactik.com")
                        .password(passwordEncoder.encode(defaultAdminPassword)) // Contraseña de prueba
                        .dni("00000000A")
                        .telephone("600000000")
                        .birthday(LocalDate.of(1990, 1, 1))
                        .role(Role.ADMIN)
                        .club(club) // Lo vinculamos
                        .build();

                userRepository.save(admin);
                log.info("¡Club y Admin creados correctamente en la base de datos!");
            }
        }
    }
}