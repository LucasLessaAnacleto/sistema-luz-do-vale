INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (11, 'Declaração de Desligamento', 'Registro da data e do motivo do desligamento do acolhido', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (11, 1,
    '[
        {
            "nome": "sisreg",
            "rotulo": "Chave de SISREG",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "dataAcolhimento",
            "rotulo": "Data do acolhimento",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "dataDesligamento",
            "rotulo": "Data do desligamento",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "motivo",
            "rotulo": "Motivo do desligamento",
            "tipo": "SELECAO",
            "obrigatorio": true,
            "opcoes": [
                "Desistência",
                "Fuga/Evasão",
                "Alta Administrativa",
                "Alta Terapêutica",
                "Agravante de Saúde",
                "Mudança de Convênio/Programa",
                "Óbito"
            ],
            "largura": 6
        },
        {
            "nome": "cidade",
            "rotulo": "Cidade",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "data",
            "rotulo": "Data da declaração",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'declaracao-desligamento'
);