package com.luzdovale.reabilitah.backend.application.DTO.usuario;

import com.luzdovale.reabilitah.backend.domain.entities.Endereco;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        Long profissionalId,

        String nome,
        String telefone,
        String regProfissional,
        String cpf,
        LocalDate dtNasc,
        Endereco endereco,

        String email,
        EnumRoleUsuario role,

        Long perfilId,
        String perfil,

        boolean ativo,
        LocalDateTime dtCriacao,
        LocalDateTime dtDesativado
) {
}
