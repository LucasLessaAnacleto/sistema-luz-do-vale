package com.luzdovale.reabilitah.backend.application.DTO.usuario;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;

import java.time.LocalDateTime;

public record UsuarioProfissionalResponse(
        Long      usuarioId,
        Long      profissionalId,
        String    nome,
        String    email,
        String    telefone,
        EnumRoleUsuario role,
        String perfil,
        boolean ativo,
        LocalDateTime dtCricao,
        LocalDateTime dtDesativado
) {
}
