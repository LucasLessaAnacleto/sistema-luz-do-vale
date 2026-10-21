package com.luzdovale.reabilitah.backend.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Email {

    @Column(unique = true, nullable = false)
    private String email;

    protected Email() {
        this.email = "";
    }

    public Email(String email) {
        if (email == null || !isValid(email)) {
            throw new IllegalArgumentException("E-mail inválido!");
        }

        this.email = email;
    }

    private boolean isValid(String email) {
        return email.matches("^[^\\s@]+@[^\\s@.]+(?:\\.[^\\s@.]+)+$");
    }

    @JsonValue
    @Override
    public String toString() {
        return email;
    }
}