package com.luzdovale.reabilitah.backend.application.exceptions;

public class UsuarioSemVinculoProfissional extends RuntimeException{

    public UsuarioSemVinculoProfissional() {
        super("Usuario sem cadastrado de profissional vinculado.");
    }
}
