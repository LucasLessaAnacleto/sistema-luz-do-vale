package com.luzdovale.reabilitah.backend.application.exceptions;

public class AvisoNaoEncontradoException extends RuntimeException{
    public AvisoNaoEncontradoException() {
        super("Não encontrado aviso no sistema.");
    }
}
