package com.tactik.tactik_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica la regla a todos los endpoints de la API
                        .allowedOrigins("http://localhost:5173") // El puerto exacto de React (Vite)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*") // Permitir que envíe cualquier cabecera (necesario para el JWT)
                        .allowCredentials(true); // Fundamental para que acepte tokens de sesión
            }
        };
    }
}
