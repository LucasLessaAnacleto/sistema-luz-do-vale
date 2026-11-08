package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.FormularioDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.tipoDocumento.TipoDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.services.TipoDocumentoService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipos-documento")
public class TipoDocumentoController {

    @Autowired
    private TipoDocumentoService tipoDocumentoService;

    @GetMapping("/{id}/formulario")
    public ResponseEntity<FormularioDocumentoResponse> buscarFormulario(
            @PathVariable Long id,
            @RequestParam Long pacienteId,
            Authentication auth
    ) {

        return ResponseEntity.ok(
                tipoDocumentoService.buscarFormulario(id, pacienteId, (Usuario) auth.getPrincipal())
        );
    }

    @GetMapping
    public ResponseEntity<List<TipoDocumentoResponse>> listar(Authentication auth) {

        return ResponseEntity.ok(
            tipoDocumentoService.listar((Usuario) auth.getPrincipal())
        );
    }

    @PostMapping("/{id}/permissoes/{perfilId}")
    public ResponseEntity<Void> adicionarPermissao(@PathVariable Long id, @PathVariable Long perfilId) {

        tipoDocumentoService.adicionarPermissao(id, perfilId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/permissoes/{perfilId}")
    public ResponseEntity<Void> removerPermissao(@PathVariable Long id, @PathVariable Long perfilId) {

        tipoDocumentoService.removerPermissao(id, perfilId);
        return ResponseEntity.ok().build();
    }


}
