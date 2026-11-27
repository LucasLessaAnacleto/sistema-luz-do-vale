INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (3, 'Controle de Saída', 'Registro de saída do paciente', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (3, 1,
    '[
        {
            "nome": "dataSaida",
            "rotulo": "Data da saída",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "horaSaida",
            "rotulo": "Hora da saída",
            "tipo": "HORA",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "dataRetorno",
            "rotulo": "Data do retorno",
            "tipo": "DATA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "horaRetorno",
            "rotulo": "Hora do retorno",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "motivo",
            "rotulo": "Motivo da saída",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 12
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'controle-saida'
);