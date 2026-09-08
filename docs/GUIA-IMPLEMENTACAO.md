# Guia de Implementação — Reabilitah

> **Para que serve este arquivo:** manter a equipe orientada sobre *o que fazer agora*, *por que agora* e *o que vem depois*. Não é especificação (isso é o `CLAUDE.md` e o `documentos-mapeados.md`) — é **ordem de execução**.
>
> **Stack:** Next.js (front) · NestJS (back) · PostgreSQL · TypeScript em tudo.
>
> Leia a seção **"A ideia central"** antes de escrever qualquer linha de código. Ela é o que separa este projeto de "17 telas feitas na mão".

---

## A ideia central (leia isto primeiro)

O erro mais fácil de cometer neste projeto é olhar os 17 documentos mapeados e pensar *"então vamos fazer 17 telas"*. **Não.**

O sistema tem **um** motor de documentos. Um tipo de documento é **dado no banco**, não código:

```
TIPO_DOCUMENTO (nome, emissor, categoria, formato, texto_fixo, quem_assina…)
    └── CAMPO_TIPO_DOCUMENTO (nome, rótulo, tipo, obrigatório, ordem, texto_ajuda…)
```

O front lê esses metadados e **desenha o formulário sozinho**. O mesmo componente renderiza a Ficha de Acolhimento, a Avaliação de Enfermagem e o Termo de Ressocialização — muda só a linha do banco.

**Por que isso importa tanto:**

| Sem motor genérico | Com motor genérico |
|---|---|
| 17 formulários codados à mão | 1 formulário + 17 linhas de seed |
| Documento novo = novo deploy | Documento novo = cadastro na tela de admin |
| Instituição depende de vocês para sempre | Instituição se vira sozinha depois da entrega |
| Banca vê CRUD repetido | Banca vê arquitetura |

Isso também responde a um risco real: **ainda faltam documentos** (o PIA e outros, ver `documentos-mapeados.md`). Com o motor genérico, documento que aparecer depois é só mais uma linha — não replaneja nada.

**Regra de bolso:** se você se pegar escrevendo `if (tipo === 'termo-acolhimento')`, pare. É sinal de que algo deveria ser metadado.

---

## Mapa das fases

```
FASE 0  Fundação            repo, banco, auth        ▓▓▓        ← comece aqui
FASE 1  Paciente            CRUD + prontuário        ▓▓▓▓
FASE 2  Motor de documentos formulário genérico      ▓▓▓▓▓▓▓    ← o coração
FASE 3  Versionamento       imutabilidade + auditoria▓▓▓▓
FASE 4  Assinatura          presencial reforçado     ▓▓▓▓
FASE 5  PDF                 A4 timbrado + exportação ▓▓▓
FASE 6  Dashboard + Equipe  indicadores, permissões  ▓▓▓
FASE 7  Validação e banca   testes, ajustes, defesa  ▓▓▓
```

A largura das barras é peso relativo de esforço, não semanas. **A Fase 2 é a maior e a mais importante** — é onde está o valor do projeto. Não a esprema para sobrar tempo para dashboard bonito.

**Ordem é obrigatória até a Fase 3.** Depois disso, 4, 5 e 6 podem paralelizar entre a equipe.

---

## Fase 0 — Fundação

**Objetivo:** todo mundo consegue rodar o projeto e fazer login. Nada de regra de negócio ainda.

### 0.1 Decisões a fechar antes de começar

Estão em aberto no `CLAUDE.md` §13. Recomendação fundamentada para cada uma — **decidam e registrem, não deixem apodrecer**:

| Decisão | Recomendação | Por quê |
|---|---|---|
| Estrutura do repo | **Monorepo** com pnpm workspaces: `apps/web` (Next) + `apps/api` (Nest) + `packages/shared` (tipos) | Time de 4 pessoas, um deploy só, tipos compartilhados entre front e back sem publicar pacote. O protótipo já usa pnpm. |
| ORM | **Prisma** | Migrations legíveis (importa para a banca mostrar evolução do schema), tipos gerados automaticamente, `JSONB` bem suportado — e vocês vão usar muito JSONB. TypeORM é mais "nativo Nest" mas tem DX pior para quem está aprendendo. |
| Banco local | **Docker Compose** com Postgres 16 | Ninguém instala Postgres na máquina. Um `docker compose up` e todos têm o mesmo ambiente. |
| Auth | **JWT em cookie httpOnly** | Simples, seguro o bastante, e não exige serviço externo. Nada de localStorage com token. |
| Validação | `class-validator` no Nest + `zod` no front | Padrão da stack. |

