package com.luzdovale.reabilitah.backend.application.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DocumentoTemplateServiceTest {

    @Autowired
    private DocumentoTemplateService documentoTemplateService;

    @Test
    void deveGerarHtmlDoDocumento() {

        String html =
                documentoTemplateService.gerarHtml(1L);

        System.out.println(html);

        assertTrue(html.contains("Joao da Silva"));
        assertTrue(html.contains("Içara"));
        assertTrue(html.contains("CONTROLE DE SAÍDA"));
    }
}
