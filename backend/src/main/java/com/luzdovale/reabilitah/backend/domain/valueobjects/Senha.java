package com.luzdovale.reabilitah.backend.domain.valueobjects;

public class Senha {

    private String senha;

    protected Senha() {
        this.senha = "";
    }

    public Senha(String senha) {
        if (senha == null || !isValid(senha)) {
            throw new IllegalArgumentException(
                "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
            );
        }

        this.senha = senha;
    }

    private boolean isValid(String senha) {
        if (senha.length() < 8) {
            return false;
        }

        boolean temMaiuscula = senha.matches(".*[A-Z].*");
        boolean temMinuscula = senha.matches(".*[a-z].*");
        boolean temNumero = senha.matches(".*[0-9].*");
        boolean temEspecial = senha.matches(".*[^a-zA-Z0-9].*");

        return temMaiuscula && temMinuscula && temNumero && temEspecial;
    }
}