INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (8, 'Declaração de Alta a Pedido', 'Registro dos esclarecimentos e do motivo da alta solicitada pelo acolhido', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (8, 1,
    '[
        {
            "nome": "esclarecimentos",
            "rotulo": "Esclarecimentos prestados ao acolhido",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
        },
        {
            "nome": "motivo",
            "rotulo": "Motivo da alta a pedido",
            "descricao": "EU, declaro que fui devidamente informado e esclarecido quanto a situação de minha saúde, conforme acima registrado e decido deixar de ser assistido por esta instituição em razão de:",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
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
    'declaracao-alta-a-pedido'
);
