package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.CriarDocumentoRequest;
import com.luzdovale.reabilitah.backend.application.DTO.documento.DocumentoResponse;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
