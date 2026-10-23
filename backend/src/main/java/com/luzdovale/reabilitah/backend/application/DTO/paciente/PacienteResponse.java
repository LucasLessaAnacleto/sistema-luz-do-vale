package com.luzdovale.reabilitah.backend.application.DTO.paciente;

import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelResponse;
import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PacienteResponse(
        Long id,
        String nome,
        String apelido,
        String cpf,
        String rg,
        String telefone,
        Endereco endereco,
        LocalDate dtNasc,
        boolean ativo,
        LocalDateTime dtCriacao,
        LocalDateTime dtDesativado,

        ResponsavelResponse responsavel
) {
}
