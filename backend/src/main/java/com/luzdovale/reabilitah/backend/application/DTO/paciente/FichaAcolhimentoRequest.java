package com.luzdovale.reabilitah.backend.application.DTO.paciente;

import java.util.List;

public record FichaAcolhimentoRequest(
    String nacionalidade,
    String naturalidade,
    String nomePai,
    String nomeMae,
    String escolaridade,
    String profissao,
    String cor,
    String estadoCivil,
    Boolean filhos,

    List<String> tiposDependencia,
    String primeiraDrogaLicita,
    Integer idadePrimeiraDrogaLicita,
    String primeiraDrogaIlicita,
    Integer idadePrimeiraDrogaIlicita
) {
}
