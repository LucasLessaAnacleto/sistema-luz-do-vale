# Documentos mapeados — Centro de Recuperação Luz no Vale (CERLUZ)

> Fonte: 19 fotos em `mapeamento/fotos/` (lote de 08/09/2026), consolidadas em **17 tipos distintos**.
> Este arquivo é a fonte de verdade para `TIPO_DOCUMENTO` / `CAMPO_TIPO_DOCUMENTO`, para o desenho A4 de cada documento e para o script de seed.
> Tudo que está marcado **[CONFIRMAR]** não é visível na foto e precisa ser respondido pela instituição.

---

## 0. Dados institucionais extraídos das fotos

Estes dados aparecem no papel timbrado e devem alimentar `InstitutionalLayout` (cabeçalho/rodapé A4) e o cadastro da instituição:

| Campo | Valor |
|---|---|
| Razão/nome oficial | Centro de Recuperação Luz no Vale — CERLUZ |
| Nome curto (logo) | LUZ NO VALE |
| CNPJ | 13.445.159/0001-61 |
| Endereço | Estrada Geral (Angelino Destro), 508 — Picadão do Sul — Nova Veneza/SC |
| CEP | 88.865-000 |
| E-mail | centroluznovale@gmail.com |
| Telefones | (48) 9 9603-1606 / (48) 9 9603-1498 |
| Site | www.centroluznovale.com.br |
| Presidente | Sérgio Antonio Elias |
| Vice-presidente | Valter Silva |

**Confirma a correção da seção 2 do CLAUDE.md:** é Nova Veneza/SC, não Itajaí. A ficha de acolhimento diz literalmente "situado no município de Nova Veneza/SC".

Existem **dois formatos de cabeçalho** em uso, e o sistema precisa suportar os dois:

- **Timbre institucional** — logo LUZ NO VALE + endereço + presidente/vice (docs 01, 07, 08, 11, 12, 13) ou logo sem endereço (doc 09).
- **Timbre do Governo de SC** — brasão + "Governo de Santa Catarina / Secretaria de Estado da Saúde / Superintendência de Gestão Estratégica e Planejamento / Diretoria de Regionalização e Planejamento / Gerência Regional de Saúde de Criciúma / Equipe Descentralizada de Controle e Avaliação" (docs 14, 15, 16, 17).
- Alguns documentos **não têm timbre nenhum** (docs 02, 03, 04, 05, 06, 10) — folhas soltas em Word.

---

## Índice

| ID | Documento | Emissor | Categoria | Foto |
|---|---|---|---|---|
| 01 | Prontuário (capa) | Institucional | Administrativo | `01-prontuario-capa.jpg` |
| 02 | Ficha de Acolhimento | Institucional | Administrativo | `02-ficha-acolhimento.jpg` |
| 03 | Termo de Acolhimento | Institucional | Jurídico-institucional | `03-termo-acolhimento.jpg` |
| 04 | Termo de Compromisso ao Patrimônio + Termo de Responsabilidade + Direito/Uso de Imagem | Institucional | Jurídico-institucional | `04-termos-patrimonio-responsabilidade-imagem.jpg` |
| 05 | Regimento Interno | Institucional | Jurídico-institucional | `05-regimento-interno.jpg` |
| 06 | Avaliação de Enfermagem | Institucional | Enfermagem | `06-avaliacao-enfermagem-p1.jpg`, `-p2.jpg` |
| 07 | Evolução de Enfermagem | Institucional | Enfermagem | `07-evolucao-enfermagem.jpg` |
| 08 | Evolução Geral | Institucional | Clínico | `08-evolucao-geral.jpg` |
| 09 | Controle de Saída de Pacientes | Institucional | Administrativo | `09-controle-saida.jpg` |
| 10 | Atividades Práticas (laborterapia) | Institucional | Administrativo | `10-atividades-praticas.jpg` |
| 11 | Declaração de Alta a Pedido | Institucional | Jurídico-institucional | `11-declaracao-alta-pedido.jpg` |
| 12 | Declaração de Alta Administrativa — CT | Institucional | Jurídico-institucional | `12-declaracao-alta-administrativa.jpg` |
| 13 | Alta Terapêutica / Conclusão | Institucional | Jurídico-institucional | `13-alta-terapeutica-conclusao.jpg` |
| 14 | Termo de Acolhimento (SES/SC) | Estadual | Jurídico-institucional | `14-ses-termo-acolhimento.jpg` |
| 15 | Declaração de Desligamento (SES/SC) | Estadual | Jurídico-institucional | `15-ses-declaracao-desligamento.jpg` |
| 16 | Termo de Ressocialização — horários semanais (SES/SC) | Estadual | Jurídico-institucional | `16-ses-termo-ressocializacao-horarios.jpg` |
| 17 | Termo de Ressocialização — locais/atividades (SES/SC) | Estadual | Jurídico-institucional | `17-ses-termo-ressocializacao-atividades.jpg` |

---

## 01. Prontuário (capa)

- **Objetivo:** capa da pasta física do paciente. Identifica o prontuário e registra entrada/saída e convênio.
- **Categoria:** Administrativo · **Emissor:** Institucional (timbre completo)
- **Quem preenche:** Administrativo/Coordenação **[CONFIRMAR]**
- **Evento disparador:** Admissão · **Único por paciente**
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome | texto_curto | sim |
| data_acolhimento | data | sim |
| convenio | texto_curto | não |
| acolhimento_convenio | texto_curto | não (**[CONFIRMAR]** o que é esse campo — nº do acolhimento? tipo?) |
| data_desligamento | data | não |

- **Quem assina:** ninguém (é capa)
- **Assinatura forte:** não · **Auditoria estadual:** não (é organização interna)
- **⚠️ Decisão de modelagem:** isto **não deve virar um `TIPO_DOCUMENTO`**. São atributos do paciente (`PACIENTE.data_acolhimento`, `.data_desligamento`, `.convenio`). Confirma a regra da seção 8 do CLAUDE.md: "Prontuário" é o conjunto, não um documento. A capa pode ser gerada como folha de rosto na exportação do prontuário completo em PDF.

