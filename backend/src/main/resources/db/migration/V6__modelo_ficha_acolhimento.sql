-- Modelo documentado em docs/regras_do_sistema.txt.
-- Preserva a ficha caso ja tenha sido configurada manualmente.
INSERT INTO tipo_documento (nome, descricao, exige_assinatura, ativo)
SELECT 'Ficha de Acolhimento', 'Dados do acolhido, tipos de dependência e responsável', false, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_documento WHERE nome = 'Ficha de Acolhimento'
) AND NOT EXISTS (
    SELECT 1 FROM tipo_documento_versao WHERE template = 'ficha-acolhimento'
);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, dt_criacao, template, campos)
SELECT tipo.id,
       COALESCE((SELECT MAX(versao) FROM tipo_documento_versao WHERE tipo_documento_id = tipo.id), 0) + 1,
       CURRENT_TIMESTAMP,
       'ficha-acolhimento',
       '[
  {
    "nome": "acolhido",
    "rotulo": "Dados do acolhido",
    "tipo": "GRUPO",
    "obrigatorio": true,
    "campos": [
      {
        "nome": "nome",
        "rotulo": "Nome",
        "tipo": "TEXTO",
        "obrigatorio": true,
        "origem": "PACIENTE.nome",
        "largura": 12
      },
      {
        "nome": "nacionalidade",
        "rotulo": "Nacionalidade",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 6
      },
      {
        "nome": "naturalidade",
        "rotulo": "Naturalidade",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 6
      },
      {
        "nome": "dataNascimento",
        "rotulo": "Data de nascimento",
        "tipo": "DATA",
        "obrigatorio": false,
        "origem": "PACIENTE.dtNasc",
        "largura": 4
      },
      {
        "nome": "cpf",
        "rotulo": "CPF",
        "tipo": "TEXTO",
        "obrigatorio": true,
        "origem": "PACIENTE.cpf",
        "largura": 4
      },
      {
        "nome": "rg",
        "rotulo": "RG",
        "tipo": "TEXTO",
        "obrigatorio": true,
        "origem": "PACIENTE.rg",
        "largura": 4
      },
      {
        "nome": "nomePai",
        "rotulo": "Nome do pai",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 12
      },
      {
        "nome": "nomeMae",
        "rotulo": "Nome da mãe",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 12
      },
      {
        "nome": "rua",
        "rotulo": "Endereço",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "PACIENTE.endereco.rua",
        "largura": 8
      },
      {
        "nome": "numero",
        "rotulo": "Nº",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "PACIENTE.endereco.numero",
        "largura": 4
      },
      {
        "nome": "bairro",
        "rotulo": "Bairro",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "PACIENTE.endereco.bairro",
        "largura": 4
      },
      {
        "nome": "municipio",
        "rotulo": "Município",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "PACIENTE.endereco.municipio",
        "largura": 4
      },
      {
        "nome": "estado",
        "rotulo": "Estado",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "PACIENTE.endereco.estado",
        "largura": 4
      },
      {
        "nome": "escolaridade",
        "rotulo": "Escolaridade",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 6
      },
      {
        "nome": "profissao",
        "rotulo": "Profissão",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 6
      },
      {
        "nome": "cor",
        "rotulo": "Cor",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 4
      },
      {
        "nome": "estadoCivil",
        "rotulo": "Estado civil",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "largura": 4
      },
      {
        "nome": "filhos",
        "rotulo": "Possui filhos?",
        "tipo": "BOOLEANO",
        "obrigatorio": false,
        "largura": 4
      }
    ]
  },
  {
    "nome": "dependencia",
    "rotulo": "Tipos de dependência",
    "tipo": "GRUPO",
    "obrigatorio": false,
    "campos": [
      {
        "nome": "tipos",
        "rotulo": "Tipos de dependência",
        "tipo": "MULTIPLA_SELECAO",
        "obrigatorio": false,
        "tabelaLista": "TIPO_DEPENDENCIA"
      },
      {
        "nome": "primeiraDrogaLicita",
        "rotulo": "Primeira droga lícita",
        "tipo": "SELECAO",
        "obrigatorio": false,
        "tabelaLista": "TIPO_DEPENDENCIA_LICITA",
        "largura": 8
      },
      {
        "nome": "idadePrimeiraDrogaLicita",
        "rotulo": "Idade",
        "tipo": "INTEIRO",
        "obrigatorio": false,
        "largura": 4
      },
      {
        "nome": "primeiraDrogaIlicita",
        "rotulo": "Primeira droga ilícita",
        "tipo": "SELECAO",
        "obrigatorio": false,
        "tabelaLista": "TIPO_DEPENDENCIA_ILICITA",
        "largura": 8
      },
      {
        "nome": "idadePrimeiraDrogaIlicita",
        "rotulo": "Idade",
        "tipo": "INTEIRO",
        "obrigatorio": false,
        "largura": 4
      }
    ]
  },
  {
    "nome": "responsavel",
    "rotulo": "Dados do responsável",
    "tipo": "GRUPO",
    "obrigatorio": false,
    "campos": [
      {
        "nome": "nome",
        "rotulo": "Nome",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.nome",
        "largura": 8
      },
      {
        "nome": "parentesco",
        "rotulo": "Grau de parentesco",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.parentesco",
        "largura": 4
      },
      {
        "nome": "cpf",
        "rotulo": "CPF",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.cpf",
        "largura": 4
      },
      {
        "nome": "rg",
        "rotulo": "RG",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.rg",
        "largura": 4
      },
      {
        "nome": "telefone",
        "rotulo": "Contato",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.telefone",
        "largura": 4
      },
      {
        "nome": "rua",
        "rotulo": "Endereço",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.endereco.rua",
        "largura": 8
      },
      {
        "nome": "numero",
        "rotulo": "Nº",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.endereco.numero",
        "largura": 4
      },
      {
        "nome": "bairro",
        "rotulo": "Bairro",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.endereco.bairro",
        "largura": 4
      },
      {
        "nome": "municipio",
        "rotulo": "Município",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.endereco.municipio",
        "largura": 4
      },
      {
        "nome": "estado",
        "rotulo": "Estado",
        "tipo": "TEXTO",
        "obrigatorio": false,
        "origem": "RESPONSAVEL.endereco.estado",
        "largura": 4
      }
    ]
  }
]'::jsonb
FROM tipo_documento tipo
WHERE tipo.id = (SELECT MIN(id) FROM tipo_documento WHERE nome = 'Ficha de Acolhimento')
  AND NOT EXISTS (
      SELECT 1 FROM tipo_documento_versao WHERE template = 'ficha-acolhimento'
  );
