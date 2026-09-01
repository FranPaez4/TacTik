package com.tactik.tactik_api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "revoked_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevokedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Le damos una longitud larga porque los JWT son cadenas largas
    @Column(unique = true, nullable = false, length = 1000)
    private String token;
}