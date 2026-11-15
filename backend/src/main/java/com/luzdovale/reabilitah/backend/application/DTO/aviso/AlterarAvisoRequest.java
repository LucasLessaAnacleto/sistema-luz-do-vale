package com.luzdovale.reabilitah.backend.application.DTO.aviso;

import java.time.LocalDateTime;

public record AlterarAvisoRequest(
    String mensagem,
    boolean ativo,
    LocalDateTime dtFinalizacao
) {
}
