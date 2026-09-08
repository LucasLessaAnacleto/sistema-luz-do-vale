# REABILITAH — REFINAMENTO DO PROTÓTIPO E NOVOS FLUXOS

Este prompt é uma continuação direta do protótipo atual do Reabilitah.

**NÃO recrie o sistema do zero. NÃO altere a identidade visual existente sem necessidade.**

Mantenha a mesma paleta de cores, tipografia, componentes, espaçamentos, navegação, ícones e linguagem visual já estabelecidos. As novas telas e funcionalidades devem parecer parte do mesmo sistema.

O objetivo desta etapa é refinar a experiência, profissionalizar a apresentação dos documentos, aprimorar assinaturas, auditoria, permissões e desenvolver a comunicação com familiares.

## CORREÇÃO CONCEITUAL IMPORTANTE

Considerar definitivamente a seguinte regra:

**PRONTUÁRIO não é um documento individual.**

O prontuário é o conjunto de documentos pertencentes ao paciente.

O primeiro documento criado automaticamente quando um paciente é cadastrado é:

**FICHA ACOLHIMENTO**

Portanto:

Paciente
→ Prontuário
→ Histórico de documentos
→ Primeiro documento: Ficha Acolhimento

A **Ficha Acolhimento** deve possuir exatamente o mesmo comportamento dos demais documentos: versionamento, auditoria, assinatura, desativação, reativação, PDF e histórico.

---

# 1. INÍCIO — SAUDAÇÃO

Na tela Início, alterar:

"Olá, (sobrenome)"

para:

**"Olá, (nome + sobrenome)"**

Exemplo:

**Olá, Abel Silva**

Utilizar o nome e sobrenome do usuário atualmente logado.

---

# 2. INÍCIO — MINI DASHBOARD

Na parte superior do Início existe um pequeno dashboard.

Remover completamente o ícone de sino/notificações dessa área.

Reduzir visualmente os quatro indicadores:

* Pacientes ativos;
* Média de internação em dias;
* Total de documentos;
* Documentos no mês.

Eles devem ocupar menos espaço vertical e horizontal.

O objetivo é deixar o dashboard mais compacto tanto em desktop quanto em celular.

Manter as mesmas informações, apenas reorganizar o espaço de maneira mais eficiente.

---

# 3. INÍCIO — ANIVERSARIANTES

Na seção:

**Próximos aniversariantes**

mostrar todos os aniversariantes dos próximos **30 dias**.

Manter a diferenciação visual:

* Pacientes → verde claro;
* Funcionários/profissionais → verde escuro.

Não limitar a lista a poucos aniversariantes.

---

# 4. ORDEM DAS INFORMAÇÕES NO INÍCIO

Alterar a ordem das seções.

A prioridade deverá ser:

1. Indicadores;
2. Quadro de avisos;
3. Últimos documentos criados;
4. Próximos aniversariantes;
5. Área de comunicação geral com familiares.

Os aniversariantes devem ficar abaixo dos últimos documentos criados.

---

# 5. PRONTUÁRIO DO PACIENTE

Ao entrar no perfil de um paciente, manter:

**Prontuário**

**Histórico**

Adicionar/reforçar que o Prontuário representa o conjunto de documentos do paciente.

As informações cadastrais do acolhido não devem ser tratadas como um documento isolado chamado "Prontuário".

O documento inicial é:

**Ficha Acolhimento**

---

# 6. FICHA ACOLHIMENTO

Quando o paciente for cadastrado, gerar automaticamente o documento:

**FICHA ACOLHIMENTO**

Esse será o primeiro documento do histórico do paciente.

Ele deverá conter todas as informações preenchidas durante o cadastro:

* Dados do acolhido;
* Tipos de dependência;
* Dados do responsável.

Esse documento deverá possuir:

* ID;
* versão;
* data;
* hora;
* usuário que criou;
* status;
* assinatura;
* auditoria;
* possibilidade de visualização;
* possibilidade de PDF;
* possibilidade de edição;
* possibilidade de desativação;
* possibilidade de reativação.

