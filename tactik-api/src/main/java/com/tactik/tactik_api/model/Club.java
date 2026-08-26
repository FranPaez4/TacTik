package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String clubName;

    private String city;
    private String colors;

    private String logoUrl; // El escudo del club

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private String subscriptionPlan = "FREE"; // Por defecto, todos nacen en el plan gratuito en la BETA

    private String contactEmail;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Team> teams;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users;
}