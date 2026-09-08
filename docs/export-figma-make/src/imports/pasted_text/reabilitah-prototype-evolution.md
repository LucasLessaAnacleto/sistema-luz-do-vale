# EVOLUÇÃO DO PROTÓTIPO REABILITAH — DOCUMENTOS, ASSINATURAS, EQUIPE E PERMISSÕES

Este prompt é uma continuação do protótipo existente.

**NÃO recrie o sistema do zero.**

Mantenha exatamente a identidade visual já criada: paleta de cores, tipografia, cards, botões, campos, ícones, espaçamentos, bordas, navegação, estilo dos componentes e estrutura visual.

O objetivo é **evoluir o protótipo existente**, adicionando os novos fluxos abaixo e corrigindo os pontos indicados.

Continue utilizando os dados fictícios existentes, porém faça as alterações de dados solicitadas neste prompt.

O protótipo precisa ser navegável e funcional para demonstração, mesmo sem backend ou banco de dados real.

---

# 1. ALTERAÇÃO DOS DADOS FICTÍCIOS

Alterar o usuário administrador atualmente chamado:

**Dr. Pedro**

para:

**Abel**

Todos os pacientes existentes no protótipo devem ser homens.

Caso existam dados fictícios femininos, substituir por dados masculinos coerentes.

---

# 2. MENU PRINCIPAL INFERIOR

Manter a navegação inferior existente, mas reorganizar para possuir quatro áreas principais:

1. **Início**
2. **Pacientes**
3. **Documentos**
4. **Configurações**

A nova opção entre Pacientes e Configurações deve se chamar:

**DOCUMENTOS**

Essa área será responsável por centralizar todos os documentos de todos os pacientes da instituição.

Não utilizar "Relatórios" como nome dessa área, pois ela não conterá apenas relatórios. Ela conterá todo o acervo documental do sistema.

---

# 3. ÁREA DOCUMENTOS — VISÃO GERAL

Criar uma tela:

**DOCUMENTOS**

Essa será uma central documental da instituição.

Ela deverá apresentar documentos de **todos os pacientes vinculados à instituição**.

Cada documento deverá aparecer como um card ou item de lista contendo:

* ID do documento;
* Nome do documento;
* Nome completo do paciente;
* Apelido do paciente;
* Data de criação;
* Hora de criação;
* Usuário responsável pela criação;
* Última alteração;
* Status atual.

Exemplo:

**DOC-000152**

**Termo de Acolhimento**

Paciente: Carlos Eduardo Pereira
Apelido: Carlinhos

Criado em: 09/08/2026 às 14:32
Criado por: Abel

Status:

**Pendente de assinatura**

---

# 4. BUSCA GERAL DE DOCUMENTOS

A tela Documentos deverá possuir uma busca ampla.

O usuário poderá pesquisar por:

* Nome completo do paciente;
* Apelido do paciente;
* Nome do documento;
* ID do documento;
* Texto existente dentro do documento.

Exemplo:

Pesquisar:

"Carlinhos"

→ encontrar documentos vinculados ao paciente Carlos Eduardo Pereira.

Pesquisar:

"acolhimento"

→ encontrar documentos cujo título ou conteúdo contenha "acolhimento".

Pesquisar:

"DOC-000152"

→ encontrar diretamente o documento.

---

# 5. FILTROS DE DOCUMENTOS

Criar filtros para facilitar a localização dos documentos.

Filtros principais:

**Paciente**

**Tipo de documento**

**Responsável pela criação**

**Período**

**Status**

O filtro de status é obrigatório e deve permitir visualizar separadamente:

* Pendente de assinatura;
* Assinado;
* Alterado;
* Removido/Desativado;
* Reativado/Pendente de assinatura;
* Outros status necessários.

O usuário deve conseguir, por exemplo:

**Status → Pendente de assinatura**

e visualizar rapidamente todos os documentos que ainda precisam ser assinados.

Essa funcionalidade é importante para a equipe identificar documentos que estão aguardando assinatura.

---

# 6. STATUS OBRIGATÓRIO PARA TODOS OS DOCUMENTOS

Todo documento do sistema deve possuir obrigatoriamente um status.

Utilizar uma diferenciação visual clara.

