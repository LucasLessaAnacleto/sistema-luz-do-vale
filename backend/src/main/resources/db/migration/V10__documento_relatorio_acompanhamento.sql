INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (4, 'Relatório de Acompanhamento', 'Relatório de acompanhamento do paciente durante o tratamento', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (4, 1,
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
    CURRENT_TIMESTAMP,
    NULL
);