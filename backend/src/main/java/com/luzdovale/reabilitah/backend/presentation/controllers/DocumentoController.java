package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.services.DocumentoPdfService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoService;
import com.luzdovale.reabilitah.backend.application.services.DocumentoTemplateService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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

    @GetMapping
    public ResponseEntity<Page<DocumentoListaResponse>> listar(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(required = false) EnumStatusDocumento status,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long pacienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(defaultValue = "true") boolean ativo) {

        return ResponseEntity.ok(
                documentoService.listar(pagina, status, busca, usuarioId, pacienteId, dataInicio, dataFim, ativo)
        );
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<DocumentoListaResponse>> listarRecentes() {

        return ResponseEntity.ok(documentoService.listarRecentes());
    }

    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<DocumentoRelacionadoResponse>> listarRelacionados(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.listarRelacionados(id));
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistDocumentoResponse>> listarHistorico(@PathVariable Long id) {

        return ResponseEntity.ok(documentoService.listarHistorico(id));
    }

    @PostMapping("/{id}/assinado")
    public ResponseEntity<Void> enviarAssinado(
            @PathVariable Long id,
            @RequestParam("arquivo") MultipartFile arquivo,
            Authentication auth) throws IOException {

        documentoService.assinar(id, arquivo, (Usuario) auth.getPrincipal());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<DocumentoResponse> desativar(@PathVariable Long id, @RequestBody DesativarDocumentoRequest dto, Authentication auth) {

        return ResponseEntity.ok(
                documentoService.desativar(id, dto, (Usuario) auth.getPrincipal())
        );
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
