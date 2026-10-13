package com.luzdovale.reabilitah.backend.application.exceptions;

public class ErroAoVerificarAutenticacao extends RuntimeException{

    public ErroAoVerificarAutenticacao(){
        super("Erro ao verificar autenticação do usuário");
    }
}
