package com.luzdovale.reabilitah.backend.application.DTO.usuario;

public record EditarInformacoesPessoaisRequest(
        String nome,
        String email,
        String telefone,
        String senhaAtual,
        String novaSenha
) {
}