---

# 7. FICHA ACOLHIMENTO NO HISTÓRICO

No Histórico do paciente, a primeira entrada obrigatoriamente deverá ser:

**FICHA ACOLHIMENTO**

Exemplo:

**09/08/2026 — 14:20**

FICHA ACOLHIMENTO
Paciente: Carlos Eduardo Pereira
Criado por: Abel
Status: Pendente de assinatura

Depois dela aparecem cronologicamente todos os demais documentos.

---

# 8. EDIÇÃO DO PERFIL DO PACIENTE

Ao clicar em:

**Editar paciente**

não criar um fluxo separado e simplificado.

A alteração das informações do paciente deve respeitar o mesmo conceito de controle documental.

Caso a alteração gere alteração na Ficha Acolhimento, o sistema deverá:

1. Criar nova versão da Ficha Acolhimento;
2. Registrar quem alterou;
3. Registrar data e hora;
4. Solicitar justificativa quando aplicável;
5. Marcar a nova versão como alterada/pendente;
6. Exigir novamente as assinaturas necessárias;
7. Preservar a versão anterior.

A versão anterior nunca deve ser sobrescrita.

---

# 9. AUDITORIA — BUSCA

Dentro da área de Auditoria, adicionar busca.

Permitir pesquisar por:

* Nome do documento;
* ID;
* Nome do paciente;
* Apelido;
* Nome do usuário;
* Texto existente no documento;
* Versão.

Adicionar filtros por:

* Status;
* Tipo de documento;
* Usuário;
* Data;
* Paciente.

A auditoria precisa ser facilmente pesquisável mesmo quando a instituição possuir grande quantidade de documentos.

---

# 10. AUDITORIA — VISUALIZAÇÃO DE TODAS AS VERSÕES

Ao abrir um documento e acessar:

**Auditoria**

mostrar claramente todas as versões existentes.

Exemplo:

**Versão 1 — Criada em 09/08/2026**

**Versão 2 — Alterada em 10/08/2026**

**Versão 3 — Alterada em 12/08/2026**

O usuário deve conseguir clicar em qualquer versão.

Ao clicar:

**Versão 1**

→ visualizar exatamente como o documento estava naquela versão.

Ao clicar:

**Versão 2**

→ visualizar o documento naquela versão.

Ao clicar:

**Versão 3**

→ visualizar a versão mais recente.

Isso precisa funcionar no protótipo, não apenas ser uma informação visual.

Adicionar uma navegação clara entre versões:

**← Versão anterior**

**Versão atual**

**Próxima versão →**

---

# 11. ASSINATURAS — NOVA ORDEM

Alterar definitivamente a ordem das assinaturas.

Para qualquer documento que necessite das duas assinaturas:

**1º RESPONSÁVEL**

**2º ACOLHIDO/PACIENTE**

Fluxo:

Documento
→ Responsável assina
→ Acolhido assina
→ Documento finalizado

Essa ordem deverá ser utilizada em todos os documentos aplicáveis.

---

# 12. ÁREA DE ASSINATURA — MELHORAR EXPERIÊNCIA

A área atual de assinatura está pequena.

Criar uma área inicialmente compacta contendo:

**Clique para assinar**

Ao clicar, abrir uma área de assinatura expandida.

Essa área deverá ser um retângulo grande, proporcional ao espaço necessário para uma assinatura manuscrita adequada.

Exemplo:

┌────────────────────────────────────────────┐
│                                            │
│                                            │
│           ÁREA DE ASSINATURA               │
│                                            │
│                                            │
└────────────────────────────────────────────┘

Botões:

**Limpar**

**Cancelar**

**Confirmar assinatura**

---

# 13. ASSINATURA EM CELULAR

No celular, a experiência de assinatura deve ser especialmente otimizada.

Ao iniciar a assinatura:

