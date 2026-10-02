# Instruções para o Codex — novo processo de assinatura e schema do banco

> **Para quem é este arquivo:** um agente de codificação (Codex) que vai trabalhar no repositório oficial do projeto **Reabilitah / sistema-luz-do-vale** e **não participou** das conversas em que as decisões abaixo foram tomadas. Este arquivo é autossuficiente: tudo que você precisa saber está aqui.
>
> **Este arquivo é só o roteiro da tarefa.** Não o commite; apague-o ao terminar, ou mantenha-o fora do controle de versão.

---

## 1. O que você precisa fazer

Duas decisões foram tomadas fora do repositório e chegam junto com este arquivo:

1. **A regra de negócio de assinatura de documentos mudou** (14/09/2026). Os documentos do repositório (`docs/` e alguns arquivos soltos) ainda descrevem o processo antigo. → Seções 2 e 3.
2. **O schema do banco foi consolidado** em `docs/schema.sql`, que chega como arquivo novo. Ele substitui os rascunhos e contradiz trechos dos guias. → Seções 4 e 5.

Sua tarefa é **atualizar a documentação** para refletir as duas coisas.

**Escopo:** apenas arquivos de documentação, mais o `docs/schema.sql` que vem pronto. **Não altere código** de `frontend/`, `backend/`, `referencia-back/`, `referencia-frontend/` nem o protótipo em `docs/export-figma-make/` — ele é histórico e serve de referência de UX; as telas dele continuam como estão. **Não altere o `docs/schema.sql`**: ele é a fonte, e os docs é que se ajustam a ele.

---

## 2. O processo novo (a mudança)

O processo de assinatura passa a ser, para **todos** os assinantes e **todos** os tipos de documento:

```
1. Criar documento        profissional preenche no sistema → documento salvo, conteúdo imutável
2. Baixar documento       sistema gera o PDF A4 timbrado daquela versão
3. Imprimir documento     impressão em papel
4. Assinar manualmente    assinantes assinam a caneta, presencialmente, no papel
5. Digitalizar documento  scanner ou foto do papel assinado
6. Jogar no sistema       upload da digitalização, vinculada à versão do documento → status "Assinado"
```

Em uma frase: **o sistema não captura assinatura nenhuma.** Ele gera o PDF para impressão e guarda a digitalização do papel assinado.

### O que existia antes nos docs (e agora está errado)

Os documentos descrevem duas propostas, ambas **descartadas**:

1. **Fluxo 100% GOV.BR** — baixar o PDF, assinar no portal GOV.BR, reanexar o PDF assinado.
2. **"Presencial reforçado"** — capturar o traço da assinatura num tablet (canvas), com testemunha autenticada no sistema, metadados biométricos do traço (pressão, tempo), hash do conteúdo exibido, IP e dispositivo; com GOV.BR/ICP-Brasil reservado a documentos que exigissem "método forte".

Tudo isso sai. Junto saem: `METODO_ASSINATURA`, a tabela `ASSINATURA` por assinante, a flag `EXIGE_METODO_FORTE`, as flags `REQUER_ASSINATURA_PACIENTE/RESPONSAVEL/PROFISSIONAL`, captura por canvas, biometria de traço e testemunha autenticada.

### Por que mudou (use estas justificativas ao escrever os docs)

- **Viabilidade para o paciente:** o Regimento Interno da instituição, **regra nº 9**, diz textualmente *"É proibido ao residente o uso de aparelho celular e fones de ouvido"* (foto em `docs/mapeamento/fotos/05-regimento-interno.jpg`). Assinar via GOV.BR exige conta Prata/Ouro e segundo fator no celular **no momento de assinar**, então é inviável para o acolhido.
- **É o processo que a instituição e o órgão auditor já conhecem.** Os documentos já são assinados a caneta hoje. O sistema não muda o ato de assinar: ele elimina o preenchimento manual em Word (datas chumbadas, erros de digitação) e resolve guarda, busca, histórico e exportação.
- **Remove a incerteza jurídica.** As propostas anteriores dependiam de a GERSA (órgão auditor) aceitar assinatura eletrônica e do valor probatório de um traço capturado em tela (MP 2.200-2/2001 e Lei 14.063/2020: assinatura simples não tem presunção de veracidade). Assinatura de próprio punho em papel não depende disso.
- **Reduz o escopo técnico.** O esforço vai para o motor de documentos e para o PDF.

### Consequências que os docs precisam refletir

| Tema | Como fica |
|---|---|
| Papéis de assinante (são 7: Acolhido, Responsável, Monitor Responsável, Enfermeiro, Profissional Responsável, Representante da CT, Testemunha) | Continuam existindo, mas agora servem só para **imprimir as linhas de assinatura com o rótulo certo no PDF**. Não geram registro de assinatura por pessoa no banco. |
| "Acolhido/Testemunha" (Declaração de Desligamento do Estado) | É **uma única linha de assinatura** com esse rótulo, não dois assinantes obrigatórios. |
| Ordem das fases de implementação | **PDF passa a vir antes de Assinatura**: sem PDF não há o que imprimir e assinar. |
| PDF | Vira peça central: A4 fiel, estável entre downloads, com **código do documento + versão no rodapé**, para conferir a digitalização com a versão impressa. |
| Baixar PDF | É **evento** de auditoria; não muda conteúdo nem status. |
| Anexar digitalização | Aceita **PDF ou imagem** (pode ser foto). Vincula à versão, guarda hash, autor do envio e data. Só depois de persistido o status vira "Assinado". |
| Digitalização errada ou ilegível | Envia-se outra **com justificativa obrigatória**; a anterior **nunca é apagada** (regra de imutabilidade da seção 7 do CLAUDE.md). |
| Guarda do papel original | **Ponto em aberto.** Recomendação: manter o arquivo físico. Descartar o original de prontuário exigiria cumprir a Lei 13.787/2018. |
| Pergunta antiga "a GERSA aceita assinatura eletrônica?" | Deixa de existir. Vira: **"a GERSA aceita a cópia digitalizada ou confere o papel original?"** |
| Questão CFM / certificação SBIS | Deixa de se aplicar à assinatura, porque o sistema não assina nada. O que sobra é a guarda do papel (Lei 13.787/2018). |
| Folhas-tabela com assinatura por linha (Evolução de Enfermagem, Controle de Saída) | **Ponto em aberto:** quando a folha é impressa e digitalizada. No Controle de Saída, residente e responsável só estão juntos no momento da saída. |

### Glossário de tradução (aplique em qualquer trecho que encontrar, mesmo fora da lista de arquivos)

| Onde aparecer | Troque por |
|---|---|
| "assinatura via GOV.BR", "assinar no portal" | "assinatura manuscrita no papel impresso" |
| "presencial reforçado" | "assinatura manuscrita + digitalização anexada" |
| "anexar PDF assinado (GOV.BR)" | "anexar digitalização do documento assinado" |
| "captura de assinatura", "canvas", "traço", "biometria", "testemunha autenticada" | remover: não existe mais |
| "método de assinatura", "método forte", `EXIGE_METODO_FORTE`, `METODO_ASSINATURA` | remover: só existe um método |
| tabela `ASSINATURA` (por assinante) | registro de arquivo do documento (`DOCUMENTO_ARQUIVO`): PDF gerado + digitalizações |

**Cuidado com a palavra "manuscrita":** nos docs antigos ela significava *assinatura desenhada na tela (canvas)*. No processo novo significa *assinada a caneta no papel*. Ao reescrever, deixe claro qual é qual, principalmente no histórico das propostas descartadas.

---

## 3. Arquivo por arquivo

Trate os blocos `ANTES` como **texto a localizar** — se não bater caractere a caractere, localize pelo sentido — e os blocos `DEPOIS` como **o texto final**.

---

### 3.1 `docs/CLAUDE.md`

#### (a) Seção 5, tabela "Decisões já tomadas": substituir duas linhas

ANTES:

```
| Assinatura manuscrita (desenho na tela/tablet) | **Revertida a decisão do protótipo.** Não é mais "removida definitivamente" — ver seção 6, é o caminho mais provável para o paciente. |
| Método de assinatura (GOV.BR vs. presencial vs. híbrido) | **Em aberto — ver seção 6.** Direção mais provável (e reforçada pelo mapeamento): presencial reforçado como padrão, GOV.BR reservado a casos que exijam nível forte. Falta a resposta da GERSA sobre aceitar assinatura eletrônica. |
```

DEPOIS:

```
| Método de assinatura | **Decidido em 14/09/2026 — ver seção 6.** Assinatura **manuscrita em papel** com anexo da digitalização: criar documento → baixar PDF → imprimir → assinar à mão → digitalizar → anexar no sistema. Vale para **todos** os assinantes e tipos de documento. |
| Assinatura eletrônica (GOV.BR, desenho na tela/tablet, "presencial reforçado") | **Descartada.** Nenhuma assinatura é capturada pelo sistema. As propostas anteriores ficam só como histórico na seção 6. |
```

#### (b) Seção 6 inteira: substituir

Apague **tudo** entre o título `## 6. Fluxo de assinatura — DECISÃO EM ABERTO (reabriu depois da análise de viabilidade)` e a linha `## 7. Regra absoluta: documentos são imutáveis, nada é apagado` (exclusive). Escreva no lugar, **na íntegra**, o texto abaixo:

`````markdown
## 6. Fluxo de assinatura — DECIDIDO (14/09/2026): assinatura manuscrita + digitalização

**Decisão de negócio:** o sistema **não captura assinatura**. Todo documento que exige assinatura segue o mesmo processo, para qualquer assinante (acolhido, responsável, testemunha, profissionais) e qualquer tipo de documento (institucional ou estadual):

```
1. Criar documento        profissional preenche no sistema → documento salvo, conteúdo imutável
2. Baixar documento       sistema gera o PDF A4 timbrado daquela versão
3. Imprimir documento     impressão em papel
4. Assinar manualmente    assinantes assinam a caneta, presencialmente, no papel
5. Digitalizar documento  scanner ou foto do papel assinado
6. Jogar no sistema       upload da digitalização, vinculada à versão do documento → status "Assinado"
```

### Por que essa decisão

- **Viável para o paciente.** O Regimento Interno, **regra nº 9**, diz: *"É proibido ao residente o uso de aparelho celular e fones de ouvido."* (`mapeamento/fotos/05-regimento-interno.jpg`). Assinar via GOV.BR exige conta Prata/Ouro e segundo fator no celular na hora de assinar, o que torna esse caminho inviável para o acolhido.
- **É o processo que a instituição e o órgão auditor já conhecem.** Os 4 formulários da GERSA e os documentos institucionais já são assinados a caneta hoje. O sistema não muda o ato de assinar. Ele elimina o preenchimento manual em Word (datas chumbadas, erros de digitação, ver seção 3) e resolve guarda, busca, histórico e exportação.
- **Remove a principal incerteza jurídica.** As propostas anteriores dependiam de a GERSA aceitar assinatura eletrônica e de o traço capturado em tela ter valor probatório (MP 2.200-2/2001 e Lei 14.063/2020: assinatura simples sem presunção de veracidade). Assinatura de próprio punho em papel não depende de nenhuma dessas respostas.
- **Reduz o escopo técnico.** Não há canvas de assinatura, biometria de traço, testemunha autenticada, integração GOV.BR/ICP-Brasil nem hash do conteúdo exibido na tela. O esforço vai para o motor de documentos e para o PDF, que passa a ser peça central do fluxo.

### Regras do fluxo

- **O PDF gerado é parte do registro.** Ele é gerado a partir do conteúdo imutável da versão e deve trazer no rodapé **código do documento + número da versão** (ex.: `DOC-000123 · v1`), para que a digitalização possa ser conferida com a versão impressa. Recomendação: armazenar o PDF gerado com seu hash, para que todo novo download devolva exatamente o mesmo arquivo.
- **Baixar/imprimir não altera o documento.** O download é registrado na auditoria como evento (quem baixou e quando), mas não muda conteúdo nem status.
- **Anexar a digitalização conclui a assinatura.** O upload fica vinculado à versão, com autor e data/hora do envio e hash do arquivo. O status só vira "Assinado" depois que o backend persiste o anexo.
- **Anexo errado ou ilegível não é apagado.** Envia-se nova digitalização com justificativa. A anterior fica preservada no histórico (seção 7).
- **Quem anexa é o profissional logado**, que declara que o papel foi assinado. O sistema não verifica a assinatura em si. A conferência é humana, como no papel hoje.
- **Documentos sem assinantes** (ex.: Avaliação de Enfermagem, Evolução Geral, que não têm linha de assinatura no papel) não passam por este fluxo: o autor e a data/hora registrados pelo sistema bastam. Status de conclusão para esses casos: ver seção 13.
- **Os papéis de assinante continuam importantes** (seção 8.1-c), mas agora servem para **imprimir as linhas de assinatura corretas no PDF** ("Assinatura do Acolhido/Testemunha", "Representante da Comunidade Terapêutica" etc.). Eles não geram mais um registro de assinatura por pessoa no banco.

Máquina de estados do documento:

```
Criar documento → Preencher → Salvar
  ↓
Status: "Pendente de assinatura"   (tipo com linhas de assinatura; conteúdo imutável)
  ↓
Baixar PDF → imprimir → assinar a caneta → digitalizar     (fora do sistema, exceto o evento de download)
  ↓
Anexar digitalização vinculada à versão
  ↓
Status: "Assinado"
```

- Um documento **desativado** não pode ser editado. Para voltar a ser utilizável precisa ser **reativado**, o que sempre gera nova versão e volta o status para "Pendente de assinatura", exigindo nova impressão, assinatura e digitalização. *(A necessidade de nova assinatura na reativação, já que o conteúdo não muda, está em discussão; ver seção 13.)*

### Pontos ainda em aberto dentro desta decisão

- ❓ **O papel original precisa ser guardado?** A digitalização é uma cópia. Descartar o original de prontuário exige cumprir a Lei 13.787/2018 (digitalização com garantia de integridade e autenticidade, com certificado ICP-Brasil ou padrão legalmente aceito, e análise de comissão de revisão de prontuários). **Recomendação: manter o arquivo físico** e tratar o sistema como fonte de consulta, organização e auditoria. Confirmar com orientador e instituição.
- ❓ **A GERSA aceita a cópia digitalizada na auditoria mensal**, ou confere o papel original? A pergunta antiga ("aceita assinatura eletrônica?") deixou de existir. Qualquer que seja a resposta, o sistema continua útil, mas ela define se a exportação do prontuário em PDF substitui ou só acompanha a pasta física.
- ❓ **Folhas-tabela com assinatura por linha** (Evolução de Enfermagem, Controle de Saída, ver 8.1-a): no papel, cada linha é assinada no momento do registro. Com impressão e digitalização, é preciso definir quando a folha é impressa e digitalizada (por registro, ao fechar a folha ou por período). Controle de Saída é o caso mais sensível: residente e responsável só estão presentes no momento da saída. **Decisão pendente com a instituição.**

### Histórico: propostas descartadas

Registrado para a banca poder explicar a evolução da decisão:

1. **Assinatura desenhada em canvas na tela** (protótipo, `SignatureScreen.tsx`): removida no último prompt de refinamento do protótipo.
2. **100% GOV.BR** (baixar PDF → assinar no portal → reanexar): inviável para o paciente pela regra 9 do Regimento.
3. **"Presencial reforçado"** (traço em tablet + testemunha autenticada + biometria + hash + IP), com GOV.BR para casos de "método forte": dependia de a GERSA aceitar assinatura eletrônica e trazia risco de valor probatório e escopo técnico alto.
4. **Decisão final (14/09/2026):** assinatura manuscrita em papel + digitalização anexada. Aproveita o formato "baixar → assinar fora → anexar" do protótipo, trocando o GOV.BR pela caneta e pelo scanner.

`````

#### (c) Seção 7, regra da imutabilidade: dois marcadores

ANTES:

```
- Se uma informação está errada, a solução é criar um **novo documento** ou seguir o fluxo de nova versão (anexar PDF assinado, desativar+reativar), nunca sobrescrever.
- **Nunca excluir definitivamente**: documentos, versões, PDFs, auditorias, justificativas, ou profissionais que já agiram no sistema. "Ocultar/Desativar" ≠ "Excluir".
```

DEPOIS:

```
- Se uma informação está errada, a solução é criar um **novo documento** ou seguir o fluxo de nova versão (desativar+reativar), nunca sobrescrever. Anexar a digitalização assinada não altera o conteúdo; só registra o anexo e muda o status.
- **Nunca excluir definitivamente**: documentos, versões, PDFs gerados, digitalizações anexadas (inclusive as substituídas por uma nova), auditorias, justificativas, ou profissionais que já agiram no sistema. "Ocultar/Desativar" ≠ "Excluir".
```

#### (d) Seção 8, item `DocumentVersion`: acrescentar a nota final

Mantenha o marcador como está e acrescente, ao fim dele:

```
*(No fluxo decidido na seção 6, `pdf-downloaded` = download do PDF para impressão e `pdf-attached` = anexo da digitalização do papel assinado a caneta, não mais PDF assinado via GOV.BR.)*
```

#### (e) Seção 8, item `Permission`: trecho de Documentos

ANTES:

```
Documentos (visualizar/criar/desativar/ver desativados/reativar/ver auditoria/ver versões/exportar PDF/baixar PDF/anexar PDF assinado/finalizar — **note: não existe `canEditDocuments`, foi removido de propósito**)
```

DEPOIS:

```
Documentos (visualizar/criar/desativar/ver desativados/reativar/ver auditoria/ver versões/exportar PDF/baixar PDF para impressão/anexar digitalização assinada/finalizar — **note: não existe `canEditDocuments`, foi removido de propósito**; no protótipo o rótulo ainda é "Anexar PDF assinado (GOV.BR)")
```

#### (f) Seção 8.1, item (a) folhas-tabela: "Modelo proposto"

ANTES:

```
**Modelo proposto:** `TIPO_DOCUMENTO.FORMATO` = `folha_unica` | `folha_tabela`. Para `folha_tabela`, cada linha é um registro imutável próprio (tabela `DOCUMENTO_LINHA`, com autor, data/hora e assinaturas individuais); a "folha" existe apenas como **visão agregada na geração do PDF A4** para a auditoria. Assim a regra de imutabilidade da seção 7 vale por linha — uma linha assinada nunca muda — e o auditor continua recebendo o documento no formato que conhece.
```

DEPOIS:

```
**Modelo proposto:** `TIPO_DOCUMENTO.FORMATO` = `folha_unica` | `folha_tabela`. Para `folha_tabela`, cada linha é um registro imutável próprio (tabela `DOCUMENTO_LINHA`, com autor e data/hora); a "folha" existe apenas como **visão agregada na geração do PDF A4** para a auditoria. Assim a regra de imutabilidade da seção 7 vale por linha e o auditor continua recebendo o documento no formato que conhece.

⚠️ **Impacto da assinatura manuscrita (seção 6):** as assinaturas por linha acontecem no papel. Falta definir quando a folha é impressa e digitalizada (a cada registro, ao fechar a folha ou por período) e se a tabela `DOCUMENTO_LINHA` continua necessária. Ver seção 13.
```

#### (g) Seção 8.1, item (c) papéis de assinante: parágrafo final

ANTES:

```
"Representante da CT" não é "qualquer profissional": é quem responde pela instituição perante o Estado. E **"Testemunha" já existe no formulário oficial do órgão auditor** (a linha é *"Assinatura do Acolhido/Testemunha"*), o que dá respaldo direto ao modelo de assinatura presencial reforçada da seção 6.

**Modelo proposto:** enum/tabela `PAPEL_ASSINANTE` + tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis exigidos por tipo, com flag de obrigatoriedade), em vez de um campo único em `TIPO_DOCUMENTO`.
```

DEPOIS:

```
"Representante da CT" não é "qualquer profissional": é quem responde pela instituição perante o Estado. E **"Testemunha" já existe no formulário oficial do órgão auditor** (a linha é *"Assinatura do Acolhido/Testemunha"*): um papel **alternativo** ao acolhido (fuga, óbito), não um assinante a mais.

**Uso após a decisão da seção 6:** como a assinatura é feita a caneta no papel impresso, os papéis servem para **gerar as linhas de assinatura com o rótulo correto no PDF** e para indicar se o tipo exige assinatura. Não há mais registro de assinatura por pessoa no banco. O modelo antes proposto (`PAPEL_ASSINANTE` + `TIPO_DOCUMENTO_ASSINANTE`) está em reavaliação: pode bastar uma lista de rótulos por tipo. Ver seção 13.
```

#### (h) Seção 9, lista "Achados que mudam o schema", item 3

ANTES:

```
3. **Mais papéis de assinante que os 3 previstos** — além de paciente/responsável/profissional, aparecem **Monitor Responsável**, **Enfermeiro**, **Representante da Comunidade Terapêutica** e **Testemunha**. Exige `PAPEL_ASSINANTE` em `ASSINATURA` e uma tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis por tipo).
```

DEPOIS:

```
3. **Mais papéis de assinante que os 3 previstos** — além de paciente/responsável/profissional, aparecem **Monitor Responsável**, **Enfermeiro**, **Representante da Comunidade Terapêutica** e **Testemunha**. Com a assinatura manuscrita (seção 6), esses papéis definem as linhas de assinatura impressas no PDF de cada tipo.
```

#### (i) Seção 9.1, processo de mapeamento: frase de objetivo e linha da tabela

ANTES (frase de objetivo):

```
Objetivo: sair da pilha de papel com uma planilha (uma linha por tipo de documento) que já responde tudo que o schema (`TIPO_DOCUMENTO`, `CAMPO_TIPO_DOCUMENTO`, `ASSINATURA`) precisa saber. Colunas sugeridas:
```

DEPOIS:

```
Objetivo: sair da pilha de papel com uma planilha (uma linha por tipo de documento) que já responde tudo que o schema (`TIPO_DOCUMENTO`, `CAMPO_TIPO_DOCUMENTO` e linhas de assinatura do PDF) precisa saber. Colunas sugeridas:
```

