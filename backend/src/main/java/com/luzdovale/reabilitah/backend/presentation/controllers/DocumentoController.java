package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<DocumentoRelacionadoResponse>> listarRelacionados(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.listarRelacionados(id));
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistDocumentoResponse>> listarHistorico(@PathVariable Long id) {
        return ResponseEntity.ok(
                documentoService.listarHistorico(id)
        );
    }
}
