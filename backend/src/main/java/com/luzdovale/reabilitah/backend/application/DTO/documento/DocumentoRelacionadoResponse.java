package com.luzdovale.reabilitah.backend.application.DTO.documento;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;

import java.time.LocalDateTime;

public record DocumentoRelacionadoResponse(
        Long id,
        String tipoDocumento,
        String relacao,
        boolean ativo,
        EnumStatusDocumento status,
        LocalDateTime dtFinalizacao,
        LocalDateTime dtAssinatura,
        LocalDateTime dtCriacao
) {
}
