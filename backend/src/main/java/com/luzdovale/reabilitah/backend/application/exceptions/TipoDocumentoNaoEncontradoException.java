package com.luzdovale.reabilitah.backend.application.exceptions;

public class TipoDocumentoNaoEncontradoException extends RuntimeException{
    public TipoDocumentoNaoEncontradoException(Long id){
        super("Tipo de documento não existe: "+id);
    }

    public TipoDocumentoNaoEncontradoException(){
        super("Tipo de documento não existe.");
    }


}
