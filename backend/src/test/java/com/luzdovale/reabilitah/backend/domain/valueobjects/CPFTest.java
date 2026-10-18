package com.luzdovale.reabilitah.backend.domain.valueobjects;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CPFTest {

    @Test
    void deveAceitarCpfValido() {
        CPF cpf = new CPF("52998224725");
        assertEquals("529.982.247-25", cpf.toString());
    }

    @Test
    void deveAceitarCpfValidoComMascara() {
        CPF cpf = new CPF("529.982.247-25");
        assertEquals("529.982.247-25", cpf.toString());
    }

    @Test
    void deveRejeitarCpfComDigitosInvalidos() {
        assertThrows(IllegalArgumentException.class, () -> new CPF("52998224726"));
    }

    @Test
    void deveRejeitarCpfComDigitosRepetidos() {
        assertThrows(IllegalArgumentException.class, () -> new CPF("11111111111"));
    }

    @Test
    void deveRejeitarCpfNulo() {
        assertThrows(IllegalArgumentException.class, () -> new CPF(null));
    }

}
