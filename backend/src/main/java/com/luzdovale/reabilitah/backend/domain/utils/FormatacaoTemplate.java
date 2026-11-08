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

        if (valor instanceof String texto) {
            try {
                LocalDate data = LocalDate.parse(texto);
                return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } catch (Exception e) {
                return texto;
            }
        }

        return String.valueOf(valor);
    }

    public String endereco(
        Object rua,
        Object numero,
        Object bairro,
        Object municipio,
        Object estado
    ) {
        String resultado = "";
        if (rua != null && !String.valueOf(rua).isBlank()) {
            resultado += rua;
        }
        if (numero != null && !String.valueOf(numero).isBlank()) {
            resultado += ", " + numero;
        }
        if (bairro != null && !String.valueOf(bairro).isBlank()) {
            resultado += " - " + bairro;
        }
        if (municipio != null && !String.valueOf(municipio).isBlank()) {
            resultado += " - " + municipio;
        }
        if (estado != null && !String.valueOf(estado).isBlank()) {
            resultado += "/" + estado;
        }

        return resultado;
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
