INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (2, 'Evolução de Enfermagem', 'Registro da evolução de enfermagem do paciente', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (2, 1,
    '[
        {
            "nome": "data",
            "rotulo": "Data",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "hora",
            "rotulo": "Hora",
            "tipo": "HORA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "evolucao",
            "rotulo": "Evolução de enfermagem",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'evolucao-enfermagem'
);