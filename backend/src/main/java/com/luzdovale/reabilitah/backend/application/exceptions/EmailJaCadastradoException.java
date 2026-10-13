package com.luzdovale.reabilitah.backend.application.exceptions;

public class EmailJaCadastradoException extends RuntimeException {

    public EmailJaCadastradoException(String email){
        super("Já existe um usuário cadastrado com o e-mail: "+email);
    }

    public EmailJaCadastradoException(){
        super("Já existe um usuário cadastrado com esse e-mail.");
    }
}
