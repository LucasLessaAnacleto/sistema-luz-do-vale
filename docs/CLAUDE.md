# Reabilitah — Sistema de Prontuário Eletrônico para a Luz do Vale

> Este documento é o ponto de partida para construir o sistema real. Foi extraído da análise completa do protótipo funcional (Figma Make, exportado para React em `export-figma-make/`), do histórico de 6 prompts de evolução desse protótipo, dos documentos acadêmicos do projeto (TCC.pdf e Template.pdf) e — desde 08/09/2026 — do **mapeamento dos documentos físicos reais da instituição** (17 tipos fotografados e consolidados em `documentos-mapeados.md`). Onde havia conflito entre fontes, as decisões abaixo já foram validadas com o time (ver seção "Decisões já tomadas").
>
> **Ordem de autoridade das fontes**, quando divergirem: (1) os **documentos reais** em `documentos-mapeados.md` e `mapeamento/fotos/`; (2) as decisões registradas neste arquivo; (3) o código do protótipo (`App.tsx`/`types.ts`); (4) os prompts antigos e os PDFs acadêmicos. O protótipo é referência de **UX**, não de regra de negócio — ver seções 8.1 e 11.

## 1. Contexto acadêmico (TCS)

- **Curso:** ADS 4 (Análise e Desenvolvimento de Sistemas) — Faculdade SENAC Criciúma.
- **Disciplina:** Extensão Curricular 2026.1 (com continuidade prevista no Projeto Integrador).
- **Professora:** Roseli Jenoveva Neto.
- **Equipe:** Danilo Dias, Bianca Birolo, Gabriel Vieira e Lucas Anacleto.
- **Título do programa:** Melhoria nos sistemas de tecnologia da informação de Instituições Sociais.
- **Título do projeto:** Desenvolvimento de sistema de prontuário eletrônico para instituição Luz do Vale.
- **ODS relacionados:** ODS 3 (Saúde e bem-estar), ODS 8 (Indústria, inovação e infraestrutura), ODS 10 (Redução das desigualdades).
- **Entregáveis do semestre:** levantamento de requisitos → modelagem → protótipo → testes/ajustes → validação com a instituição e professores → preenchimento do template → postagem no Teams → apresentação para banca.

## 2. A instituição

- **Nome oficial:** Centro de Recuperação Luz no Vale — **CERLUZ** (logo/nome curto: "LUZ NO VALE"). *(Confirmado no papel timbrado das fotos de `mapeamento/fotos/`.)*
- **CNPJ:** 13.445.159/0001-61.
- **Localização:** Estrada Geral (Angelino Destro), 508 — Picadão do Sul — Nova Veneza/SC, CEP 88.865-000. *(Nota: o código do protótipo atual tem "Itajaí - SC" hardcoded no cabeçalho dos documentos — isso é um resíduo incorreto do protótipo e deve ser corrigido no sistema real.)*
- **Contato:** centroluznovale@gmail.com · (48) 9 9603-1606 / (48) 9 9603-1498 · www.centroluznovale.com.br
- **Direção:** Presidente Sérgio Antonio Elias; Vice-presidente Valter Silva.
- **Vínculo com o Estado:** parte das vagas é **custeada pelo Governo de SC**, com acompanhamento da **Gerência Regional de Saúde de Criciúma / Equipe Descentralizada de Controle e Avaliação** (é este o órgão da auditoria mensal). Pacientes com vaga estadual têm **chave SISREG**.
- **Atividade:** centro de recuperação de dependentes químicos, com foco em reabilitação e reintegração social.
- **Equipe multidisciplinar:** psicólogos, enfermeiros, psiquiatras, equipe administrativa, coordenação.
- **Escala real:** ~32 pacientes, ~7 funcionários. Sistema é uso **interno exclusivo da equipe** — pacientes não têm celular/acesso próprio ao sistema.

## 3. Problema atual

- Toda a gestão de pacientes é feita em **papel, planilhas Excel e arquivos Word**, de forma descentralizada.
- Todo fim de mês, um órgão estadual faz auditoria dos documentos de cada paciente — hoje isso é lento e desorganizado por estar tudo em papel.
- Dificuldades: tempo alto de preenchimento/organização, risco de perda/extravio, difícil consulta de histórico, falta de padronização, retrabalho, complexidade para preparar auditorias.

### O que o mapeamento dos documentos revelou sobre o problema (08/09/2026)

O órgão auditor tem nome e formulários próprios: **Gerência Regional de Saúde de Criciúma — Equipe Descentralizada de Controle e Avaliação**, ligada à Secretaria de Estado da Saúde de SC. **4 dos 17 documentos mapeados são formulários emitidos pelo próprio órgão** (ver seção 9) — esses são a prestação de contas das vagas custeadas pelo Estado e formam o **núcleo inegociável da V1**.

Os documentos em papel evidenciam os sintomas de forma concreta e citável na banca:

- **Templates Word com dados chumbados:** a Declaração de Alta Administrativa traz *"NOVA VENEZA, SC 16 DE MARÇO 2026"* impresso no corpo; a Declaração de Alta a Pedido traz o ano *"2026"* fixo. Alguém edita o Word e reimprime a cada uso.
- **Erros de digitação propagados por cópia:** "NOVE VENEZA/SC", "PROFICIONAL RESPONSAVEL", "ESCLARECIMENTTOS", "COODENADOR", "DIESEPAN" (por Diazepam). São erros que o sistema elimina de vez ao gerar o documento a partir de metadados.
- **Três padrões de cabeçalho conviventes:** timbre institucional completo, timbre só com logo, e folhas sem timbre nenhum (a própria Ficha de Acolhimento não tem timbre).
- **Registros clínicos sem assinatura nem data:** a Avaliação de Enfermagem e a Evolução Geral não têm linha de assinatura no papel. O sistema registra autor e data/hora automaticamente — isso **melhora a rastreabilidade em relação ao papel**, não apenas digitaliza.
- **Folhas-tabela acumulativas** (Evolução de Enfermagem, Controle de Saída) concentram dezenas de registros de meses numa folha só: perder essa folha é perder o histórico inteiro daquele eixo.

