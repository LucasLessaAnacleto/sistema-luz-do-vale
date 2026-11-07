package com.luzdovale.reabilitah.backend.application.services;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class DocumentoPdfService {

    @Autowired
    private DocumentoTemplateService documentoTemplateService;

    public byte[] gerarPdf(Long documentoId) throws IOException {

        String html = documentoTemplateService.gerarHtml(documentoId);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfRendererBuilder builder = new PdfRendererBuilder();

        builder.withHtmlContent(html, null);
        builder.toStream(output);
        builder.run();

        return output.toByteArray();
    }
}