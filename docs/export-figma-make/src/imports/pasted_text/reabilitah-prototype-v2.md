# EVOLUÇÃO DO PROTÓTIPO — SISTEMA REABILITAH

Você já criou uma primeira versão funcional do protótipo do sistema Reabilitah. **NÃO recrie o sistema do zero.**

Este prompt deve ser interpretado como uma solicitação de **melhoria e evolução do protótipo existente**.

## REGRA PRINCIPAL — PRESERVAR O PROTÓTIPO EXISTENTE

Mantenha o mesmo layout, identidade visual, paleta de cores, tipografia, componentes, estilo dos cards, botões, campos, ícones, espaçamentos, bordas arredondadas, navegação e padrão visual já criado.

O design atual está aprovado visualmente e deve continuar sendo a base do sistema.

**Não substitua o design atual por outro estilo.**

Apenas:

* reorganize elementos quando necessário;
* remova funcionalidades/telas que foram solicitadas para remoção;
* adicione as novas funcionalidades descritas abaixo;
* melhore os fluxos existentes;
* conecte visualmente as novas telas ao padrão atual;
* mantenha os dados fictícios já utilizados no protótipo sempre que possível.

O objetivo é transformar o protótipo atual em uma versão mais completa e apresentável, mantendo a mesma identidade visual.

Todas as informações apresentadas continuam sendo **dados fictícios para demonstração**.

---

# 1. LOGIN

Mantenha a tela de login atual e seu layout.

Adicionar no canto inferior direito um botão:

**"Área familiar"**

Esse botão deve levar para uma área específica destinada aos familiares.

Neste momento, como se trata apenas de um protótipo, a Área Familiar pode utilizar dados fictícios e um fluxo simplificado de acesso.

Não alterar o restante do design da tela de login.

---

# 2. LOGIN E IDENTIFICAÇÃO DO PROFISSIONAL

REMOVER completamente a tela:

**"Selecione seu perfil"**

Não deve mais existir uma etapa onde o usuário escolhe manualmente entre Psicólogo, Enfermeiro, Psiquiatra, Administração ou Familiar depois do login.

No sistema real, o usuário será identificado automaticamente de acordo com suas credenciais e permissões cadastradas.

Para o protótipo, o login atualmente utilizado representa o usuário administrador da instituição.

Portanto:

LOGIN → SISTEMA IDENTIFICA O USUÁRIO → ENTRA DIRETAMENTE NO SISTEMA

Não criar uma tela intermediária de seleção de perfil.

---

# 3. ÁREA PACIENTES

A área **Pacientes é a principal área do sistema** e deve receber bastante atenção.

Mantenha o layout atual da lista de pacientes.

Cada paciente deve apresentar:

* Foto de perfil;
* Nome completo;
* Apelido;
* Tempo desde a última alteração relevante em documento.

Exemplo:

**João da Silva**
*Joãozinho*
Último documento atualizado há 2 horas

O tempo deve ser apresentado de maneira dinâmica conforme o dado fictício:

* minutos;
* horas;
* dias;
* meses;
* anos.

Exemplos:

"há 15 minutos"

"há 3 horas"

"há 2 dias"

"há 4 meses"

"há 1 ano"

## BUSCA DE PACIENTES

A busca existente deve continuar funcionando.

A pesquisa deve encontrar pacientes tanto pelo:

* nome completo;
* apelido.

Exemplo:

Se o paciente se chama:

**Carlos Eduardo Pereira**

e seu apelido é:

**Carlinhos**

a busca por "Carlos" ou "Carlinhos" deve encontrar o mesmo paciente.

---

# 4. BOTÃO "+" DA LISTA DE PACIENTES

O botão "+" existente na área Pacientes deve se tornar funcional no protótipo.

Não é necessário banco de dados real.

Porém, o comportamento deve ser funcional dentro do protótipo:

1. Usuário clica no botão "+".
2. Abre a tela de cadastro de novo paciente.
3. Usuário preenche os dados.
4. Usuário salva.
5. O paciente criado deve aparecer na lista de pacientes.
6. O paciente deve poder ser aberto normalmente.
7. Os dados preenchidos devem permanecer disponíveis durante a utilização do protótipo.

Não apresentar apenas uma tela estática.