### 0.2 Estrutura de pastas

```
reabilitah/
├── apps/
│   ├── api/                    NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed/           ← seed dos TIPO_DOCUMENTO vem daqui
│   │   └── src/
│   │       ├── auth/
│   │       ├── pacientes/
│   │       ├── documentos/     ← o coração
│   │       ├── assinaturas/
│   │       ├── auditoria/
│   │       ├── equipe/
│   │       └── pdf/
│   └── web/                    Next.js (App Router)
│       └── src/
│           ├── app/
│           ├── components/
│           │   ├── ui/         ← copiar do protótipo (48 componentes prontos)
│           │   └── documentos/ ← renderizadores genéricos
│           └── lib/
├── packages/
│   └── shared/                 tipos e enums usados pelos dois lados
├── docker-compose.yml
└── README.md
```

### 0.3 Reaproveitamento do protótipo — o que vale a pena

O `export-figma-make/` tem **48 componentes shadcn/ui + Tailwind v4** já estilizados. Isso é ganho real:

✅ **Copiar:** `src/app/components/ui/*` inteiro (button, input, select, dialog, table, tabs, card…), `utils.ts`, o tema em `default_shadcn_theme.css`.
✅ **Usar como referência visual:** as telas em `components/screens/` — layout, hierarquia, textos em português.
❌ **Não copiar:** `App.tsx` (estado em memória), lógica de negócio, renderização hardcoded por tipo, telas órfãs (`FamilyPortalScreen`, `MuralScreen`, `AgendaScreen`, `ReportsScreen`, `TimelineScreen`, `SignatureScreen`, `ProfileSelectionScreen`).

> Detalhe técnico: o protótipo é Vite; Next.js precisa de `"use client"` no topo dos componentes shadcn que usam hooks. É uma linha por arquivo.

### 0.4 Tarefas

- [ ] Criar repositório e estrutura de pastas acima
- [ ] `docker-compose.yml` com Postgres 16 + volume persistente
- [ ] NestJS inicializado, respondendo `GET /health`
- [ ] Next.js inicializado, com os componentes `ui/` migrados do protótipo
- [ ] Prisma conectado, primeira migration rodando
- [ ] Tabela `USUARIO` + login com JWT em cookie httpOnly
- [ ] Middleware de rota protegida no Next
- [ ] README com "como rodar" em 5 passos

### ✅ Critério de pronto
Um integrante que nunca clonou o projeto consegue: `git clone` → `pnpm install` → `docker compose up` → `pnpm dev` → fazer login → ver uma página vazia protegida. **Em menos de 10 minutos.**

---

## Fase 1 — Paciente

**Objetivo:** cadastrar e consultar acolhidos. É a entidade raiz — tudo pendura nela.

### 1.1 Schema

Campos vêm da Ficha de Acolhimento real (`documentos-mapeados.md` §02) + capa do Prontuário (§01), **não do protótipo** — ele estava incompleto.

```prisma
model Paciente {
  id                String    @id @default(uuid())
  nome              String                          // ÚNICO obrigatório
  apelido           String?                         // confirmar se usam
  cpf               String?
  rg                String?
  dataNascimento    DateTime?
  nacionalidade     String?
  naturalidade      String?
  municipioNatural  String?
  nomePai           String?
  nomeMae           String?
  escolaridade      String?
  profissao         String?
  cor               String?
  estadoCivil       String?
  temFilhos         Boolean?
  endereco          String?
  numero            String?
  bairro            String?
  municipio         String?
  estado            String?

  // vindos da capa do prontuário — atributos do paciente, não da ficha
  dataAcolhimento   DateTime?
  dataDesligamento  DateTime?
  convenio          Convenio?                       // seleção, não texto livre
  chaveSisreg       String?                         // ⚠️ novo — exigido pelo Estado
  faseAtual         FaseTratamento?

  dependencias      TipoDependencia[]
  primeiraDrogaLicita        String?
  primeiraDrogaLicitaIdade   Int?
  primeiraDrogaIlicita       String?
  primeiraDrogaIlicitaIdade  Int?

  responsaveis      Responsavel[]
  documentos        Documento[]

  ativo             Boolean   @default(true)        // nunca deletar (§7 do CLAUDE.md)
  criadoEm          DateTime  @default(now())
}

enum FaseTratamento {
  ADAPTACAO_DESINTOXICACAO
  CONSCIENTIZACAO_INTERIORIZACAO
  RESSOCIALIZACAO_REINSERCAO
}
```

