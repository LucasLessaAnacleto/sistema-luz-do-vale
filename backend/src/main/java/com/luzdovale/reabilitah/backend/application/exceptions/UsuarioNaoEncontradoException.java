package com.luzdovale.reabilitah.backend.application.exceptions;

public class UsuarioNaoEncontradoException extends RuntimeException{

    public UsuarioNaoEncontradoException(Long id){
        super("Usuário não encontrado: "+id);
    }

    public UsuarioNaoEncontradoException(String email){
        super("Usuário não encontrado: "+email);
    }

    public UsuarioNaoEncontradoException(){
        super("Usuário não existe no sistema.");
    }
}
