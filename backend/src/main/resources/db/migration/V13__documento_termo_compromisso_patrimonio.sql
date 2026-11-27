INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (7, 'Termo de Compromisso ao Patrimônio', 'Compromisso ao patrimônio, responsabilidade pelo acolhimento e autorização de uso de imagem', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (7, 1,
    '[
        {
            "nome": "autorizacaoImagem",
            "rotulo": "Autorização de uso de imagem",
            "descricao": "Autorizo o Centro de Recuperação Luz no Vale – CERLUZ, CNPJ: 13.445.159/0001-61. Bem como voluntários que prestam serviços na instituição, á fazer o uso de minha imagem em (redes sociais, vídeos, sites, panfletos e etc...).",
            "tipo": "BOOLEANO",
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
    'termo-compromisso-patrimonio'
);