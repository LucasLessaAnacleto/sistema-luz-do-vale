package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.services.DocumentoPdfService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoTemplateService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documentos")
@Tag(name = "Documentos", description = "Criação, consulta e visualização dos documentos do prontuário.")
public class DocumentoController {
    @Autowired
    private DocumentoService documentoService;
    @Autowired
    private DocumentoTemplateService documentoTemplateService;
    @Autowired
    private DocumentoPdfService documentoPdfService;

    @PostMapping
    @Operation(summary = "Criar documento", description = "Cria um documento com os dados informados e o usuário autenticado.")
    public ResponseEntity<DocumentoResponse> criar(@RequestBody CriarDocumentoRequest request, Authentication auth){

        return ResponseEntity.ok(
                documentoService.criar(request, (Usuario) auth.getPrincipal())
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar documento", description = "Retorna os detalhes do documento identificado pelo ID.")
    public ResponseEntity<DocumentoDetalhesResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.buscar(id));
    }

    @GetMapping
    @Operation(summary = "Listar documentos", description = "Retorna uma página de documentos. A numeração das páginas começa em zero.")
    public ResponseEntity<Page<DocumentoListaResponse>> listar(@RequestParam(defaultValue = "0") int pagina) {

        return ResponseEntity.ok(documentoService.listar(pagina));
    }

    @GetMapping("/recentes")
    @Operation(summary = "Listar documentos recentes", description = "Retorna a lista de documentos recentes.")
    public ResponseEntity<List<DocumentoListaResponse>> listarRecentes() {

        return ResponseEntity.ok(documentoService.listarRecentes());
    }

    @GetMapping("/{id}/relacionados")
    @Operation(summary = "Listar documentos relacionados", description = "Retorna os documentos relacionados ao documento identificado pelo ID.")
    public ResponseEntity<List<DocumentoRelacionadoResponse>> listarRelacionados(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.listarRelacionados(id));
    }

    @GetMapping("/{id}/historico")
    @Operation(summary = "Consultar histórico do documento", description = "Retorna os registros de histórico do documento identificado pelo ID.")
    public ResponseEntity<List<HistDocumentoResponse>> listarHistorico(@PathVariable Long id) {

        return ResponseEntity.ok(documentoService.listarHistorico(id));
    }

    @GetMapping(value = "/{id}/html", produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Visualizar documento em HTML", description = "Gera e retorna a versão HTML do documento identificado pelo ID.")
    public ResponseEntity<String> visualizarHtml(@PathVariable Long id) {

        return ResponseEntity.ok(documentoTemplateService.gerarHtml(id));
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Visualizar documento em PDF", description = "Gera o PDF do documento e o retorna para exibição no navegador.")
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
