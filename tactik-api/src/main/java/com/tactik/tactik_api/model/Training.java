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
@Table(name = "trainings")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class Training {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateTime;
    private Integer durationMinutes;
    private String localisation;
    private String objective;
    private String material;

    @Column(columnDefinition = "TEXT")
    private String warmUp;

    @Column(columnDefinition = "TEXT")
    private String mainPart;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Absence> absences = new ArrayList<>();
}
