package com.luzdovale.reabilitah.backend.application.DTO.documento;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;

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
    EnumStatusDocumento status,
    String hash,

    LocalDateTime dtCriacao,
    LocalDateTime dtAssinatura,
    LocalDateTime dtFinalizacao
) {
}
