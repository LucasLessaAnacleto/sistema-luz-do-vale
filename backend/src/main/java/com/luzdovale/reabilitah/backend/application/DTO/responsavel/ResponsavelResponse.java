package com.luzdovale.reabilitah.backend.application.DTO.responsavel;

import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;

public record ResponsavelResponse(
        Long id,
        String nome,
        String parentesco,
        String cpf,
        String rg,
        String telefone,
        Endereco endereco,
        LocalDate dtNasc
) {
}
