package com.luzdovale.reabilitah.backend.application.DTO.usuario;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.ProfissionalDados;
import com.luzdovale.reabilitah.backend.domain.entities.Endereco;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;

import java.time.LocalDate;

public record CriarUsuarioRequest(
        String nome,
        String telefone,
        String regProfissional,
        String cpf,
        LocalDate dtNasc,

        Endereco endereco,

        String email,
        String senha,
        EnumRoleUsuario role,
        Long perfilId
) implements ProfissionalDados {
}
