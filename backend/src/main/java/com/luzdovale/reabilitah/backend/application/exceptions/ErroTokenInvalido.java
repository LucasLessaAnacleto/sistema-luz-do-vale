package com.luzdovale.reabilitah.backend.application.exceptions;

public class ErroTokenInvalido extends RuntimeException{

    public ErroTokenInvalido(){
        super("Token inválido ou expirado");
    }
}
