package com.tactik.tactik_api.model;

import com.fasterxml.jackson.databind.deser.DataFormatReaders;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "match_players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class MatchPlayer {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Enumerated(EnumType.STRING)
    private MatchRole role;

    private String tacticalPosition;




}