O fluxo de criação deve funcionar para demonstração.

---

# 5. CADASTRO DE PACIENTE — FICHA DE ACOLHIMENTO

Ao clicar em "+" abrir uma tela intitulada:

**FICHA DE ACOLHIMENTO**

Organizar o formulário em seções visualmente separadas.

## DADOS DO ACOLHIDO

Campos:

* Foto de perfil — permitir selecionar/carregar uma imagem do dispositivo;
* Nome completo;
* Apelido;
* CPF;
* RG;
* Data de nascimento;
* Nacionalidade;
* Naturalidade;
* Município;
* Nome do pai;
* Nome da mãe;
* Escolaridade;
* Profissão;
* Cor;
* Estado civil;
* Filhos? — Sim / Não;
* Endereço;
* Bairro;
* Município;
* Estado;
* Data de acolhimento;
* Convênio;
* Acolhimento/Convênio;
* Data de desligamento.

## REGRA DOS CAMPOS

Nenhum campo deve ser obrigatório, com exceção de:

**Nome completo.**

O sistema deve permitir salvar o cadastro mesmo com os demais campos vazios.

---

# 6. TIPOS DE DEPENDÊNCIA

Criar uma seção:

**TIPOS DE DEPENDÊNCIA**

Utilizar caixas de seleção/checkboxes para permitir marcar as substâncias.

Opções:

* Álcool
* Maconha/Haxixe
* Cocaína
* Crack
* Inalantes/Cola/Solventes/Thinner
* Diazepam
* Afetam/REM/EMA
* Ecstasy/MDMA
* LSD
* Heroína/Morfina/Metanfetamina

Logo abaixo:

**Primeira droga lícita:** [campo]

**Idade:** [campo]

**Primeira droga ilícita:** [campo]

**Idade:** [campo]

Manter o mesmo padrão visual dos demais campos do sistema.

---

# 7. DADOS DO RESPONSÁVEL

Criar uma seção:

**DADOS DO RESPONSÁVEL**

O paciente pode possuir **mais de um responsável**.

Campos de cada responsável:

* Nome;
* Grau de parentesco;
* CPF;
* RG;
* Endereço;
* Contato;
* Data.

Adicionar um botão visual:

**"+ Adicionar responsável"**

Ao clicar, deve permitir adicionar outro responsável ao paciente.

Apenas o campo **Nome** é obrigatório.

---

# 8. CRIAÇÃO AUTOMÁTICA DO PRONTUÁRIO

Ao salvar um novo paciente, o sistema deve criar automaticamente um documento:

**PRONTUÁRIO**

Esse será o **único documento criado automaticamente** no momento do cadastro.

O prontuário deve conter todas as informações preenchidas no cadastro:

1. Dados do acolhido;
2. Tipos de dependência;
3. Dados dos responsáveis.

A criação desse documento deve aparecer no histórico do paciente como a primeira atividade.

A linha do tempo/histórico deve começar pela:

**Admissão do paciente**

---

# 9. PERFIL DO PACIENTE

Ao abrir um paciente pela área **PACIENTES**, manter o layout atual como base, mas melhorar o cabeçalho.

Na parte superior apresentar:

* Foto do paciente;
* Nome completo;
* Apelido;
* Idade;
* Tempo de permanência na instituição.

Exemplo:

**Carlos Eduardo Pereira**

*Carlinhos*

**32 anos**

**Internado há 4 meses**

Adicionar nessa mesma área:

**Editar paciente**

e manter também um botão:

**"+"**

Esse botão será utilizado para criar novos documentos para o paciente.

---

# 10. ABAS DO PERFIL DO PACIENTE

Abaixo do cabeçalho do paciente criar uma navegação/separador com duas áreas principais:

## PRONTUÁRIO

Deve apresentar todas as informações cadastradas anteriormente.

Organizar visualmente em blocos separados:

### Dados do acolhido

Informações pessoais.

### Tipos de dependência

Substâncias selecionadas e demais informações.

### Dados dos responsáveis

Todos os responsáveis cadastrados.

---

## HISTÓRICO

A antiga tela **Linha do Tempo** deve ser incorporada ao Histórico.

Não manter "Linha do Tempo" como uma área separada.

A área deve se chamar somente:

**HISTÓRICO**

