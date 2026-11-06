package com.luzdovale.reabilitah.backend.application.DTO.documento;

import java.time.LocalDateTime;

public record DocumentoRelacionadoResponse(
        Long id,
        String tipoDocumento,
        String relacao,
        LocalDateTime dtCriacao,
        LocalDateTime dtAssinatura,
        boolean ativo
) {
}
