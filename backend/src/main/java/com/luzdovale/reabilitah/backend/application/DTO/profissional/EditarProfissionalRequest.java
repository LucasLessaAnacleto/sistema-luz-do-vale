package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import java.time.LocalDate;

public record EditarProfissionalRequest(
    Long id,
    String nome,
    String telefone,
    String regProfissional,     // adm
    String cpf,                 // adm
    LocalDate dtNasc,           // adm

    String enderecoRua,
    String enderecoNr,
    String enderecoBairro,
    String enderecoMunicipio,
    String enderecoEstado
) implements ProfissionalDados {
}