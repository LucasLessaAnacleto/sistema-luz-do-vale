package com.luzdovale.reabilitah.backend.application.DTO.documento;

import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record DocumentoDetalhesResponse(
        Long id,
        Long tipoDocumentoId,
        String tipoDocumento,
        int versao,
        Long pacienteId,
        Long criadoPorId,
        String criadoPor,
        String observacao,
        List<CampoDocumento> campos,
        Map<String, Object> dados,
        boolean ativo,
        LocalDateTime dtCriacao,
        LocalDateTime dtAtualizacao,
        LocalDateTime dtAssinatura
) {
}