> ⚠️ **`chaveSisreg` não é opcional na prática** para pacientes com vaga estadual — é o que amarra o acolhido aos 4 formulários da auditoria. Deixe nullable no banco (nem todo paciente tem), mas **valide na hora de gerar documento estadual**.

### 1.2 Tarefas

- [ ] Models `Paciente` e `Responsavel` (1:N — paciente pode ter vários)
- [ ] Enums: `TipoDependencia` (10 valores, lista fixa do papel), `Convenio`, `FaseTratamento`
- [ ] CRUD no Nest — com **soft delete** (`ativo`), nunca `DELETE` de verdade
- [ ] Lista de pacientes com busca (nome, apelido, CPF)
- [ ] Tela de detalhe com abas **Prontuário** (dados) e **Histórico** (documentos — ainda vazia)
- [ ] Formulário de cadastro: **só o nome é obrigatório**, resto opcional

### ✅ Critério de pronto
Cadastrar um paciente só com o nome, depois voltar e completar o resto aos poucos, sem o formulário reclamar. É assim que a instituição trabalha.

---

## Fase 2 — Motor de documentos 🔥

**Objetivo:** um formulário genérico que renderiza qualquer um dos 17 tipos a partir do banco. **Esta fase é o projeto.**

### 2.1 Schema do motor

```prisma
model TipoDocumento {
  id            String    @id @default(uuid())
  codigo        String    @unique          // "ficha-acolhimento"
  nome          String                     // "Ficha de Acolhimento"
  nomeExibicao  String                     // "Termo de Acolhimento (SES/SC)" — desambiguado
  emissor       Emissor                    // INSTITUCIONAL | ESTADUAL
  categoria     Categoria
  formato       FormatoDocumento           // FOLHA_UNICA | FOLHA_TABELA
  recorrencia   Recorrencia                // UNICO_POR_PACIENTE | RECORRENTE
  textoFixo     String?                    // Regimento Interno, termos de ciência
  textoFixoVersao Int      @default(1)     // versionado no nível do TIPO
  exigeMetodoForte Boolean @default(false)
  ativo         Boolean   @default(true)

  campos        CampoTipoDocumento[]
  assinantes    TipoDocumentoAssinante[]
  documentos    Documento[]
}

model CampoTipoDocumento {
  id          String      @id @default(uuid())
  tipoId      String
  nome        String                       // "pressao_arterial"
  rotulo      String                       // "Pressão Arterial"
  tipo        TipoCampo
  obrigatorio Boolean     @default(false)
  ordem       Int
  textoAjuda  String?                      // hint entre parênteses do papel
  opcoes      Json?                        // para seleções
  grupo       String?                      // "Sinais Vitais", "Cabeça"…
}

enum TipoCampo {
  TEXTO_CURTO
  TEXTO_LONGO
  DATA
  NUMERO
  SELECAO_UNICA
  SELECAO_MULTIPLA
  BOOLEANO
}

model TipoDocumentoAssinante {
  id          String        @id @default(uuid())
  tipoId      String
  papel       PapelAssinante
  obrigatorio Boolean       @default(true)
  ordem       Int
}

enum PapelAssinante {
  ACOLHIDO
  RESPONSAVEL
  MONITOR_RESPONSAVEL
  ENFERMEIRO
  PROFISSIONAL_RESPONSAVEL
  REPRESENTANTE_CT
  TESTEMUNHA
}
```

> Os 7 papéis vêm de `CLAUDE.md` §8.1-c. O modelo antigo de 3 papéis **não serve** — o Termo de Acolhimento sozinho tem 3 assinantes.

### 2.2 Instância do documento

