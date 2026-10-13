package com.luzdovale.reabilitah.backend.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.luzdovale.reabilitah.backend.domain.entities.Token;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${spring.secretkey}")
    private String secret;


    @Value("${spring.emissor}")
    private String emissor;

    @Value("${spring.expiracaoMinutos}")
    private Long expiracaoMinutos;

    @Autowired
    private TokenRepository tokenRepository;


    public Usuario validarToken(String token) {

        try {

            Algorithm algoritmo = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algoritmo)
                    .withIssuer(emissor)
                    .build();
            verifier.verify(token);

        } catch (Exception e) {
            throw new RuntimeException("Token JWT inválido ou expirado", e);
        }

        var tokenBanco = tokenRepository.findTokenByToken(token)
                .orElseThrow(() -> new RuntimeException("Token não encontrado"));

        var usuario = tokenBanco.getUsuario();
        if(!Boolean.TRUE.equals(usuario.getAtivo())){
            throw new RuntimeException("Usuário desativado");
        }
        return usuario;

    }


    public String gerarToken(Usuario usuario) {

        try{
            Algorithm algoritomo = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(usuario.getEmail())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritomo);

            tokenRepository.save(new Token(token,usuario));

            return token;


        }catch (Exception e){

            return  null;
        }

    }

    private Instant gerarDataExpiracao(){
        return LocalDateTime.now()
                .plusMinutes(expiracaoMinutos)
                .toInstant(ZoneOffset.of("-03:00"));
    }

}
