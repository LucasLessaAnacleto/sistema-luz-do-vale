package com.luzdovale.reabilitah.backend.domain.valueobjects;

public class Senha {

    private String senha;

    protected Senha() {
        this.senha = "";
    }

    public Senha(String senha) {
        if (senha == null || !isValid(senha)) {
            throw new IllegalArgumentException(
                "A senha deve ter no mínimo 6 caracteres, uma letra e um número."
            );
        }

        this.senha = senha;
    }

    private boolean isValid(String senha) {
        if (senha.length() < 6) {
            return false;
        }

        boolean temLetra = senha.matches(".*[a-zA-Z].*");
        boolean temNumero = senha.matches(".*[0-9].*");

        return temLetra && temNumero;
    }
}