O histórico deve apresentar todos os documentos e eventos relacionados ao paciente em uma linha do tempo organizada.

---

# 11. DOCUMENTOS DO HISTÓRICO

Ao cadastrar um paciente, o primeiro documento será automaticamente:

**PRONTUÁRIO**

Os demais documentos somente aparecerão quando forem criados pelos usuários.

Cada item do histórico deve apresentar:

* Título do documento;
* ID do documento;
* Data;
* Hora;
* Minuto;
* Usuário responsável pela criação;
* Status atual.

Exemplo:

**EVOLUÇÃO GERAL**
ID: DOC-000023
09/08/2026 — 14:32
Criado por: Maria Silva

---

# 12. STATUS DOS DOCUMENTOS

Existem três situações:

### Documento normal

Quando criado e nunca alterado.

Exibir normalmente.

### Documento editado

Quando o documento sofreu alteração e continua ativo.

Exibir na lateral direita uma mensagem:

**Documento Editado**

Utilizar o padrão visual amarelo já existente no sistema.

### Documento removido

Quando o documento foi ocultado/removido.

Exibir:

**Documento Removido**

Utilizar o padrão visual vermelho.

IMPORTANTE:

**NENHUM DOCUMENTO DEVE SER EXCLUÍDO DEFINITIVAMENTE.**

Mesmo um documento removido deve continuar disponível para consulta.

Todos os registros históricos devem permanecer armazenados no sistema.

---

# 13. AUDITORIA E VERSIONAMENTO

Ao clicar em qualquer documento do histórico, abrir sua visualização.

Essa tela deve possuir duas áreas:

## DOCUMENTO

Exibir o conteúdo do documento.

Adicionar:

**Baixar documento**

O download deve utilizar o layout configurado na área:

**Configurações → Layout**

O documento deve possuir aparência profissional.

Também apresentar o:

**ID do documento**

---

## AUDITORIA

Criar uma área:

**AUDITORIA**

Ela deve mostrar todas as versões e alterações realizadas no documento.

Exemplo:

VERSÃO 1
Criado em 09/08/2026 às 14:32
Responsável: Maria Silva

VERSÃO 2
Alterado em 09/08/2026 às 15:10
Responsável: João Souza
Justificativa: Correção das informações do atendimento.

VERSÃO 3
Removido em 09/08/2026 às 16:02
Responsável: Maria Silva
Motivo: Documento criado incorretamente.

O comportamento deve ser:

CRIAR → mantém versão original

EDITAR → mantém versão anterior e cria uma nova versão

REMOVER → não exclui; apenas marca como removido

---

# 14. REMOÇÃO DE DOCUMENTO

Quando o usuário clicar para remover um documento, NÃO excluir o documento.

Antes de confirmar, abrir uma janela solicitando:

**Motivo da remoção**

Campo de texto para justificativa.

Botões:

**Cancelar**

**Confirmar remoção**

Depois da confirmação:

* documento continua disponível;
* status passa para "Documento Removido";
* motivo fica registrado na auditoria;
* usuário responsável fica registrado;
* data e hora ficam registradas.

---

# 15. BOTÃO "+" DENTRO DO PERFIL DO PACIENTE

O botão "+" no perfil do paciente será responsável pela criação de novos documentos.

Ao clicar, abrir:

**NOVO DOCUMENTO**

Apresentar uma lista de documentos disponíveis:

* Evolução de enfermagem;
* Ficha de acolhimento;
* Avaliação de enfermagem;
* Termos;
* Controle de saída de pacientes;
* Evolução geral.

Para o protótipo, implementar funcionalmente apenas três documentos:

1. Termo de Acolhimento;
2. Controle de Saída de Pacientes;
3. Evolução Geral.

Os demais podem aparecer na lista como opções disponíveis, mas podem apresentar indicação de que estão em desenvolvimento ou ainda não implementados no protótipo.

---

# 16. DOCUMENTO — TERMO DE ACOLHIMENTO

Ao selecionar:

**TERMO DE ACOLHIMENTO**

Abrir o formulário/documento com o título:

**TERMO DE ACOLHIMENTO**

Inserir o seguinte texto:

"Estou ciente de que o tratamento é de caráter gratuito, sendo que fico isento de pagar qualquer valor referente à mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para inclusão no tratamento, com as quais concordo, e estou ciente dos meus direitos e deveres junto a esta instituição."

