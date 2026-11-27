INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (6, 'Termo de Acolhimento', 'Declaração de acolhimento e lista de pertences', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (6, 1,
    '[
        {
            "nome": "pertences",
            "rotulo": "Lista de pertences",
            "descricao": "Estou ciente de que o tratamento é de caráter gratuito sendo que fico isento de pagar qualquer valor referente a mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para inclusão no tratamento, com as quais CONCORDO, e estou ciente dos meus direitos e deveres junto com esta instituição.",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "data",
            "rotulo": "Data",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'termo-acolhimento'
);