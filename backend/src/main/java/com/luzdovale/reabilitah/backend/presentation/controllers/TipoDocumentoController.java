package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.FormularioDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.tipoDocumento.TipoDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.services.TipoDocumentoService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tipos-documento")
public class TipoDocumentoController {

    @Autowired
    private TipoDocumentoService tipoDocumentoService;

    @GetMapping("/{id}/formulario")
    public ResponseEntity<FormularioDocumentoResponse> buscarFormulario(@PathVariable Long id) {

        return ResponseEntity.ok(tipoDocumentoService.buscarFormulario(id));
    }

    @GetMapping
    public ResponseEntity<List<TipoDocumentoResponse>> listar(Authentication auth) {

        return ResponseEntity.ok(
            tipoDocumentoService.listar((Usuario) auth.getPrincipal())
        );
    }


}