---

## 02. Ficha de Acolhimento

- **Objetivo:** declaração de internação voluntária + cadastro completo do acolhido e do responsável. Base de todo o prontuário.
- **Categoria:** Administrativo · **Emissor:** Institucional (sem timbre)
- **Texto fixo de abertura:** *"Declaro para os devidos fins que é de livre e espontânea vontade internar-me para tratamento de desintoxicação no Centro de Recuperação Luz no Vale – CERLUZ, situado no município de Nova Veneza/SC."*
- **Quem preenche:** Administrativo/Coordenação · **Evento:** Admissão · **Único por paciente**
- **Campos — bloco "DADOS DO ACOLHIDO":**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome | texto_curto | sim |
| cpf | texto_curto | não |
| rg | texto_curto | não |
| data_nascimento | data | não |
| nacionalidade | texto_curto | não |
| naturalidade | texto_curto | não |
| municipio_naturalidade | texto_curto | não |
| nome_pai | texto_curto | não |
| nome_mae | texto_curto | não |
| escolaridade | texto_curto | não |
| profissao | texto_curto | não |
| cor | texto_curto | não |
| estado_civil | texto_curto | não |
| filhos | selecao_unica (Sim/Não) | não |
| endereco | texto_curto | não |
| numero | texto_curto | não |
| bairro | texto_curto | não |
| municipio | texto_curto | não |
| estado | texto_curto | não |

- **Campos — bloco "TIPOS DE DEPENDÊNCIA"** (`selecao_multipla`, lista fixa exata do papel):
  `Álcool` · `Maconha/Haxixe` · `Cocaína` · `Crack` · `Inal./Cola/Solv./Tíner` · `Diesepan` *(sic — no papel; é "Diazepam")* · `Afetam./Rem./Ema.` *(sic — provavelmente "Anfetamina/Remédio/Emagrecedor")* · `Ecstasy/MDMA` · `LSD` · `Heroína/Morfina/Met.`
- **Campos — primeira droga:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| primeira_droga_licita | texto_curto | não |
| primeira_droga_licita_idade | numero | não |
| primeira_droga_ilicita | texto_curto | não |
| primeira_droga_ilicita_idade | numero | não |

- **Campos — bloco "DADOS DO RESPONSÁVEL"** (repetível — o protótipo já prevê múltiplos):

| Campo | Tipo | Obrigatório |
|---|---|---|
| responsavel_nome | texto_curto | não |
| responsavel_grau_parentesco | texto_curto | não |
| responsavel_cpf | texto_curto | não |
| responsavel_rg | texto_curto | não |
| responsavel_endereco | texto_curto | não |
| responsavel_contato | texto_curto | não |

- **Campo final:** `data` (data)
- **Quem assina:** **nenhuma linha de assinatura no papel** — apesar de ser uma declaração em primeira pessoa. **[CONFIRMAR]** se na prática o acolhido assina em algum lugar ou se a assinatura fica só no Termo de Acolhimento (doc 03).
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **⚠️ Divergências com o protótipo (`types.ts`):**
  - O papel **não tem** `apelido` — o protótipo tem. Confirmar se é uso interno real ou invenção do protótipo.
  - O papel **não tem** `data_acolhimento`/`data_desligamento` (estão na capa, doc 01).
  - O papel **tem** campos que o protótipo não tem: `nacionalidade`, `cor`, `filhos`, `municipio` (naturalidade), `numero` do endereço, `bairro`, `estado`.
  - O papel **não tem** `convenio` (está na capa).

---

## 03. Termo de Acolhimento (institucional)

- **Objetivo:** registrar que o acolhido está ciente da gratuidade do tratamento, concorda com as normas, e inventariar os pertences que entraram com ele.
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (sem timbre)
- **Texto fixo:** *"Estou ciente de que o tratamento é de caráter gratuito sendo que fico isento de pagar qualquer valor referente a mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para inclusão no tratamento, com as quais CONCORDO, e estou ciente dos meus direitos e deveres junto com esta instituição."*
- **Quem preenche:** Monitor/Administrativo · **Evento:** Admissão · **Único por paciente**
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| lista_pertences | texto_longo (~28 linhas no papel) | não |
| data | data | sim |

- **Quem assina:** **3 assinaturas** — `ACOLHIDO` · `RESPONSÁVEL PELO ACOLHIDO` · `MONITOR RESPONSÁVEL`
- **Assinatura forte:** não (presencial reforçado basta) **[CONFIRMAR]**
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **⚠️ O protótipo modela só Paciente + Responsável.** O papel exige um terceiro assinante: **Monitor Responsável** (profissional). Ver "Achados que afetam o schema", item 3.

---

## 04. Termo de Compromisso ao Patrimônio + Termo de Responsabilidade ao Acolhimento do Residente + Direito/Uso de Imagem

- **Objetivo:** três termos distintos impressos na mesma folha, com dois assinantes diferentes.
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (sem timbre)
- **Quem preenche:** ninguém (texto fixo, só assina) · **Evento:** Admissão · **Único por paciente**
- **Bloco A — Termo de Compromisso ao Patrimônio:** texto fixo (zelar por camas, guarda-roupas, paredes, roupas de cama, mesa, banheiro, ventilador etc.; ressarcir danos). **Sem linha de assinatura própria** — aparentemente coberto pela assinatura do bloco B **[CONFIRMAR]**.
- **Bloco B — Termo de Responsabilidade ao Acolhimento do Residente:** texto fixo; o responsável se responsabiliza pela inclusão do acolhido, declara que não influenciará na decisão do acolhido de sair, e que a família cumprirá o calendário de visitas. → assina **`Ass. Responsável`**.
- **Bloco C — Direito / Uso de Imagem:** *"Autorizo o Centro de Recuperação Luz no Vale – CERLUZ, CNPJ: 13.445.159/0001-61. Bem como voluntários que prestam serviços na instituição, á fazer o uso de minha imagem em (redes sociais, vídeos, sites, panfletos e etc...)."*