Abaixo:

**LISTA DE PERTENCES:**

Criar uma área de texto ampla para preenchimento.

No final criar campos/áreas para assinatura:

**Acolhido**

**Responsável pelo acolhimento**

**Monitor responsável**

O documento deve seguir o padrão visual profissional definido pelo sistema.

---

# 17. DOCUMENTO — CONTROLE DE SAÍDA DE PACIENTES

Criar o documento:

**CONTROLE DE SAÍDA DE PACIENTES**

Campos:

**Data e horário da saída**

**Data e horário do retorno**

**Motivo da saída**

No final:

**Assinatura do responsável**

**Assinatura do residente**

---

# 18. DOCUMENTO — EVOLUÇÃO GERAL

Criar o documento:

**EVOLUÇÃO GERAL**

Inserir automaticamente o texto:

"Nesta evolução consta o registro de forma geral da equipe técnica: coordenador, psicóloga e monitores concernente à evolução do acolhido na instituição."

Logo abaixo, mostrar automaticamente o nome do paciente.

Exemplo:

**Acolhido: Carlos Eduardo Pereira**

Depois criar uma área de texto grande para que o profissional registre a evolução livremente.

---

# 19. IDENTIFICAÇÃO DOS DOCUMENTOS

Todo documento criado deverá receber automaticamente um ID único.

Exemplo:

**DOC-000001**

**DOC-000002**

**DOC-000003**

O ID deve aparecer:

* no histórico;
* na visualização do documento;
* na área de auditoria;
* no documento quando ele for visualizado/baixado.

---

# 20. PADRONIZAÇÃO VISUAL DOS DOCUMENTOS

Todos os documentos criados devem utilizar o layout configurado pelo usuário em:

**Configurações → Layout**

Os documentos devem possuir aparência profissional, organizada e adequada para impressão/download.

Manter:

* cabeçalho;
* identificação da instituição;
* identificação do paciente;
* título do documento;
* conteúdo;
* identificação do responsável;
* data;
* ID do documento;
* campos de assinatura quando necessários.

Não alterar a identidade visual geral do sistema.

---

# 21. TELA INÍCIO / DASHBOARD

Manter o layout atual do Dashboard como base, mas reorganizar as informações.

Exibir:

**Olá, [nome do usuário logado]**

Depois apresentar indicadores:

* Pacientes ativos;
* Média de tempo de internação em dias;
* Total de relatórios/documentos criados;
* Relatórios/documentos criados no mês atual.

O indicador mensal deve possuir alguma forma de selecionar outros meses para consulta.

Exemplo:

**Agosto 2026 ▼**

permitindo selecionar outro mês.

---

# 22. PRÓXIMOS ANIVERSARIANTES

Criar uma área:

**PRÓXIMOS ANIVERSARIANTES**

Mostrar pacientes e usuários/profissionais que fazem aniversário próximo.

Utilizar diferenciação visual:

Paciente:
**verde claro**

Funcionário/usuário do sistema:
**verde escuro**

Apresentar:

* nome;
* tipo — paciente ou funcionário;
* data do aniversário;
* idade que completará, quando aplicável.

Utilizar dados fictícios.

---

# 23. QUADRO DE AVISOS

Criar uma área:

**QUADRO DE AVISOS**

Qualquer usuário poderá criar um aviso.

Exemplo:

"Vamos fazer uma reunião quinta-feira às 14:30."

Adicionar botão:

**+ Novo aviso**

Ao criar o aviso, permitir configurar:

* mensagem;
* período de início;
* período de duração/expiração.

O aviso deve aparecer na tela inicial enquanto estiver dentro do período configurado.

Depois de expirado, não deve mais aparecer como aviso ativo.

Para o protótipo, essa funcionalidade deve funcionar com dados fictícios durante a navegação.

---

# 24. ÚLTIMOS DOCUMENTOS/RELATÓRIOS

Na tela inicial criar uma área:

**Últimos documentos criados**

Mostrar os últimos 3 documentos criados.

Cada item deve apresentar:

* título;
* paciente;
* data;
* horário;
* responsável;
* status.

Ao clicar, deve levar para o documento correspondente.

