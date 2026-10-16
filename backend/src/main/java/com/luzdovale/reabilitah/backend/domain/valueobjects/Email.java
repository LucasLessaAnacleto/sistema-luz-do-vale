package com.luzdovale.reabilitah.backend.domain.valueobjects;

public class Email {

    private String email;

    public Email() {
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

    @Override
    public String toString() {
        return email;
    }
}