## 4. Proposta / objetivo do sistema

Sistema web de **prontuário eletrônico** que centraliza cadastro de pacientes, documentação clínica/administrativa, histórico e **auditoria por paciente** — para facilitar tanto o trabalho da equipe quanto a auditoria mensal do governo.

Pilares centrais (nessa ordem de importância, confirmado nos prompts de evolução do protótipo):
1. **Pacientes** — cadastro, prontuário, acompanhamento.
2. **Documentos** — criação, consulta, versionamento, desativação/reativação, assinatura, PDF.
3. **Auditoria** — rastreamento de toda ação, versão, assinatura, justificativa, usuário, data/hora.

## 5. Decisões já tomadas (perguntas fechadas com o usuário)

| Tema | Decisão |
|---|---|
| Frontend | Next.js |
| Backend | Node.js + NestJS |
| Banco de dados | PostgreSQL |
| Localização da instituição | Nova Veneza/SC — endereço completo e CNPJ na seção 2 (corrigir o "Itajaí" que está no protótipo) |
| Área/portal para familiares | **Fora de escopo.** Não incluir chat, mural ou login de familiar. Manter apenas "Responsáveis" como dado cadastral do paciente (nome, parentesco, CPF, contato — ver seção 8). |
| Assinatura manuscrita (desenho na tela/tablet) | **Revertida a decisão do protótipo.** Não é mais "removida definitivamente" — ver seção 6, é o caminho mais provável para o paciente. |
| Método de assinatura (GOV.BR vs. presencial vs. híbrido) | **Em aberto — ver seção 6.** Direção mais provável (e reforçada pelo mapeamento): presencial reforçado como padrão, GOV.BR reservado a casos que exijam nível forte. Falta a resposta da GERSA sobre aceitar assinatura eletrônica. |
| Tipos de documento da V1 | **Mapeados — ver seção 9.** São **17 tipos** (não ~40), consolidados em `documentos-mapeados.md`. Escopo mínimo = os 4 formulários do Governo de SC + os institucionais que a auditoria exigir (a confirmar). |
| Nome oficial da instituição nos documentos | **Centro de Recuperação Luz no Vale — CERLUZ** (logo: "LUZ NO VALE"). O sistema deve suportar **dois cabeçalhos**: o institucional e o do Governo de SC (ver seção 8). |

## 6. Fluxo de assinatura — DECISÃO EM ABERTO (reabriu depois da análise de viabilidade)

A última refinada do protótipo trocou a assinatura manuscrita por um fluxo 100% via **GOV.BR** (baixar PDF → assinar externamente → reanexar PDF assinado). Ao revisar isso com o time, identificamos um problema estrutural: **assinar pelo GOV.BR exige conta nível Prata/Ouro (validada por reconhecimento facial via app, banco credenciado ou certificado digital) + segundo fator no momento da assinatura** — ou seja, exige smartphone/dados disponíveis *no instante de assinar*, não só uma conta já criada. Pacientes de uma instituição de recuperação tipicamente **não têm celular disponível** (muitas vezes por regra do próprio tratamento), então esse fluxo é inviável para o paciente assinar sozinho.

**✅ Confirmação documental (08/09/2026):** o **Regimento Interno da instituição, regra nº 9**, diz textualmente: *"É proibido ao residente o uso de aparelho celular e fones de ouvido."* Isso deixa de ser suposição e vira evidência citável na banca — o fluxo GOV.BR é comprovadamente inviável para o paciente assinar. Foto em `mapeamento/fotos/05-regimento-interno.jpg`.

**✅ Reforço ao modelo de testemunha:** a **Declaração de Desligamento do próprio Governo de SC** (`15-ses-declaracao-desligamento.jpg`) tem a linha de assinatura rotulada *"Assinatura do Acolhido/**Testemunha**"* — ou seja, o conceito de testemunha assinando no lugar do acolhido **já existe no processo oficial do órgão auditor**. Isso sustenta diretamente a proposta de "presencial reforçado com testemunha".

**✅ Redução do risco CFM:** nenhum dos 17 documentos mapeados é registro médico assinado por psiquiatra — os registros clínicos são de enfermagem e da equipe técnica. Isso enfraquece bastante a hipótese de cair nas exigências CFM/SBIS. **Mas ainda não fecha a questão**: a Avaliação de Enfermagem pergunta sobre medicação psiquiátrica e o Regimento (regra 18) exige receituário médico, então existe documentação médica que não foi fotografada. Confirmar antes de travar.

**⚠️ Nova pergunta bloqueante identificada:** 4 dos 17 documentos são **formulários do próprio órgão auditor** (Gerência Regional de Saúde de Criciúma). Antes de qualquer decisão sobre método de assinatura, é preciso saber **se a GERSA aceita esses documentos assinados eletronicamente** e sob qual padrão. Essa é hoje a pergunta de maior impacto nesta seção.

### Base legal levantada
- MP 2.200-2/2001 + Lei 14.063/2020: toda assinatura eletrônica sem certificado ICP-Brasil ("assinatura simples") é juridicamente válida como evidência de manifestação de vontade, mas **não tem presunção de veracidade** — quem quiser usá-la como prova precisa conseguir demonstrar autenticidade se for contestada.
- Um traço "cru" capturado em canvas (só a imagem do risco, sem mais nada) é **fraco** nesse sentido — comparável a um print de tela, contestável. O que fortalece uma assinatura simples (sem precisar de certificado) é **biometria do traço (pressão/velocidade/timing) + testemunha autenticada + hash de integridade do conteúdo assinado + metadados de dispositivo/IP** — isso a aproxima de uma assinatura "avançada".
- **Ponto de atenção a confirmar com a instituição/orientador antes da banca:** documentos que sejam estritamente **prontuário médico assinado pelo psiquiatra** (não os demais profissionais) podem cair sob regras do CFM (Resolução 1.821/2007 + certificação SBIS, níveis NGS1/2/3) que endurecem conforme o sistema elimina totalmente o papel daquele registro. Não temos certeza da linha exata — é item de pesquisa/validação, não decisão travada.

