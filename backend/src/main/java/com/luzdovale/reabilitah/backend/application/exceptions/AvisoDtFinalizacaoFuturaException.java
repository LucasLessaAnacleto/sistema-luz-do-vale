package com.luzdovale.reabilitah.backend.application.exceptions;

public class AvisoDtFinalizacaoFuturaException extends RuntimeException{
    public AvisoDtFinalizacaoFuturaException(){
        super("Data de finalização do aviso inválido.");
    }
}