## DOCUMENTO CRIADO E AINDA NÃO ASSINADO

Status:

**Pendente de assinatura**

Utilizar uma identificação visual de atenção, preferencialmente em tom neutro/amarelo claro.

Esse status significa que o documento existe, mas ainda precisa passar pelo processo de assinatura.

---

## DOCUMENTO CRIADO E ASSINADO

Status:

**Assinado**

Utilizar verde.

Esse é o status normal de um documento finalizado e assinado.

---

## DOCUMENTO ALTERADO

Status:

**Alterado**

Utilizar amarelo.

O documento permanece ativo, mas sofreu alteração e a nova versão precisa ser assinada.

---

## DOCUMENTO REMOVIDO/DESATIVADO

Status:

**Documento desativado**

Utilizar vermelho.

O documento continua armazenado e disponível para consulta.

Ele nunca é excluído definitivamente.

---

## DOCUMENTO REATIVADO

Quando um documento desativado for reativado, ele deverá obrigatoriamente voltar para:

**Pendente de assinatura**

A reativação deve gerar uma nova versão/auditoria e exigir assinatura novamente.

---

# 7. REGRA FUNDAMENTAL DE ASSINATURA

**TODAS AS ALTERAÇÕES RELEVANTES NO DOCUMENTO DEVEM EXIGIR NOVA ASSINATURA.**

A assinatura está vinculada à versão específica do documento.

Portanto:

DOCUMENTO CRIADO
→ Pendente de assinatura

DOCUMENTO ASSINADO
→ Assinado

DOCUMENTO EDITADO
→ Nova versão
→ Alterado
→ Pendente de nova assinatura

DOCUMENTO DESATIVADO
→ Documento desativado

DOCUMENTO REATIVADO
→ Nova versão
→ Pendente de assinatura

DOCUMENTO REATIVADO E EDITADO
→ Nova versão
→ Pendente de assinatura novamente

Nunca sobrescrever uma versão anteriormente assinada.

---

# 8. ASSINATURA DO PACIENTE E RESPONSÁVEL

Todo documento que exigir assinatura deverá seguir o fluxo:

**Assinatura do paciente → Assinatura do responsável → Documento finalizado**

Criar um fluxo visual para isso.

Exemplo:

**1. Paciente**

✓ Assinado

**2. Responsável**

○ Aguardando assinatura

**3. Documento**

○ Pendente de finalização

Quando as assinaturas necessárias forem concluídas:

**Documento → Assinado**

---

# 9. ASSINATURA MANUSCRITA PRESENCIAL

O paciente não possui acesso a celular dentro da instituição.

Portanto, o sistema deverá utilizar um **terminal de assinatura presencial**.

Criar no protótipo uma interface que simule um tablet/tela de assinatura.

O paciente poderá assinar utilizando o dedo ou uma caneta diretamente na área de assinatura.

Criar uma área:

**ASSINATURA DO PACIENTE**

com uma área branca para desenhar a assinatura.

Botões:

**Limpar assinatura**

**Confirmar assinatura**

---

# 10. ASSINATURA DO RESPONSÁVEL

Depois que o paciente assinar, o sistema deverá solicitar a assinatura do responsável.

Mostrar:

**ASSINATURA DO RESPONSÁVEL**

Apresentar novamente uma área para assinatura manuscrita.

Botões:

**Limpar assinatura**

**Confirmar assinatura**

O responsável poderá assinar utilizando o mesmo terminal presencial.

---

# 11. DADOS DA ASSINATURA

Além da assinatura manuscrita, o sistema deverá registrar automaticamente os dados estruturados da assinatura.

Para cada assinatura armazenar visualmente:

* Nome do assinante;
* Tipo de assinante;
* Data;
* Hora;
* Minuto;
* Documento;
* ID do documento;
* Versão do documento;
* Usuário/profissional responsável pelo procedimento;
* Método: assinatura presencial.

A assinatura manuscrita deve permanecer vinculada àquela versão específica do documento.

---

# 12. ÁREA DE ASSINATURA NO PROTÓTIPO

Criar também uma área acessível durante a apresentação para demonstrar o processo de assinatura.

Essa área deve permitir:

1. Selecionar um paciente;
2. Selecionar um documento pendente;
3. Visualizar o documento;
4. Assinar como paciente;
5. Confirmar;
6. Assinar como responsável;
7. Confirmar;
8. Finalizar documento.

O objetivo é conseguir demonstrar presencialmente aos professores e à instituição como funcionará a assinatura sem utilização de papel ou celular.

---

# 13. DOCUMENTO CRIADO COM OU SEM O PACIENTE PRESENTE

Ao criar um documento, o sistema deverá oferecer duas possibilidades.

## OPÇÃO 1 — CRIAR E ASSINAR AGORA

Se o paciente e o responsável estiverem presentes:

**Criar documento → preencher → salvar → assinar paciente → assinar responsável → finalizar**

O documento terminará como:

**Assinado**

---

## OPÇÃO 2 — CRIAR E ASSINAR DEPOIS

Caso o paciente não esteja presente:

**Criar documento → preencher → salvar**

O documento ficará:

**Pendente de assinatura**

O usuário poderá sair da tela.

Posteriormente, a equipe poderá entrar no documento e selecionar:

**Solicitar assinatura**

Quando o paciente estiver presente, realizar a assinatura.

---

# 14. DOCUMENTO PENDENTE

Documentos pendentes devem ser facilmente identificáveis.

Na central Documentos, criar uma área/filtro:

**Pendentes de assinatura**

Também pode existir um contador no menu:

**Documentos (5)**

indicando que existem cinco documentos aguardando alguma assinatura.

---

# 15. VISUALIZAÇÃO DO DOCUMENTO

Ao clicar em qualquer documento, abrir sua página de detalhes.

Apresentar duas áreas:

**DOCUMENTO**

e

**AUDITORIA**

Na área Documento mostrar o documento completo.

Também apresentar:

* ID;
* paciente;
* responsável;
* data;
* status;
* versão;
* assinaturas.

---

# 16. VISUALIZAÇÃO DAS ASSINATURAS

Dentro do documento, mostrar as assinaturas manuscritas.

Exemplo:

**Assinatura do paciente**

[imagem/traçado da assinatura]

Carlos Eduardo Pereira

Assinado em:
09/08/2026 às 14:38

---

**Assinatura do responsável**

[imagem/traçado da assinatura]

Maria da Silva

Assinado em:
09/08/2026 às 14:41

As assinaturas também devem aparecer quando o documento for preparado para PDF.

---

# 17. VISUALIZAÇÃO ANTES DO DOWNLOAD

Não baixar o documento imediatamente ao clicar em "Baixar".

Criar duas opções:

**Visualizar PDF**

**Baixar PDF**

Ao selecionar "Visualizar PDF", abrir uma visualização do documento no formato final que será gerado.

O usuário poderá conferir o documento antes de fazer o download.

---

# 18. DOWNLOAD

Quando o usuário selecionar:

**Baixar PDF**

o documento deverá ser gerado obrigatoriamente no formato:

**PDF**

O PDF deverá conter:

* layout institucional;
* logo;
* nome da instituição;
* informações institucionais;
* título do documento;
* conteúdo;
* nome do paciente;
* ID;
* data;
* hora;
* versão;
* assinaturas manuscritas;
* identificação do paciente;
* identificação do responsável;
* demais informações pertinentes ao documento.

A assinatura manuscrita visualizada no sistema também deve aparecer no PDF e consequentemente na impressão.

---

# 19. DESATIVAÇÃO DO DOCUMENTO

Adicionar a opção:

**Desativar documento**

Ao clicar, abrir confirmação solicitando obrigatoriamente:

**Motivo da desativação**

O usuário deve preencher a justificativa.

Depois da confirmação:

* documento permanece armazenado;
* status passa para "Documento desativado";
* data e hora são registradas;
* usuário responsável é registrado;
* motivo é registrado;
* versão anterior permanece disponível;
* documento continua disponível para consulta.

---

# 20. DOCUMENTO DESATIVADO NÃO PODE SER EDITADO

Se o documento estiver:

**Documento desativado**

não apresentar botão "Editar".

Apresentar somente:

**Visualizar**

**Reativar documento**

**Baixar PDF**

