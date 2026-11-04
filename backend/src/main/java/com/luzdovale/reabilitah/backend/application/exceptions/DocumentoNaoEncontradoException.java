package com.luzdovale.reabilitah.backend.application.exceptions;

public class DocumentoNaoEncontradoException extends RuntimeException {

    public DocumentoNaoEncontradoException(Long id) {
        super("Documento não encontrado: " + id);
    }

    public DocumentoNaoEncontradoException() {
        super("Documento não encontrado.");
    }
}
