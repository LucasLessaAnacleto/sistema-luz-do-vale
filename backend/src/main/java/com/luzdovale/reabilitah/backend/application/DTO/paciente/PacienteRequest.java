package com.luzdovale.reabilitah.backend.application.DTO.paciente;

import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;

public record PacienteRequest(
        String nome,
        String apelido,
        String cpf,
        String rg,
        String telefone,
        Endereco endereco,
        LocalDate dtNasc
) {
}
