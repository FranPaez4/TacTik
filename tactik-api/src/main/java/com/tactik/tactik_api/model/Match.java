package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime;
    private String localisation;
    private String opponent;

    private Boolean isHome;

    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    private MatchType matchType;

    private Integer ourGoals;
    private Integer opponentGoals;

    // El equipo nuestro que juega
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    // Lista de jugadores convocados (se actualiza automáticamente si borras el partido)
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchPlayer> calledUpPlayers = new ArrayList<>();


    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchEvent> events = new ArrayList<>();
}