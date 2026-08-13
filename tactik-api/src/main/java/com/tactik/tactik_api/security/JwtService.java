package com.tactik.tactik_api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${api.security.token.secret}")
    private String secretKey;

    // Metodo que crea el token cuando el usuario hace login
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Guardamos el email del usuario en el token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira en 24 horas
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Lo firmamos criptográficamente
                .compact();
    }

    // 2. Extraer el email (username) del token
    public String extractUsername(String token) {
        return extractClaim(token, io.jsonwebtoken.Claims::getSubject);
    }

    // 3. Comprobar si el token es válido y pertenece al usuario
    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // 4. Comprobar si el token ha caducado
    private boolean isTokenExpired(String token) {
        return extractClaim(token, io.jsonwebtoken.Claims::getExpiration).before(new java.util.Date());
    }

    // Metodo interno para desencriptar cualquier dato del token
    private <T> T extractClaim(String token, java.util.function.Function<io.jsonwebtoken.Claims, T> claimsResolver) {
        final io.jsonwebtoken.Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    //Metodo auxiliar
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secretKey.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}