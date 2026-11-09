INSERT INTO usuario (email, senha, role, ativo, dt_criacao)
VALUES ('admin@teste.com','$2a$10$J69EcfOpTkhuha4sEcl36u1qkOyZc7ILRV9ATBVqDhiowU7pwyxpi','ROLE_ADMIN',true,CURRENT_TIMESTAMP);
-- admin@teste.com/123456

INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES
(1, 'Ficha de Acolhimento', 'Dados do acolhido, tipos de dependência e responsável', false, true),
(2, 'Evolução de Atendimento', 'Registro da evolução e acompanhamento do paciente', true, true),
(3, 'Controle de Saída', 'Registro de saída do paciente', false, true),
(4, 'Relatório de Acompanhamento', 'Relatório de acompanhamento do paciente durante o tratamento', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (1,1,
    '[
        {
            "nome": "acolhido",
            "rotulo": "Dados do acolhido",
            "tipo": "GRUPO",
            "obrigatorio": true,
            "largura": 12,
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
            "largura": 12,
            "campos": [
                {
                    "nome": "tipos",
                    "rotulo": "Tipos de dependência",
                    "tipo": "MULTIPLA_SELECAO",
                    "obrigatorio": false,
                    "tabelaLista": "TIPO_DEPENDENCIA",
                    "largura": 12
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
            "largura": 12,
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
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'ficha-acolhimento'
);


INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao)
VALUES (2,1,
        '[
        {
            "nome": "dataAtendimento",
            "rotulo": "Data do atendimento",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 4
        },
        {
            "nome": "evolucao",
            "rotulo": "Evolução",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
        },
        {
            "nome": "conduta",
            "rotulo": "Conduta",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": false,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP
);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao)
VALUES (3, 1,
    '[
        {
            "nome": "destino",
            "rotulo": "Destino",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 8
        },
        {
            "nome": "dataSaida",
            "rotulo": "Data da saída",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 4
        },
        {
            "nome": "acompanhado",
            "rotulo": "Está acompanhado?",
            "tipo": "BOOLEANO",
            "obrigatorio": false,
            "largura": 4
        },
        {
            "nome": "observacao",
            "rotulo": "Observação",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": false,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP
);


INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao)
VALUES (4,1,
    '[
        {
            "nome": "data",
            "rotulo": "Data",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 4
        },
        {
            "nome": "resumo",
            "rotulo": "Resumo do acompanhamento",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
        },
        {
            "nome": "observacao",
            "rotulo": "Observações",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": false,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP
);

