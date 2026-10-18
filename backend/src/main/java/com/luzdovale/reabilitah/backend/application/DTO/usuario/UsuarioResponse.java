package com.luzdovale.reabilitah.backend.application.DTO.usuario;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;

public record UsuarioResponse(
        Long id,
        String email,
        String nome,
        String perfil,
        EnumRoleUsuario role,
        boolean ativo
) {
}
