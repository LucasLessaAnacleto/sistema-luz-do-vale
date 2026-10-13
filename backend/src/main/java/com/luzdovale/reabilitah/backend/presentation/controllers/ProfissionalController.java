package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.CriarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.EditarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.exceptions.ErroAoVerificarAutenticacao;
import com.luzdovale.reabilitah.backend.application.services.ProfissionalService;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> infosProfissionalPorUsuario(@PathVariable Long id, Authentication auth){
        var usuarioLogado = (Usuario) auth.getPrincipal();
        if(usuarioLogado == null){
            throw new ErroAoVerificarAutenticacao();
        }
        return ResponseEntity.ok(
            profissionalService.buscarPorIdPermissaoAdm(id, usuarioLogado)
        );
    }

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody CriarProfissionalRequest profissionalDto){
        profissionalService.criar(profissionalDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> editar(@RequestBody EditarProfissionalRequest profissionalDto,Authentication auth){
        var usuarioLogado = (Usuario) auth.getPrincipal();
        if(usuarioLogado == null){
            throw new ErroAoVerificarAutenticacao();
        }

        return ResponseEntity.ok(
                profissionalService.alterar(profissionalDto, usuarioLogado)
        );
    }
}
