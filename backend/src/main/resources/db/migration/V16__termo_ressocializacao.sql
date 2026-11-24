INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (12, 'Termo de Ressocialização', 'Registro da empresa e dos horários das atividades de ressocialização do acolhido', true, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (12, 1,
    '[
        {
            "nome": "sisreg",
            "rotulo": "Chave de SISREG",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 12
        },
        {
            "nome": "empresa",
            "rotulo": "Empresa",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "telefoneEmpresa",
            "rotulo": "Telefone da empresa",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "segundaInicio",
            "rotulo": "Segunda-feira - início",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "segundaFim",
            "rotulo": "Segunda-feira - fim",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "tercaInicio",
            "rotulo": "Terça-feira - início",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "tercaFim",
            "rotulo": "Terça-feira - fim",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "quartaInicio",
            "rotulo": "Quarta-feira - início",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "quartaFim",
            "rotulo": "Quarta-feira - fim",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "quintaInicio",
            "rotulo": "Quinta-feira - início",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "quintaFim",
            "rotulo": "Quinta-feira - fim",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "sextaInicio",
            "rotulo": "Sexta-feira - início",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "sextaFim",
            "rotulo": "Sexta-feira - fim",
            "tipo": "HORA",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "retorno",
            "rotulo": "Horário de retorno",
            "tipo": "HORA",
            "obrigatorio": true,
            "largura": 12
        },
        {
            "nome": "cidade",
            "rotulo": "Cidade",
            "tipo": "TEXTO",
            "obrigatorio": true,
            "largura": 6
        },
        {
            "nome": "data",
            "rotulo": "Data do termo",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'termo-ressocializacao'
);
