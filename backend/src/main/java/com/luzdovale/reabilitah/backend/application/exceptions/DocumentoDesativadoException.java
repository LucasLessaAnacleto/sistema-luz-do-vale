package com.luzdovale.reabilitah.backend.application.exceptions;

public class DocumentoDesativadoException extends RuntimeException{
    public DocumentoDesativadoException(){
        super("O documento está desativado.");
    }
}
