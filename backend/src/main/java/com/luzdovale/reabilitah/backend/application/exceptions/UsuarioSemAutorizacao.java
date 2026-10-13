package com.luzdovale.reabilitah.backend.application.exceptions;

public class UsuarioSemAutorizacao extends RuntimeException{

    public UsuarioSemAutorizacao(){
        super("Usuário sem autorização para acessar esse recurso");
    }
}
