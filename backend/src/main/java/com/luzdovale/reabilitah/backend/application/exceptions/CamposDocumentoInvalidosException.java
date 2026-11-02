package com.luzdovale.reabilitah.backend.application.exceptions;


public class CamposDocumentoInvalidosException extends RuntimeException{
    public CamposDocumentoInvalidosException(String nomeDocumento) {
        super("Erro interno ao ler a estrutura dos campos do documento \"%s\".".formatted(nomeDocumento));
    }
    public CamposDocumentoInvalidosException() {
        super("Erro interno ao ler a estrutura dos campos do documento.");
    }
}
