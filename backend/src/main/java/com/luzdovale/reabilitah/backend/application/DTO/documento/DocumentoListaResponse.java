package com.luzdovale.reabilitah.backend.application.DTO.documento;

import java.time.LocalDateTime;

public record DocumentoListaResponse(
    Long id,

    Long tipoDocumentoId,
    String tipoDocumento,
    int versao,

    Long pacienteId,
    String paciente,
    String apelido,

    Long criadoPorId,
    String criadoPor,

    boolean ativo,

    LocalDateTime dtCriacao,
    LocalDateTime dtAssinatura
) {
}