```prisma
model Documento {
  id          String    @id @default(uuid())
  codigo      String    @unique          // DOC-000001, sequencial
  pacienteId  String
  tipoId      String
  status      StatusDocumento            // PENDENTE_ASSINATURA | ASSINADO | DESATIVADO
  versaoAtual Int       @default(1)

  versoes     DocumentoVersao[]
  linhas      DocumentoLinha[]           // só para FOLHA_TABELA
  criadoPor   String
  criadoEm    DateTime  @default(now())
}
```

### 2.3 O renderizador genérico (front)

Este é o componente que justifica o projeto:

```tsx
// Um componente. Dezessete documentos.
<FormularioDocumento tipo={tipo} valores={valores} onChange={setValores} />

// Por dentro: percorre tipo.campos e escolhe o input pelo TipoCampo
{tipo.campos.map(campo => {
  switch (campo.tipo) {
    case 'TEXTO_CURTO':      return <Input ... />
    case 'TEXTO_LONGO':      return <Textarea ... />
    case 'DATA':             return <DatePicker ... />
    case 'SELECAO_UNICA':    return <Select options={campo.opcoes} ... />
    case 'SELECAO_MULTIPLA': return <CheckboxGroup ... />
    // …
  }
})}
```

Agrupando por `campo.grupo`, a Avaliação de Enfermagem sai organizada em "Sinais Vitais", "Cabeça", "Abdômen" sem uma linha de código específica dela.

### 2.4 Ordem de ataque dentro da fase

Faça **nesta ordem** — cada passo valida o anterior:

1. **Seed com 1 tipo simples** — Evolução Geral (2 campos). Prova que o motor funciona.
2. **Renderizador de formulário** — genérico desde o primeiro dia.
3. **Salvar e listar** — com snapshot em JSONB (ver Fase 3).
4. **Renderizador de visualização** — o documento "em papel" na tela.
5. **Seed dos outros tipos `FOLHA_UNICA`** — Ficha de Acolhimento, Termos, Altas, formulários do Estado.
6. **Tratar `FOLHA_TABELA`** — Evolução de Enfermagem, Controle de Saída. É o caso mais complexo, deixe por último.
7. **Tela de admin de tipos** — cadastrar/editar tipo sem mexer em código. *(Se o tempo apertar, esta é a única coisa cortável da fase — o seed cobre a demo.)*

### 2.5 Sobre as folhas-tabela

`CLAUDE.md` §8.1-a explica: Evolução de Enfermagem e Controle de Saída **não são "um documento por evento"** — são uma folha por paciente com dezenas de linhas, cada uma com data e assinatura próprias.

```prisma
model DocumentoLinha {
  id          String   @id @default(uuid())
  documentoId String
  ordem       Int
  dados       Json                        // valores dos campos da linha
  autorId     String
  criadoEm    DateTime @default(now())
  assinaturas Assinatura[]                // assinatura POR LINHA
  // imutável após criação — nunca UPDATE
}
```

Na tela: uma tabela onde se adiciona linha. No PDF: a folha inteira, como o auditor conhece.

### 2.6 Seed a partir do mapeamento

O `documentos-mapeados.md` tem os campos de cada tipo em tabelas markdown. Transforme em seed — pode ser um `.ts` escrito à mão a partir dele:

```ts
// prisma/seed/tipos-documento.ts
export const tiposDocumento = [
  {
    codigo: 'evolucao-geral',
    nome: 'Evolução Geral',
    emissor: 'INSTITUCIONAL',
    categoria: 'CLINICO',
    formato: 'FOLHA_UNICA',
    recorrencia: 'RECORRENTE',
    campos: [
      { nome: 'acolhido', rotulo: 'Acolhido', tipo: 'TEXTO_CURTO', obrigatorio: true, ordem: 1 },
      { nome: 'registro_evolucao', rotulo: 'Evolução', tipo: 'TEXTO_LONGO', obrigatorio: true, ordem: 2 },
    ],
    assinantes: [],
  },
  // … os outros 16
]
```

> **Tarefa braçal, mas mecânica.** Boa para dividir: cada pessoa transcreve 4 tipos. Faça **depois** do renderizador funcionar com 1 tipo — assim vocês transcrevem já sabendo o formato certo.

### ✅ Critério de pronto
Criar um documento de qualquer tipo, preencher, salvar, e ver renderizado — **sem existir nenhum `if` por tipo de documento no código.**

---

