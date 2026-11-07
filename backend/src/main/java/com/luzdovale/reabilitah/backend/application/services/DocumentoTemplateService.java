package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.exceptions.DocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.TemplateDocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.repository.DocumentoRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class DocumentoTemplateService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private DocumentoCamposService documentoCamposService;

    @Autowired
    private ITemplateEngine templateEngine;
    @Autowired
    private ResourceLoader resourceLoader;

    public String gerarHtml(Long documentoId) {

        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new DocumentoNaoEncontradoException());

        return gerarHtml(documento);
    }

    public String gerarHtml(Documento documento) {

        var versao = documento.getTipoDocumentoVersao();
        var campos = documentoCamposService.lerCampos(versao);
        var dados = documentoCamposService.lerDados(documento.getDados());

        Context context = new Context();

        context.setVariable("documento", documento);
        context.setVariable("tipoDocumento",versao.getTipoDocumento());
        context.setVariable("paciente", documento.getPaciente());
        context.setVariable("usuario", documento.getCriadoPor());
        context.setVariable("profissional",
            documento.getCriadoPor() != null
                ? documento.getCriadoPor().getProfissional()
                : null
        );
        context.setVariable("campos", campos);
        context.setVariable("dados", dados);

        String template = resolverTemplate(versao);

        return templateEngine.process("documentos/"+template, context);
    }

    private String resolverTemplate(TipoDocumentoVersao versao) {

        String template = versao.getTemplate();

        if (template == null || template.isBlank()) {
            return "generico";
        }

        String caminho = "classpath:/templates/documentos/"+template +".html";

        Resource resource = resourceLoader.getResource(caminho);

        if (!resource.exists()) {
            throw new TemplateDocumentoNaoEncontradoException(template, versao.getId());
        }

        return template;
    }
}