### Direção mais provável (ainda não travada em pedra)
Modelo **híbrido por tipo de assinante**, com "presencial reforçado" como caminho padrão:

| Assinante | Método padrão proposto |
|---|---|
| Paciente | **Presencial reforçado**: captura de assinatura em dispositivo da instituição (touch/stylus) + testemunha (profissional autenticado no sistema) + metadados do traço (timestamp/pressão quando disponível) + hash do conteúdo exibido no momento + IP/dispositivo |
| Profissional | GOV.BR quando fizer sentido, ou também presencial reforçado |
| Responsável/família | GOV.BR se tiver conta/celular, senão presencial quando visitar a instituição |

O schema já foi desenhado para suportar **qualquer** um dos caminhos sem travar a decisão de negócio nele — ver `rascunho-tabelas-2.txt`: tabela `ASSINATURA` (vinculada à versão do documento, com `METODO_ASSINATURA_ID`, testemunha, metadados de captura, hash, arquivo assinado) e `TIPO_DOCUMENTO.EXIGE_METODO_FORTE` (flag por tipo de documento, para os casos que precisarem de GOV.BR/ICP-Brasil de verdade).

Fluxo de documento continua com a mesma máquina de estados (independente do método de assinatura escolhido):

```
Criar documento → Preencher → Salvar
  ↓
Status: "Pendente de assinatura"  (versão original é preservada)
  ↓
Assinatura(s) necessária(s) conforme TIPO_DOCUMENTO (paciente / responsável / profissional)
  ↓
Sistema registra cada assinatura vinculada à versão (nunca sobrescreve a original)
  ↓
Status: "Assinado" (quando todas as assinaturas exigidas foram coletadas)
```

- Um documento **desativado** não pode ser editado; para voltar a ser editável precisa ser **reativado**, o que sempre gera nova versão e volta o status para "Pendente de assinatura" (exige nova assinatura).
- **Isto ainda é uma decisão em aberto**, mas o mapeamento (seção 9) já respondeu parte do que faltava:
  - ✅ **Quantos/quais documentos têm múltiplos assinantes ou assinante ≠ paciente** — respondido: são **7 papéis distintos**, e o Termo de Acolhimento tem **3 assinantes** (paciente + responsável + monitor). Detalhe em 8.1-c.
  - ✅ **Quais exigiriam método forte** — os candidatos naturais são as **3 declarações de alta** (peso jurídico de isenção de responsabilidade) e os **4 formulários do Estado**. Os registros clínicos de enfermagem e a evolução geral não precisam.
  - ❌ **Falta (1):** confirmar com a GERSA se o órgão auditor **aceita assinatura eletrônica** nos formulários dele — é hoje a pergunta de maior impacto desta seção.
  - ❌ **Falta (2):** confirmar a questão do CFM/prontuário médico antes de travar `EXIGE_METODO_FORTE` como padrão geral — nenhum dos 17 documentos é assinado por psiquiatra, mas há indícios de documentação médica fora do lote.

## 7. Regra absoluta: documentos são imutáveis, nada é apagado

Esta é a regra de negócio mais repetida em todos os prompts de evolução — trate como inegociável:

- **Não existe mais edição de documento.** Não deve haver botão "Editar" em lugar nenhum do sistema. Um documento criado é uma versão imutável.
- Se uma informação está errada, a solução é criar um **novo documento** ou seguir o fluxo de nova versão (anexar PDF assinado, desativar+reativar), nunca sobrescrever.
- **Nunca excluir definitivamente**: documentos, versões, PDFs, auditorias, justificativas, ou profissionais que já agiram no sistema. "Ocultar/Desativar" ≠ "Excluir".
- Desativar um documento **exige justificativa obrigatória** (motivo). Mesmo assim ele continua consultável.
- Um profissional desativado nunca deve ter seu nome substituído por "usuário desconhecido" — o histórico deve sempre preservar quem fez cada ação.
- A Auditoria de um documento deve mostrar **todas as versões navegáveis** (não só texto — o conteúdo completo daquela versão deve ser visualizável, com navegação "‹ Versão anterior / Próxima versão ›").

## 8. Modelo de domínio (baseado em `export-figma-make/src/app/types.ts`)

Entidades principais já modeladas no protótipo (referência de campos, não schema final de banco):

- **Patient** (paciente/acolhido): dados pessoais completos (nome, apelido, CPF, RG, nascimento, naturalidade, filiação, escolaridade, profissão, estado civil, endereço, convênio, data de acolhimento/desligamento), `dependencies: string[]` (substâncias selecionadas de uma lista fixa — álcool, maconha/haxixe, cocaína, crack, inalantes, diazepam, ecstasy/MDMA, LSD, heroína/morfina/metanfetamina, etc.), primeira droga lícita/ilícita + idade, e `responsibles: Responsible[]` (paciente pode ter mais de um responsável).
  - Único campo obrigatório no cadastro: **Nome completo**. Todo o resto é opcional (institução preenche aos poucos).