| Campo | Tipo | Obrigatório |
|---|---|---|
| autorizacao_uso_imagem | selecao_unica (Sim/Não) | sim |
| data | data | sim |

  → assina **`Ass. Acolhido`**.
- **Quem assina (folha toda):** Responsável (bloco B) + Acolhido (bloco C)
- **Auditoria estadual:** provável (uso de imagem é item comum de fiscalização) **[CONFIRMAR]**
- **⚠️ Decisão de modelagem:** no papel são 3 termos numa folha por economia de impressão. No sistema, o mais correto é **3 `TIPO_DOCUMENTO` separados** (assinantes e naturezas diferentes; o de imagem inclusive tem resposta Sim/Não que pode ser negada sem invalidar os outros). Alternativa: 1 tipo com 3 seções e 2 assinantes. **Recomendação: separar.** **[DECISÃO DO TIME]**

---

## 05. Regimento Interno

- **Objetivo:** conjunto de 30 regras da instituição, dado ao residente na admissão.
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (sem timbre)
- **Quem preenche:** ninguém (texto fixo integral) · **Evento:** Admissão · **Único por paciente**
- **Campos:** nenhum campo preenchível.
- **Quem assina:** **sem linha de assinatura na folha fotografada.** Porém a **regra nº 1 do próprio regimento** diz: *"todo objeto de valor ou pessoal que não será usado pelo residente não ficará na instituição e será devolvido para família"* e a **regra nº 2** cita *"salvo termo devidamente assinado pelo residente"* — ou seja, existe ciência formal do regimento em algum lugar. **[CONFIRMAR]** se o residente assina o regimento (talvez em folha de ciência separada não fotografada).
- **Auditoria estadual:** provável (regimento interno é documento clássico de fiscalização de CT) **[CONFIRMAR]**
- **⚠️ Este documento é o mesmo para todos os pacientes.** Modelar como documento de **texto fixo versionado a nível de instituição** (o conteúdo muda quando a instituição revisa o regimento), instanciado por paciente apenas para registrar a ciência/assinatura. Ver "Achados que afetam o schema", item 5.

### Regras com impacto direto no sistema (extraídas do texto)

Estas regras não são só contexto — algumas explicam ou contradizem decisões do projeto:

- **Regra 9 — "É proibido ao residente o uso de aparelho celular e fones de ouvido."**
  → **Confirmação documental definitiva** da premissa da seção 6 do CLAUDE.md: o fluxo de assinatura 100% GOV.BR é inviável para o paciente. Não é suposição, é regra escrita do regimento. Citável na banca.
- **Regra 5** — cita *"livros de ocorrências diárias que ficará a disposição aos familiares nos dias de visita"* → existe um **livro de ocorrências** não fotografado.
- **Regra 8** — cita *"avaliação de comportamento"* do residente → existe possível **documento de avaliação de comportamento** não fotografado.
- **Regra 15** — regra detalhada de visitas (após 15 dias; casado comprovado pode visita em casa após 60 dias, 1 noite; solteiro após 3 meses; etc.) → há **controle de visitas/saídas** que pode exigir documento próprio.
- **Regra 18** — *"Medicações não poderão ser fornecidas sem receituário médico"* → existe **controle de medicação / receituário** não fotografado.
- **Regra 7** — *"Todo residente deverá passar pelas avaliações dos profissionais da instituição"* → confirma que há **mais avaliações** além da de enfermagem (psicológica, no mínimo).

---

## 06. Avaliação de Enfermagem

- **Objetivo:** exame físico completo de admissão, feito pela enfermagem (céfalo-caudal).
- **Categoria:** Enfermagem · **Emissor:** Institucional (sem timbre) · **2 páginas**
- **Quem preenche:** Enfermeiro(a) · **Evento:** Admissão **[CONFIRMAR se é só na admissão ou periódica]** · **Único por paciente [CONFIRMAR]**
- **Campos — página 1:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome | texto_curto | sim |
| temperatura | texto_curto | não |
| pulso | texto_curto | não |
| respiracao | texto_curto | não |
| pressao_arterial | texto_curto | não |
| peso | texto_curto | não |
| altura | texto_curto | não |
| quantidade_internacoes_anteriores | numero | não |
| usa_medicacao_psiquiatrica | selecao_unica (Sim/Não) | não |
| qual_medicacao_psiquiatrica | texto_curto | não |
| teve_dst_qual | texto_curto | não |
| genitais_regiao_perineal | texto_longo | não |
| cabeca_couro_cabeludo | texto_longo | não |
| cabeca_orelhas_ouvido | texto_longo | não |
| cabeca_olhos_palpebras | texto_longo | não |
| cabeca_nariz | texto_longo | não |

- **Campos — página 2:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| boca_mucosa | texto_longo | não |
| pescoco_garganta | texto_longo | não |
| membro_superior_inferior | texto_longo | não |
| abdomem | texto_longo | não |
| eliminacoes_secrecoes | texto_longo | não |
| malformacoes | texto_longo | não |
| traumatismo | texto_longo | não |
| nivel_consciencia | selecao_multipla | não |
| postura_marcha | selecao_multipla | não |
| data | data | sim |