ANTES (duas linhas da tabela de colunas):

```
| Quem assina | Nenhum assinante / Paciente / Responsável / Profissional / mais de um — **é aqui que aparecem os casos "alguém além do paciente assina" ou "múltiplos assinantes"** |
| Assinatura precisa ser "forte"? | Se o documento é estritamente prontuário médico assinado pelo psiquiatra (possível caso CFM — ver seção 6) ou se presencial reforçado basta |
```

DEPOIS:

```
| Quem assina | Nenhum assinante / Paciente / Responsável / Profissional / mais de um — **é aqui que aparecem os casos "alguém além do paciente assina" ou "múltiplos assinantes"**. Anotar o rótulo exato da linha de assinatura do papel (vai para o PDF) |
| ~~Assinatura precisa ser "forte"?~~ | **Obsoleta desde 14/09/2026.** Toda assinatura é manuscrita no papel impresso (seção 6). A coluna foi preenchida no lote de 08/09 e não precisa ser respondida nos próximos |
```

#### (j) Seção 10, telas órfãs: ajustar a frase e acrescentar uma subseção

ANTES:

```
`FamilyPortalScreen.tsx`, `MuralScreen.tsx`, `AgendaScreen.tsx`, `ReportsScreen.tsx`, `ProfileSelectionScreen.tsx`, `TimelineScreen.tsx`, `SignatureScreen.tsx` (assinatura manuscrita em canvas — modelo abandonado).
```

DEPOIS (a frase ajustada **mais** a subseção nova logo abaixo dela):

```
`FamilyPortalScreen.tsx`, `MuralScreen.tsx`, `AgendaScreen.tsx`, `ReportsScreen.tsx`, `ProfileSelectionScreen.tsx`, `TimelineScreen.tsx`, `SignatureScreen.tsx` (assinatura em canvas — modelo abandonado; a decisão final é assinatura a caneta no papel, seção 6).

### O que reaproveitar do fluxo de assinatura do protótipo

`DocumentViewScreen.tsx` já tem o formato do fluxo decidido: banner "Aguardando assinatura", botão **"Baixar PDF para assinatura"**, modal **"Anexar PDF assinado"** e eventos `pdf-downloaded`/`pdf-attached` na auditoria. Reaproveitar a UX trocando os textos de GOV.BR pelo processo manual (ex.: *"Baixe o PDF, imprima, colete as assinaturas a caneta, digitalize o papel e anexe o arquivo aqui"*) e aceitando imagem além de PDF, já que a digitalização pode ser foto. Textos com GOV.BR no protótipo que ficam obsoletos: `DocumentFormScreen.tsx` ("enviá-lo para assinatura via GOV.BR"), `DocumentViewScreen.tsx` ("Documento assinado via GOV.BR", "Assinatura via GOV.BR") e `TeamScreen.tsx` ("Anexar PDF assinado (GOV.BR)").
```

#### (k) Seção 11, protótipo como referência de UX: dois marcadores e uma linha de tabela

ANTES (fim do marcador sobre geração de PDF):

```
No sistema real isso deve virar geração de PDF no backend (ex.: Puppeteer, pdf-lib, ou similar), especialmente porque o PDF gerado precisa ser **anexável/verificável** no fluxo de assinatura GOV.BR.
```

DEPOIS:

```
No sistema real isso deve virar geração de PDF no backend (ex.: Puppeteer, pdf-lib, ou similar), especialmente porque **o PDF é o que vai para a impressora e para a caneta** no fluxo de assinatura (seção 6): precisa ser A4 fiel, estável entre downloads e identificado com código do documento + versão no rodapé.
```

ANTES (marcador sobre `Signature`):

```
- `Signature` (interface com `method: 'presencial' | 'gov-br'`) é um resíduo do modelo antigo de assinatura manuscrita — no fluxo atual a assinatura em si não é mais capturada como imagem/traço, só o PDF assinado anexado. Ao desenhar o schema real, considerar se ainda faz sentido manter uma entidade "Signature" separada ou se basta a versão do documento com `action: 'pdf-attached'` + nome do arquivo.
```

DEPOIS:

```
- `Signature` (interface com `method: 'presencial' | 'gov-br'`) é resíduo dos modelos descartados. Com a decisão da seção 6, a assinatura não é capturada pelo sistema, só a digitalização do papel assinado é anexada. **Não criar entidade "Signature" por assinante**: basta registrar o anexo vinculado à versão do documento (equivalente a `action: 'pdf-attached'` + arquivo). Detalhe na discussão de tabelas (seção 13).
```

Na tabela "Divergências concretas entre o protótipo e os documentos reais", acrescente uma linha depois da linha dos 3 papéis de assinante:

```
| Assinatura via GOV.BR (baixar → assinar no portal → anexar) | Assinatura a caneta no papel impresso → digitalizar → anexar (seção 6) |
```

#### (l) Seção 12, fontes originais: duas correções

No marcador sobre os prompts do protótipo, troque `remove assinatura manuscrita` por `remove assinatura em canvas` e acrescente ao fim do marcador:

```
**Exceção:** o fluxo GOV.BR desse prompt foi substituído pela assinatura manuscrita + digitalização (seção 6).
```

ANTES (marcador do `rascunho-tabelas-2.txt`):

```
- `rascunho-tabelas-2.txt` — evolução desse rascunho incorporando versionamento de documento (`DOCUMENTO_VERSAO`) e o modelo de assinatura desacoplado do método (`ASSINATURA`, `METODO_ASSINATURA`, flags em `TIPO_DOCUMENTO`) — ver seção 6. **Ainda não é o schema final:** o mapeamento já rodou (seção 9) e apontou 6 lacunas estruturais a incorporar antes de fechar — ver seção 8.1.
```

DEPOIS:

```
- `rascunho-tabelas-2.txt` — evolução desse rascunho incorporando versionamento de documento (`DOCUMENTO_VERSAO`) e um modelo de assinatura desacoplado do método (`ASSINATURA`, `METODO_ASSINATURA`, flags em `TIPO_DOCUMENTO`). **Esse modelo de assinatura ficou obsoleto** com a decisão da seção 6 (itens marcados no próprio arquivo). **Ainda não é o schema final:** o mapeamento já rodou (seção 9) e apontou lacunas estruturais a incorporar antes de fechar (seção 8.1), e a necessidade de cada tabela está em revisão (seção 13).
```

#### (m) Seção 13, "Em aberto / próximos passos": substituir itens

ANTES (os itens abaixo, na ordem em que aparecem):

```
- [ ] **Validar as 15 perguntas do mapeamento com a instituição** (lista no fim de `documentos-mapeados.md`). As 5 bloqueantes: (1) falta o PIA e documentação médica? (2) os dois Termos de Ressocialização são tipos distintos ou versões? (3) Atividades Práticas é por paciente ou escala coletiva? (4) quais dos 17 a auditoria realmente exige? (5) a GERSA aceita assinatura eletrônica?
```
```
- [ ] **Travar o método de assinatura** (seção 6) — a direção "presencial reforçado" saiu reforçada pelo mapeamento (regra 9 do regimento + testemunha no formulário do Estado + ausência de registro psiquiátrico), mas depende da resposta da GERSA sobre aceitar assinatura eletrônica e da confirmação de que não há documentação médica fora do lote.
- [ ] **Reavaliar o modelo de "documento" no schema** para acomodar as folhas-tabela acumulativas (achado 1 da seção 9) — afeta `DOCUMENTO_VERSAO` e exige provavelmente uma tabela `DOCUMENTO_LINHA`.
```
```
- [ ] **Modelar `PAPEL_ASSINANTE` + `TIPO_DOCUMENTO_ASSINANTE`** (achado 3 da seção 9) — o modelo atual de 3 papéis é insuficiente.
```
```
- [ ] Decidir geração real de PDF (biblioteca no backend NestJS) e como/se ela participa da captura de hash para a assinatura presencial reforçada.
```

DEPOIS (respectivamente):

```
- [ ] **Validar as 15 perguntas do mapeamento com a instituição** (lista no fim de `documentos-mapeados.md`). As 5 bloqueantes: (1) falta o PIA e documentação médica? (2) os dois Termos de Ressocialização são tipos distintos ou versões? (3) Atividades Práticas é por paciente ou escala coletiva? (4) quais dos 17 a auditoria realmente exige? (5) a GERSA aceita a cópia digitalizada ou confere o papel original?
```
```
- [x] ~~**Travar o método de assinatura**~~ — **decidido em 14/09/2026**: assinatura manuscrita em papel + digitalização anexada (seção 6).
- [ ] **Definir a guarda do papel original** após a digitalização (seção 6): recomendação de manter o arquivo físico; confirmar com orientador/instituição (Lei 13.787/2018).
- [ ] **Definir o fluxo de impressão/digitalização das folhas-tabela** (Evolução de Enfermagem, Controle de Saída): por registro, ao fechar a folha ou por período. Isso decide se `DOCUMENTO_LINHA` continua necessária.
- [ ] **Definir a regra de reativação:** reativar exige nova impressão e assinatura mesmo com o conteúdo inalterado, ou reaproveita a digitalização anterior?
- [ ] **Definir o status de conclusão de documentos sem assinantes** (Avaliação de Enfermagem, Evolução Geral): não devem ficar "Pendentes de assinatura" para sempre.
- [ ] **Revisar a necessidade de cada tabela do schema** à luz da assinatura manuscrita. Candidatas a sair: `METODO_ASSINATURA`, `ASSINATURA` (por assinante), `EXIGE_METODO_FORTE`, `REQUER_ASSINATURA_*`. Candidata a entrar: registro de arquivos do documento (PDF gerado + digitalizações).
```
```
- [ ] **Definir como o tipo declara suas linhas de assinatura** (achado 3 da seção 9): tabela `TIPO_DOCUMENTO_ASSINANTE` ou lista de rótulos no próprio tipo.
```
```
- [ ] Decidir geração real de PDF (biblioteca no backend NestJS). O PDF é pré-requisito do fluxo de assinatura: identificação do documento + versão no rodapé, armazenamento do arquivo gerado e hash.
- [ ] Decidir armazenamento dos arquivos (PDFs gerados e digitalizações): disco local, volume do servidor ou storage de objetos, com backup. São dados sensíveis de paciente.
```

---

### 3.2 `docs/GUIA-IMPLEMENTACAO.md`

Este arquivo é a ordem de execução do projeto em fases. **As fases 4 e 5 trocam de lugar:** a Fase 4 passa a ser o PDF e a Fase 5 a Assinatura.

#### (a) "Mapa das fases"

ANTES:

```
FASE 4  Assinatura          presencial reforçado     ▓▓▓▓
FASE 5  PDF                 A4 timbrado + exportação ▓▓▓
```

DEPOIS:

```
FASE 4  PDF                 A4 timbrado + exportação ▓▓▓▓
FASE 5  Assinatura          anexar digitalização     ▓▓
```

E, logo abaixo do diagrama:

ANTES:

```
**Ordem é obrigatória até a Fase 3.** Depois disso, 4, 5 e 6 podem paralelizar entre a equipe.
```

DEPOIS:

```
**Ordem é obrigatória até a Fase 3.** Depois disso, a Fase 6 pode paralelizar com 4 e 5. **A Fase 5 depende da 4**: a assinatura é feita a caneta no PDF impresso (`CLAUDE.md` §6), então sem PDF não há o que assinar.
```

#### (b) Fase 2.1, modelo `TipoDocumento`: remover uma linha

Remova a linha `exigeMetodoForte Boolean @default(false)` do bloco Prisma.

#### (c) Fase 2.1, modelo `TipoDocumentoAssinante`

ANTES:

```
model TipoDocumentoAssinante {
  id          String        @id @default(uuid())
  tipoId      String
  papel       PapelAssinante
  obrigatorio Boolean       @default(true)
  ordem       Int
}
```

DEPOIS:

```
model TipoDocumentoAssinante {           // gera as LINHAS DE ASSINATURA do PDF (assinatura é a caneta)
  id          String        @id @default(uuid())
  tipoId      String
  papel       PapelAssinante
  rotulo      String                     // texto exato do papel: "Assinatura do Acolhido/Testemunha"
  ordem       Int
}
```

E, na citação logo abaixo do bloco, acrescente ao fim:

```
Como a assinatura é manuscrita (`CLAUDE.md` §6), os papéis só servem para imprimir as linhas certas no PDF e saber se o tipo exige assinatura. Se isso justifica tabela própria ou uma lista de rótulos no tipo está em revisão (`CLAUDE.md` §13).
```

#### (d) Fase 2.5, folhas-tabela: modelo `DocumentoLinha` e aviso

No bloco Prisma, remova a linha `assinaturas Assinatura[]  // assinatura POR LINHA` e ponha no lugar o comentário:

```
  // assinatura por linha é feita A CANETA na folha impressa (CLAUDE.md §6)
```

Depois da frase "Na tela: uma tabela onde se adiciona linha. No PDF: a folha inteira, como o auditor conhece", ajuste e acrescente:

```
Na tela: uma tabela onde se adiciona linha. No PDF: a folha inteira, como o auditor conhece, com a coluna de assinatura em branco para a caneta.

> ⚠️ **Em aberto:** quando a folha é impressa e digitalizada (por registro, ao fechar a folha ou por período)? No Controle de Saída, residente e responsável só estão presentes no momento da saída. Essa decisão pode até eliminar `DocumentoLinha` (ex.: uma saída = um documento). Ver `CLAUDE.md` §13. **Deixe as folhas-tabela por último** até isso ser respondido.
```

#### (e) Fase 3.1, enum `AcaoVersao`

ANTES:

```
enum AcaoVersao {
  CRIADO
  PDF_BAIXADO
  PDF_ANEXADO
  DESATIVADO
  REATIVADO
  ASSINADO
}
```

DEPOIS (o enum **mais** a observação logo abaixo do bloco):

```
enum AcaoVersao {
  CRIADO
  PDF_BAIXADO               // download para impressão — evento, não muda conteúdo
  DIGITALIZACAO_ANEXADA     // papel assinado a caneta, digitalizado e enviado → ASSINADO
  DIGITALIZACAO_SUBSTITUIDA // novo anexo no lugar de um ilegível/errado (com justificativa)
  DESATIVADO
  REATIVADO
}
```

```
> Como o conteúdo nunca muda (§3.2), vale discutir se `PDF_BAIXADO` e `DIGITALIZACAO_*` devem ser **eventos** numa tabela própria em vez de "versões" com snapshot repetido. Ver `CLAUDE.md` §13.
```

#### (f) Fase 3.2, regras não negociáveis: último marcador

ANTES:

```
- ✅ Hash do conteúdo calculado na criação da versão — é o que sustenta a assinatura da Fase 4.
```

DEPOIS:

```
- ✅ Hash do conteúdo calculado na criação da versão — é o que garante que o PDF impresso para assinatura (Fases 4 e 5) corresponde àquela versão.
- ✅ Digitalização anexada nunca é apagada; substituição exige justificativa e preserva a anterior.
```

#### (g) Fases 4 e 5: substituir as duas seções inteiras

Apague tudo entre `## Fase 4 — Assinatura` e `## Fase 6 — Dashboard e Equipe` (exclusive) e escreva no lugar, **na íntegra**:

`````markdown
## Fase 4 — PDF

**Objetivo:** gerar o documento em A4 timbrado. É o que vai para a impressora, recebe as assinaturas a caneta e depois chega à auditoria.

> **Por que o PDF vem antes da assinatura:** com o fluxo decidido em `CLAUDE.md` §6 (baixar → imprimir → assinar à mão → digitalizar → anexar), **não existe assinatura sem PDF**. As linhas de assinatura, o timbre e a identificação do documento precisam estar certas no papel antes de alguém assinar.

### 4.1 Como fazer

**Puppeteer no backend**, renderizando a mesma página HTML que o front já mostra. Vantagem: um só lugar define a aparência do documento.

```
GET /documentos/:id/pdf
  → Nest renderiza HTML do documento (mesmo template do front)
  → Puppeteer converte para PDF A4
  → armazena o arquivo gerado + hash (novo download devolve o mesmo arquivo)
  → registra evento PDF_BAIXADO na auditoria
```

> ❌ **Não use `window.print()`** como o protótipo. Não é PDF real e não garante que o papel impresso seja igual entre downloads.

### 4.2 O que o PDF precisa ter para o fluxo de assinatura

- **Rodapé de identificação** em toda página: código do documento + versão (ex.: `DOC-000123 · v1 · pág. 1/2`). É o que permite conferir, na hora de anexar, que a digitalização corresponde àquela versão.
- **Linhas de assinatura com o rótulo exato** do papel, geradas a partir dos papéis do tipo (§2.1): *"Assinatura do Acolhido/Testemunha"*, *"Representante da Comunidade Terapêutica"*, *"Monitor Responsável"*…
- **Espaço real para assinar** (linha longa, margem suficiente) e cidade/data preenchidas pelo sistema, sem o "16 DE MARÇO 2026" chumbado.

### 4.3 Os três cabeçalhos

`CLAUDE.md` §8.1-d: o layout é **por emissor**, não global.

| Emissor | Cabeçalho |
|---|---|
| Institucional completo | logo LUZ NO VALE + endereço + presidente/vice |
| Institucional simples | só logo |
| **Estadual** | brasão SC + 6 linhas da hierarquia da Secretaria |

O rodapé institucional completo está na Evolução Geral (`08-evolucao-geral.jpg`) — use como referência.

### 4.4 Tarefas

- [ ] Template A4 com CSS de impressão (`@page`, margens, quebra)
- [ ] Layout por emissor
- [ ] Rodapé com código + versão + paginação
- [ ] Linhas de assinatura geradas pelos papéis do tipo
- [ ] Armazenar o PDF gerado com hash
- [ ] Renderização de `FOLHA_TABELA` como folha completa
- [ ] **Exportar prontuário inteiro** de um paciente em PDF único, com a capa "PRONTUÁRIO" como folha de rosto — *é isto que resolve a dor da auditoria mensal*. Para documentos assinados, a exportação usa a **digitalização anexada** (Fase 5), não o PDF em branco.
- [ ] Upload de imagens de cabeçalho/rodapé (tela de Layout)

### ✅ Critério de pronto
Imprimir o PDF de um formulário estadual e colocá-lo lado a lado com a foto do papel em branco (`mapeamento/fotos/`). Deve estar reconhecível para quem faz a auditoria hoje e ter espaço para assinar a caneta.

---

## Fase 5 — Assinatura (manuscrita + digitalização)

**Objetivo:** fechar o ciclo do documento assinado no papel: baixar → imprimir → assinar a caneta → digitalizar → anexar.

### ✅ Decisão fechada

`CLAUDE.md` §6 (14/09/2026): **o sistema não captura assinatura.** Não há canvas, biometria, testemunha autenticada nem GOV.BR. O sistema cuida do PDF (Fase 4) e do **anexo da digitalização**, vinculado à versão do documento.

```
Documento PENDENTE_ASSINATURA
  → Baixar PDF (Fase 4)          evento na auditoria
  → imprimir, assinar, digitalizar  fora do sistema
  → Anexar digitalização          upload (PDF ou imagem) vinculado à versão
  → status ASSINADO
```

### 5.1 Modelo (proposta, depende da revisão de tabelas em `CLAUDE.md` §13)

Um registro de **arquivo do documento** substitui a antiga tabela `Assinatura` por assinante:

```prisma
model DocumentoArquivo {
  id            String      @id @default(uuid())
  documentoId   String
  versao        Int                       // versão impressa/assinada
  tipo          TipoArquivo               // PDF_GERADO | DIGITALIZACAO_ASSINADA
  caminho       String                    // onde o arquivo está armazenado
  nomeOriginal  String?
  mimeType      String                    // application/pdf, image/jpeg, image/png
  tamanhoBytes  Int
  hashArquivo   String                    // SHA-256 do arquivo
  substituiId   String?                   // digitalização que esta substitui (a anterior nunca é apagada)
  justificativa String?                   // obrigatória quando substitui outra
  enviadoPorId  String
  enviadoEm     DateTime    @default(now())
}
```

> Não existe mais `metodo`, `testemunhaId`, `tracoBiometrico`, `ip`/`userAgent` de captura nem `exigeMetodoForte`. Quem assinou está **no papel**. O sistema registra quem anexou e quando.

### 5.2 Tarefas

- [ ] Botão **"Baixar PDF para assinatura"** em documento `PENDENTE_ASSINATURA` (reaproveitar UX de `DocumentViewScreen.tsx`, trocando os textos de GOV.BR)
- [ ] Modal **"Anexar documento assinado"**: aceita PDF, JPG e PNG, com limite de tamanho, e mostra o código + versão esperados para o usuário conferir com o papel
- [ ] Upload no backend (multipart) com validação de tipo real do arquivo, hash e armazenamento fora da pasta pública
- [ ] Status vira `ASSINADO` somente depois do anexo persistido
- [ ] **Substituir digitalização** (ilegível/errada) com justificativa obrigatória, preservando a anterior
- [ ] Visualizar a digitalização na aba Documento e no histórico da Auditoria
- [ ] Documentos **sem linhas de assinatura** não entram neste fluxo (regra de conclusão em `CLAUDE.md` §13)
- [ ] Folhas-tabela: aguardar a decisão de quando imprimir/digitalizar (`CLAUDE.md` §6 e §13)

> `SignatureScreen.tsx` (canvas) **não** serve mais de referência. A referência é o fluxo "baixar / anexar" de `DocumentViewScreen.tsx`.

### ✅ Critério de pronto
Termo de Acolhimento (3 assinantes): criar → baixar PDF com as 3 linhas de assinatura → imprimir e assinar → fotografar → anexar → status `ASSINADO`, com a digitalização visível na aba Documento e o evento na Auditoria. Anexar uma segunda digitalização exige justificativa e mantém a primeira no histórico.

---

`````

#### (h) Fase 7 e roteiro da demo

