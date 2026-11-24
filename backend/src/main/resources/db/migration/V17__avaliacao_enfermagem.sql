INSERT INTO tipo_documento (id, nome, descricao, exige_assinatura, ativo)
VALUES (13, 'Avaliação de Enfermagem', 'Registro dos sinais vitais e do exame físico do acolhido', false, true);

INSERT INTO tipo_documento_versao (tipo_documento_id, versao, campos, dt_criacao, template)
VALUES (13, 1,
    '[
        {
            "nome": "temperatura",
            "rotulo": "Temperatura",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "pulso",
            "rotulo": "Pulso",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "respiracao",
            "rotulo": "Respiração",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "pressaoArterial",
            "rotulo": "Pressão arterial",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "peso",
            "rotulo": "Peso",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "altura",
            "rotulo": "Altura",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "internacoes",
            "rotulo": "Quantidade de internações anteriores",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "usaMedicacao",
            "rotulo": "Faz o uso de medicação psiquiátrica?",
            "tipo": "BOOLEANO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "medicacao",
            "rotulo": "Qual medicação?",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "dst",
            "rotulo": "Teve alguma DST? Qual?",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "genitais",
            "rotulo": "Genitais e região perineal",
            "descricao": "(Se necessário) (Edema, sujidade, lesões, hemorroidas, deformidades, parasitas, sondas, prurido)",
            "tipo": "TEXTO_LONGO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "couroCabeludo",
            "rotulo": "Couro cabeludo",
            "descricao": "(Alopecia, sujidade, lêndeas, piolhos, seborréia, emaranhado, crosta, comprimento, ressecamento, quebradiço)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "orelhasOuvido",
            "rotulo": "Orelhas e ouvido",
            "descricao": "(Acuidade auditiva, secreção, lesão, deformidades, dor, aparelho auditivo)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "olhosPalpebras",
            "rotulo": "Olhos e pálpebras",
            "descricao": "(Acuidade visual, secreção, alteração da conjutiva, avaliação pupilar, deformidades, uso de prótese)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "nariz",
            "rotulo": "Nariz",
            "descricao": "(Olfato, secreção, sujidade, deformidades, obstrução)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "bocaMucosa",
            "rotulo": "Boca e mucosa",
            "descricao": "(Edema, paralisia, lingua saburrosa, sangramento, ulceração, sujidade, deformidades, coloração mucosa, sialorréia, ressecamento, hiperemia, dor, dificuldade para sugar e/ou mastigar, prótese)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "pescocoGarganta",
            "rotulo": "Pescoço e garganta",
            "descricao": "(Nódulos, disfagia, secreção, hiperemia e fissura)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "membros",
            "rotulo": "Membro superior e inferior",
            "descricao": "(Edemas, plegias, deformidades, temperatura, dor, dormencia, prótese, rede venenosa visível ou não, processo inflamatório, unhas sujas, quebradiças)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "abdomen",
            "rotulo": "Abdômen",
            "descricao": "(Plano, flácido, distendido, globoso, doloroso, ascite, umbigo, com secreção ou sujidade)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "eliminacoesSecrecoes",
            "rotulo": "Eliminações e secreções",
            "descricao": "(Se necessário) (Vômito, intestinal, vesical)",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "malformacoes",
            "rotulo": "Malformações",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "traumatismo",
            "rotulo": "Traumatismo",
            "tipo": "TEXTO",
            "obrigatorio": false,
            "largura": 12
        },
        {
            "nome": "consciencia",
            "rotulo": "Nível de consciência",
            "tipo": "SELECAO",
            "obrigatorio": false,
            "largura": 6,
            "opcoes": [
                "Consciente",
                "Semi-consciente",
                "Inconsciente"
            ]
        },
        {
            "nome": "orientacao",
            "rotulo": "Orientação",
            "tipo": "SELECAO",
            "obrigatorio": false,
            "largura": 6,
            "opcoes": [
                "Orientado",
                "Desorientado"
            ]
        },
        {
            "nome": "postura",
            "rotulo": "Postura",
            "tipo": "SELECAO",
            "obrigatorio": false,
            "largura": 6,
            "opcoes": [
                "Normal",
                "Alterada"
            ]
        },
        {
            "nome": "posicaoSentada",
            "rotulo": "Posição sentada",
            "tipo": "SELECAO",
            "obrigatorio": false,
            "largura": 6,
            "opcoes": [
                "Não senta",
                "Senta"
            ]
        },
        {
            "nome": "engatinha",
            "rotulo": "Engatinha?",
            "tipo": "BOOLEANO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "marcha",
            "rotulo": "Marcha?",
            "tipo": "BOOLEANO",
            "obrigatorio": false,
            "largura": 6
        },
        {
            "nome": "data",
            "rotulo": "Data da avaliação",
            "tipo": "DATA",
            "obrigatorio": true,
            "largura": 6
        }
    ]'::jsonb,
    CURRENT_TIMESTAMP,
    'avaliacao-enfermagem'
);