- `nivel_consciencia` — opções do papel: `Consciente` · `Semi-consciente` · `Inconsciente` · `Orientado` · `Desorientado` (são **dois eixos** no mesmo bloco: consciência e orientação — modelar como 2 campos `selecao_unica` é mais limpo que 1 `selecao_multipla`). **[DECISÃO DO TIME]**
- `postura_marcha` — opções: `Normal` · `Alterada` · `Não senta` · `Senta` · `Engatinha` · `Marcha`
- Cada campo de exame físico tem **texto de apoio entre parênteses** no papel (ex.: couro cabeludo → "alopecia, sujidade, lêndeas, piolhos, seborréia, emaranhado, crosta, comprimento, ressecamento, quebradiço"). Isso deve virar **placeholder/hint** do campo no formulário, não parte do valor. → sugere coluna `TEXTO_AJUDA` em `CAMPO_TIPO_DOCUMENTO`.
- **Quem assina:** **nenhuma linha de assinatura no papel.** ⚠️ Um documento clínico de enfermagem sem assinatura do enfermeiro é uma lacuna do processo atual em papel. **[CONFIRMAR]** — o sistema deveria registrar automaticamente o profissional autor (o que já é uma melhoria sobre o papel, boa de citar na banca).
- **Auditoria estadual:** provável **[CONFIRMAR]**

---

## 07. Evolução de Enfermagem

- **Objetivo:** registro cronológico contínuo da evolução do paciente pela enfermagem.
- **Categoria:** Enfermagem · **Emissor:** Institucional (timbre completo)
- **Formato no papel:** **folha-tabela acumulativa** — uma folha por paciente com ~45 linhas, preenchidas ao longo do tratamento.
- **Quem preenche:** Enfermeiro(a) · **Evento:** periódico/sob demanda · **Recorrente**
- **Campos — cabeçalho da folha:** `nome` (texto_curto, sim)
- **Campos — por linha da tabela:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| data | data | sim |
| evolucao | texto_longo | sim |
| assinatura_enfermeiro | assinatura | sim |

- **Quem assina:** Enfermeiro(a), **uma assinatura por linha**
- **Assinatura forte:** **[CONFIRMAR — item CFM]** é registro clínico de enfermagem, não de psiquiatra; a princípio presencial reforçado basta.
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **⚠️ Ver "Achados que afetam o schema", item 1 (folhas-tabela acumulativas).**

---

## 08. Evolução Geral

- **Objetivo:** registro geral da equipe técnica (coordenador, psicóloga e monitores) sobre a evolução do acolhido.
- **Categoria:** Clínico · **Emissor:** Institucional (timbre no cabeçalho **e rodapé completo** — este é o único documento do lote com rodapé institucional completo; usar como referência para o `InstitutionalLayout`)
- **Texto fixo:** *"Nesta evolução consta o registro de forma geral da equipe técnica: coordenador, psicóloga e monitores concernente a evolução do acolhido na instituição:"*
- **Quem preenche:** Equipe técnica (coordenador / psicóloga / monitor) · **Evento:** periódico/sob demanda · **Recorrente**
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| acolhido | texto_curto | sim |
| registro_evolucao | texto_longo (~35 linhas pautadas) | sim |

- **Quem assina:** **nenhuma linha de assinatura no papel** (nem data!). Mesma lacuna do doc 06. **[CONFIRMAR]** — no sistema, autor + data/hora vêm automáticos.
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **✅ Bate com o protótipo** (`Evolução Geral`, texto livre) — mas o protótipo não modela quem assina/data, que aqui também não existe no papel.

---

## 09. Controle de Saída de Pacientes

- **Objetivo:** registrar e autorizar cada saída temporária do acolhido, com motivo, horários e assinaturas.
- **Categoria:** Administrativo · **Emissor:** Institucional (logo, sem endereço)
- **Formato no papel:** **folha-tabela acumulativa** — ~28 linhas por folha.
- **Quem preenche:** Monitor/Enfermagem **[CONFIRMAR]** · **Evento:** cada saída · **Recorrente**
- **Campos — cabeçalho da folha:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome_completo | texto_curto | sim |
| data_acolhimento | data | sim |

- **Campos — por linha da tabela:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| data_saida | data | sim |
| data_retorno | data | não |
| hora_saida | texto_curto | sim |
| hora_retorno | texto_curto | não |
| motivo_saida | texto_curto | sim |
| assinatura_residente | assinatura | sim |
| assinatura_responsavel | assinatura | sim |

- **Quem assina:** Residente + Responsável, **por linha**
- **Auditoria estadual:** provável (controle de saída é item clássico de fiscalização) **[CONFIRMAR]**
- **⚠️ Divergência com o protótipo:** o protótipo modela isto como **um documento por saída**. No papel é **uma folha por paciente com N saídas**. Ver "Achados que afetam o schema", item 1.
- **⚠️ Nota de ordem das colunas:** o papel tem a ordem estranha `DATA SAÍDA | DATA RETORNO | HORA SAÍDA | HORA RETORNO`. Na tela, agrupar saída (data+hora) e retorno (data+hora) é mais usável — mas o **PDF impresso deve manter a ordem original** se a auditoria compara com o modelo antigo. **[DECISÃO DO TIME]**

---

## 10. Atividades Práticas (laborterapia)

- **Objetivo:** registrar em quais atividades práticas da casa o acolhido atua e em qual função.
- **Categoria:** Administrativo · **Emissor:** Institucional (sem timbre)
- **Formato no papel:** **matriz** — 19 linhas de atividade × 4 colunas de função.
- **Quem preenche:** Monitor/Coordenação **[CONFIRMAR]** · **Evento:** **[CONFIRMAR — admissão? mensal? a cada mudança de escala?]** · **Recorrente [CONFIRMAR]**
- **Linhas (atividades):** `Cozinha` · `Horta` · `Portão` · `Lavanderia` · `Quarto 6/7` · `Casarão` · `Rastel` · `Animais` · `Almoxarife` · `Manutenção` · `Lenha` · `Capela` · `Carpir` · `Roçar` · `Rampa` · `Recolhedor` · `Jardim` · `Pintura` · `Outros`
- **Colunas (funções):** `Cozinheiro` · `Auxiliar` · `Panela` · `Padaria`
- **⚠️ A matriz é semanticamente estranha:** as 4 colunas de função são claramente específicas de cozinha/padaria, mas se aplicam a todas as 19 linhas. **[CONFIRMAR com a instituição como esta folha é realmente preenchida]** — sem isso não dá para modelar direito. Hipóteses: (a) marca-se X no cruzamento atividade×função; (b) escreve-se o nome do residente na célula (folha coletiva, não por paciente!); (c) as colunas só valem para a linha "Cozinha".
- **⚠️ Esta folha pode não ser por paciente** — não há campo de nome. Se for uma escala coletiva da casa, **não é documento de prontuário** e sai do escopo do módulo de documentos. **Pergunta prioritária.**
- **Quem assina:** ninguém (nenhuma linha no papel)
- **Auditoria estadual:** **[CONFIRMAR]** — laborterapia é item avaliado em CT, então provavelmente sim de alguma forma.

