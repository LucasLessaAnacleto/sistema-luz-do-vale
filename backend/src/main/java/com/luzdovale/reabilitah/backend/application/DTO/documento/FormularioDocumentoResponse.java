package com.luzdovale.reabilitah.backend.application.DTO.documento;

import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;

import java.util.List;
import java.util.Map;

public record FormularioDocumentoResponse(
    Long tipoDocumentoId,
    String nome,
    String descricao,
    boolean exigeAssinatura,
    Long versaoId,
    int versao,
    List<CampoDocumento> campos,
    Map<String, List<OpcaoLista>> listas,
    Map<String, Object> dadosPadrao
) {
}