- **Responsible**: nome, parentesco, CPF, RG, endereço, contato, data. Único campo obrigatório: nome.
- **PatientDocument**: `docId` (formato `DOC-000001`, sequencial), tipo, título, `status` (`pending-signature` | `signed` | `disabled`), `currentVersion`, criador, conteúdo (varia por tipo), e `versions: DocumentVersion[]` — histórico completo com snapshot de conteúdo por versão.
- **DocumentVersion**: versão, ação (`created` | `pdf-downloaded` | `pdf-attached` | `disabled` | `reactivated` | `signed`), timestamp, autor, justificativa (quando aplicável), nome do arquivo (quando PDF anexado), snapshot do conteúdo daquela versão.
- **Notice** (aviso do quadro de avisos): mensagem, autor, período de início/expiração.
- **StaffMember**: usado só para exibir aniversariantes no dashboard (nome, cargo, data de nascimento).
- **TeamMember**: usuário do sistema (profissional) — nome, CPF/RG, email, cargo, status (ativo/inativo), `isAdmin`, `permissions: Permission`, `auditLog[]`.
- **Permission**: granular por categoria — Pacientes (visualizar/criar/editar/desativar/ver histórico), Documentos (visualizar/criar/desativar/ver desativados/reativar/ver auditoria/ver versões/exportar PDF/baixar PDF/anexar PDF assinado/finalizar — **note: não existe `canEditDocuments`, foi removido de propósito**), Administrativo (visualizar equipe/criar/editar/desativar/reativar profissional/alterar permissões/alterar senha/ver log administrativo).
- **InstitutionalLayout**: imagem de cabeçalho e rodapé (upload livre, sem filtro de cor), nome/local da instituição, texto de rodapé — usado para montar o "papel timbrado" A4 de todos os documentos gerados.

### 8.1. Revisão do modelo após o mapeamento dos documentos (08/09/2026)

O mapeamento dos 17 documentos reais (seção 9, detalhe em `documentos-mapeados.md`) confirmou boa parte do modelo do protótipo, mas expôs **seis lacunas estruturais**. Estas são as mudanças a incorporar antes de fechar o schema em `rascunho-tabelas-2.txt`:

#### (a) Nem todo documento é "uma folha = um evento" — existem folhas-tabela acumulativas

Três ou quatro dos 17 tipos funcionam como **uma folha por paciente com N linhas**, preenchidas ao longo de meses, cada linha com data própria e — nos dois primeiros — **assinatura própria**:

| Documento | Linhas na folha | Assinatura |
|---|---|---|
| Evolução de Enfermagem | ~45 | enfermeiro, por linha |
| Controle de Saída de Pacientes | ~28 | residente + responsável, por linha |
| Termo de Ressocialização (locais/atividades) | 9 | no rodapé, da folha toda |
| Atividades Práticas | matriz 19×4 | nenhuma **[a confirmar se é por paciente]** |

Isso **contradiz o protótipo**, que modela Controle de Saída como um documento por saída.

**Modelo proposto:** `TIPO_DOCUMENTO.FORMATO` = `folha_unica` | `folha_tabela`. Para `folha_tabela`, cada linha é um registro imutável próprio (tabela `DOCUMENTO_LINHA`, com autor, data/hora e assinaturas individuais); a "folha" existe apenas como **visão agregada na geração do PDF A4** para a auditoria. Assim a regra de imutabilidade da seção 7 vale por linha — uma linha assinada nunca muda — e o auditor continua recebendo o documento no formato que conhece.

#### (b) O paciente tem campos que o protótipo não previa

- **`chave_sisreg`** — identificador do paciente no sistema de regulação do Estado. Aparece nos **4 formulários estaduais** e não existe em lugar nenhum do protótipo nem dos rascunhos. É o campo que amarra o paciente à vaga custeada.
- **`convenio`** deve virar **seleção, não texto livre** — há pelo menos a distinção "vaga custeada pelo Governo do Estado de SC" × outras. (Quais são as outras: a confirmar.)
- Campos presentes na Ficha de Acolhimento em papel e ausentes no `types.ts`: `nacionalidade`, `cor`, `filhos` (sim/não), `municipio` de naturalidade, `numero`/`bairro`/`estado` do endereço.
- Campo presente no protótipo e ausente no papel: **`apelido`** (a confirmar se é uso real da instituição).
- `data_acolhimento`, `data_desligamento` e `convenio` estão na **capa do prontuário**, não na Ficha — ou seja, são atributos do paciente. **O protótipo acertou o lugar.**
- A lista de tipos de dependência do protótipo **bate exatamente** com o papel. ✅

#### (c) Os papéis de assinante são sete, não três

O modelo atual (paciente / responsável / profissional) é insuficiente. Papéis efetivamente observados:

| Papel | Onde aparece |
|---|---|
| Acolhido / Residente / Paciente | quase todos |
| Responsável pelo acolhido | Termo de Acolhimento, Termos, Controle de Saída, as três altas |
| **Monitor Responsável** | Termo de Acolhimento (é um **terceiro** assinante, além de paciente e responsável) |
| **Enfermeiro** | Evolução de Enfermagem (por linha) |
| Profissional Responsável | as três declarações de alta |
| **Representante da Comunidade Terapêutica** | os 4 formulários do Estado |
| **Testemunha** | Declaração de Desligamento — assina *no lugar* do acolhido |

"Representante da CT" não é "qualquer profissional": é quem responde pela instituição perante o Estado. E **"Testemunha" já existe no formulário oficial do órgão auditor** (a linha é *"Assinatura do Acolhido/Testemunha"*), o que dá respaldo direto ao modelo de assinatura presencial reforçada da seção 6.

**Modelo proposto:** enum/tabela `PAPEL_ASSINANTE` + tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis exigidos por tipo, com flag de obrigatoriedade), em vez de um campo único em `TIPO_DOCUMENTO`.

#### (d) O emissor do documento faz parte da identidade dele

Dois documentos se chamam **"Termo de Acolhimento"** — um institucional (ciência de gratuidade + lista de pertences, 3 assinantes) e um do Estado (declaração de vaga custeada, com SISREG, 2 assinantes). Conteúdo, campos e assinantes completamente diferentes.

→ `TIPO_DOCUMENTO.EMISSOR` = `institucional` | `estadual`, com nome de exibição desambiguado na UI ("Termo de Acolhimento (SES/SC)"). Sem isso a busca da central de documentos fica ambígua.

→ **Impacto no `InstitutionalLayout`:** o protótipo assume **um** cabeçalho/rodapé para todos os documentos. A realidade tem **três**: timbre institucional completo, timbre só com logo, e o **timbre do Governo de SC** (brasão + 6 linhas de hierarquia da Secretaria). O layout precisa ser **por emissor**, não global. O único documento do lote com rodapé institucional completo é a Evolução Geral — usar como referência do rodapé.

