package com.luzdovale.reabilitah.backend.application.DTO.documento;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;

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
        EnumStatusDocumento status,

        LocalDateTime dtCriacao,
        LocalDateTime dtAssinatura,
        LocalDateTime dtFinalizacao
) {
}
