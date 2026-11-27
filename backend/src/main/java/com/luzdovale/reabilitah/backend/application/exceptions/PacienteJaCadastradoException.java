package com.luzdovale.reabilitah.backend.application.exceptions;

public class PacienteJaCadastradoException extends RuntimeException {

    public PacienteJaCadastradoException(){
        super("Já existe um paciente cadastrado com este CPF.");
    }
}