ANTES:

```
- [ ] Testes dos fluxos críticos: imutabilidade, assinatura completa, geração de PDF
```

DEPOIS:

```
- [ ] Testes dos fluxos críticos: imutabilidade, geração de PDF, anexo e substituição de digitalização
```

ANTES (passos 6 e 7 do roteiro de demo):

```
6. **Assinar** — presencial com testemunha, explicando a base legal
7. **Exportar prontuário completo** — "isto é o que o auditor recebe hoje em papel"
```

DEPOIS:

```
6. **Assinar** — baixar o PDF, mostrar a folha impressa já assinada a caneta, fotografar e anexar; status vira "Assinado". Explicar por que não é assinatura eletrônica (regra 9 do Regimento: residente não pode ter celular)
7. **Exportar prontuário completo** — "isto é o que o auditor recebe hoje em papel"

> Leve para a banca uma folha já impressa e assinada, para não depender de impressora na hora.
```

#### (i) "Dependências das perguntas em aberto"

ANTES (última linha da tabela):

```
| **GERSA aceita assinatura eletrônica?** | **Fase 4** | ⚠️ Implemente presencial reforçado — o schema é agnóstico |
```

DEPOIS (duas linhas):

```
| GERSA aceita a cópia digitalizada ou confere o papel original? | Papel da exportação do prontuário (substitui ou acompanha a pasta física) | ✅ Sim — assinatura manuscrita já está decidida (`CLAUDE.md` §6) |
| Quando imprimir/digitalizar as folhas-tabela? | Folhas-tabela na Fase 2 e na Fase 5 | ✅ Sim — faça os tipos `FOLHA_UNICA` antes |
```

#### (j) "Divisão sugerida para 4 pessoas"

ANTES:

```
| B | **Frontend / motor** — renderizador genérico de formulário e visualização | 2, 5 |
| C | **Auth, equipe, permissões, dashboard** | 0, 6 |
| D | **Seed, PDF, validação com a instituição, documentação acadêmica** | 2.6, 5, 7 |
```

DEPOIS:

```
| B | **Frontend / motor** — renderizador genérico de formulário e visualização, telas de baixar/anexar | 2, 5 |
| C | **Auth, equipe, permissões, dashboard** | 0, 6 |
| D | **Seed, PDF, validação com a instituição, documentação acadêmica** | 2.6, 4, 7 |
```

#### (k) "Armadilhas conhecidas"

ANTES:

```
| **Deixar PDF para o fim** | Fase 5 nunca chega | O PDF *é* a entrega para a auditoria. Faça um protótipo feio dele já na Fase 2. |
```

DEPOIS (três linhas):

```
| **Deixar PDF para o fim** | Fase 4 nunca chega, e sem ela não há assinatura | O PDF *é* o papel que será assinado e a entrega para a auditoria. Faça um protótipo feio dele já na Fase 2. |
| **Tratar upload como assinatura garantida** | Status "Assinado" com arquivo qualquer | Mostrar código + versão esperados no modal de anexo, validar tipo real do arquivo, nunca apagar anexo substituído. |
| **Reintroduzir assinatura eletrônica** | Canvas, GOV.BR ou "testemunha" aparecendo no código | Descartado em `CLAUDE.md` §6. Assinatura é a caneta. |
```

ANTES (linha sobre dado real de paciente):

```
| **Dado real de paciente no repo** | Foto preenchida commitada | `.gitignore` cobre `uploads/`, mas foto vai para `mapeamento/`. **Só documento em branco.** |
```

DEPOIS:

```
| **Dado real de paciente no repo** | Foto preenchida ou digitalização assinada commitada | `.gitignore` cobre `uploads/` e `storage/`, mas foto vai para `mapeamento/`. **Só documento em branco.** Digitalizações de teste também só com dados fictícios. |
```

---

### 3.3 `docs/PADRAO-BACKEND-NESTJS.md`

#### (a) Seção 10, tabela de estruturas de auditoria/versão

ANTES:

```
**Essa auditoria não implementa, por si só, o versionamento do prontuário.** Ela registra alterações de linhas do banco. Nosso domínio também precisa registrar o significado da ação, a justificativa, o conteúdo exibido e as assinaturas daquela versão.
```

DEPOIS:

```
**Essa auditoria não implementa, por si só, o versionamento do prontuário.** Ela registra alterações de linhas do banco. Nosso domínio também precisa registrar o significado da ação, a justificativa, o conteúdo impresso e a digitalização assinada daquela versão.
```

Na tabela logo abaixo:

ANTES:

```
| `DocumentoLinha` | Registro de folhas-tabela, com histórico preservado |
| `Assinatura` | Assinante, papel, método e vínculo ao conteúdo assinado |
| Evento documental | Ações como baixar PDF, desativar ou reativar, com autor e justificativa aplicável |
```

DEPOIS (inclusive o parágrafo novo depois da tabela):

```
| `DocumentoLinha` | Registro de folhas-tabela, com histórico preservado (necessidade em revisão, ver CLAUDE.md §13) |
| `DocumentoArquivo` | PDF gerado para impressão e digitalizações do papel assinado a caneta, com hash, autor do envio e vínculo à versão |
| Evento documental | Ações como baixar PDF, anexar/substituir digitalização, desativar ou reativar, com autor e justificativa aplicável |
```

```
A assinatura é **manuscrita no papel impresso** ([CLAUDE.md](CLAUDE.md) §6). O backend não recebe traço, não integra GOV.BR e não guarda um registro por assinante: recebe o **upload da digitalização** e o vincula à versão.
```

#### (b) Seção 10, "Pontos do domínio a fechar na implementação"

ANTES:

```
- Baixar PDF precisa gerar evento auditável. Os docs atuais também o listam como ação de versão; explicitar se haverá nova versão ou apenas evento, sem invalidar uma assinatura por uma simples leitura.
- Documentos sem assinantes exigidos precisam de uma regra de conclusão; não presumir que todos ficam pendentes de assinatura.
- Em controle de saída, o retorno só é conhecido depois. Registrar complemento/evento ou nova versão da linha, preservando o que foi assinado na saída.
- Papéis alternativos, como acolhido **ou** testemunha, não podem ser tratados como dois assinantes obrigatórios simultâneos.
```

DEPOIS:

```
- Baixar PDF gera evento auditável, não nova versão de conteúdo. O arquivo gerado deve ser armazenado com hash para que novos downloads devolvam o mesmo PDF impresso.
- Anexar digitalização: validar o tipo real do arquivo (PDF/JPG/PNG, não só a extensão), limitar tamanho, calcular hash, gravar fora de pasta pública e registrar arquivo + evento + mudança de status na **mesma transação**. Se o arquivo foi salvo e a transação falhou, remover o arquivo órfão ou marcá-lo para limpeza.
- Substituir digitalização exige justificativa e nunca remove o arquivo anterior.
- Download de digitalizações só com permissão e sem URL pública permanente: são dados sensíveis de paciente.
- Documentos sem assinantes exigidos precisam de uma regra de conclusão; não presumir que todos ficam pendentes de assinatura.
- Em controle de saída, o retorno só é conhecido depois, e a assinatura acontece no papel no momento da saída. A forma de impressão/digitalização dessa folha ainda está em aberto (CLAUDE.md §13).
- Papéis alternativos, como acolhido **ou** testemunha, viram uma única linha de assinatura no PDF (*"Assinatura do Acolhido/Testemunha"*), não dois assinantes obrigatórios.
```

#### (c) Seção 11, tabela de módulos

ANTES:

```
| `assinaturas` | Coleta e associação à versão/linha | Novo módulo no mesmo padrão |
```
```
| `pdf` | Documento A4 e exportação de prontuário | Novo módulo no mesmo padrão |
```

DEPOIS:

```
| `assinaturas` | Upload, validação, armazenamento e substituição da digitalização assinada, vinculada à versão | Novo módulo no mesmo padrão + upload multipart do Nest (`FileInterceptor`) |
```
```
| `pdf` | Documento A4 para impressão/assinatura e exportação de prontuário | Novo módulo no mesmo padrão |
```

#### (d) Seção 11, tabela de rotas propostas

ANTES:

```
| `POST /assinaturas` | Registrar assinatura validando papel e vínculo |
| `GET /documentos/:id/pdf` | Exportar documento com evento de auditoria |
```

DEPOIS:

```
| `GET /documentos/:id/pdf` | Baixar PDF para impressão/assinatura, com evento de auditoria |
| `POST /documentos/:id/digitalizacoes` | Anexar digitalização do papel assinado (multipart); status vira assinado |
| `POST /documentos/:id/digitalizacoes/:arquivoId/substituir` | Substituir digitalização com justificativa, preservando a anterior |
| `GET /documentos/:id/digitalizacoes/:arquivoId` | Baixar/visualizar a digitalização, conforme permissão |
```

#### (e) Seção 13, variáveis de ambiente

ANTES:

```
Para nosso `.env.example`, documentar valores fictícios para banco e acrescentar `DB_PORT`, `PORT`, `JWT_SECRET` e a origem permitida do frontend.
```

DEPOIS:

```
Para nosso `.env.example`, documentar valores fictícios para banco e acrescentar `DB_PORT`, `PORT`, `JWT_SECRET`, a origem permitida do frontend, o diretório de armazenamento dos arquivos (PDFs gerados e digitalizações, ex.: `STORAGE_DIR`) e o tamanho máximo de upload.
```

#### (f) Seção 15, ordem de implementação e validações

ANTES:

```
7. Implementar assinaturas conforme as decisões de negócio e geração de PDF.
```

DEPOIS:

```
7. Implementar geração de PDF e, em seguida, o anexo da digitalização assinada (o PDF é pré-requisito da assinatura manuscrita).
```

ANTES (último item da lista de validações):

```
- Concluir assinatura apenas quando os papéis aplicáveis estiverem atendidos.
```

DEPOIS:

```
- Marcar documento como assinado somente após persistir a digitalização; recusar arquivo de tipo inválido; preservar a digitalização anterior ao substituir.
- Devolver o mesmo PDF (mesmo hash) em downloads repetidos da mesma versão.
```

---

### 3.4 `docs/GUIA-FRONTEND.md`

#### (a) Seção 3, árvore de pastas

Em `documentos/componentes/`, acrescente `AnexarDigitalizacaoModal.tsx` depois de `DocumentoLinhas.tsx`.

#### (b) Seção 11, tabela de telas

ANTES:

```
| Visualização | Conteúdo da versão, status, ações permitidas e auditoria navegável |
```

DEPOIS:

```
| Visualização | Conteúdo da versão, status, baixar PDF para impressão, anexar/substituir digitalização assinada, ações permitidas e auditoria navegável |
```

#### (c) Seção 11, "Motor de documentos": acrescentar componente e parágrafo

Depois do marcador `- `DocumentoAuditoria` lista ações e permite consultar a versão selecionada.`, acrescente:

```
- `AnexarDigitalizacaoModal` envia o arquivo do papel assinado (PDF ou imagem) e mostra o código + versão esperados para conferência com a folha.

Fluxo de assinatura decidido ([CLAUDE.md](CLAUDE.md) §6): **criar documento → baixar PDF → imprimir → assinar a caneta → digitalizar → anexar no sistema.** A interface não captura assinatura (sem canvas, sem GOV.BR). A UX de referência é o par "Baixar PDF para assinatura" / "Anexar PDF assinado" de `DocumentViewScreen.tsx`, com os textos de GOV.BR trocados pelo processo manual.
```

#### (d) Seção 11, lista de regras do motor: itens 5, 6, 7 e 9

ANTES:

```
5. Não marcar “Assinado” apenas porque um arquivo foi selecionado; o status vem da API após processamento.
6. Assinantes e método dependem do tipo e das decisões pendentes. Não fixar GOV.BR como caminho universal.
7. PDF deve ser obtido do fluxo de geração/armazenamento definido para o sistema; `window.print()` do protótipo não substitui essa integração.
```
```
9. Desativar/reativar e anexar assinatura devem atualizar status e auditoria usando o resultado persistido.
```

DEPOIS:

```
5. Não marcar “Assinado” apenas porque um arquivo foi selecionado; o status vem da API após o upload da digitalização ser persistido. Mostrar progresso do envio e preservar o arquivo selecionado se o envio falhar.
6. Assinatura é sempre manuscrita no papel impresso. Os assinantes do tipo aparecem como linhas de assinatura no documento; não há seleção de método nem captura de assinatura na tela.
7. PDF deve ser obtido do backend (é o papel que será impresso e assinado); `window.print()` do protótipo não substitui essa integração.
```
```
9. Desativar/reativar, anexar e substituir digitalização devem atualizar status e auditoria usando o resultado persistido. Substituir exige justificativa.
```

#### (e) Seção 15, limites e decisões pendentes

ANTES:

```
- O método de assinatura e perguntas do mapeamento continuam pendentes; este guia não as fecha.
```

DEPOIS:

```
- O método de assinatura está decidido (manuscrita + digitalização, [CLAUDE.md](CLAUDE.md) §6). Continuam pendentes as perguntas do mapeamento e o fluxo de impressão das folhas-tabela.
```

---

### 3.5 `docs/documentos-mapeados.md`

Este arquivo tem uma seção por documento mapeado. A ideia geral: **o campo "Quem assina" continua valendo** (vira linha de assinatura no PDF) e **o campo "Assinatura forte" deixa de existir**.

#### (a) Cabeçalho do arquivo: acrescentar nota

Depois da linha que termina com "precisa ser respondido pela instituição.", acrescente:

```
>
> **Atualização 14/09/2026:** a assinatura passou a ser **manuscrita no papel impresso, com a digitalização anexada ao sistema** (CLAUDE.md §6). A classificação "assinatura forte" (GOV.BR/ICP-Brasil × presencial reforçado) que existia por documento foi removida. O campo "Quem assina" de cada documento continua valendo e define as **linhas de assinatura impressas no PDF**.
```

#### (b) Remover todas as linhas "Assinatura forte"

Apague os marcadores `- **Assinatura forte:** …` dos documentos **03, 07, 11, 12 e 14** (e de qualquer outro em que apareçam). Nos casos abaixo, o conteúdo não some, se transforma:

- **Doc 11 (Declaração de Alta a Pedido)** — no lugar da linha removida, escreva:
  ```
  - **Observação:** é o documento de maior peso jurídico do conjunto (isenção de responsabilidade). A assinatura a caneta mantém o mesmo valor que tem hoje no papel.
  ```
- **Doc 14 (Termo de Acolhimento SES/SC)** — a linha "Assinatura forte: [CONFIRMAR — prioridade máxima]" sai e a linha da auditoria estadual vira:
  ```
  - **Auditoria estadual:** **SIM — certeza.** É documento emitido em formulário do próprio órgão auditor. Assinado a caneta, como hoje. **[CONFIRMAR]** se o órgão aceita a cópia digitalizada ou confere o original em papel.
  ```

#### (c) Doc 05 (Regimento Interno), regra 9

ANTES:

```
  → **Confirmação documental definitiva** da premissa da seção 6 do CLAUDE.md: o fluxo de assinatura 100% GOV.BR é inviável para o paciente. Não é suposição, é regra escrita do regimento. Citável na banca.
```

DEPOIS:

```
  → **Confirmação documental** de que qualquer assinatura que dependa de celular (GOV.BR) é inviável para o paciente. É um dos fundamentos da decisão da seção 6 do CLAUDE.md (assinatura manuscrita + digitalização). Citável na banca.
```

#### (d) Doc 07 (Evolução de Enfermagem)

ANTES:

```
- **Quem assina:** Enfermeiro(a), **uma assinatura por linha**
- **Assinatura forte:** **[CONFIRMAR — item CFM]** é registro clínico de enfermagem, não de psiquiatra; a princípio presencial reforçado basta.
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **⚠️ Ver "Achados que afetam o schema", item 1 (folhas-tabela acumulativas).**
```

DEPOIS:

```
- **Quem assina:** Enfermeiro(a), **uma assinatura por linha** (a caneta, na folha impressa)
- **Auditoria estadual:** provável **[CONFIRMAR]**
- **⚠️ Ver "Achados que afetam o schema", item 1 (folhas-tabela acumulativas).** Com a assinatura manuscrita, falta definir quando a folha é impressa e digitalizada. Como quem assina é o próprio enfermeiro, uma folha impressa ao fim do período e assinada linha a linha é viável aqui. **[DECISÃO DO TIME]**
```

#### (e) Doc 09 (Controle de Saída): acrescentar marcador

Depois de `- **Quem assina:** Residente + Responsável, **por linha**`, acrescente:

```
- **⚠️ Assinatura manuscrita:** residente e responsável só estão juntos no momento da saída, então a folha precisa estar impressa nessa hora. Imprimir a folha só no fim do período não funciona para este documento. **[CONFIRMAR com a instituição como a saída é registrada hoje]**
```

#### (f) Doc 15 (Declaração de Desligamento), nota sobre "/Testemunha"

ANTES:

```
  - ⚠️ Note o **"/Testemunha"**: o próprio Estado prevê que o acolhido pode não estar presente (fuga, óbito) e uma testemunha assina no lugar. **Isso valida diretamente o modelo de "presencial reforçado com testemunha" da seção 6 do CLAUDE.md** — o conceito de testemunha já existe no processo oficial.
```

DEPOIS:

```
  - ⚠️ Note o **"/Testemunha"**: o próprio Estado prevê que o acolhido pode não estar presente (fuga, óbito) e uma testemunha assina no lugar. No PDF isso é **uma única linha de assinatura** com esse rótulo, não dois assinantes obrigatórios.
```

#### (g) "Achados que afetam o schema", item 3: duas últimas linhas

ANTES:

```
→ A tabela `ASSINATURA` precisa de um **`PAPEL_ASSINANTE`** (enum/tabela), e `TIPO_DOCUMENTO` precisa declarar **quais papéis são exigidos** — provavelmente uma tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis por tipo), não um campo único. **[DECISÃO DO TIME]**

→ **Bônus:** o papel "Testemunha" já existe no formulário oficial do Estado (doc 15). Isso é argumento forte na banca para o modelo de "presencial reforçado com testemunha" da seção 6.
```

DEPOIS (uma linha só):

```
→ `TIPO_DOCUMENTO` precisa declarar **quais linhas de assinatura** o PDF imprime, com o rótulo exato do papel: tabela `TIPO_DOCUMENTO_ASSINANTE` (N papéis por tipo) ou lista de rótulos no próprio tipo. Com a assinatura manuscrita (CLAUDE.md §6) não há mais registro de assinatura por pessoa no banco. **[DECISÃO DO TIME]**
```

#### (h) "Achados que afetam o schema", item 7 (CFM)

ANTES:

```
Isso é relevante para a questão do **CFM (Resolução 1.821/2007)** levantada na seção 6 do CLAUDE.md: se a instituição não mantém prontuário médico psiquiátrico dentro deste conjunto, o risco de cair nas exigências de certificação SBIS **cai bastante**, e o modelo de "presencial reforçado" fica muito mais defensável.

**Mas atenção:** a Avaliação de Enfermagem pergunta "faz uso de medicação psiquiátrica?" e o Regimento (regra 18) exige receituário médico. **Então existe alguma documentação médica que não foi fotografada.** Confirmar antes de travar a decisão. **[CONFIRMAR — prioridade máxima]**
```

DEPOIS:

```
Isso era relevante para a questão do **CFM (Resolução 1.821/2007)** enquanto se discutia assinatura eletrônica. Com a decisão de assinatura manuscrita em papel (CLAUDE.md §6), a exigência de certificação SBIS para assinatura eletrônica deixa de se aplicar, porque o sistema não assina nada. O ponto que continua existindo é a **guarda do papel original**: descartá-lo após digitalizar exige cumprir a Lei 13.787/2018. Recomendação: manter o arquivo físico.

**Mas atenção:** a Avaliação de Enfermagem pergunta "faz uso de medicação psiquiátrica?" e o Regimento (regra 18) exige receituário médico. **Então existe alguma documentação médica que não foi fotografada.** Ela entra no escopo do mapeamento (ver "O que parece estar faltando"). **[CONFIRMAR]**
```

#### (i) "Perguntas para a instituição", pergunta 5

ANTES:

```
5. **A auditoria/GERSA aceita documento assinado eletronicamente**, ou exige papel com assinatura de próprio punho? Se aceita, exige algum padrão (GOV.BR / ICP-Brasil)? — **esta pergunta trava a decisão da seção 6 do CLAUDE.md.**
```

DEPOIS:

```
5. **A auditoria/GERSA aceita a cópia digitalizada** do documento assinado a caneta (anexada no sistema / exportada em PDF), ou confere o papel original? — *reformulada em 14/09/2026; a antiga pergunta sobre assinatura eletrônica deixou de existir com a decisão da seção 6 do CLAUDE.md.* A resposta define se a exportação do prontuário substitui ou só acompanha a pasta física.
```

---

### 3.6 `docs/mapeamento-documentos.csv`

Planilha com uma linha por documento, separada por `;`. Mudanças pontuais:

1. No cabeçalho, renomeie a coluna `ASSINATURA_FORTE` para:
   `ASSINATURA_FORTE (OBSOLETO desde 14/09/2026 - assinatura manuscrita + digitalizacao)`
2. Onde a coluna tiver justificativa do método antigo, troque o valor por `N/A`. Ocorrências: linhas dos documentos **07, 09, 11, 12 e 14** (valores como `A confirmar [item CFM]`, `PROVAVEL SIM [CONFIRMAR] - maior peso juridico...`, `[CONFIRMAR - PRIORIDADE MAXIMA] documento que vai para o Estado...`).
3. Ajustes de texto em outras colunas:
   - Doc 05, observações: `Regra 9 proibe celular ao residente = CONFIRMACAO DOCUMENTAL de que GOV.BR e inviavel para o paciente assinar.` → `Regra 9 proibe celular ao residente = fundamento da decisao de assinatura manuscrita + digitalizacao (CLAUDE.md secao 6).`
   - Doc 07, quem assina: acrescentar `(a caneta na folha impressa)`.
   - Doc 09, quem assina: acrescentar `(a caneta, no momento da saida)`.
   - Doc 14, auditoria: `SIM - CERTEZA (formulario do proprio orgao auditor) [CONFIRMAR se aceita copia digitalizada ou exige original]`.
   - Doc 15, observações: trocar `O papel "/Testemunha" ja existe no formulario oficial = valida o modelo presencial reforcado com testemunha da secao 6` por `"Acolhido/Testemunha" e UMA linha de assinatura no PDF (papeis alternativos, nao dois assinantes)`.

