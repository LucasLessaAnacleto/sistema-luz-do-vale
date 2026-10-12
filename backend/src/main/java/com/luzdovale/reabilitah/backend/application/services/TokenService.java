package com.luzdovale.reabilitah.backend.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.luzdovale.reabilitah.backend.domain.entities.Token;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.TokenRepository;
import com.luzdovale.reabilitah.backend.domain.repository.UsuarioRepository;
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

    @Autowired
    private UsuarioRepository usuarioRepository;


    public Usuario validarToken(String token) {

        try {

            Algorithm algoritmo = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algoritmo)
                    .withIssuer(emissor)
                    .build();
            verifier.verify(token);

            var tokenBanco = tokenRepository.findTokenByToken(token);

            return tokenBanco.get().getUsuario();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public String gerarToken(String email) {

        try{
            Algorithm algoritomo = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(email)
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritomo);

            var usuario = usuarioRepository.findAll()
                    .stream()
                    .filter(u -> u.getEmail().equals(email)).findFirst().orElse(null);

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
