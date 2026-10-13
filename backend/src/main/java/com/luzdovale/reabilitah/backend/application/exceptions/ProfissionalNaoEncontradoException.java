package com.luzdovale.reabilitah.backend.application.exceptions;

public class ProfissionalNaoEncontradoException extends RuntimeException{

    public ProfissionalNaoEncontradoException(Long id){
        super("Profissional não encontrado com id: "+id);
    }

    public ProfissionalNaoEncontradoException(String cpf){
        super("Profissional não encontrado com CPF: "+cpf);
    }

    public ProfissionalNaoEncontradoException(){
        super("Profissional não encontrado no sistema.");
    }
}
