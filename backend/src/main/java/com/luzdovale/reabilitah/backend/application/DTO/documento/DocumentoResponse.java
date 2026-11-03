package com.luzdovale.reabilitah.backend.application.DTO.documento;

import java.time.LocalDateTime;

public record DocumentoResponse(
        Long id,
        Long tipoDocumentoId,
        String tipoDocumento,
        int versao,
        Long pacienteId,
        Long criadoPorId,
        String observacao,
        String dados,
        boolean ativo,
        LocalDateTime dtCriacao,
        LocalDateTime dtAssinatura
) {
}