---

## 11. Declaração de Alta a Pedido

- **Objetivo:** formalizar a saída do acolhido por decisão própria, com esclarecimento de riscos e isenção de responsabilidade da instituição.
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (timbre completo)
- **Quem preenche:** Profissional técnico responsável · **Evento:** alta a pedido · **Único por acolhimento** (pode repetir se o paciente for readmitido)
- **Texto fixo:** bloco "DISPOSIÇÕES GERAIS" explicando que a alta a pedido é direito do paciente, ato livre e soberano, e isenta a equipe multiprofissional; cabe à equipe explicar diagnóstico, condições clínicas e riscos em linguagem acessível; não impede retorno futuro.
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| esclarecimentos_prestados | texto_longo (bloco "REGISTRO DO PROFISSIONAL TÉCNICO RESPONSÁVEL", 5 linhas) | sim |
| nome_residente | texto_curto (bloco "REGISTRO DO RESIDENTE: Eu, ___") | sim |
| razao_saida | texto_longo ("decido deixar de ser assistido por esta instituição em razão de:", 4 linhas) | sim |
| cidade | texto_curto | sim (pré-impresso "NOVE VENEZA/SC" — *sic*, erro de digitação no papel) |
| mes | texto_curto | sim |
| ano | texto_curto | sim (pré-impresso "2026") |

- **Quem assina:** `Paciente ou responsável` + `Profissional Responsável`
- **Assinatura forte:** **[CONFIRMAR]** — é o documento de maior peso jurídico do conjunto (isenção de responsabilidade). Forte candidato a `EXIGE_METODO_FORTE = true`, mesmo não sendo do psiquiatra.
- **Auditoria estadual:** muito provável **[CONFIRMAR]**
- **⚠️ Erros de digitação a corrigir no sistema:** "ALTA Á PEDIDO" (crase indevida → "a pedido"), "NOVE VENEZA/SC" (→ "Nova Veneza/SC"), ano "2026" hardcoded.

---

## 12. Declaração de Alta Administrativa — CT

- **Objetivo:** formalizar o desligamento **por decisão da instituição**, por descumprimento do regimento interno.
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (só logo LUZ NO VALE)
- **Quem preenche:** Coordenador / Diretores · **Evento:** desligamento por descumprimento · **Único por acolhimento**
- **Texto fixo:** a alta administrativa é direito da instituição de desligar o acolhido mediante descumprimento do regime interno; constitui ato praticado pela equipe multiprofissional; isenta toda equipe multiprofissional; não impede retorno futuro, mediante análise de toda equipe técnica.
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| esclarecimentos_prestados | texto_longo (bloco "REGISTRO DO PROFISSIONAL COORDENADOR / DIRETORES", 5 linhas) | sim |
| cidade_data | texto_curto | sim (pré-impresso "NOVA VENEZA, SC 16 DE MARÇO 2026" — data fixa no template!) |

- **Quem assina:** `Paciente ou responsável` + `Profissional responsável`
- **Assinatura forte:** **[CONFIRMAR]** — mesmo peso jurídico do doc 11.
- **Auditoria estadual:** muito provável **[CONFIRMAR]**
- **⚠️ Erros de digitação:** "ESCLARECIMENTTOS" (duplo T), "PROFICIONAL RESPONSAVEL" (→ "Profissional Responsável"), "PACIENTE OU RESPONSAVEL" (sem acento), data "16 DE MARÇO 2026" chumbada no template. **Este é um exemplo perfeito do problema que o sistema resolve** — bom de citar na banca.

---

## 13. Alta Terapêutica / Conclusão

- **Objetivo:** formalizar a conclusão bem-sucedida do programa terapêutico ("graduação").
- **Categoria:** Jurídico-institucional · **Emissor:** Institucional (timbre completo)
- **Quem preenche:** Coordenador / Diretores · **Evento:** conclusão do tratamento · **Único por acolhimento**
- **Texto fixo (com lacunas):** *"O acolhido ______, inscrito no CPF: ______. Concluiu duas das três fases do programa terapêutico da instituição, sendo elas: Adaptação e Desintoxicação, Conscientização e Interiorização, Ressocialização e Reinserção social. O tratamento proposto na CT de nove meses. Iniciando o acolhimento ______. Comemora-se a vitória pela evolução neste período. O graduado é convidado a retornar a CT, quando quiser (visitas agendadas), conversas com os residentes, passar um dia com os mesmos, demonstrando, pela simplicidade, que funciona, ou, como tem funcionado em sua vida o programa de recuperação."*
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome_acolhido | texto_curto | sim |
| cpf | texto_curto | sim |
| data_inicio_acolhimento | data | sim |
| esclarecimentos_prestados | texto_longo | sim (vem com **texto sugerido pré-preenchido** no papel: *"O acolhido apresentou bom comportamento, praticando todas as laborterapias propostas pelos monitores e coordenadores, participou das atividades da instituição e obteve evolução nas duas fases do programa terapêutico da instituição."*) |
| cidade_data | texto_curto | sim (pré-impresso "NOVA VENEZA / SC, DE MARÇO DE 2026") |

