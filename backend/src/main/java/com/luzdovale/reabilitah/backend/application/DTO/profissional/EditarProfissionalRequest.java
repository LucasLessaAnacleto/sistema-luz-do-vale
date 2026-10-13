package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import java.time.LocalDate;

public record CriarProfissionalRequest(
    String nome,
    String telefone,
    String regProfissional,
    String cpf,
    LocalDate dtNasc,

    String enderecoRua,
    String enderecoNr,
    String enderecoBairro,
    String enderecoMunicipio,
    String enderecoEstado,

    String email,
    String senha,

    Long perfilId
) {
}