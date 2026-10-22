package com.luzdovale.reabilitah.backend.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.Embeddable;

@Embeddable
public class Telefone {

    private String telefone;

    protected Telefone() {
        this.telefone = "";
    }

    public Telefone(String telefone) {
        if (telefone == null || !isValid(telefone)) {
            throw new IllegalArgumentException("Telefone inválido!");
        }

        this.telefone = telefone;
    }

    private boolean isValid(String telefone) {
        String telefoneTratado = telefone.replaceAll("[^0-9]", "");

        return telefoneTratado.length() == 10
                || telefoneTratado.length() == 11;
    }

    @JsonValue
    @Override
    public String toString() {
        return telefone;
    }
}