#### (e) Documentos de texto fixo × documentos com campos

O **Regimento Interno** (30 regras) e os **Termos de Patrimônio/Responsabilidade/Uso de Imagem** não têm campos preenchíveis — são texto institucional que o paciente recebe e aceita. O Regimento é **idêntico para todos os pacientes** e muda quando a instituição o revisa.

→ `TIPO_DOCUMENTO.TEXTO_FIXO` versionado **no nível do tipo**; a instância por paciente guarda apenas qual versão do texto ele assinou. Evita duplicar 30 regras em 32 prontuários e deixa auditável "qual versão do regimento o paciente X assinou".

#### (f) Vocabulários controlados vindos do Estado e do próprio processo

Taxonomias que **não devem ser inventadas** — já existem no papel:

- **Motivo de desligamento** (lista oficial do Estado, Declaração de Desligamento): `Desistência` · `Fuga/Evasão` · `Alta Administrativa` · `Alta Terapêutica` · `Agravante de Saúde` · `Mudança de Convênio/Programa` · `Óbito`. O sistema deve **derivar/sugerir** este campo a partir de qual documento de alta foi emitido.
- **Fases do programa terapêutico** (Alta Terapêutica): (1) Adaptação e Desintoxicação → (2) Conscientização e Interiorização → (3) Ressocialização e Reinserção Social. Duração proposta na CT: **9 meses**. Sugere um campo `fase_atual` no paciente e possivelmente um indicador no dashboard.
- **Tipos de dependência**: lista fixa de 10, idêntica à do protótipo.
- **Atividades de laborterapia**: 19 atividades × 4 funções (Atividades Práticas).

#### (g) Campos precisam de texto de ajuda

Cada campo da Avaliação de Enfermagem tem, no papel, um texto de apoio entre parênteses (ex.: couro cabeludo → *"alopecia, sujidade, lêndeas, piolhos, seborréia, emaranhado, crosta, comprimento, ressecamento, quebradiço"*). Isso é **hint do formulário**, não conteúdo do valor.

→ Coluna `TEXTO_AJUDA` em `CAMPO_TIPO_DOCUMENTO`.

### Prontuário ≠ documento único
Conceito importante: **"Prontuário" não é um documento isolado.** É o conjunto de documentos do paciente. O primeiro documento criado automaticamente no cadastro do paciente é a **Ficha de Acolhimento**, que segue as mesmas regras de qualquer outro documento (versão, auditoria, assinatura, desativação, PDF).

**✅ Confirmado pelo mapeamento:** a pasta física do paciente tem uma **capa literalmente intitulada "PRONTUÁRIO"**, com apenas nome, data de acolhimento, convênio e data de desligamento — ou seja, o prontuário é mesmo o conjunto, e a capa carrega atributos do paciente. Essa capa **não deve virar um `TIPO_DOCUMENTO`**; no máximo, uma folha de rosto gerada na exportação do prontuário completo em PDF.

⚠️ **Ponto a confirmar:** a Ficha de Acolhimento em papel **não tem linha de assinatura**, apesar de ser uma declaração em primeira pessoa ("Declaro... é de livre e espontânea vontade internar-me..."). Verificar se na prática o acolhido assina em algum lugar ou se a assinatura fica só no Termo de Acolhimento.

Na tela do paciente existem duas abas: **Prontuário** (dados cadastrais organizados em blocos: dados do acolhido, tipos de dependência, dados dos responsáveis) e **Histórico** (linha do tempo cronológica de todos os documentos, começando pela Ficha de Acolhimento).

## 9. Tipos de documento — mapeamento concluído (17 tipos)

No protótipo, apenas **4 tipos têm formulário e renderização completos**:

1. **Ficha de Acolhimento** — gerada automaticamente ao cadastrar o paciente (não tem formulário próprio, herda os dados do cadastro).
2. **Termo de Acolhimento** — texto fixo de ciência + lista de pertences (campo livre).
3. **Controle de Saída de Pacientes** — data/hora de saída e retorno, motivo.
4. **Evolução Geral** — texto livre de evolução do paciente pela equipe técnica.

Outros tipos aparecem na tela "Novo Documento" apenas como placeholders "Em desenvolvimento" (não clicáveis): Evolução de Enfermagem, Avaliação de Enfermagem, Termos (genérico).

### ✅ Mapeamento executado (08/09/2026) — 17 tipos, não ~40

A estimativa inicial de ~40 tipos **não se confirmou**. O lote de 19 fotos entregue pela instituição (`mapeamento/fotos/`, já renomeadas na convenção do README) consolidou em **17 tipos distintos**, documentados campo a campo em **`documentos-mapeados.md`** — essa é agora a fonte de verdade para `TIPO_DOCUMENTO`/`CAMPO_TIPO_DOCUMENTO`, para o desenho A4 e para o seed. O `mapeamento-documentos.csv` tem as 17 linhas correspondentes.

Os 17: capa do Prontuário · Ficha de Acolhimento · Termo de Acolhimento · Termos de Patrimônio/Responsabilidade/Uso de Imagem · Regimento Interno · Avaliação de Enfermagem · Evolução de Enfermagem · Evolução Geral · Controle de Saída · Atividades Práticas · Declaração de Alta a Pedido · Declaração de Alta Administrativa · Alta Terapêutica/Conclusão · e **4 formulários do Governo de SC** (Termo de Acolhimento, Declaração de Desligamento, Termo de Ressocialização em 2 variantes).

**Achados que mudam o schema** (detalhados em `documentos-mapeados.md`, seção "Achados que afetam o schema"):

