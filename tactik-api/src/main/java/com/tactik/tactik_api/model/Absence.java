package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "absences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Absence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el entrenamiento
    @ManyToOne
    @JoinColumn(name = "training_id", nullable = false)
    private Training training;

    // Relación con el jugador que falta
    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    // Guardamos el motivo usando el Enum que creamos antes
    @Enumerated(EnumType.STRING)
    private AbsenceReason reason;
}