**solicitar/permitir orientação horizontal do aparelho (modo paisagem).**

Utilizar praticamente toda a largura disponível da tela para a assinatura.

O objetivo é que o paciente consiga utilizar o dedo ou caneta com liberdade.

A área de assinatura deve ser grande o suficiente para que a assinatura seja legível quando incorporada ao documento.

Depois da confirmação, retornar à orientação normal do sistema.

Essa experiência deve ser demonstrada no protótipo.

---

# 14. CONFIRMAÇÃO DE AÇÕES IMPORTANTES

Criar confirmações para ações importantes em todo o sistema.

Antes de executar uma ação crítica, apresentar uma confirmação.

Exemplos:

**Salvar documento**

"Tem certeza que deseja salvar este documento?"

**Editar documento**

"Essa alteração criará uma nova versão e será necessário realizar novamente as assinaturas. Deseja continuar?"

**Desativar documento**

"Este documento será desativado, mas continuará armazenado. Deseja continuar?"

Solicitar motivo quando necessário.

**Reativar documento**

"Este documento será reativado e uma nova assinatura será necessária. Deseja continuar?"

**Alterar permissões**

"Você está alterando as permissões deste usuário. Deseja continuar?"

**Desativar profissional**

"Este profissional perderá o acesso ao sistema, mas seu histórico será preservado. Deseja continuar?"

As confirmações devem existir para ações relevantes e irreversíveis ou que alterem informações importantes.

Não colocar confirmação excessiva em ações triviais como abrir uma tela ou simplesmente visualizar um documento.

---

# 15. DOCUMENTOS — PADRÃO VISUAL

Os documentos estão visualmente muito enfeitados.

Modificar completamente a apresentação interna dos documentos.

O documento deverá ter aparência de um documento profissional institucional/médico.

Utilizar:

* Fundo branco;
* Fonte profissional e legível;
* Texto predominantemente preto;
* Título centralizado;
* Título em tamanho maior;
* Título em negrito;
* Corpo do documento abaixo;
* Espaçamento adequado;
* Margens profissionais;
* Estrutura limpa;
* Sem cards coloridos;
* Sem elementos decorativos desnecessários;
* Sem excesso de ícones;
* Sem aparência de dashboard.

O documento deve parecer um documento oficial quando visualizado ou impresso.

Manter a identidade visual do sistema nas telas de navegação, mas **não transformar o conteúdo do documento em uma interface de aplicativo**.

---

# 16. CABEÇALHO INSTITUCIONAL

Na Configurações → Layout, substituir o sistema atual de personalização textual.

O usuário não deverá configurar manualmente fontes, cores, tamanho de título ou espaçamentos.

Criar:

**LAYOUT INSTITUCIONAL**

O layout será composto por dois arquivos de imagem:

### ANEXO SUPERIOR

Permitir carregar uma imagem retangular.

Essa imagem poderá conter:

* Logo;
* Nome da instituição;
* Endereço;
* Telefone;
* Email;
* Site;
* outras informações institucionais.

A imagem será utilizada como cabeçalho dos documentos.

Não colar a imagem no limite superior da folha.

Criar margem/espaçamento suficiente para que o cabeçalho tenha aparência profissional.

---

# 17. RODAPÉ INSTITUCIONAL

Criar:

**ANEXO INFERIOR**

Permitir carregar uma segunda imagem retangular.

Ela poderá conter:

* Logo;
* informações;
* telefone;
* endereço;
* site;
* outros dados institucionais.

Essa imagem será utilizada como rodapé dos documentos.

Também deve possuir espaçamento adequado em relação ao final do conteúdo.

---

# 18. PREVISUALIZAÇÃO DO LAYOUT

Dentro de:

**Configurações → Layout**

criar um botão:

**Visualizar modelo**

Ao clicar, abrir uma prévia de uma folha A4.

Mostrar:

* Anexo superior;
* título fictício;
* corpo de texto fictício;
* área de assinaturas;
* assinatura fictícia/generalizada;
* anexo inferior;
* informações do documento.

O objetivo é permitir que a instituição veja como o documento ficará antes de gerar documentos reais.

---

# 19. COR DAS IMAGENS

Permitir que os anexos institucionais sejam imagens coloridas.

Não aplicar filtros ou conversões automáticas.

A imagem deve aparecer no PDF exatamente conforme o arquivo configurado, respeitando o tamanho e posicionamento definidos pelo sistema.

---

# 20. IDENTIFICAÇÃO DO DOCUMENTO NO FINAL

Abaixo do anexo inferior, adicionar uma pequena identificação técnica do documento.

Utilizar no máximo duas linhas.

Exemplo:

**ID: DOC-000152 | Versão: 03 | Gerado por: Abel | 10/08/2026 14:32**

**Status: Assinado | Paciente: Carlos Eduardo Pereira**

A informação deve ser pequena e discreta, mas perfeitamente legível.

---

# 21. TELA EXCLUSIVA DE EQUIPE

Em Configurações, ao acessar:

**Equipe**

abrir uma tela exclusiva para gerenciamento de usuários.

Não utilizar apenas uma aba expansível dentro de Configurações.

A tela deve possuir:

* lista de usuários;
* busca;
* filtros;
* status;
* função;
* ações;
* botão adicionar profissional.

---

# 22. CONTROLE COMPLETO DE USUÁRIOS

Na tela de cada profissional permitir demonstrar:

**Editar usuário**

**Alterar senha**

**Alterar função**

**Alterar email**

**Alterar dados pessoais**

**Alterar permissões**

**Desativar usuário**

**Reativar usuário**

Todas essas ações devem possuir confirmação quando forem relevantes.

---

# 23. LOG ADMINISTRATIVO DOS USUÁRIOS

Criar dentro da área de Equipe uma área:

**Log de atividades**

Esse log será visível **somente para o super administrador**.

Registrar:

* criação de usuário;
* alteração de nome;
* alteração de email;
* alteração de função;
* alteração de senha;
* alteração de permissões;
* ativação;
* desativação;
* reativação;
* demais alterações administrativas.

Exemplo:

**Abel alterou a função de João Silva**

10/08/2026 — 15:42

**Abel alterou as permissões de Maria Souza**

10/08/2026 — 16:10

---

# 24. ÁREA DE COMUNICAÇÃO COM FAMILIARES

Dentro do perfil do paciente, adicionar uma terceira seção:

**Comunicação Familiar**

As três seções do paciente serão:

**Prontuário**

**Histórico**

**Comunicação Familiar**

Essa área será a visão do profissional.

---

# 25. COMUNICAÇÃO FAMILIAR — CHAT

Criar uma interface semelhante a um chat.

O profissional poderá:

* enviar mensagens;
* enviar anexos;
* enviar mensagem + anexo;
* visualizar mensagens recebidas;
* visualizar anexos recebidos;
* responder familiares.

Os familiares também poderão:

* enviar mensagens;
* enviar anexos;
* responder mensagens.

Cada mensagem deve apresentar:

* autor;
* data;
* hora;
* conteúdo;
* anexo quando existir.

---

# 26. LOGIN DO FAMILIAR

No cadastro do responsável pelo paciente, adicionar opção:

**Criar acesso à área familiar**

Caso habilitado, permitir definir:

* usuário/login;
* senha inicial.

O familiar poderá utilizar essas credenciais para acessar o sistema.

Criar uma experiência de login específica para familiares.

---

# 27. ÁREA DO FAMILIAR

Quando o familiar entrar no sistema, apresentar uma interface diferente da equipe profissional.

O familiar deverá ter acesso principalmente a:

**Meu familiar**

**Comunicação com a instituição**

**Mural da instituição**

Não mostrar ferramentas administrativas ou documentos internos que não tenham sido autorizados.

---

