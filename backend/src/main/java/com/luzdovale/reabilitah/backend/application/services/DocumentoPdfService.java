package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.exceptions.DocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.repository.DocumentoRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class DocumentoPdfService {

    private static final String PASTA_ASSINADOS = "src/main/resources/uploads/assinados";

    @Autowired
    private DocumentoTemplateService documentoTemplateService;
    @Autowired
    private DocumentoRepository documentoRepository;

    public byte[] gerarPdf(Long documentoId) throws IOException {

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new DocumentoNaoEncontradoException());

        if(documento.getCaminhoAssinado() != null){
            return Files.readAllBytes(Path.of(documento.getCaminhoAssinado()));
        }

        String html = documentoTemplateService.gerarHtml(documento);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfRendererBuilder builder = new PdfRendererBuilder();

        builder.withHtmlContent(html, null);
        builder.toStream(output);
        builder.run();

        return output.toByteArray();
    }

    public String salvarAssinado(Documento documento, MultipartFile arquivo) throws IOException {

        if(arquivo == null || arquivo.isEmpty()){
            throw new IllegalArgumentException("Selecione o arquivo do documento assinado.");
        }

        if(!"application/pdf".equals(arquivo.getContentType())){
            throw new IllegalArgumentException("O documento assinado deve ser um arquivo PDF.");
        }

        String caminho = PASTA_ASSINADOS + "/documento-" + documento.getId() + ".pdf";

        Files.createDirectories(Path.of(PASTA_ASSINADOS));
        Files.write(Path.of(caminho), arquivo.getBytes());

        return caminho;
    }
}