## Fase 3 — Versionamento e imutabilidade

**Objetivo:** cumprir a regra absoluta do `CLAUDE.md` §7 — *documento não se edita, nada se apaga*.

### 3.1 O mecanismo

Toda alteração cria **nova versão** com snapshot completo. A versão anterior fica intacta para sempre.

```prisma
model DocumentoVersao {
  id           String    @id @default(uuid())
  documentoId  String
  numero       Int
  acao         AcaoVersao
  conteudo     Json                      // SNAPSHOT COMPLETO daquela versão
  hashConteudo String                    // SHA-256 — prova de integridade
  autorId      String
  justificativa String?                  // obrigatória em DESATIVADO
  nomeArquivo  String?
  criadoEm     DateTime  @default(now())

  assinaturas  Assinatura[]
}

enum AcaoVersao {
  CRIADO
  PDF_BAIXADO
  PDF_ANEXADO
  DESATIVADO
  REATIVADO
  ASSINADO
}
```

**O snapshot em JSONB é o que torna isso simples.** Não tente reconstruir versões antigas por diff — guarde o estado inteiro. São documentos pequenos; espaço não é problema, e a auditoria fica trivial.

### 3.2 Regras a implementar (não negociáveis)

- ❌ **Nenhum endpoint `PUT`/`PATCH` que altere conteúdo de documento.** Existe `POST /documentos/:id/versoes`.
- ❌ **Nenhum `DELETE` em lugar nenhum.** Só `ativo = false`.
- ✅ Desativar exige **justificativa obrigatória** — valide no backend, não só no front.
- ✅ Reativar → nova versão → status volta para `PENDENTE_ASSINATURA`.
- ✅ Profissional desativado **continua aparecendo** no histórico com nome real. Nunca "usuário desconhecido".
- ✅ Hash do conteúdo calculado na criação da versão — é o que sustenta a assinatura da Fase 4.

> **Teste isto explicitamente.** Um teste automatizado que tenta editar um documento e espera falhar vale ouro na banca — demonstra que a regra é estrutural, não só disciplina.

### 3.3 Auditoria

Timeline de versões navegável, cada uma abrindo o **snapshot completo** daquela versão (não só o texto da ação), com "‹ Versão anterior / Próxima versão ›".

### ✅ Critério de pronto
Criar documento → desativar com justificativa → reativar → ver as 3 versões na aba Auditoria, navegando pelo conteúdo de cada uma. E não existir nenhuma forma de apagar nada.

---

## Fase 4 — Assinatura

**Objetivo:** coletar assinaturas conforme os papéis exigidos por tipo.

### ⚠️ Antes de começar

A decisão de método **ainda está aberta** (`CLAUDE.md` §6) e depende de resposta da GERSA. **Isso não bloqueia esta fase** — o schema foi desenhado agnóstico ao método de propósito.

**Implemente "presencial reforçado" primeiro.** É o caminho mais provável e o único viável para o paciente (regra 9 do Regimento Interno proíbe celular ao residente — evidência documental).

```prisma
model Assinatura {
  id              String    @id @default(uuid())
  versaoId        String?
  linhaId         String?                   // assinatura por linha em FOLHA_TABELA
  papel           PapelAssinante
  metodo          MetodoAssinatura          // PRESENCIAL_REFORCADO | GOV_BR | ICP_BRASIL
  nomeAssinante   String
  documentoAssinante String?                // CPF

  // presencial reforçado
  testemunhaId    String?                   // profissional autenticado
  tracoBiometrico Json?                     // pontos, pressão, timing
  hashConteudo    String                    // do que foi exibido no momento
  ip              String?
  userAgent       String?

  // gov.br / icp
  arquivoAssinado String?

  assinadoEm      DateTime  @default(now())
}
```

### 4.2 Tarefas

- [ ] Captura de assinatura em canvas (touch/stylus) — **capturar pressão e timing**, não só a imagem
- [ ] Testemunha: profissional logado confirma presencialmente
- [ ] Hash do conteúdo exibido no momento da assinatura
- [ ] IP e user-agent do dispositivo
- [ ] Status vira `ASSINADO` só quando **todos** os papéis obrigatórios do tipo assinaram
- [ ] Fluxo alternativo: baixar PDF → assinar externo → reanexar (para GOV.BR, quando aplicável)