# 28. NOTIFICAÇÃO DE NOVAS MENSAGENS

Na área de Pacientes, para os profissionais, criar indicação quando houver comunicação familiar não visualizada.

Pode ser uma pequena bolinha amarela ou outro elemento visual coerente.

Exemplo:

**Pacientes ● 3**

Ao abrir, indicar quais pacientes possuem mensagens não visualizadas.

Também considerar notificações de:

* novas mensagens;
* anexos recebidos;
* documentos aguardando assinatura, quando fizer sentido para o usuário.

Respeitar as permissões de cada usuário.

---

# 29. MURAL INSTITUCIONAL

Na tela Início, abaixo do quadro de avisos, criar uma área:

**Mural da Luz do Vale**

Essa área será uma pequena rede social institucional.

Ao clicar, abrir uma nova tela:

**Mural Institucional**

---

# 30. PUBLICAÇÕES DO MURAL

Profissionais autorizados poderão criar publicações.

Uma publicação poderá conter:

* texto;
* imagem;
* imagem + texto.

Exemplos:

"Hoje tivemos uma atividade esportiva com os acolhidos."

ou uma fotografia de uma atividade realizada na instituição.

---

# 31. OBJETIVO DO MURAL

O Mural não será uma rede social pública.

Ele servirá para comunicação institucional com os familiares.

Todos os familiares que possuem acesso poderão visualizar as publicações autorizadas.

---

# 32. IDENTIDADE DAS PUBLICAÇÕES

As publicações não deverão mostrar o nome pessoal do funcionário.

Sempre apresentar:

**Luz do Vale**

com:

* logo da instituição;
* nome da instituição;
* data;
* hora;
* minuto.

A logo e o nome exibidos nas publicações devem utilizar as informações configuradas em:

**Configurações → Instituição**

---

# 33. CURTIDAS

Familiares poderão:

**Curtir**

ou

**Descurtir**

uma publicação.

A identidade de quem curtiu **não deverá aparecer para outros usuários**.

Apenas o contador será público.

Exemplo:

**Luz do Vale**
09/08/2026 — 15:32

[imagem]

"Hoje realizamos uma atividade esportiva."

**♥ 18 curtidas**

Cada familiar poderá curtir ou remover sua própria curtida.

---

# 34. ÁREA FAMILIAR — DUAS EXPERIÊNCIAS

A área familiar deverá possuir dois espaços distintos:

### Comunicação privada

Chat específico relacionado ao paciente/família.

### Mural institucional

Publicações gerais da instituição.

O familiar poderá conversar privadamente com a equipe e também acompanhar as publicações gerais da instituição.

---

# 35. PERMISSÕES — EXPANDIR O SISTEMA

Todas as novas funcionalidades deverão ser integradas ao sistema de permissões.

O super administrador poderá controlar o que cada profissional pode acessar.

Adicionar permissões para:

### DOCUMENTOS

* Visualizar documentos;
* Criar documentos;
* Editar documentos;
* Desativar documentos;
* Reativar documentos;
* Visualizar documentos desativados;
* Visualizar auditoria;
* Exportar PDF;
* Realizar assinaturas quando aplicável.

### PACIENTES

* Visualizar;
* Criar;
* Editar;
* Desativar.

### COMUNICAÇÃO FAMILIAR

* Visualizar;
* Enviar mensagens;
* Receber/interagir;
* Enviar anexos;
* Visualizar anexos.

### MURAL

* Visualizar;
* Criar publicação;
* Editar publicação;
* Remover publicação;
* Gerenciar publicações.

### QUADRO DE AVISOS

* Visualizar;
* Criar aviso;
* Editar aviso;
* Remover aviso.

### EQUIPE

Somente usuários autorizados poderão:

* visualizar equipe;
* criar usuários;
* editar usuários;
* alterar permissões;
* alterar senha;
* ativar;
* desativar;
* visualizar logs.

### CONFIGURAÇÕES

Separar permissões para:

* Layout institucional;
* Dados da instituição;
* Configurações gerais.

---

# 36. SUPER ADMINISTRADOR

O super administrador deverá possuir acesso total.

No protótipo:

**Abel = Super Administrador**

Ele poderá acessar todas as áreas e permissões.

---

# 37. REGRA DE SEGURANÇA VISUAL

Se o usuário não possuir uma determinada permissão:

* não mostrar o botão da ação quando possível;
* ou apresentar a ação desabilitada quando for necessário demonstrar sua existência.

Nunca permitir que um usuário execute uma ação que não esteja autorizada.

Exemplo:

Usuário sem permissão de desativar documentos:

→ pode visualizar documento;

→ não possui botão "Desativar".

---

# 38. AUDITORIA DE TODAS AS ÁREAS

Além dos documentos, registrar ações relevantes em:

* pacientes;
* documentos;
* assinaturas;
* usuários;
* permissões;
* comunicação familiar;
* mural;
* avisos;
* configurações.

Sempre que fizer sentido, registrar:

**Quem**

**O quê**

**Quando**

**Data**

**Hora**

**Motivo/justificativa, quando aplicável**

---

# 39. RESPONSIVIDADE

Todas as novas telas devem funcionar em:

* Desktop;
* Tablet;
* Celular.

Dar atenção especial à:

* assinatura;
* visualização de documentos;
* chat;
* filtros;
* central de documentos;
* gerenciamento de equipe.

No celular, evitar telas excessivamente comprimidas.

Quando uma tarefa exigir área maior, utilizar tela cheia ou orientação horizontal, principalmente na assinatura.

---

# 40. FLUXO COMPLETO DE DOCUMENTO

O protótipo deve demonstrar claramente este fluxo:

**Criar documento**

↓

**Preencher documento**

↓

**Salvar**

↓

**Responsável assina**

↓

**Paciente/Acolhido assina**

↓

**Documento Assinado**

↓

**Armazenamento**

↓

**Histórico**

↓

**Auditoria**

↓

**PDF**

↓

**Impressão opcional**

Se o paciente ou responsável não estiver presente:

**Criar**

↓

**Pendente de assinatura**

↓

**Solicitar assinatura posteriormente**

↓

**Responsável assina**

↓

**Paciente assina**

↓

**Assinado**

---

# 41. FLUXO DE ALTERAÇÃO

Documento Assinado

↓

Editar

↓

Confirmar alteração

↓

Informar justificativa quando necessário

↓

Nova versão

↓

Status: Alterado / Pendente de assinatura

↓

Responsável assina novamente

↓

Paciente assina novamente

↓

Status: Assinado

A versão anterior permanece disponível.

---

# 42. FLUXO DE DESATIVAÇÃO E REATIVAÇÃO

Documento Assinado

↓

Desativar

↓

Confirmar

↓

Informar motivo

↓

Documento desativado

↓

Visualização preservada

↓

Reativar

↓

Confirmar

↓

Informar motivo

↓

Nova versão

↓

Pendente de assinatura

↓

Responsável assina

↓

Paciente assina

↓

Assinado

---

# 43. OBJETIVO FINAL DO PROTÓTIPO

O protótipo deve transmitir uma visão clara de um sistema real para a Luz do Vale.

O Reabilitah deverá demonstrar:

**Gestão de pacientes**

**Prontuário digital**

**Documentação digital**

**Assinatura presencial**

**Versionamento**

**Auditoria**

**Controle de acesso**

**Gestão de equipe**

**Comunicação com familiares**

**Mural institucional**

**Exportação para PDF**

**Impressão**

**Redução da utilização de papel**

O sistema deve continuar visualmente limpo, profissional, humanizado e coerente com o protótipo já existente.

Não adicionar elementos visuais apenas para "enfeitar". Priorizar clareza, facilidade de uso, organização das informações e aparência de um sistema que realmente poderia ser utilizado pela instituição.