> **Aviso sobre este CSV:** ele **já vem com um defeito de formatação** anterior a esta tarefa. Algumas linhas (documentos 2, 4 e 9, entre outras) têm `;` no meio de texto **fora de aspas**, o que faz um leitor de CSV enxergar colunas a mais. **Não corrija isso nesta tarefa** — só não introduza novos `;` em campos de texto. Se quiser, registre o problema para o time decidir depois.

---

### 3.7 `docs/rascunho-tabelas-2.txt`

É o rascunho de schema do time, em texto puro. Ele **foi substituído pelo `docs/schema.sql`** (seção 4), mas continua no repositório como registro de como o modelo evoluiu. Não o redesenhe nem o apague: apenas **marque o que ficou obsoleto** e aponte para o schema novo.

No topo do arquivo, antes de tudo, acrescente também:

```
// SUBSTITUÍDO por schema.sql (18/09/2026). Este arquivo fica como histórico da
// modelagem. O schema em vigor é docs/schema.sql.
```

Depois, as marcações da mudança de assinatura:

1. No topo do arquivo, antes do comentário `// Baseado em rascunho-tabelas.txt...`, acrescente:

```
// ATUALIZAÇÃO 14/09/2026 — a assinatura passou a ser MANUSCRITA NO PAPEL + DIGITALIZAÇÃO ANEXADA
// (criar documento -> baixar PDF -> imprimir -> assinar à mão -> digitalizar -> anexar no sistema; ver CLAUDE.md §6).
// O modelo de assinatura desacoplado do método (itens 2, 3 e 4 abaixo) ficou OBSOLETO. Os trechos afetados estão
// marcados com "// OBSOLETO". Não foram apagados porque a revisão das tabelas ainda está em discussão (CLAUDE.md §13).
//
```

2. Em `TIPO_DOCUMENTO`, marque as quatro flags:

```
REQUER_ASSINATURA_PACIENTE       BOOLEAN   // NOVO — OBSOLETO: 3 papéis não bastam (são 7, ver CLAUDE.md §8.1-c);
REQUER_ASSINATURA_RESPONSAVEL    BOOLEAN   // NOVO — OBSOLETO   agora os papéis só geram as linhas de assinatura do PDF
REQUER_ASSINATURA_PROFISSIONAL   BOOLEAN   // NOVO — OBSOLETO
EXIGE_METODO_FORTE                BOOLEAN   // NOVO — OBSOLETO: não existe mais escolha de método (assinatura é a caneta)
```

3. Em `DOCUMENTO_VERSAO`, esclareça as duas linhas:

```
ACAO                              // CRIACAO | ANEXO_PDF_ASSINADO | DESATIVACAO | REATIVACAO
                                  //   (14/09: ANEXO_PDF_ASSINADO = digitalização do papel assinado a caneta)
ARQUIVO_PDF_URL                   // nullable — PDF gerado para impressão ou digitalização anexada nessa versão
```

4. Marque a tabela `METODO_ASSINATURA`:

```
METODO_ASSINATURA                 // NOVO — OBSOLETO (14/09/2026): só existe um método, manuscrita + digitalização
```

5. Marque a tabela `ASSINATURA`:

```
ASSINATURA                        // NOVO — OBSOLETO (14/09/2026): o sistema não captura assinatura por assinante.
                                  //   Testemunha autenticada, traço, metadados de captura e IP deixam de existir.
                                  //   O que sobra é o ARQUIVO DIGITALIZADO vinculado à versão (autor do envio,
                                  //   data, hash do arquivo) — ver discussão de tabelas em CLAUDE.md §13.
```

---

### 3.8 `backend/passo-a-passo.txt`

ANTES (item 7 da lista "Implemente nesta ordem"):

```
7. Assinaturas e PDF.
```

DEPOIS:

```
7. PDF para impressão e anexo da digitalização assinada (assinatura manuscrita, ver `docs/CLAUDE.md` seção 6).
```

---

### 3.9 `docs/.gitignore`

ANTES (comentário do bloco de uploads):

```
# Uploads e arquivos gerados em runtime (PDFs de documentos, anexos assinados,
# imagens de cabeçalho/rodapé institucional enviadas pela equipe).
```

DEPOIS:

```
# Uploads e arquivos gerados em runtime (PDFs de documentos, digitalizações dos
# documentos assinados à mão, imagens de cabeçalho/rodapé institucional).
```

---

## 4. O schema do banco (`docs/schema.sql`)

Chega junto com este arquivo um `docs/schema.sql` **novo**, com o schema PostgreSQL consolidado: 17 tabelas. Ele nasce da fusão de `rascunho-tabelas.txt` e `rascunho-tabelas-2.txt` com o que o mapeamento dos documentos revelou e com a decisão de assinatura da seção 2.

**Ele é a fonte de verdade do banco a partir de agora.** Não o edite. Onde algum documento contradisser o schema, quem muda é o documento.

### Convenções que o schema segue

- Nomes em MAIÚSCULO e sem aspas: o PostgreSQL guarda em minúsculo, o que casa com a `SnakeNamingStrategy` do TypeORM.
- Tabela no singular; FK = nome da tabela + `_ID`; datas com prefixo `DT_`.
- **Nenhum `CHECK`.** Coluna de lista fixa é `VARCHAR` comum, com as opções no comentário. Quem valida é o DTO do NestJS, com `@IsEnum`.
- IDs inteiros com `GENERATED BY DEFAULT AS IDENTITY`, para o seed poder fixar os IDs das listas de apoio.
- Nada é apagado: `ATIVO` + `DT_DESATIVADO`, e nenhum `ON DELETE CASCADE` em histórico.

### As decisões que o schema tomou

| Decisão | Por quê |
|---|---|
| Não existe tabela `ASSINATURA` nem `METODO_ASSINATURA` | A assinatura é a caneta (seção 2). O que o sistema guarda é o arquivo: `DOCUMENTO_ARQUIVO`. |
| Não existe tabela de acolhimento/internação | Data de acolhimento, data de desligamento, convênio e chave SISREG são colunas do `PACIENTE`, como na capa do prontuário em papel. Readmissão sobrescreve; o histórico fica nos documentos daquele período. |
| `DOCUMENTO_EVENTO` no lugar de `DOCUMENTO_VERSAO` | O conteúdo do documento nunca muda, então guardar uma cópia dos dados por versão seria repetir a mesma coisa. `DOCUMENTO.DADOS` é gravado uma vez; cada ação vira um evento. |
| Não existe `DOCUMENTO_LINHA` | As linhas das folhas-tabela ficam como lista dentro de `DOCUMENTO.DADOS`. O fluxo de impressão dessas folhas ainda está em aberto com a instituição, e as duas saídas possíveis dispensam a tabela. |
| Não existe `TIPO_DOCUMENTO_ASSINANTE` | Virou a coluna `TIPO_DOCUMENTO.ASSINANTES` em JSONB, com os rótulos das linhas de assinatura que vão impressas no PDF. Vazio = tipo não exige assinatura. |
| `PROFISSIONAL` e `USUARIO` são tabelas separadas, e a FK é `PROFISSIONAL.USUARIO_ID` | `USUARIO` é identidade de login genérica: se um dia o paciente puder entrar, ele ganha `PACIENTE.USUARIO_ID` e `USUARIO` não muda. Profissional sem login tem a coluna nula. |
| Autoria em `PROFISSIONAL_ID` | Quem cria documento, anexa arquivo e publica aviso é a pessoa, não a credencial. Só o `LOG` guarda `USUARIO_ID`. |
| Uma tabela `LOG` genérica | Substitui a ideia de tabela de auditoria técnica: tipo (evento/erro), módulo, usuário, descrição e data, para o sistema inteiro. |
| Arquivos ficam fora do banco | `DOCUMENTO_ARQUIVO` guarda só metadados e o `CAMINHO`. Ver seção 5. |
| `CONVENIO` é texto no paciente, não tabela | A lista de convênios ainda não é conhecida, e "é vaga estadual" se resolve pela chave SISREG estar preenchida. |

### O que atualizar nos docs por causa do schema

Os guias foram escritos antes e citam tabelas que mudaram de nome ou deixaram de existir. Corrija:

**`docs/CLAUDE.md`**

- Seção 12: o marcador do `rascunho-tabelas-2.txt` deve dizer que ele foi **substituído pelo `docs/schema.sql`**, que passa a ser o schema em vigor. Acrescente um marcador para o `schema.sql` na mesma lista.
- Seção 13: marque como feitos (`[x]`) os itens "Revisar a necessidade de cada tabela do schema" e "Definir como o tipo declara suas linhas de assinatura" — os dois foram resolvidos pelo schema. O item sobre folhas-tabela **continua aberto**, mas reescreva-o dizendo que hoje as linhas moram em `DOCUMENTO.DADOS`.

**`docs/GUIA-IMPLEMENTACAO.md`**

- Os blocos Prisma das fases 1, 2, 3 e 5 são ilustrativos e hoje divergem do schema. Acrescente, na primeira vez que aparecer um bloco Prisma (fase 1), uma nota: *"Os blocos abaixo são ilustrativos. O schema em vigor é `docs/schema.sql`; em caso de divergência, vale o SQL."*
- Onde aparecer o model `Assinatura`, troque por `DocumentoArquivo` conforme o schema.
- Onde aparecer `DocumentoLinha`, diga que as linhas ficam em `DOCUMENTO.DADOS` enquanto o fluxo das folhas-tabela não é definido.
- Onde aparecer `TipoDocumentoAssinante`, troque pela coluna `ASSINANTES` (JSONB) do `TIPO_DOCUMENTO`.
- Na tabela "Onde cada coisa está documentada", a linha "Rascunho de schema do time | `rascunho-tabelas-2.txt`" vira "**Schema do banco** | `docs/schema.sql`".

**`docs/PADRAO-BACKEND-NESTJS.md`**

- Na tabela de estruturas da seção 10, os nomes devem bater com o schema: `DOCUMENTO`, `DOCUMENTO_EVENTO`, `DOCUMENTO_ARQUIVO`. A linha de `DocumentoLinha` sai.
- Na seção 7 (banco, entities e migrations), acrescente que as entities e a primeira migration saem de `docs/schema.sql`.

**`docs/GUIA-FRONTEND.md`**

- Onde cita o componente `DocumentoLinhas`, deixe claro que as linhas vêm de dentro do documento, não de um recurso próprio.

---

## 5. Como as tabelas de documento são usadas

Esta seção existe para quem for implementar não precisar deduzir. Ela descreve o ciclo de vida completo de um documento no banco.

