package com.luzdovale.reabilitah.backend.application.exceptions;

public class PerfilNaoEncontradoException extends RuntimeException{

    public PerfilNaoEncontradoException(Long id){
        super("Perfil de usuário nao existe: "+id);
    }

    public PerfilNaoEncontradoException(){
        super("Perfil de usuário não existe");
    }

}
