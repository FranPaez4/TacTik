package com.tactik.tactik_api.controller;

import com.tactik.tactik_api.dto.ClubRequestDto;
import com.tactik.tactik_api.model.Club;
import com.tactik.tactik_api.model.User;
import com.tactik.tactik_api.repository.ClubRepository;
import com.tactik.tactik_api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    public ClubController(ClubRepository clubRepository, UserRepository userRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
    }

    // Actualizar los datos y el escudo del club del míster autenticado
    @PutMapping("/me")
    public ResponseEntity<Club> updateMyClub(@RequestBody ClubRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Club club = user.getClub();
        if (club == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.getName() != null) club.setClubName(request.getName());
        if (request.getCity() != null) club.setCity(request.getCity());
        if (request.getColors() != null) club.setColors(request.getColors());
        if (request.getBadgeUrl() != null) club.setBadgeUrl(request.getBadgeUrl());

        Club updatedClub = clubRepository.save(club);
        return ResponseEntity.ok(updatedClub);
    }

    // Borrar el club actual y desvincularlo
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyClub() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Club club = user.getClub();
        if (club != null) {
            user.setClub(null);
            userRepository.save(user);
            clubRepository.delete(club);
        }

        return ResponseEntity.noContent().build();
    }
}