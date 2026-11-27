INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (5, 'Evolução Geral', 'Registro de evolução geral da equipe técnica', false, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (5, 1,
    '[
        {
            "nome": "registro",
            "rotulo": "Evolução Geral",
            "descricao": "Nesta evolução consta o registro de forma geral da equipe técnica: coordenador, psicóloga e monitores concernente a evolução do acolhido na instituição:",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": true,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'evolucao-geral'
);