1. **Folhas-tabela acumulativas** — 3-4 tipos não são "um documento = um evento", mas uma folha por paciente com N linhas, cada uma com data e assinatura próprias (Evolução de Enfermagem, Controle de Saída, Ressocialização/atividades). Isso **contradiz o protótipo**, que modela Controle de Saída como um documento por saída. Recomendação: cada linha é um registro imutável no banco; a folha existe só como visão agregada no PDF.
2. **Campo novo no paciente: chave SISREG** — aparece nos 4 documentos estaduais, não existe no protótipo nem nos rascunhos de tabela.
3. **Mais papéis de assinante que os 3 previstos** — além de paciente/responsável/profissional, aparecem **Monitor Responsável**, **Enfermeiro**, **Representante da Comunidade Terapêutica** e **Testemunha**. Exige `PAPEL_ASSINANTE` em `ASSINATURA` e uma tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis por tipo).
4. **Dois documentos com o mesmo nome** ("Termo de Acolhimento" institucional e estadual) → `TIPO_DOCUMENTO` precisa de `EMISSOR` (`institucional` | `estadual`).
5. **Documentos de texto fixo** (Regimento Interno) devem ser versionados no nível da instituição, não duplicados por paciente.
6. **Taxonomia oficial de motivo de desligamento** vinda do Estado: Desistência · Fuga/Evasão · Alta Administrativa · Alta Terapêutica · Agravante de Saúde · Mudança de Convênio/Programa · Óbito.
7. **Regras de domínio novas:** o programa tem 3 fases nomeadas (Adaptação e Desintoxicação → Conscientização e Interiorização → Ressocialização e Reinserção Social), duração proposta de 9 meses.

**Ainda faltam documentos.** Os próprios papéis citam itens que não estão no lote — o mais crítico é o **PIA (Plano Individual de Acolhido)**, citado no Termo de Ressocialização e obrigatório em CT. Também: livro de ocorrências diárias, receituário/controle de medicação, avaliação de comportamento, avaliação psicológica, controle de visitas. Lista completa com a evidência de cada um em `documentos-mapeados.md`.

Ver **seção 9.1** para o processo de mapeamento (já executado neste lote; reaproveitar para o próximo).

Isso deve virar uma tabela `TIPO_DOCUMENTO`/`CAMPO_TIPO_DOCUMENTO` no banco (metadado configurável — ver `rascunho-tabelas-2.txt`), em vez de 40 componentes React hardcoded como no protótipo atual — ver seção 11.

## 9.1. Processo de mapeamento dos tipos de documento (executado — reaproveitar para o próximo lote)

Objetivo: sair da pilha de papel com uma planilha (uma linha por tipo de documento) que já responde tudo que o schema (`TIPO_DOCUMENTO`, `CAMPO_TIPO_DOCUMENTO`, `ASSINATURA`) precisa saber. Colunas sugeridas:

| Coluna | Pergunta que responde |
|---|---|
| Nome do documento | Como a instituição chama esse documento (título exato usado no papel) |
| Objetivo | Pra que esse documento existe — o que ele registra, comprova ou garante (importante pra justificar decisões na banca) |
| Categoria | Clínico / Enfermagem / Psicológico / Administrativo / Jurídico-institucional (ajuda a agrupar por profissional responsável e por semelhança estrutural) |
| Quem preenche | Qual cargo/função preenche (psicólogo, enfermeiro, psiquiatra, coordenação, administrativo) |
| Evento disparador | Quando é gerado: admissão, periodicidade fixa (diária/semanal/mensal), evento pontual (saída, alta, ocorrência), sob demanda |
| Único ou recorrente | Um por paciente (como a Ficha de Acolhimento) ou pode haver vários ao longo do tratamento |
| Campos | Lista dos campos do papel, **um por um**, cada um com: nome, tipo (`texto_curto` / `texto_longo` / `data` / `numero` / `selecao_unica` / `selecao_multipla` / `foto`) e se é obrigatório — mapeia direto pra `CAMPO_TIPO_DOCUMENTO` no schema. Assinatura não entra nessa lista (é tratada à parte, ver linha abaixo) |
| Quem assina | Nenhum assinante / Paciente / Responsável / Profissional / mais de um — **é aqui que aparecem os casos "alguém além do paciente assina" ou "múltiplos assinantes"** |
| Assinatura precisa ser "forte"? | Se o documento é estritamente prontuário médico assinado pelo psiquiatra (possível caso CFM — ver seção 6) ou se presencial reforçado basta |
| Aparece na auditoria estadual? | Sim/Não/Não sei — os que aparecem são prioridade máxima pro escopo mínimo |
| Observações | Qualquer regra estranha, exceção, campo condicional, etc. |

O time está usando `mapeamento-documentos.csv` (planilha com essas colunas, 4 tipos já preenchidos como exemplo) e `modelo-anotacao-documentos.txt` (modelo de anotação manual/offline, em bloco de texto padronizado, pra usar durante a visita à instituição sem depender de ferramenta nenhuma — depois é só colar de volta numa conversa pra consolidar na planilha).

**Fluxo escolhido:** fotografar cada tipo de documento (um exemplar de cada) e salvar em `mapeamento/fotos/`, seguindo a convenção de nome descrita em `mapeamento/README.md` (`NN-nome-curto.jpg`, mesmo `ID` do CSV). A partir das fotos + qualquer anotação manual feita com `modelo-anotacao-documentos.txt`, a IA consolida tudo em `documentos-mapeados.md` (um arquivo, uma seção por tipo de documento — vira a fonte de verdade única pro schema de `TIPO_DOCUMENTO`/`CAMPO_TIPO_DOCUMENTO`, pro desenho visual de cada documento em A4, e pra um script de seed que popula o banco a partir desse arquivo). `documentos-mapeados.md` ainda não existe — só será criado quando houver fotos/anotações suficientes pra processar.

Passo a passo:
1. Fotografar/escanear cada tipo de documento físico distinto da pilha entregue pela instituição (um exemplar em branco de cada, se possível).
2. Preencher uma linha da planilha acima por tipo, junto com a instituição sempre que houver dúvida sobre quem assina ou quando é gerado.
3. Agrupar por semelhança estrutural (Categoria + conjunto de campos parecido) — documentos parecidos podem compartilhar o mesmo template de formulário genérico em vez de uma tela própria cada.
4. Marcar quais aparecem na auditoria mensal do governo — isso vira o escopo mínimo obrigatório da V1; o resto pode entrar depois.
5. Validar a lista final com a instituição/professores antes de começar a implementar o schema de documentos.

