package com.luzdovale.reabilitah.backend.application.DTO.aviso;

import java.time.LocalDateTime;

public record AvisoResponse(
    Long id,
    String mensagem,
    Long criadoPorId,
    String criadoPor,
    LocalDateTime dtCriacao,
    LocalDateTime dtFinalizacao,
    boolean ativo,
    LocalDateTime dtDesativado
) {
}
