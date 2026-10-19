package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;

public record EditarProfissionalRequest(
    String nome,
    String telefone,
    String regProfissional,     // adm
    String cpf,                 // adm
    LocalDate dtNasc,           // adm

    Endereco endereco
) implements ProfissionalDados {
}