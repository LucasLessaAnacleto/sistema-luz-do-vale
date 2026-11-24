INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (10, 'Declaração de Alta Administrativa - CT', 'Registro da alta administrativa e dos esclarecimentos prestados ao acolhido', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (10, 1,
    '[
        {
            "nome": "esclarecimentos",
            "rotulo": "Esclarecimentos prestados ao acolhido",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
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
    'declaracao-alta-administrativa'
);
