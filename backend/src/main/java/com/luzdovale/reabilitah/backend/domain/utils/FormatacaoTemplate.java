package com.luzdovale.reabilitah.backend.domain.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FormatacaoTemplate {
    public String data(Object valor) {
        if (valor == null) {
            return "";
        }

        if (valor instanceof LocalDate data) {
            return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }

        if (valor instanceof LocalDateTime dataHora) {
            return dataHora.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        }

        return String.valueOf(valor);
    }

    public String inteiro(Object valor) {
        if (valor == null) {
            return "";
        }

        if (valor instanceof Number numero) {
            return String.valueOf(numero.intValue());
        }

        return String.valueOf(valor);
    }

    public String simNao(Object valor) {
        if (valor == null) {
            return "Não informado";
        }

        if (valor instanceof Boolean b) {
            return b ? "Sim" : "Não";
        }

        return String.valueOf(valor);
    }

}
