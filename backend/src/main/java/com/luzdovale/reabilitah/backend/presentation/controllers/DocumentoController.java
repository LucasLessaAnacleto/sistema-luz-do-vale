package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.services.DocumentoPdfService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoTemplateService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {
    @Autowired
    private DocumentoService documentoService;
    @Autowired
    private DocumentoTemplateService documentoTemplateService;
    @Autowired
    private DocumentoPdfService documentoPdfService;

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

        return ResponseEntity.ok(documentoService.listarHistorico(id));
    }

    @GetMapping(value = "/{id}/html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> visualizarHtml(@PathVariable Long id) {

        return ResponseEntity.ok(documentoTemplateService.gerarHtml(id));
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarPdf(@PathVariable Long id) throws IOException {

        byte[] pdf = documentoPdfService.gerarPdf(id);
//        String tipo = "attachment";
        String tipo = "inline";

        return ResponseEntity.ok()
                .header("Content-Disposition", tipo+"; filename=documento-"+id+".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
