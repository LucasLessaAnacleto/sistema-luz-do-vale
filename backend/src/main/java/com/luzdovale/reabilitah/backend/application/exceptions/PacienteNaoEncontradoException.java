package com.luzdovale.reabilitah.backend.application.exceptions;

public class PacienteNaoEncontradoException extends RuntimeException{

    public PacienteNaoEncontradoException(Long id){
        super("Paciente não existe: "+id);
    }

    public PacienteNaoEncontradoException(){
        super("Paciente não existe.");
    }

}
