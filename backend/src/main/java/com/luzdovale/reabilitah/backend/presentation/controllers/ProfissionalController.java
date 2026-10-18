package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.CriarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.EditarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioProfissionalResponse;
import com.luzdovale.reabilitah.backend.application.services.ProfissionalService;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> infosProfissionalPorUsuario(@PathVariable Long id, Authentication auth){
        return ResponseEntity.ok(
            profissionalService.buscarPorIdPermissaoAdm(id, (Usuario) auth.getPrincipal())
        );
    }

    @PostMapping
    public ResponseEntity<UsuarioProfissionalResponse> criar(@RequestBody CriarProfissionalRequest profissionalDto){
        return ResponseEntity.ok(
                profissionalService.criar(profissionalDto)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody EditarProfissionalRequest profissionalDto,Authentication auth){
        return ResponseEntity.ok(
                profissionalService.alterar(id, profissionalDto, (Usuario) auth.getPrincipal())
        );
    }
}