> A tela `SignatureScreen.tsx` do protótipo tem canvas de assinatura. Foi marcada como "modelo abandonado", mas com a decisão da §6 revertida, **vale olhar como referência de captura** — só não copie a lógica de negócio.

### ✅ Critério de pronto
Documento com 3 assinantes (Termo de Acolhimento) só vira `ASSINADO` depois das 3 assinaturas, cada uma com testemunha e hash registrados.

---

## Fase 5 — PDF

**Objetivo:** gerar o documento em A4 timbrado — é o que a auditoria recebe.

### 5.1 Como fazer

**Puppeteer no backend**, renderizando a mesma página HTML que o front já mostra. Vantagem: um só lugar define a aparência do documento.

```
GET /documentos/:id/pdf
  → Nest renderiza HTML do documento (mesmo template do front)
  → Puppeteer converte para PDF A4
  → registra versão PDF_BAIXADO na auditoria
```

> ❌ **Não use `window.print()`** como o protótipo. Não é PDF real e não serve para o fluxo de assinatura.

### 5.2 Os três cabeçalhos

`CLAUDE.md` §8.1-d: o layout é **por emissor**, não global.

| Emissor | Cabeçalho |
|---|---|
| Institucional completo | logo LUZ NO VALE + endereço + presidente/vice |
| Institucional simples | só logo |
| **Estadual** | brasão SC + 6 linhas da hierarquia da Secretaria |

O rodapé institucional completo está na Evolução Geral (`08-evolucao-geral.jpg`) — use como referência.

### 5.3 Tarefas

- [ ] Template A4 com CSS de impressão (`@page`, margens, quebra)
- [ ] Layout por emissor
- [ ] Renderização de `FOLHA_TABELA` como folha completa
- [ ] **Exportar prontuário inteiro** de um paciente em PDF único, com a capa "PRONTUÁRIO" como folha de rosto — *é isto que resolve a dor da auditoria mensal*
- [ ] Upload de imagens de cabeçalho/rodapé (tela de Layout)

### ✅ Critério de pronto
Gerar o prontuário completo de um paciente em PDF e comparar lado a lado com a pasta física. Deve estar reconhecível para quem faz a auditoria hoje.

---

## Fase 6 — Dashboard e Equipe

**Objetivo:** o resto do sistema. Só depois que o núcleo funciona.

- [ ] Dashboard: 4 indicadores, documentos do mês, quadro de avisos, últimos documentos, aniversariantes
- [ ] Central de Documentos: busca e filtros por paciente/tipo/status/responsável
- [ ] Gestão de equipe: CRUD de profissionais, ativo/inativo
- [ ] **Permissões granulares** — o modelo `Permission` do protótipo (`types.ts`) já está bem desenhado, aproveite. Note: **não existe `canEditDocuments`** e isso é proposital
- [ ] Log administrativo por membro
- [ ] Configurações: perfil, senha, notificações, layout institucional

> Indicador extra que vale a pena, agora que sabemos das fases: **quantos pacientes em cada fase do tratamento**. Não estava no protótipo, saiu do mapeamento.

---

## Fase 7 — Validação e banca

- [ ] Seed de demonstração com dados fictícios realistas (**nunca dados reais de acolhido**)
- [ ] Testes dos fluxos críticos: imutabilidade, assinatura completa, geração de PDF
- [ ] Validar com a instituição: sentar com a equipe e deixar **eles** cadastrarem um paciente
- [ ] Ajustes do feedback
- [ ] Template acadêmico preenchido
- [ ] Roteiro de demonstração (ver abaixo)

### Roteiro sugerido de demo (8 min)

1. **O problema** — mostre a foto de um documento real com data chumbada e erro de digitação
2. **Cadastrar paciente** — só o nome, mostrando que o resto é opcional
3. **Criar documento** — e revelar que o formulário veio do banco, não de código
4. **Cadastrar um tipo novo na hora** — sem deploy. *Este é o momento que impressiona.*
5. **Tentar editar** — mostrar que não existe o botão, e que a API recusa
6. **Assinar** — presencial com testemunha, explicando a base legal
7. **Exportar prontuário completo** — "isto é o que o auditor recebe hoje em papel"

---

## Dependências das perguntas em aberto