- **Quem assina:** `Paciente ou Responsável` + `Profissional Responsável`
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **📌 Regras de negócio extraídas (valiosas para o domínio):**
  - O programa tem **3 fases nomeadas**: (1) Adaptação e Desintoxicação, (2) Conscientização e Interiorização, (3) Ressocialização e Reinserção Social.
  - Duração proposta do tratamento na CT: **9 meses**.
  - O texto diz "Concluiu **duas das três** fases" — ou seja, a alta terapêutica é dada ao concluir a 2ª fase, com a 3ª (ressocialização) acontecendo já com saídas para trabalho (docs 16/17). **[CONFIRMAR]**
  - → Sugere um campo `fase_atual` no paciente e possivelmente um indicador no dashboard. **[DECISÃO DO TIME]**
- **⚠️ Erro de digitação:** "COODENADOR" (→ Coordenador).

---

## 14. Termo de Acolhimento (SES/SC)

- **Objetivo:** declarar ao Estado que o acolhido ocupa vaga custeada pelo Governo de SC, para fins de prestação de contas do convênio.
- **Categoria:** Jurídico-institucional · **Emissor:** **Governo de SC / Gerência Regional de Saúde de Criciúma**
- **Quem preenche:** Administrativo/Coordenação · **Evento:** Admissão (de paciente com vaga estadual) · **Único por acolhimento**
- **Texto fixo:** *"Declaro para os devidos fins que, o acolhido ______, portador do CPF: ______, portador da chave de SISREG: ______, foi acolhido instituição na data de __/__/____, para tratamento de transtornos decorrentes do uso abusivo de Substâncias Psicoativas (SPA), ocupando vaga custeada pelo Governo do Estado de Santa Catarina."*
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome_acolhido | texto_curto | sim |
| cpf | texto_curto | sim |
| chave_sisreg | texto_curto | sim |
| data_acolhimento | data | sim |
| cidade | texto_curto | sim |
| data | data | sim |

- **Quem assina:** `Assinatura do Acolhido` + `Representante da Comunidade Terapêutica`
- **Assinatura forte:** **[CONFIRMAR — prioridade máxima]** documento que vai para o Estado; pode haver exigência formal do órgão sobre aceitar documento assinado eletronicamente. **Esta é a pergunta que mais impacta a decisão da seção 6 do CLAUDE.md.**
- **Auditoria estadual:** **SIM — certeza.** É documento emitido em formulário do próprio órgão auditor.
- **⚠️ Nome colide com o doc 03** (também "Termo de Acolhimento"). Precisa de desambiguação no sistema. Ver "Achados que afetam o schema", item 4.

---

## 15. Declaração de Desligamento (SES/SC)

- **Objetivo:** declarar ao Estado o desligamento do acolhido e o motivo, encerrando a vaga custeada.
- **Categoria:** Jurídico-institucional · **Emissor:** Governo de SC / GERSA Criciúma
- **Quem preenche:** Administrativo/Coordenação · **Evento:** desligamento · **Único por acolhimento**
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome_acolhido | texto_curto | sim |
| cpf | texto_curto | sim |
| chave_sisreg | texto_curto | sim |
| data_acolhimento | data | sim |
| data_desligamento | data | sim |
| motivo_desligamento | selecao_unica | sim |
| cidade | texto_curto | sim |
| data | data | sim |

- **`motivo_desligamento` — lista fixa oficial do Estado** (esta é a taxonomia que o sistema deve adotar, não uma inventada):
  `Desistência` · `Fuga/Evasão` · `Alta Administrativa` · `Alta Terapêutica` · `Agravante de Saúde` · `Mudança de Convênio/Programa` · `Óbito`
- **Quem assina:** `Assinatura do Acolhido/Testemunha` + `Representante da Comunidade Terapêutica`
  - ⚠️ Note o **"/Testemunha"**: o próprio Estado prevê que o acolhido pode não estar presente (fuga, óbito) e uma testemunha assina no lugar. **Isso valida diretamente o modelo de "presencial reforçado com testemunha" da seção 6 do CLAUDE.md** — o conceito de testemunha já existe no processo oficial.
- **Auditoria estadual:** **SIM — certeza.**
- **📌 Impacto no domínio:** o motivo de desligamento se conecta aos docs 11 (alta a pedido → "Desistência"?), 12 (alta administrativa) e 13 (alta terapêutica). O sistema deve **derivar/sugerir** este campo a partir de qual documento de alta foi emitido. **[CONFIRMAR mapeamento "Alta a Pedido" → "Desistência"]**

---

## 16. Termo de Ressocialização — horários semanais (SES/SC)

- **Objetivo:** declarar ao Estado que o acolhido, conforme o PIA, iniciou processo de ressocialização trabalhando em uma empresa, com a grade de horários.
- **Categoria:** Jurídico-institucional · **Emissor:** Governo de SC / GERSA Criciúma
- **Quem preenche:** Administrativo/Coordenação · **Evento:** início da ressocialização (fase 3) · **Recorrente [CONFIRMAR — novo termo a cada mudança de empresa/horário?]**
- **Campos:**

| Campo | Tipo | Obrigatório |
|---|---|---|
| nome_acolhido | texto_curto | sim |
| cpf | texto_curto | sim |
| chave_sisreg | texto_curto | sim |
| empresa | texto_curto | sim |
| fone_empresa | texto_curto | sim |
| dias_atividade | selecao_multipla (segunda a sexta) | sim |
| hora_inicio_por_dia | texto_curto (um par por dia marcado) | sim |
| hora_fim_por_dia | texto_curto | sim |
| hora_retorno_ct | texto_curto | sim |
| cidade | texto_curto | sim |
| data | data | sim |

- **Quem assina:** `Assinatura do Acolhido` + `Representante da Comunidade Terapêutica`
- **Auditoria estadual:** **SIM — certeza.**
- **📌 Menciona o PIA (Plano Individual de Acolhido)** — documento obrigatório em CT que **não está no lote de fotos.** Ver "O que parece estar faltando".
- **⚠️ Estrutura de campo não trivial:** dias da semana com horário de início/fim **por dia** é uma tabela aninhada, não um campo simples. Modelar como `selecao_multipla` + campos condicionais, ou como sub-tabela. **[DECISÃO DO TIME]**

