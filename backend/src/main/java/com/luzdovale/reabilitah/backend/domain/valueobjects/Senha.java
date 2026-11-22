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
        if (senha.codePointCount(0, senha.length()) < 8) {
            return false;
        }

        boolean temMaiuscula = senha.matches("(?s).*\\p{Lu}.*");
        boolean temMinuscula = senha.matches("(?s).*\\p{Ll}.*");
        boolean temNumero = senha.matches("(?s).*\\p{Nd}.*");
        boolean temEspecial = senha.matches("(?s).*[\\p{P}\\p{S}].*");

        return temMaiuscula && temMinuscula && temNumero && temEspecial;
    }
}