As 5 perguntas bloqueantes com a instituição (`documentos-mapeados.md`) **não travam o início**. O que trava o quê:

| Pergunta | Bloqueia | Dá para começar sem? |
|---|---|---|
| Falta o PIA / documentação médica? | Seed completo | ✅ Sim — motor genérico absorve depois |
| Os 2 Termos de Ressocialização são um ou dois? | Seed desses 2 tipos | ✅ Sim |
| Atividades Práticas é por paciente? | Modelagem desse 1 tipo | ✅ Sim |
| Quais a auditoria exige? | Priorização do seed | ✅ Sim |
| **GERSA aceita assinatura eletrônica?** | **Fase 4** | ⚠️ Implemente presencial reforçado — o schema é agnóstico |

**Conclusão: comecem a Fase 0 hoje.** Nada depende dessas respostas. Mas **mandem as perguntas hoje também** — resposta de instituição demora, e vocês vão precisar delas na Fase 2.

---

## Divisão sugerida para 4 pessoas

| Pessoa | Trilha | Fases |
|---|---|---|
| A | **Backend / dados** — Prisma, migrations, motor de documentos no Nest | 0, 2, 3 |
| B | **Frontend / motor** — renderizador genérico de formulário e visualização | 2, 5 |
| C | **Auth, equipe, permissões, dashboard** | 0, 6 |
| D | **Seed, PDF, validação com a instituição, documentação acadêmica** | 2.6, 5, 7 |

**Nas Fases 0 e 1 trabalhem juntos** — todo mundo precisa entender o schema. A partir da Fase 2 as trilhas separam.

**A pessoa D é a ponte com a instituição.** Perseguir as respostas das perguntas abertas é trabalho real e no caminho crítico — não é "a sobra".

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Antídoto |
|---|---|---|
| **Codar tipo por tipo** | `if (tipo === '…')` aparecendo | Volte para "A ideia central". É o erro que mata o projeto. |
| **Deixar PDF para o fim** | Fase 5 nunca chega | O PDF *é* a entrega para a auditoria. Faça um protótipo feio dele já na Fase 2. |
| **Esperar as respostas da instituição** | Ninguém codando | Nada bloqueia as Fases 0–3. |
| **Reescrever o protótipo** | Semanas em CSS | Copie `ui/`, use as telas como referência visual, siga em frente. |
| **Escopo inflando** | "e se tivesse agenda?" | Área familiar, agenda e relatórios estão **fora de escopo** (§5). Anote como trabalho futuro no TCS. |
| **Dado real de paciente no repo** | Foto preenchida commitada | `.gitignore` cobre `uploads/`, mas foto vai para `mapeamento/`. **Só documento em branco.** |
| **Permitir editar "só um pouquinho"** | Um `PATCH` inocente | §7 é inegociável. Teste automatizado que garanta. |

---

## Onde cada coisa está documentada

| Preciso saber… | Está em |
|---|---|
| Campos de um documento específico | `documentos-mapeados.md` |
| Regras de negócio e decisões | `CLAUDE.md` |
| Lacunas do modelo a resolver | `CLAUDE.md` §8.1 |
| Como o papel realmente é | `mapeamento/fotos/*.jpg` |
| Rascunho de schema do time | `rascunho-tabelas-2.txt` |
| Referência de UX | `export-figma-make/src/app/components/screens/` |
| **Ordem de execução** | este arquivo |

---

## Primeira semana — concreto

Se a equipe está lendo isto hoje e quer começar agora:

**Dia 1** — Fechar as 5 decisões da Fase 0.1 e registrar no `CLAUDE.md` §13. Enviar as 5 perguntas bloqueantes para a instituição.
**Dia 2** — Repo, monorepo, Docker Compose com Postgres subindo.
**Dia 3** — Nest + Prisma + primeira migration. Next + componentes `ui/` migrados.
**Dia 4** — Login funcionando de ponta a ponta.
**Dia 5** — Model `Paciente` + cadastro simples salvando no banco.

Ao fim da semana vocês têm uma **fatia vertical** — login → cadastrar paciente → ver na lista. Toda a stack validada. A partir daí é só engrossar.

> **Fatia vertical fina antes de qualquer camada grossa.** Cinco camadas perfeitas que não se conversam valem menos que um fluxo feio que funciona ponta a ponta.