Para editar um documento desativado, o usuário deverá primeiro:

**Reativar documento**

---

# 21. REATIVAÇÃO

Ao clicar em:

**Reativar documento**

solicitar obrigatoriamente:

**Motivo da reativação**

Após confirmar:

* registrar usuário;
* registrar data;
* registrar hora;
* registrar justificativa;
* criar nova versão;
* alterar status para **Pendente de assinatura**.

A nova versão deverá ser assinada novamente.

Somente depois de assinada ela poderá voltar ao status:

**Assinado**

---

# 22. EDIÇÃO DE DOCUMENTO

Um documento assinado nunca deve ser simplesmente sobrescrito.

Ao clicar:

**Editar**

o sistema deve criar uma nova versão.

Exemplo:

**DOC-000152 — Versão 1**

Assinado.

Ao editar:

**DOC-000152 — Versão 2**

Status:

**Alterado / Pendente de assinatura**

Depois das assinaturas:

**Versão 2 — Assinado**

A versão 1 continua disponível na auditoria.

---

# 23. AUDITORIA

A área de Auditoria deve apresentar o histórico completo do documento.

Exemplo:

**Versão 1**

Criado por: Abel
Data: 09/08/2026
Hora: 14:20
Status: Assinado

**Versão 2**

Alterado por: João Silva
Data: 09/08/2026
Hora: 15:10
Motivo: Correção de informação

Status: Pendente de assinatura

**Versão 2**

Assinado pelo paciente: Carlos Eduardo
Data: 09/08/2026
Hora: 15:20

Assinado pelo responsável: Maria Silva
Data: 09/08/2026
Hora: 15:23

Status: Assinado

---

# 24. CONFIGURAÇÕES — LAYOUT INSTITUCIONAL

Modificar completamente a ideia atual da área "Layout".

A área Layout **NÃO deve servir para escolher fonte, tamanho de texto, espaçamento ou estilo individual de cada documento.**

O sistema deverá possuir um padrão profissional de formatação documental.

Utilizar um padrão adequado para documentos institucionais, com estrutura profissional e compatível com documentos em formato A4.

A configuração do usuário deverá ser focada no:

**LAYOUT INSTITUCIONAL**

O usuário poderá definir/importar o modelo visual da folha A4 da instituição.

Exemplo:

* Logo da Luz do Vale;
* Nome da instituição;
* Localização;
* informações institucionais;
* cabeçalho;
* rodapé;
* elementos institucionais;
* identificação visual.

Esse layout funcionará como um **modelo/base de página A4**.

---

# 25. FUNCIONAMENTO DO LAYOUT INSTITUCIONAL

Todos os documentos gerados deverão utilizar automaticamente o layout institucional configurado.

Fluxo:

**Layout institucional A4**

↓

**Documento**

↓

**Informações do paciente**

↓

**Conteúdo**

↓

**Assinaturas**

↓

**Data/hora**

↓

**ID**

↓

**PDF final**

O usuário não deverá precisar configurar manualmente a aparência de cada documento.

O sistema deverá padronizar automaticamente a estrutura textual dos documentos.

---

# 26. ÁREA DE EQUIPE / PROFISSIONAIS

Adicionar em Configurações uma nova área chamada:

**Equipe**

ou

**Profissionais**

Preferencialmente utilizar:

**Equipe**

Essa área será responsável pelo gerenciamento dos usuários da instituição.

---

# 27. LISTA DE PROFISSIONAIS

Mostrar todos os profissionais cadastrados.

Cada profissional deverá apresentar:

* Foto/avatar;
* Nome;
* Função;
* Email;
* Status;
* Data de cadastro.

Status:

**Ativo**

ou

**Desativado**

Adicionar:

**+ Adicionar profissional**

---

# 28. CADASTRO DE PROFISSIONAL

Criar formulário:

**NOVO PROFISSIONAL**

Campos:

* Nome completo;
* CPF;
* RG;
* Data de nascimento;
* Email;
* Função;
* Senha inicial.

Apenas dados necessários devem ser solicitados.

---

# 29. PERMISSÕES DO PROFISSIONAL

A parte mais importante do cadastro será:

**PERMISSÕES DE ACESSO**

