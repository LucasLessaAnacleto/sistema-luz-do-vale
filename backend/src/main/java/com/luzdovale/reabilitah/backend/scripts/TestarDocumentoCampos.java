package com.luzdovale.reabilitah.backend.scripts;


import com.google.gson.Gson;
import com.luzdovale.reabilitah.backend.application.services.DocumentoCamposService;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;

import java.util.List;

public class TestarDocumentoCampos {
    public static void main(String[] args) {
        DocumentoCamposService documentoCamposService = new DocumentoCamposService(new Gson());
        var versaoDocumento = new TipoDocumentoVersao();
        versaoDocumento.setId(1L);
        versaoDocumento.setVersao(1);
        versaoDocumento.setCampos("""
                [
                  {
                    "nome": "estadoCivil",
                    "rotulo": "Estado civil",
                    "tipo": "SELECAO",
                    "opcoes": [
                      "Solteiro",
                      "Casado",
                      "Divorciado"
                    ]
                  },
                  {
                    "nome": "hobbies",
                    "rotulo": "Hobbies",
                    "tipo": "MULTIPLA_ESCOLHA",
                    "opcoes": [
                      "Esportes",
                      "Música",
                      "Leitura"
                    ]
                  }
                ]
                """);
        var tipoDocumento = new TipoDocumento();
        tipoDocumento.setId(1L);
        tipoDocumento.setNome("Controle de Saída");
        versaoDocumento.setTipoDocumento(tipoDocumento);

        var campos = documentoCamposService.lerCampos(versaoDocumento);
        imprimirCampos(campos, 0);
    }

    private static void imprimirCampos(List<CampoDocumento> campos, int nivel) {
        if (campos == null || campos.isEmpty()) {
            return;
        }

        String indentacao = "  ".repeat(nivel);

        for (CampoDocumento campo : campos) {

            System.out.println(indentacao + "==================================");
            System.out.println(indentacao + "Nome:             " + campo.getNome());
            System.out.println(indentacao + "Rótulo:           " + campo.getRotulo());
            System.out.println(indentacao + "Tipo:             " + campo.getTipo());
            System.out.println(indentacao + "Obrigatório:      " + campo.isObrigatorio());
            System.out.println(indentacao + "Largura:          " + campo.getLargura());
            System.out.println(indentacao + "Opções:           " + (campo.getOpcoes() != null ? campo.getOpcoes() : "N/A"));
            System.out.println(indentacao + "Tabela Lista:     " + (campo.getTabelaLista() != null ? campo.getTabelaLista() : "N/A"));
            System.out.println(indentacao + "Origem:           " + (campo.getOrigem() != null ? campo.getOrigem() : "N/A"));
            System.out.println(indentacao + "Somente Leitura:  " + campo.isSomenteLeitura());

            if (campo.getCampos() != null && !campo.getCampos().isEmpty()) {
                System.out.println(indentacao + "Campos internos:");
                imprimirCampos(campo.getCampos(), nivel + 1);
            }

            System.out.println(indentacao + "==================================");
        }
    }
}
