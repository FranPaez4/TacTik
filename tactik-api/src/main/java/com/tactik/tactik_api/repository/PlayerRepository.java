package com.tactik.tactik_api.repository;

import com.tactik.tactik_api.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByTeamCategory(String category);

    // Añadimos un metodo de búsqueda por nombre y apellido, ignorando mayúsculas y minúsculas
    List<Player> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    Optional<Player> findByFamilyInviteCode(String familyInviteCode);

    List<Player> findByTeamId(Long id);
}