Criar uma interface organizada para selecionar o que o profissional poderá fazer.

Permissões possíveis:

### PACIENTES

☐ Visualizar pacientes
☐ Criar pacientes
☐ Editar pacientes
☐ Desativar pacientes

### DOCUMENTOS

Para cada tipo de documento permitir configurar:

**Visualizar**

**Criar**

**Editar**

**Desativar**

**Reativar**

**Assinar**

Exemplo:

**Evolução de enfermagem**

☑ Visualizar
☑ Criar
☑ Editar
☐ Desativar
☐ Reativar

---

# 30. PERMISSÕES POR DOCUMENTO

Criar uma tabela ou interface semelhante:

| Documento | Visualizar | Criar | Editar | Desativar | Reativar |
| Evolução enfermagem | ✓ | ✓ | ✓ | — | — |
| Termo acolhimento | ✓ | ✓ | ✓ | ✓ | ✓ |
| Controle saída | ✓ | ✓ | ✓ | — | — |
| Evolução geral | ✓ | ✓ | ✓ | ✓ | ✓ |

Essa tabela é apenas um exemplo visual.

O protótipo deve permitir demonstrar que cada profissional pode possuir permissões diferentes.

---

# 31. ADMINISTRADOR / SUPER ADMINISTRADOR

O usuário **Abel** será o administrador/super administrador do protótipo.

Ele deverá possuir acesso total.

O super administrador poderá:

* criar profissionais;
* editar profissionais;
* alterar senha;
* ativar profissionais;
* desativar profissionais;
* definir permissões;
* alterar permissões;
* visualizar documentos;
* administrar o sistema.

---

# 32. SENHA DO PROFISSIONAL

Ao cadastrar um profissional, o administrador poderá definir uma senha inicial.

No primeiro login, o profissional deverá utilizar essa senha para acessar sua conta.

O profissional deverá poder alterar sua própria senha posteriormente.

O administrador também poderá alterar a senha de outro profissional.

---

# 33. AUDITORIA DE USUÁRIOS

Todas as ações administrativas relacionadas aos profissionais também devem gerar registros de auditoria.

Exemplos:

**Senha alterada**

Profissional: João Silva
Alterado por: Abel
Data: 09/08/2026
Hora: 16:20

**Permissão alterada**

Profissional: João Silva
Alterado por: Abel
Data: 09/08/2026
Hora: 16:35

**Profissional desativado**

Profissional: João Silva
Desativado por: Abel
Data: 09/08/2026
Hora: 16:42

**Profissional criado**

Profissional: João Silva
Criado por: Abel
Data: 09/08/2026
Hora: 15:10

Esses registros devem permanecer no histórico.

---

# 34. PROFISSIONAL DESATIVADO

Ao desativar um profissional:

* impedir novo login;
* manter seus registros históricos;
* manter documentos criados por ele;
* manter auditorias;
* manter assinaturas;
* manter seu nome nos documentos anteriores.

Nunca substituir o nome do profissional por "usuário desconhecido".

O histórico deve preservar quem realizou cada ação.

---

# 35. INÍCIO / DASHBOARD

Manter a estrutura atual do Dashboard, porém remover completamente:

**Pacientes recentes**

Essa seção não deve mais aparecer.

Manter as demais informações já definidas anteriormente:

* Olá, Abel;
* pacientes ativos;
* média de tempo de internação;
* quantidade total de documentos/relatórios;
* quantidade criada no mês;
* próximos aniversariantes;
* quadro de avisos;
* últimos documentos criados.

---

# 36. PRONTUÁRIO — TIPOS DE DEPENDÊNCIA

Corrigir a apresentação dos tipos de dependência.

No prontuário do paciente, **NÃO mostrar todas as opções existentes no sistema.**

Mostrar somente as dependências que foram selecionadas para aquele paciente durante o cadastro.

Exemplo:

Durante o cadastro foram selecionadas:

☑ Álcool
☑ Cocaína
☑ Crack

No prontuário deverá aparecer somente:

**Tipos de dependência**

* Álcool
* Cocaína
* Crack

Não apresentar:

* Maconha;
* LSD;
* Heroína;
* etc.

caso não tenham sido selecionados.

---

