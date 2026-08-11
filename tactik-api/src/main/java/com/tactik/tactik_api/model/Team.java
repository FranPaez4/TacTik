package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder

public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private String Season;

    private String coachName;

    @OneToMany (mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Player> players;

}
