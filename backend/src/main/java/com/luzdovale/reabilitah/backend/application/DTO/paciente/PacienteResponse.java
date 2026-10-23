package com.luzdovale.reabilitah.backend.application.DTO.paciente;

import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelRequest;
import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelResponse;
import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;

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

        ResponsavelResponse responsavel
) {
}