---

# 25. MENU — REMOVER FUNCIONALIDADES

Remover completamente do menu principal:

**Agenda**

e

**Relatórios**

Não devem aparecer como opções principais de navegação.

As informações relacionadas aos documentos/relatórios devem ser acessadas principalmente através do perfil do paciente e do Dashboard.

---

# 26. CONFIGURAÇÕES

Manter a área:

**Informações Pessoais**

Porém, remover a opção separada:

**Segurança e Senha**

As configurações de segurança e senha deverão ficar dentro de:

**Informações Pessoais**

Manter:

**Notificações**

---

# 27. ALTERAR "APARÊNCIA" PARA "LAYOUT"

Na área Configurações, renomear:

**Aparência**

para:

**Layout**

Essa área será responsável pela configuração do modelo visual dos documentos gerados pelo sistema.

O usuário poderá configurar o padrão que será utilizado nos documentos.

A configuração deverá afetar documentos como:

* Prontuário;
* Termo de acolhimento;
* Controle de saída;
* Evolução geral;
* demais documentos futuramente implementados.

Manter as demais configurações já existentes no protótipo.

---

# 28. DADOS FICTÍCIOS

IMPORTANTE:

Não remover os dados fictícios que já existem no protótipo.

Continue utilizando nomes, pacientes, profissionais, documentos, datas e demais informações fictícias para demonstrar o funcionamento.

Quando novas informações forem necessárias, criar novos dados fictícios coerentes com os já existentes.

O objetivo é que o protótipo pareça um sistema real funcionando, mas sem utilizar dados reais de pacientes.

---

# 29. NAVEGAÇÃO E INTERAÇÃO

O protótipo deve ser navegável.

Priorizar os seguintes fluxos:

LOGIN
→ INÍCIO

INÍCIO
→ PACIENTES

PACIENTES
→ PACIENTE

PACIENTE
→ PRONTUÁRIO

PACIENTE
→ HISTÓRICO

PACIENTE
→ NOVO DOCUMENTO

PACIENTE
→ EDITAR PACIENTE

PACIENTE
→ +

NOVO DOCUMENTO
→ TERMO DE ACOLHIMENTO

NOVO DOCUMENTO
→ CONTROLE DE SAÍDA

NOVO DOCUMENTO
→ EVOLUÇÃO GERAL

HISTÓRICO
→ DOCUMENTO

DOCUMENTO
→ AUDITORIA

DOCUMENTO
→ EDITAR

DOCUMENTO
→ REMOVER

LOGIN
→ ÁREA FAMILIAR

---

# 30. PRINCÍPIO GERAL DO PROTÓTIPO

O sistema deve transmitir a ideia de um **Prontuário Eletrônico para gerenciamento e acompanhamento dos pacientes da instituição Luz do Vale**, centralizando:

* cadastro de pacientes;
* prontuário;
* documentos;
* histórico;
* auditoria;
* profissionais;
* informações administrativas;
* acesso familiar.

A proposta do sistema é substituir processos atualmente realizados de maneira manual e descentralizada por uma solução centralizada, organizada e rastreável.

**Não transformar o sistema em um aplicativo genérico de clínica ou hospital.**

O contexto deve permanecer focado em:

**Luz do Vale → acolhimento → reabilitação → acompanhamento → prontuário → documentos → histórico → auditoria.**

---

# RESULTADO ESPERADO

Ao finalizar essas alterações, o protótipo deve parecer uma evolução natural do sistema que você já criou.

**Não criar um novo design.**

**Não trocar a paleta.**

**Não trocar a tipografia.**

**Não mudar desnecessariamente os componentes existentes.**

**Não remover os dados fictícios atuais sem necessidade.**

A prioridade é:

1. preservar o design atual;
2. melhorar os fluxos;
3. adicionar as funcionalidades descritas;
4. tornar Pacientes e Documentos as áreas centrais;
5. demonstrar criação e edição de dados durante a apresentação;
6. demonstrar histórico e auditoria;
7. demonstrar criação de documentos;
8. manter tudo visualmente consistente;
9. garantir que as telas estejam conectadas e navegáveis;
10. deixar o protótipo com aparência de um sistema real pronto para ser apresentado aos professores e posteriormente validado pela instituição Luz do Vale.