## 10. Navegação e telas (estado atual, real, do protótipo — `App.tsx`)

Bottom nav com 4 itens (confirmado no código, não apenas nos prompts): **Início, Pacientes, Documentos, Configurações** (badge de contagem de documentos pendentes de assinatura no ícone "Documentos"). Não existem mais "Agenda" nem "Relatórios" no menu.

Fluxo de telas efetivamente roteado em `App.tsx`:

```
splash → login → home (dashboard)
home → patients (lista) → patient-detail (Prontuário | Histórico)
patient-detail → patient-form (editar paciente)
patient-detail → new-document → document-form → document-view (Documento | Auditoria)
home → documents (central de documentos de todos os pacientes, com busca e filtros)
home → settings → team (gestão de equipe/permissões)
```

- **Login**: não existe mais tela de "seleção de perfil" — login identifica o usuário diretamente pelas credenciais/permissões (não há mais botão de área familiar).
- **Dashboard (Início)**: saudação, 4 indicadores compactos (pacientes ativos, média de internação em dias, total de documentos, pendentes de assinatura), documentos do mês (com seletor de mês), Quadro de Avisos (criar aviso com duração em dias), Últimos documentos criados, Próximos aniversariantes (30 dias, pacientes vs. equipe com cor diferente).
- **Documentos**: central com todos os documentos de todos os pacientes — busca por paciente/apelido/título/ID/conteúdo, filtros por paciente/tipo/status/responsável.
- **Documento (visualização)**: duas abas — "Documento" (render tipo A4/papel timbrado) e "Auditoria" (timeline de versões, cada uma clicável para ver o snapshot completo daquela versão, com busca na auditoria).
- **Equipe**: tela própria (não é só uma aba dentro de Configurações) — lista de profissionais, busca, filtro ativo/inativo, editor de permissões por categoria, log de ações (auditoria administrativa) por membro.
- **Configurações**: Informações Pessoais (perfil + segurança/senha juntos), Equipe (atalho), Notificações, Layout (upload de imagem de cabeçalho/rodapé institucional + pré-visualização A4).

### Telas órfãs no código exportado (existem como arquivo mas **não são usadas** em `App.tsx` — resíduo de iterações anteriores do protótipo, ignorar como referência de produto, só olhar se quiser ver histórico de UI):
`FamilyPortalScreen.tsx`, `MuralScreen.tsx`, `AgendaScreen.tsx`, `ReportsScreen.tsx`, `ProfileSelectionScreen.tsx`, `TimelineScreen.tsx`, `SignatureScreen.tsx` (assinatura manuscrita em canvas — modelo abandonado).

## 11. O protótipo `export-figma-make/` é referência de UX, não código de produção

Pontos importantes para não copiar sem pensar:
- Todo o estado é **client-side em memória** (`useState` no `App.tsx`) — não há backend, API ou persistência real. Recarregar a página perde tudo.
- Login é simulado (`setTimeout` de 1.2s, sem validar nada).
- Geração de "PDF" é feita abrindo uma nova janela com HTML e chamando `window.print()` — não é PDF real. No sistema real isso deve virar geração de PDF no backend (ex.: Puppeteer, pdf-lib, ou similar), especialmente porque o PDF gerado precisa ser **anexável/verificável** no fluxo de assinatura GOV.BR.
- Os 4 tipos de documento têm renderização **hardcoded por tipo** (`if (doc.type === 'termo-acolhimento') ...`). Com 17 tipos reais (e mais por vir), o sistema real precisa de um modelo genérico/configurável (formulário dirigido por metadados de `document_type`), não 17+ blocos de `if`.
- `Signature` (interface com `method: 'presencial' | 'gov-br'`) é um resíduo do modelo antigo de assinatura manuscrita — no fluxo atual a assinatura em si não é mais capturada como imagem/traço, só o PDF assinado anexado. Ao desenhar o schema real, considerar se ainda faz sentido manter uma entidade "Signature" separada ou se basta a versão do documento com `action: 'pdf-attached'` + nome do arquivo.

### Divergências concretas entre o protótipo e os documentos reais (08/09/2026)

Confirmadas pelo mapeamento — corrigir ao reaproveitar qualquer trecho:

| Protótipo | Realidade no papel |
|---|---|
| Controle de Saída = 1 documento por saída | 1 folha por paciente com ~28 saídas, **assinadas linha a linha** (ver 8.1-a) |
| Cabeçalho institucional único (`InstitutionalLayout`) | 3 cabeçalhos: institucional completo, só logo, e **timbre do Governo de SC** (ver 8.1-d) |
| 3 papéis de assinante | 7 papéis, incl. Monitor, Representante da CT e Testemunha (ver 8.1-c) |
| Paciente sem `chave_sisreg` | Campo obrigatório nos 4 documentos estaduais (ver 8.1-b) |
| Paciente com `apelido` | Não existe no papel — confirmar se é uso real |
| Ficha de Acolhimento sem `nacionalidade`/`cor`/`filhos`/`bairro`/`estado`/`nº` | Todos existem no papel |
| "Itajaí - SC" no cabeçalho | Nova Veneza/SC (ver seção 2) |
| Lista de tipos de dependência | ✅ bate exatamente |
| "Prontuário" como conjunto, não documento | ✅ confirmado (existe capa física "PRONTUÁRIO") |
| Evolução Geral como texto livre | ✅ bate |

## 12. Fontes originais (para consulta, não para copiar cegamente)

