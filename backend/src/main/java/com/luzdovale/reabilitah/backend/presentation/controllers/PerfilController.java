package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.perfil.PerfilRequest;
import com.luzdovale.reabilitah.backend.application.DTO.perfil.PerfilResponse;
import com.luzdovale.reabilitah.backend.application.services.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/perfis")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public ResponseEntity<List<PerfilResponse>> listar() {

        return ResponseEntity.ok(perfilService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilResponse> buscar(@PathVariable Long id) {

        return ResponseEntity.ok(perfilService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<PerfilResponse> criar(@RequestBody PerfilRequest dto) {

        return ResponseEntity.ok(perfilService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilResponse> editar(@PathVariable Long id, @RequestBody PerfilRequest dto) {

        return ResponseEntity.ok(perfilService.editar(id, dto));
    }
}
