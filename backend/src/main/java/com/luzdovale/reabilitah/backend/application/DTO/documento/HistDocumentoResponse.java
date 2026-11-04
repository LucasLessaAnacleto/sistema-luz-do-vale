package com.luzdovale.reabilitah.backend.application.DTO.documento;

import java.time.LocalDateTime;

public record HistDocumentoResponse(
        Long id,
        Long documentoId,
        String tipoDocumento,
        String acao,
        Long usuarioId,
        String usuario,
        String observacao,
        LocalDateTime dtCriacao
) {
}
