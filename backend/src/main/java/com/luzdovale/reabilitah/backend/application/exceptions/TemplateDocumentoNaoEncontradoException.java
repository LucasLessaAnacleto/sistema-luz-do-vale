package com.luzdovale.reabilitah.backend.application.exceptions;

public class TemplateDocumentoNaoEncontradoException extends RuntimeException {

    public TemplateDocumentoNaoEncontradoException(String template,Long versaoId) {
        super("Template \"%s\" não encontrado para a versão de documento %d.".formatted(template, versaoId));
    }
}