# 37. REGRA GERAL DE INTEGRIDADE

O sistema deve sempre preservar o histórico.

Nunca apagar definitivamente:

* documentos;
* versões;
* assinaturas;
* registros de auditoria;
* profissionais que já realizaram ações;
* justificativas;
* datas;
* horários.

Quando algo precisar deixar de estar ativo, utilizar:

**desativação/ocultação lógica**

e manter o registro disponível para consulta conforme as permissões do usuário.

---

# 38. EXPERIÊNCIA GERAL

O Reabilitah deve transmitir a ideia de que o papel está sendo substituído pelo sistema.

O fluxo principal deve ser:

**Criar documento**

↓

**Preencher**

↓

**Salvar**

↓

**Assinar paciente**

↓

**Assinar responsável**

↓

**Documento assinado**

↓

**Armazenamento digital**

↓

**Histórico**

↓

**Auditoria**

↓

**PDF/Impressão quando necessário**

A impressão deve existir como recurso complementar, e não como mecanismo principal de armazenamento.

---

# 39. IMPORTANTE — PRESERVAR O DESIGN

Novamente:

**NÃO recriar o layout.**

**NÃO trocar a paleta de cores.**

**NÃO trocar a tipografia.**

**NÃO criar outro sistema visual.**

Todas as novas telas, tabelas, filtros, formulários, áreas de assinatura, documentos e configurações devem utilizar os componentes e padrões visuais já existentes.

A nova funcionalidade deve parecer parte do mesmo sistema.

---

# 40. FLUXOS QUE DEVEM FUNCIONAR NO PROTÓTIPO

Priorizar estes fluxos para apresentação:

### Fluxo 1 — Documento assinado imediatamente

Paciente
→ Documento
→ Criar
→ Preencher
→ Salvar
→ Assinar paciente
→ Assinar responsável
→ Documento Assinado

### Fluxo 2 — Documento pendente

Paciente
→ Documento
→ Criar
→ Salvar
→ Pendente de assinatura
→ Sair

Depois:

Documentos
→ Filtro "Pendente de assinatura"
→ Abrir documento
→ Solicitar assinatura
→ Paciente assina
→ Responsável assina
→ Documento Assinado

### Fluxo 3 — Edição

Documento Assinado
→ Editar
→ Justificativa
→ Nova versão
→ Status Alterado/Pendente de assinatura
→ Nova assinatura
→ Status Assinado

### Fluxo 4 — Desativação

Documento Assinado
→ Desativar
→ Informar motivo
→ Documento desativado

### Fluxo 5 — Reativação

Documento desativado
→ Reativar
→ Informar motivo
→ Nova versão
→ Pendente de assinatura
→ Assinar novamente
→ Assinado

### Fluxo 6 — Central de documentos

Documentos
→ Buscar
→ Filtrar por status
→ Abrir documento
→ Visualizar
→ Editar, quando permitido
→ Desativar, quando permitido
→ Reativar, quando permitido
→ Visualizar auditoria
→ Visualizar PDF
→ Baixar PDF

### Fluxo 7 — Administração de equipe

Configurações
→ Equipe
→ Adicionar profissional
→ Cadastrar dados
→ Definir permissões
→ Criar usuário
→ Login com novo usuário

### Fluxo 8 — Assinatura presencial

Área de assinatura
→ Selecionar paciente
→ Selecionar documento
→ Visualizar documento
→ Assinatura do paciente
→ Confirmar
→ Assinatura do responsável
→ Confirmar
→ Documento finalizado

---

# RESULTADO ESPERADO

O resultado final deve ser uma evolução do protótipo existente, com foco em três pilares:

**1. PACIENTES**

Cadastro, prontuário e acompanhamento.

**2. DOCUMENTOS**

Criação, consulta, edição, versionamento, desativação, reativação, assinatura e PDF.

**3. AUDITORIA**

Rastreamento de todas as ações, versões, assinaturas, justificativas, usuários, datas e horários.

O sistema deve transmitir claramente a proposta do Reabilitah:

**reduzir a utilização de papel, centralizar os documentos da Luz do Vale, facilitar o trabalho da equipe e manter um histórico completo e rastreável das informações dos pacientes.**
