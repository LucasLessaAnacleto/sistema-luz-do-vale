SELECT setval(
    pg_get_serial_sequence('tipo_documento', 'id'),
    GREATEST(
        (SELECT MAX(id) FROM tipo_documento),
        nextval(pg_get_serial_sequence('tipo_documento', 'id'))
    )
);

WITH novo_tipo AS (
    INSERT INTO tipo_documento (nome, descricao, exige_assinatura, ativo)
    VALUES ('Evolução Geral', 'Registro de evolução geral da equipe técnica', false, true)
    RETURNING id
)
INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
SELECT id, 1,
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
FROM novo_tipo;
