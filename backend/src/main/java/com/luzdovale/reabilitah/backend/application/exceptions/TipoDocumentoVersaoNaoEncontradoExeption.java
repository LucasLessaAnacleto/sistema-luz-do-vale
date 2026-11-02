package com.luzdovale.reabilitah.backend.application.exceptions;

public class TipoDocumentoVersaoNaoEncontradoExeption extends RuntimeException {

    public TipoDocumentoVersaoNaoEncontradoExeption(){
        super("Tipo de documento não possui versão cadastrada.");
    }

    public TipoDocumentoVersaoNaoEncontradoExeption(int versao){
        super("Tipo de documento não possui versão %d".formatted(versao));
    }
}
