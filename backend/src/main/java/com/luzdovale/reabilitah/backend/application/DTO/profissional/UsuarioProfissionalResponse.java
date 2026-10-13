package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;

import java.time.LocalDate;

public record UsuarioProfissionalResponse(
        Long      usuarioId,
        Long      profissionalId,
        String    nome,
        String    email,
        String    telefone,
        EnumRoleUsuario role,
        String perfil,
        boolean ativo,
        LocalDate dtCricao
) {
}
