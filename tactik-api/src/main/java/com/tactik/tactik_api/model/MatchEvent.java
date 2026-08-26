package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "match_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    // El minuto exacto del partido
    private Integer matchMinute;

    @Enumerated(EnumType.STRING)
    private MatchEventType eventType;

    @ManyToOne
    @JoinColumn(name = "primary_player_id", nullable = false)
    private Player primaryPlayer;

    // Solo para SUSTITUCION: el que SALE del campo
    @ManyToOne
    @JoinColumn(name = "secondary_player_id", nullable = true)
    private Player secondaryPlayer;
}