package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.usuario.CriarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.EditarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioResponse;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.RedefinirSenhaDto;
import com.luzdovale.reabilitah.backend.application.services.UsuarioService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<List<UsuarioResponse>> listarTodos(Authentication auth){
        var usuarioLogado = (Usuario) auth.getPrincipal();

        return ResponseEntity.ok(
                usuarioService.listarComDadosProfissional(usuarioLogado)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(
            @PathVariable Long id,
            Authentication auth
    ){
        var usuarioLogado = (Usuario) auth.getPrincipal();

        return ResponseEntity.ok(
                usuarioService.buscarComDadosProfissional(id, usuarioLogado)
        );
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar( @RequestBody CriarUsuarioRequest usuarioDto ){
        return ResponseEntity.ok(
                usuarioService.criar(usuarioDto)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponse> editar(
            @PathVariable Long id,
            @RequestBody EditarUsuarioRequest usuarioDto,
            Authentication auth
    ){
        var usuarioLogado = (Usuario) auth.getPrincipal();

        return ResponseEntity.ok(
                usuarioService.alterar(id, usuarioDto, usuarioLogado)
        );
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<Void> redefinirSenha(
            @PathVariable Long id,
            @RequestBody RedefinirSenhaDto dto,
            Authentication auth
    ){
        var usuarioLogado = (Usuario) auth.getPrincipal();
        usuarioService.redefinirSenha( id, dto.senha(), usuarioLogado );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuariologado")
    @Operation(summary = "Consulta usuario logado",description = "busca usuario da sessão")
    public ResponseEntity<UsuarioResponse> getUsuarioLogado(){

        return ResponseEntity.ok(usuarioService.getUsuarioLogado());
    }

}