---

## 17. Termo de Ressocialização — locais/atividades (SES/SC)

- **Objetivo:** mesma finalidade do doc 16, em **variante de layout**: em vez de grade de horários semanais, uma tabela de locais/atividades com datas de saída e retorno.
- **Categoria:** Jurídico-institucional · **Emissor:** Governo de SC / GERSA Criciúma
- **Texto fixo:** idêntico ao doc 16 até "...ocupando vaga custeada pelo Governo do Estado de Santa Catarina." (sem a parte do PIA/empresa).
- **Campos — cabeçalho:** `nome_acolhido`, `cpf`, `chave_sisreg` (todos texto_curto, sim)
- **Campos — por linha da tabela (9 linhas no papel):**

| Campo | Tipo | Obrigatório |
|---|---|---|
| local_atividade | texto_curto | sim |
| data_saida | data | sim |
| data_retorno | data | não |

- **Campos — rodapé:** `cidade` (texto_curto, sim), `data` (data, sim)
- **Quem assina:** `Assinatura do Acolhido` + `Representante da Comunidade Terapêutica`
- **Auditoria estadual:** **SIM — certeza.**
- **⚠️ Pergunta:** docs 16 e 17 são **dois tipos distintos** ou **duas versões do mesmo formulário** (uma nova que substituiu a outra)? Os dois têm exatamente o mesmo título. **[CONFIRMAR — prioridade alta]** Se forem versões, usar só a mais recente.

---

# Achados que afetam o schema

Estes são os pontos em que a realidade do papel **diverge do que está modelado** em `rascunho-tabelas-2.txt` e no protótipo. Cada um é uma decisão a tomar antes de fechar o schema.

### 1. Existem "folhas-tabela acumulativas" — 3 ou 4 dos 17 tipos

Docs **07 (Evolução de Enfermagem)**, **09 (Controle de Saída)**, **17 (Ressocialização/atividades)** e possivelmente **10 (Atividades Práticas)** não são "um documento = um evento". São **uma folha por paciente com N linhas** acumuladas ao longo do tratamento, cada linha com sua própria data e (nos docs 07 e 09) sua **própria assinatura**.

O protótipo modela o Controle de Saída como um documento por saída — **isso não bate com o papel.**

**Recomendação:** no banco, cada **linha é um registro próprio** (com autor, data/hora, assinaturas e imutabilidade individuais); a "folha" existe só como **visão agregada na hora de gerar o PDF A4** para a auditoria. Assim:
- preserva a regra de imutabilidade da seção 7 (uma linha assinada nunca muda);
- permite assinatura por linha (que é como o papel funciona);
- e ainda entrega para o auditor a folha no formato que ele conhece.

→ Implica um atributo em `TIPO_DOCUMENTO` do tipo `FORMATO` = `folha_unica` | `folha_tabela`, e uma tabela de linhas (`DOCUMENTO_LINHA`) para os do segundo tipo. **[DECISÃO DO TIME]**

### 2. Campo novo obrigatório no paciente: chave SISREG

A **chave de SISREG** aparece em **4 dos 4 documentos estaduais** (14, 15, 16, 17) — exatamente os que a auditoria certamente cobra. **Não existe** nem no protótipo (`types.ts`) nem nos rascunhos de tabela.

→ Adicionar `PACIENTE.chave_sisreg`. Também confirma que existe uma distinção **vaga custeada pelo Estado × vaga particular/outra**, que provavelmente é o campo "CONVÊNIO" da capa (doc 01). → Modelar `PACIENTE.convenio` como seleção, não texto livre. **[CONFIRMAR quais são os convênios possíveis]**

### 3. Os assinantes são mais que "paciente / responsável / profissional"

Papéis de assinatura efetivamente observados no papel:

| Papel no papel | Aparece em |
|---|---|
| Acolhido / Residente / Paciente | 03, 04, 09, 11, 12, 13, 14, 15, 16, 17 |
| Responsável (pelo acolhido) | 03, 04, 09, 11, 12, 13 |
| **Monitor Responsável** | 03 |
| **Enfermeiro** | 07 |
| Profissional Responsável | 11, 12, 13 |
| **Representante da Comunidade Terapêutica** | 14, 15, 16, 17 |
| **Testemunha** (em lugar do acolhido) | 15 |

"Monitor", "Enfermeiro", "Representante da CT" e "Testemunha" não são intercambiáveis — **Representante da CT** em particular é um papel institucional específico (quem responde pela CT perante o Estado), não "qualquer profissional".

→ A tabela `ASSINATURA` precisa de um **`PAPEL_ASSINANTE`** (enum/tabela), e `TIPO_DOCUMENTO` precisa declarar **quais papéis são exigidos** — provavelmente uma tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis por tipo), não um campo único. **[DECISÃO DO TIME]**

→ **Bônus:** o papel "Testemunha" já existe no formulário oficial do Estado (doc 15). Isso é argumento forte na banca para o modelo de "presencial reforçado com testemunha" da seção 6.

### 4. Dois documentos diferentes com o mesmo nome

Doc 03 (institucional) e doc 14 (SES/SC) se chamam ambos **"Termo de Acolhimento"** e têm conteúdo, campos e assinantes completamente diferentes.

→ `TIPO_DOCUMENTO` precisa de **`EMISSOR`/`ORIGEM`** (`institucional` | `estadual`) e de um **nome de exibição desambiguado** na UI (ex.: "Termo de Acolhimento (SES/SC)"). Sem isso a busca da central de documentos fica ambígua. **[DECISÃO DO TIME]**

### 5. Documentos de texto fixo × documentos com campos

Docs **04** e **05** (Regimento Interno) não têm nenhum campo preenchível — são texto institucional que o paciente recebe/aceita. Doc 05 é **idêntico para todos os pacientes**, e muda quando a instituição revisa o regimento.

