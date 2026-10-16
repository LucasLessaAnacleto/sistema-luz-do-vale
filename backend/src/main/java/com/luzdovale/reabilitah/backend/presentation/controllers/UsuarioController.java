package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.UsuarioProfissionalResponse;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.RedefinirSenhaDto;
import com.luzdovale.reabilitah.backend.application.exceptions.ErroAoVerificarAutenticacao;
import com.luzdovale.reabilitah.backend.application.services.UsuarioService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioProfissionalResponse>> listarTodos(Authentication auth){
        var usuarioLogado = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(
            usuarioService.listarComDadosProfissional(usuarioLogado)
        );
    }

    @PostMapping("/{id}/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(
            @PathVariable Long  id,
            @RequestBody RedefinirSenhaDto dto,
            Authentication auth
    ){
        var usuarioLogado = (Usuario) auth.getPrincipal();
        usuarioService.redefinirSenha(id, dto.senha(), usuarioLogado);
        return ResponseEntity.ok().build();
    }

}
