package com.luzdovale.reabilitah.backend.application.services;

import com.google.gson.Gson;
import com.luzdovale.reabilitah.backend.application.exceptions.CamposDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoCampo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DocumentoCamposServiceTest {

    private DocumentoCamposService documentoCamposService;

    @BeforeEach
    void preparar() {
        documentoCamposService = new DocumentoCamposService(new Gson());
    }

    @Test
    void deveLerCamposValidosEUsarTextoComoTipoPadrao() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "destino",
                    "rotulo": "Destino",
                    "obrigatorio": true
                  },
                  {
                    "nome": "dataSaida",
                    "rotulo": "Data da saída",
                    "tipo": "DATA",
                    "obrigatorio": true
                  },
                  {
                    "nome": "acompanhado",
                    "rotulo": "Está acompanhado?",
                    "tipo": "BOOLEANO",
                    "obrigatorio": false
                  }
                ]
                """);

        var campos = documentoCamposService.lerCampos(versao);

        assertEquals(3, campos.size());

        assertEquals("destino", campos.get(0).getNome());
        assertEquals(EnumTipoCampo.TEXTO, campos.get(0).getTipo());

        assertEquals(EnumTipoCampo.DATA, campos.get(1).getTipo());
        assertEquals(EnumTipoCampo.BOOLEANO, campos.get(2).getTipo());
        assertFalse(campos.get(2).isObrigatorio());
    }

    @Test
    void deveAceitarGrupoComCamposValidos() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "solicitante",
                    "rotulo": "Dados do solicitante",
                    "tipo": "GRUPO",
                    "campos": [
                      {
                        "nome": "nome",
                        "rotulo": "Nome completo",
                        "tipo": "TEXTO",
                        "obrigatorio": true
                      },
                      {
                        "nome": "cpf",
                        "rotulo": "CPF",
                        "tipo": "TEXTO",
                        "obrigatorio": true
                      },
                      {
                        "nome": "dataNascimento",
                        "rotulo": "Data de nascimento",
                        "tipo": "DATA"
                      }
                    ]
                  }
                ]
                """);

        var campos = assertDoesNotThrow(
                () -> documentoCamposService.lerCampos(versao)
        );

        assertEquals(1, campos.size());

        var grupo = campos.getFirst();

        assertEquals(EnumTipoCampo.GRUPO, grupo.getTipo());
        assertNotNull(grupo.getCampos());
        assertEquals(3, grupo.getCampos().size());
    }

    @Test
    void naoDevePermitirGrupoAninhado() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "solicitante",
                    "rotulo": "Dados do solicitante",
                    "tipo": "GRUPO",
                    "campos": [
                      {
                        "nome": "nome",
                        "rotulo": "Nome",
                        "tipo": "TEXTO"
                      },
                      {
                        "nome": "endereco",
                        "rotulo": "Endereço",
                        "tipo": "GRUPO",
                        "campos": [
                          {
                            "nome": "rua",
                            "rotulo": "Rua",
                            "tipo": "TEXTO"
                          }
                        ]
                      }
                    ]
                  }
                ]
                """);

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void naoDevePermitirGrupoSemCampos() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "solicitante",
                    "rotulo": "Dados do solicitante",
                    "tipo": "GRUPO",
                    "campos": []
                  }
                ]
                """);

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void naoDevePermitirCampoSemNomeDentroDoGrupo() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "solicitante",
                    "rotulo": "Dados do solicitante",
                    "tipo": "GRUPO",
                    "campos": [
                      {
                        "nome": "",
                        "rotulo": "Nome",
                        "tipo": "TEXTO"
                      }
                    ]
                  }
                ]
                """);

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void naoDevePermitirGrupoAninhadoMesmoQuandoVazio() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "solicitante",
                    "rotulo": "Dados do solicitante",
                    "tipo": "GRUPO",
                    "campos": [
                      {
                        "nome": "endereco",
                        "rotulo": "Endereço",
                        "tipo": "GRUPO",
                        "campos": []
                      }
                    ]
                  }
                ]
                """);

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void naoDevePermitirSelecaoSemOpcoesNemTabelaLista() {

        var versao = criarVersao("""
                [
                  {
                    "nome": "estadoCivil",
                    "rotulo": "Estado civil",
                    "tipo": "SELECAO"
                  }
                ]
                """);

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void deveAceitarSelecaoComOpcoes() {

        var versao = criarVersao("""
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
                  }
                ]
                """);

        var campos = assertDoesNotThrow(
                () -> documentoCamposService.lerCampos(versao)
        );

        assertEquals(1, campos.size());
        assertEquals(3, campos.getFirst().getOpcoes().size());
        assertEquals("Solteiro", campos.getFirst().getOpcoes().getFirst());
    }

    @Test
    void naoDeveAceitarArrayVazio() {

        var versao = criarVersao("[]");

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    @Test
    void naoDeveAceitarNull() {

        var versao = criarVersao("");

        assertThrows(
                CamposDocumentoInvalidosException.class,
                () -> documentoCamposService.lerCampos(versao)
        );
    }

    private TipoDocumentoVersao criarVersao(String camposJson) {

        var tipoDocumento = new TipoDocumento();
        tipoDocumento.setId(1L);
        tipoDocumento.setNome("Documento de Teste");

        var versaoDocumento = new TipoDocumentoVersao();
        versaoDocumento.setId(1L);
        versaoDocumento.setVersao(1);
        versaoDocumento.setTipoDocumento(tipoDocumento);
        versaoDocumento.setCampos(camposJson);

        return versaoDocumento;
    }
}