→ Sugere `TIPO_DOCUMENTO.TEXTO_FIXO` (o corpo) **versionado no nível do tipo**, com a instância por paciente guardando apenas qual versão do texto ele assinou. Isso evita duplicar 30 regras em 32 prontuários e ainda deixa auditável "qual versão do regimento o paciente X assinou". **[DECISÃO DO TIME]**

### 6. Divergências entre a Ficha de Acolhimento real e o `types.ts` do protótipo

- Protótipo tem `apelido`; o papel não. **[CONFIRMAR se é uso real]**
- Papel tem `nacionalidade`, `cor`, `filhos`, `município` (naturalidade), `número`, `bairro`, `estado`; o protótipo não.
- Protótipo tem `data_acolhimento`, `data_desligamento`, `convenio` na ficha; no papel estão na **capa do prontuário** (doc 01) — ou seja, são atributos do paciente, não campos da ficha. **O protótipo acertou o lugar (paciente), o papel só os coloca em outra folha.**
- A lista de dependências do protótipo **bate exatamente** com o papel. ✅

### 7. Nenhum documento assinado por médico/psiquiatra neste lote

**Nenhum** dos 17 documentos é registro médico assinado por psiquiatra. Os registros clínicos são de **enfermagem** (06, 07) e da **equipe técnica** (08).

Isso é relevante para a questão do **CFM (Resolução 1.821/2007)** levantada na seção 6 do CLAUDE.md: se a instituição não mantém prontuário médico psiquiátrico dentro deste conjunto, o risco de cair nas exigências de certificação SBIS **cai bastante**, e o modelo de "presencial reforçado" fica muito mais defensável.

**Mas atenção:** a Avaliação de Enfermagem pergunta "faz uso de medicação psiquiátrica?" e o Regimento (regra 18) exige receituário médico. **Então existe alguma documentação médica que não foi fotografada.** Confirmar antes de travar a decisão. **[CONFIRMAR — prioridade máxima]**

---

# O que parece estar faltando

O CLAUDE.md registrava a estimativa de **~40 tipos**; o lote tem **17**. Ou a estimativa era alta, ou faltam documentos. Estes são citados **pelos próprios documentos fotografados**, então existem quase com certeza:

| Documento provável | Evidência |
|---|---|
| **PIA — Plano Individual de Acolhido** | Citado no doc 16. É documento obrigatório de CT e certamente auditado. **Falta mais crítica do lote.** |
| **Livro de ocorrências diárias** | Regimento Interno, regra 5 |
| **Receituário / controle de medicação** | Regimento, regra 18 + doc 06 pergunta sobre medicação psiquiátrica |
| **Avaliação de comportamento** | Regimento, regra 8 |
| **Avaliação / evolução psicológica** | Doc 08 cita "psicóloga" na equipe técnica; regra 7 cita "avaliações dos profissionais" |
| **Controle/registro de visitas** | Regimento, regra 15 (regras detalhadas de visita) + doc 04 cita "calendário de visitas" |
| **Termo de devolução de pertences de valor** | Regimento, regra 1 (objetos de valor devolvidos à família) e regra 2 ("salvo termo devidamente assinado pelo residente") |
| **Cronograma de atividades diárias** | Regimento, regra 5 |
| Documentos de admissão anexados (RG, CPF, cartão SUS, exames) | Prática comum; **[CONFIRMAR]** se ficam no prontuário |

---

# Perguntas para a instituição

Ordenadas por impacto no schema. As 5 primeiras são bloqueantes.

### Bloqueantes

1. **Este lote é tudo mesmo?** Especificamente: existe **PIA (Plano Individual de Acolhido)**? Existe registro médico/psiquiátrico ou controle de medicação? Existe avaliação psicológica? (ver tabela acima)
2. **Docs 16 e 17 (Termo de Ressocialização):** são dois formulários diferentes em uso, ou um substituiu o outro?
3. **Doc 10 (Atividades Práticas):** é por paciente ou é uma escala coletiva da casa? Como se preenche a matriz atividade × função?
4. **Quais destes 17 a auditoria estadual mensal efetivamente exige?** (Os 4 do Governo de SC são certeza; e os institucionais?) — isso define o escopo mínimo da V1.
5. **A auditoria/GERSA aceita documento assinado eletronicamente**, ou exige papel com assinatura de próprio punho? Se aceita, exige algum padrão (GOV.BR / ICP-Brasil)? — **esta pergunta trava a decisão da seção 6 do CLAUDE.md.**

### Importantes

6. Docs 02 (Ficha), 06 (Aval. Enfermagem) e 08 (Evolução Geral) **não têm linha de assinatura** no papel. É intencional, ou na prática alguém assina/rubrica?
7. O acolhido assina o **Regimento Interno** (doc 05) em algum lugar? Há folha de ciência separada?
8. **Doc 04:** os 3 termos (Patrimônio / Responsabilidade / Uso de Imagem) devem continuar juntos numa folha, ou podem virar 3 documentos independentes no sistema?
9. **Doc 06 (Avaliação de Enfermagem):** é só na admissão ou é refeita periodicamente?
10. **Doc 01 (capa):** o que é o campo "ACOLHIMENTO/CONVÊNIO"?
11. Quais são os **convênios possíveis** além da vaga custeada pelo Estado?
12. O campo `apelido` do protótipo é usado de verdade na instituição?

### Contexto / produto

13. As **3 fases** do programa (Adaptação e Desintoxicação / Conscientização e Interiorização / Ressocialização e Reinserção) devem ser acompanhadas no sistema (ex.: campo "fase atual" no paciente, indicador no dashboard)?
14. A **Alta Terapêutica** é dada ao concluir a 2ª fase (como o texto do doc 13 sugere) ou as 3?
15. Os erros de digitação dos templates (ver docs 11, 12, 13) podem ser corrigidos no sistema, ou a instituição prefere manter o texto idêntico ao papel para não gerar estranheza na auditoria?
