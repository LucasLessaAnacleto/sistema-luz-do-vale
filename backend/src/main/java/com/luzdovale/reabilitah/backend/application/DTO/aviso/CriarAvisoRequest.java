package com.luzdovale.reabilitah.backend.application.DTO.aviso;

import java.time.LocalDateTime;

public record CriarAvisoRequest(
    String mensagem,
    LocalDateTime dtFinalizacao
) {
}