- `export-figma-make/src/imports/pasted_text/*.md` — os 6 prompts usados para evoluir o protótipo no Figma Make, em ordem cronológica aproximada: `rein-proj-prompt.md` (briefing visual inicial, sistema ainda chamado "ReIntegra") → `reabilitah-refinamento.md` e `reabilitah-prototype-evolution.md`/`-1.md` (ainda tinham área familiar, assinatura manuscrita, agenda, relatórios — **superados**) → `reabilitah-prototype-refinemen.md` (**o mais recente e autoritativo**: remove área familiar, remove assinatura manuscrita, introduz fluxo GOV.BR, remove edição de documentos). Em caso de dúvida sobre uma regra de negócio, o código de `App.tsx`/`types.ts` + este último prompt são a fonte de verdade — não os prompts mais antigos.
- `export-figma-make/src/imports/TCC.pdf` e `Template.pdf` — pitch acadêmico oficial do projeto (visão de produto e enquadramento da disciplina). Nota: esses documentos ainda citam "Acesso para Familiares" como funcionalidade — **decisão do time foi não incluir isso na V1 real** (ver seção 5); se for citado na banca/TCS, registrar como "não implementado nesta fase por decisão de escopo".
- `rascunho-tabelas.txt` — primeiro rascunho do schema relacional (Postgres), feito pelo time.
- `rascunho-tabelas-2.txt` — evolução desse rascunho incorporando versionamento de documento (`DOCUMENTO_VERSAO`) e o modelo de assinatura desacoplado do método (`ASSINATURA`, `METODO_ASSINATURA`, flags em `TIPO_DOCUMENTO`) — ver seção 6. **Ainda não é o schema final:** o mapeamento já rodou (seção 9) e apontou 6 lacunas estruturais a incorporar antes de fechar — ver seção 8.1.

### Guia de execução

- **`GUIA-IMPLEMENTACAO.md`** — ordem de execução do projeto em 8 fases (fundação → paciente → motor de documentos → versionamento → assinatura → PDF → dashboard → banca), com schema Prisma sugerido, decisões de stack recomendadas, divisão de trabalho para 4 pessoas, armadilhas e roteiro de demonstração. **Este arquivo responde "o que fazer agora"; o CLAUDE.md responde "quais são as regras".**

### Fontes primárias do mapeamento de documentos (08/09/2026)

Estas passam a ser a **fonte de verdade sobre os documentos**, acima do protótipo:

- **`documentos-mapeados.md`** — consolidação dos 17 tipos: objetivo, categoria, emissor, quem preenche, quem assina, campos com tipo e obrigatoriedade, textos fixos transcritos, divergências com o protótipo, o que falta e as 15 perguntas em aberto para a instituição. **É daqui que sai o seed de `TIPO_DOCUMENTO`/`CAMPO_TIPO_DOCUMENTO` e o desenho A4 de cada documento.**
- **`mapeamento-documentos.csv`** — as mesmas 17 linhas em planilha (colunas `EMISSOR` e `FORMATO` adicionadas ao modelo original da seção 9.1).
- **`mapeamento/fotos/*.jpg`** — os 17 documentos fotografados em branco, nomeados `NN-nome-curto.jpg` cruzando com o `ID` do CSV. São formulários vazios, sem dado de paciente (por isso versionados no git — ver `.gitignore`).
- `mapeamento/README.md` — processo de coleta e nomenclatura.
- `modelo-anotacao-documentos.txt` — modelo de anotação manual para usar em visita à instituição.

## 13. Em aberto / próximos passos

- [x] ~~**Mapear os ~40 tipos de documento reais**~~ — **feito em 08/09/2026**: 17 tipos mapeados em `documentos-mapeados.md` (ver seção 9). Não eram ~40.
- [ ] **Validar as 15 perguntas do mapeamento com a instituição** (lista no fim de `documentos-mapeados.md`). As 5 bloqueantes: (1) falta o PIA e documentação médica? (2) os dois Termos de Ressocialização são tipos distintos ou versões? (3) Atividades Práticas é por paciente ou escala coletiva? (4) quais dos 17 a auditoria realmente exige? (5) a GERSA aceita assinatura eletrônica?
- [ ] **Obter as fotos dos documentos faltantes** — prioridade no **PIA (Plano Individual de Acolhido)**; depois livro de ocorrências, receituário/controle de medicação, avaliação de comportamento, avaliação psicológica, controle de visitas.
- [ ] **Travar o método de assinatura** (seção 6) — a direção "presencial reforçado" saiu reforçada pelo mapeamento (regra 9 do regimento + testemunha no formulário do Estado + ausência de registro psiquiátrico), mas depende da resposta da GERSA sobre aceitar assinatura eletrônica e da confirmação de que não há documentação médica fora do lote.
- [ ] **Reavaliar o modelo de "documento" no schema** para acomodar as folhas-tabela acumulativas (achado 1 da seção 9) — afeta `DOCUMENTO_VERSAO` e exige provavelmente uma tabela `DOCUMENTO_LINHA`.
- [ ] **Adicionar `PACIENTE.chave_sisreg`** e transformar `convenio` em seleção (achado 2 da seção 9).
- [ ] **Modelar `PAPEL_ASSINANTE` + `TIPO_DOCUMENTO_ASSINANTE`** (achado 3 da seção 9) — o modelo atual de 3 papéis é insuficiente.
- [ ] Decidir estrutura do repositório (monorepo Next.js + NestJS vs. dois repositórios separados).
- [ ] Desenhar autenticação real (hoje é só mock) — provavelmente JWT/sessão com NestJS + tabela de usuários com as `Permission` já modeladas.
- [ ] Corrigir "Itajaí - SC" → "Nova Veneza - SC" onde for reaproveitar qualquer trecho de UI do protótipo.
- [ ] Decidir geração real de PDF (biblioteca no backend NestJS) e como/se ela participa da captura de hash para a assinatura presencial reforçada.
- [ ] Confirmar com a instituição/professores quais campos do cadastro de paciente e quais tipos de documento são realmente exigidos pela auditoria estadual — isso deve guiar a priorização do mapeamento de documentos.
- [ ] Decidir hospedagem/infra (o Template.pdf deixa isso como `{x}` em aberto).
