INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (9, 'Alta Terapêutica - Conclusão', 'Registro da conclusão do programa terapêutico do acolhido', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (9, 1,
    '[
        {
            "nome": "dataAcolhimento",
            "rotulo": "Data de início do acolhimento",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "data",
            "rotulo": "Data da alta",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'alta-terapeutica-conclusao'
);