### A vida de um documento, passo a passo

**1. Criar o documento**

```
DOCUMENTO          + 1 linha  (VERSAO 1, STATUS PENDENTE_ASSINATURA, DADOS, HASH_CONTEUDO)
DOCUMENTO_EVENTO   + 1 linha  (ACAO CRIACAO, NUMERO_VERSAO 1, PROFISSIONAL_ID)
DOCUMENTO_ARQUIVO  nada ainda
```

Se o tipo não tiver `ASSINANTES`, o status nasce `CONCLUIDO` em vez de `PENDENTE_ASSINATURA`.

**2. Baixar o PDF para imprimir**

```
DOCUMENTO_ARQUIVO  + 1 linha  (TIPO PDF_GERADO, NUMERO_VERSAO 1, CAMINHO, HASH_ARQUIVO)
DOCUMENTO_EVENTO   + 1 linha  (ACAO PDF_BAIXADO, DOCUMENTO_ARQUIVO_ID)
DOCUMENTO          intocado
```

⚠️ **Diferença proposital em relação ao protótipo:** lá o download incrementava a versão do documento e só era registrado uma vez (`App.tsx`, `handleDownloadPdf`). Aqui **baixar não cria versão**, porque não muda conteúdo, e **todo** download vira evento, para a auditoria mostrar quem imprimiu e quando. O arquivo é gerado uma vez só: no segundo download, devolva a mesma linha, com o mesmo hash, para a folha impressa duas vezes ser idêntica.

**3. Anexar a digitalização do papel assinado**

```
DOCUMENTO_ARQUIVO  + 1 linha  (TIPO DIGITALIZACAO, NUMERO_VERSAO 1, ATIVO true)
DOCUMENTO_EVENTO   + 1 linha  (ACAO DIGITALIZACAO_ANEXADA, DOCUMENTO_ARQUIVO_ID)
DOCUMENTO          UPDATE     STATUS -> ASSINADO
```

**4. A digitalização saiu ilegível e mandam outra**

```
DOCUMENTO_ARQUIVO  + 1 linha  (nova, SUBSTITUI_ARQUIVO_ID = a anterior, ATIVO true)
DOCUMENTO_ARQUIVO  UPDATE     a anterior: ATIVO -> false   (continua no banco e no disco)
DOCUMENTO_EVENTO   + 1 linha  (ACAO DIGITALIZACAO_SUBSTITUIDA + JUSTIFICATIVA obrigatória)
```

**5. Desativar e depois reativar**

```
desativar:  DOCUMENTO         UPDATE (STATUS DESATIVADO, VERSAO 2, DT_DESATIVADO)
            DOCUMENTO_EVENTO  + 1 (DESATIVACAO, NUMERO_VERSAO 2, JUSTIFICATIVA)

reativar:   DOCUMENTO         UPDATE (STATUS PENDENTE_ASSINATURA, VERSAO 3)
            DOCUMENTO_EVENTO  + 1 (REATIVACAO, NUMERO_VERSAO 3, JUSTIFICATIVA)
```

Depois de reativar, o ciclo de imprimir e assinar recomeça. É **por isso que `DOCUMENTO_ARQUIVO` tem `NUMERO_VERSAO`**: a digitalização da versão 1 continua amarrada à versão 1, e a nova nasce amarrada à versão 3. Assim nunca se confunde qual papel assinado pertence a qual ciclo.

### A aba Auditoria

Uma consulta só, e cada linha vira um item da linha do tempo:

```sql
SELECT e.DT_CRIACAO, e.NUMERO_VERSAO, e.ACAO, e.JUSTIFICATIVA,
       p.NOME AS AUTOR, a.ID AS ARQUIVO_ID, a.NOME_ORIGINAL
  FROM DOCUMENTO_EVENTO e
  JOIN PROFISSIONAL p           ON p.ID = e.PROFISSIONAL_ID
  LEFT JOIN DOCUMENTO_ARQUIVO a ON a.ID = e.DOCUMENTO_ARQUIVO_ID
 WHERE e.DOCUMENTO_ID = $1
 ORDER BY e.DT_CRIACAO;
```

O front traduz a `ACAO` em rótulo e ícone, como o protótipo já faz em `DocumentViewScreen.tsx`. Dois rótulos mudam:

| Protótipo | Agora |
|---|---|
| PDF baixado para assinatura | PDF baixado para impressão |
| PDF assinado anexado (GOV.BR) | Digitalização anexada |

**Sobre "‹ Versão anterior / Próxima versão ›":** no protótipo cada versão guardava um `contentSnapshot`, porque ele imaginava conteúdo mudando. Como aqui o conteúdo nunca muda, navegar entre versões mostra sempre o mesmo conteúdo — o que muda de um ciclo para outro é o papel assinado preso a ele. Na prática, navegar por versão é ver a digitalização daquele ciclo.

### A aba Documento

Mostra `DOCUMENTO.DADOS` renderizado pelo tipo, mais a digitalização vigente:

```sql
SELECT * FROM DOCUMENTO_ARQUIVO
 WHERE DOCUMENTO_ID = $1 AND TIPO = 'DIGITALIZACAO' AND ATIVO
 ORDER BY DT_CRIACAO DESC LIMIT 1;
```

### Quando escreve e quando edita

**Escreve:** sempre dentro da transação da ação, pelo service de documentos, no mesmo `queryRunner`. Nenhuma tela escreve nessas tabelas por conta própria.

**Edita:** só em dois lugares, e nenhum deles é conteúdo.

1. `DOCUMENTO`: `STATUS`, `VERSAO` e `DT_DESATIVADO`. É estado, não conteúdo.
2. `DOCUMENTO_ARQUIVO.ATIVO`: marca a digitalização substituída.

`DOCUMENTO.DADOS` **nunca** recebe `UPDATE`. `DOCUMENTO_EVENTO` só recebe `INSERT`: nunca `UPDATE`, nunca `DELETE`. Como o schema não tem `CHECK`, essas duas regras e a da justificativa obrigatória dependem do backend — valem testes automatizados.

### Os arquivos em si

O PDF gerado e as digitalizações **não ficam no banco**: uma digitalização A4 tem de 1 a 5 MB e inchar o `pg_dump` com isso torna backup e restauração lentos. `DOCUMENTO_ARQUIVO` guarda os metadados e o `CAMINHO`.

Onde o arquivo mora depende da hospedagem, que ainda está em aberto:

- **Servidor próprio ou máquina da instituição:** uma pasta `STORAGE_DIR` fora da pasta pública, e `CAMINHO` guarda o caminho relativo.
- **Serverless:** o disco é efêmero e os arquivos somem a cada deploy. Nesse caso é preciso storage de objetos, e `CAMINHO` guarda a chave do objeto.

O schema é o mesmo nos dois casos. Regras que valem sempre:

- O nome do arquivo é gerado pelo sistema, nunca o nome enviado pelo usuário (path traversal).
- Validar o tipo real pelos bytes iniciais, não pela extensão, e limitar o tamanho no upload.
- Servir por rota autenticada, com stream; nunca por pasta pública. São dados de prontuário.
- Gravar o arquivo e a linha na mesma transação; se a transação falhar depois do arquivo salvo, apagar o órfão.
- O backup dos arquivos é separado do banco: restaurar só o dump deixaria todo documento assinado apontando para arquivo inexistente.

---

## 6. Verificação ao terminar

Rode uma busca por resíduos do processo antigo:

```bash
grep -rniE "gov\.?br|presencial reforç|biometri|canvas|método forte|EXIGE_METODO|METODO_ASSINATURA|assinatura eletrôn|testemunha autenticada" \
  --include="*.md" --include="*.txt" --include="*.csv" \
  docs/ backend/passo-a-passo.txt README.md \
  | grep -v "export-figma-make"
```

Cada ocorrência restante precisa ser **uma destas três coisas**, e nada além:

1. **Histórico explícito** — a lista de propostas descartadas na seção 6 do CLAUDE.md.
2. **Negação explícita** — frases do tipo "não há canvas, biometria nem GOV.BR", "descartado", "obsoleto".
3. **Referência ao protótipo** — trechos que descrevem o que o protótipo tem hoje e precisa ser trocado ao reaproveitar.

Se encontrar algo que ainda **afirma** o processo antigo como o processo do sistema, corrija seguindo o glossário da seção 2.

### Checklist

- [ ] `docs/CLAUDE.md` — seção 6 reescrita e seções 5, 7, 8, 8.1, 9, 9.1, 10, 11, 12, 13 ajustadas
- [ ] `docs/GUIA-IMPLEMENTACAO.md` — fases 4 e 5 trocadas e todas as referências a "Fase 4"/"Fase 5" conferidas
- [ ] `docs/PADRAO-BACKEND-NESTJS.md` — rotas, módulos, regras de upload e ordem de implementação
- [ ] `docs/GUIA-FRONTEND.md` — componente do modal, regras do motor e pendências
- [ ] `docs/documentos-mapeados.md` — nota no cabeçalho, "Assinatura forte" removida, achados 3 e 7, pergunta 5
- [ ] `docs/mapeamento-documentos.csv` — coluna marcada como obsoleta e valores ajustados
- [ ] `docs/rascunho-tabelas-2.txt` — marcado como substituído pelo `schema.sql` e com os trechos `// OBSOLETO`, sem redesenhar nada
- [ ] `backend/passo-a-passo.txt` e `docs/.gitignore`
- [ ] Busca final sem resíduos que afirmem o processo antigo
- [ ] Nenhum arquivo de código alterado
- [ ] `docs/schema.sql` entrou no repositório **sem edição**
- [ ] Nenhum doc apresenta `rascunho-tabelas-2.txt` como schema em vigor
- [ ] Nenhum doc cita `ASSINATURA`, `METODO_ASSINATURA`, `DOCUMENTO_VERSAO`, `DOCUMENTO_LINHA`, `TIPO_DOCUMENTO_ASSINANTE` ou tabela de acolhimento como parte do modelo atual
- [ ] Este arquivo de instruções não foi commitado

---

## 7. Fora do escopo desta tarefa

Não invente conteúdo sobre os assuntos abaixo. Eles ainda não têm decisão, e nos docs devem aparecer como **pergunta em aberto**, nunca como regra:

- **Ficha de Acolhimento gerada a partir do cadastro do paciente.** A ideia é que a Ficha seja um documento comum cujos campos vêm do cadastro, mas o mecanismo está sendo desenhado em paralelo e **não entra** nesta tarefa. Por isso o schema não tem coluna de origem de campo.
- **Fluxo das folhas-tabela** (Evolução de Enfermagem e Controle de Saída): quando a folha é impressa e digitalizada. Depende de resposta da instituição.
- **Regra de conclusão de documentos sem assinantes** e **regra de reativação** (se reativar exige nova impressão e assinatura, já que o conteúdo não mudou).
- **Guarda do papel original** depois da digitalização.

Também **não redesenhe o banco**: a modelagem já foi fechada no `docs/schema.sql`. Se achar que alguma tabela está errada, registre a dúvida na resposta final em vez de alterar o SQL.
