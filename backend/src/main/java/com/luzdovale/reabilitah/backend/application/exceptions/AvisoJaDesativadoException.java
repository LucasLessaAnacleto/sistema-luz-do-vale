package com.luzdovale.reabilitah.backend.application.exceptions;

public class AvisoJaDesativadoException extends RuntimeException {
    public AvisoJaDesativadoException(){
        super("Não é possível alterar um aviso já desativado.");
    }
}
