package com.luzdovale.reabilitah.backend.presentation;

import com.luzdovale.reabilitah.backend.application.DTO.auth.LoginRequest;
import com.luzdovale.reabilitah.backend.application.DTO.auth.LoginResponse;
import com.luzdovale.reabilitah.backend.application.services.TokenService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(description = "Serviço responsavel por controlar a autenticação de usuarios e sessão!",name = "Serviço autenticação")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        var authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.email(),loginRequest.senha());

        var auth = authenticationManager.authenticate(authenticationToken);
        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(
                new LoginResponse(token)
        );

    }

}
