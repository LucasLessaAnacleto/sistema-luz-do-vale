package com.luzdovale.reabilitah.backend.domain.valueobjects;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.Assertions;

public class EmailTest {

    @Test
    void deveAceitarEmailValido() {
        Email email = new Email("gabriel@gmail.com");
        Assertions.assertEquals("gabriel@gmail.com", email.toString());
    }

    @Test
    void deveAceitarEmailComSubdominio() {
        Email email = new Email("gabriel@instituicao.org.br");
        Assertions.assertEquals("gabriel@instituicao.org.br", email.toString());
    }

    @Test
    void deveRejeitarEmailSemArroba() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email("gabrielgmail.com"));
    }

    @Test
    void deveRejeitarEmailSemDominio() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email("gabriel@"));
    }

    @Test
    void deveRejeitarEmailSemExtensao() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email("gabriel@gmail"));
    }

    @Test
    void deveRejeitarEmailComEspacos() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email("gabriel silva@gmail.com"));
    }


    @Test
    void deveRejeitarEmailComDuasArrobas() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email("gabriel@@gmail.com"));
    }

    @Test
    void deveRejeitarEmailNulo() {
        Assertions.assertThrows(IllegalArgumentException.class,() -> new Email(null));
    }
}
