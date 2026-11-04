package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.CriarDocumentoRequest;
import com.luzdovale.reabilitah.backend.application.DTO.documento.DocumentoDetalhesResponse;
import com.luzdovale.reabilitah.backend.application.DTO.documento.DocumentoResponse;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {
    @Autowired
    private DocumentoService documentoService;

    @PostMapping
    public ResponseEntity<DocumentoResponse> criar(@RequestBody CriarDocumentoRequest request, Authentication auth){
        return ResponseEntity.ok(
                documentoService.criar(request, (Usuario) auth.getPrincipal())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoDetalhesResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.buscar(id));
    }
}
