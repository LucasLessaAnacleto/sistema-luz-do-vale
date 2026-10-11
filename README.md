# Reabilitah — Prontuário Eletrônico

Sistema web de prontuário eletrônico desenvolvido para o **Centro de Recuperação Luz no Vale (CERLUZ)**, localizado em Nova Veneza/SC. O projeto busca digitalizar e centralizar os registros dos pacientes, facilitando a gestão interna, o acompanhamento clínico e a preparação para auditorias estaduais.

## 🎯 Objetivo

Substituir processos manuais baseados em papel, planilhas e documentos Word por uma plataforma centralizada, segura e rastreável, reduzindo retrabalho, erros e riscos de perda de informações.

## 🚀 Funcionalidades principais

- **Gestão de pacientes:** cadastro, dados pessoais, responsáveis e histórico de acolhimento.
- **Prontuário eletrônico:** centralização dos documentos e registros de cada paciente.
- **Gestão de documentos:** criação, geração de PDF, assinaturas, desativação e reativação com controle de versões.
- **Auditoria:** histórico de ações, alterações de status, versões, responsáveis e datas.
- **Gestão de equipe:** cadastro de profissionais, permissões de acesso e registros administrativos.
- **Dashboard:** indicadores, documentos pendentes de assinatura, avisos e informações relevantes.
- **Controle de acesso:** permissões por usuário e funcionalidade.

## 🛠️ Tecnologias

- **Frontend:** Next.js + React 19
- **Backend:** Java Spring
- **Banco de dados:** PostgreSQL

## 🔒 Regras importantes

- Documentos e versões não podem ser excluídos definitivamente nem sobrescritos.
- A desativação de documentos exige justificativa e preserva o histórico.
- As ações realizadas no sistema devem ser rastreáveis.
- O acesso é restrito aos profissionais autorizados da instituição.
- O método definitivo de assinatura eletrônica ainda depende de validação com a instituição e o órgão auditor.

## 🎓 Contexto acadêmico

Projeto desenvolvido no curso de **Análise e Desenvolvimento de Sistemas (ADS)** da Faculdade SENAC Criciúma, no âmbito da Extensão Curricular 2026.1, com continuidade prevista no Projeto Integrador.

**ODS relacionados:** ODS 3 — Saúde e Bem-Estar; ODS 8 — Trabalho Decente e Crescimento Econômico; ODS 10 — Redução das Desigualdades.