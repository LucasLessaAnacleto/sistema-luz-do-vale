package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.aviso.AvisoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.aviso.CriarAvisoRequest;
import com.luzdovale.reabilitah.backend.application.services.AvisoService;
import com.luzdovale.reabilitah.backend.domain.entities.Aviso;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avisos")
public class AvisoController {
    @Autowired
    private AvisoService avisoService;

    @GetMapping
    public ResponseEntity<Page<AvisoResponse>> listarTodos(@RequestParam(required = false) Boolean ativo, @RequestParam(defaultValue = "0") int pagina) {

        return ResponseEntity.ok(avisoService.listarTodos(ativo, pagina));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvisoResponse> buscarPorId(@PathVariable Long id) {

        return ResponseEntity.ok(avisoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Aviso> criar(@RequestBody CriarAvisoRequest dto, Authentication auth) {

        avisoService.criar(dto, (Usuario) auth.getPrincipal());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {

        avisoService.desativar(id);
        return ResponseEntity.ok().build();
    }
}
