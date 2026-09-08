EABILITAH — REFINAMENTO DO PROTÓTIPO: DOCUMENTOS, AUDITORIA, ASSINATURA GOV.BR E CONTROLE DE USUÁRIOS

Este prompt é uma continuação do protótipo existente do Reabilitah.

NÃO recrie o sistema do zero.

Mantenha a identidade visual, paleta de cores, tipografia, componentes, navegação e estrutura geral já existentes.

O objetivo é corrigir e simplificar funcionalidades existentes e implementar as novas regras descritas abaixo.

Priorize funcionalidade, clareza, aparência profissional e consistência entre as telas.

1. REMOVER COMPLETAMENTE A ÁREA FAMILIAR

Remover do projeto inteiro tudo que estiver relacionado à Área Familiar, Comunicação Familiar, Chat com familiares, Mural para familiares ou qualquer funcionalidade destinada ao acesso de familiares.

Fazer uma busca completa em todas as telas e fluxos do protótipo.

Remover:

Área familiar no login;
Comunicação Familiar;
Chat com familiares;
mensagens para familiares;
anexos para familiares;
notificações relacionadas a familiares;
Mural/rede social institucional;
publicações para familiares;
curtidas;
qualquer botão relacionado a familiares;
qualquer tela relacionada a familiares;
qualquer permissão relacionada a comunicação familiar.
EXCEÇÕES

Manter obrigatoriamente:

Responsáveis do paciente

Informações dos pais do paciente

Essas informações fazem parte exclusivamente do cadastro e do prontuário do paciente.

Não transformar essas informações em uma Área Familiar.

2. EQUIPE — PERMISSÕES

A área:

Configurações → Equipe

deve possuir uma tela exclusiva para gerenciamento de profissionais.

Ao criar um novo profissional, além dos dados pessoais, deve existir uma seção:

PERMISSÕES DE ACESSO

O administrador deverá conseguir selecionar exatamente o que aquele usuário pode ou não fazer.

Criar permissões organizadas por categoria.

3. PERMISSÕES DE PACIENTES

Permitir configurar:

Visualizar pacientes;
Criar pacientes;
Editar informações cadastrais;
Desativar paciente;
Visualizar histórico.
4. PERMISSÕES DE DOCUMENTOS

Permitir configurar:

Visualizar documentos;
Criar documentos;
Ocultar/desativar documentos;
Visualizar documentos desativados;
Reativar documentos;
Visualizar auditoria;
Visualizar versões anteriores;
Exportar PDF;
Baixar PDF;
Anexar PDF assinado;
Finalizar processo documental.

REMOVER completamente a permissão de EDITAR DOCUMENTOS.

Não deve existir nenhuma permissão chamada "Editar documento".

5. PERMISSÕES ADMINISTRATIVAS

Permitir configurar:

Visualizar equipe;
Criar profissional;
Editar profissional;
Desativar profissional;
Reativar profissional;
Alterar permissões;
Alterar senha;
Visualizar log administrativo.

O super administrador deverá possuir todas as permissões.

6. PERFIL DO PROFISSIONAL

Ao clicar em um profissional dentro da área Equipe, abrir uma tela completa de gerenciamento.

Permitir demonstrar:

Editar informações

Alterar nome

Alterar email

Alterar função

Alterar senha

Alterar permissões

Desativar usuário

Reativar usuário

Todas as alterações relevantes devem gerar registros no log administrativo.

7. DOCUMENTOS — REMOVER EDIÇÃO

A partir desta versão do sistema:

NÃO É MAIS POSSÍVEL EDITAR DOCUMENTOS.

Remover completamente o botão:

Editar

de todas as telas do sistema.

Não deve existir edição de documentos:

no perfil do paciente;
no Histórico;
na área Documentos;
na Auditoria;
na visualização do documento;
em qualquer outro local.

Um documento criado passa a ser uma versão imutável.

Se alguma informação estiver incorreta, o documento não será editado.

A solução será criar um novo documento ou uma nova versão conforme o fluxo documental definido.

8. DOCUMENTOS — ÚNICA ALTERAÇÃO PERMITIDA

As ações principais sobre documentos passam a ser:

Criar

Visualizar

Baixar PDF

Anexar PDF assinado

Ocultar/Desativar

Visualizar auditoria

Visualizar versões anteriores

Reativar, quando permitido.

Não disponibilizar edição.

9. DESATIVAÇÃO DE DOCUMENTO

Ao selecionar:

Ocultar documento

ou

Desativar documento

abrir uma confirmação.

Solicitar obrigatoriamente:

Motivo da desativação

Exemplo:

"Documento criado incorretamente."

Depois da confirmação:

documento permanece armazenado;
não é apagado;
passa para status "Documento desativado";
registra usuário;
registra data;
registra hora;
registra justificativa;
mantém todas as versões anteriores;
continua disponível na Auditoria.
10. DOCUMENTO DESATIVADO

Um documento desativado não poderá ser editado.

Na visualização, apresentar:

Documento desativado

e as opções permitidas:

Visualizar

Visualizar auditoria

Visualizar versões

Baixar PDF

Reativar, caso o usuário tenha permissão.

11. REATIVAÇÃO

Ao selecionar:

Reativar documento

solicitar:

Motivo da reativação

Depois da confirmação:

registrar usuário;
registrar data;
registrar hora;
registrar justificativa;
registrar a ação na auditoria.

O documento volta a ficar disponível conforme as regras de assinatura definidas abaixo.

12. REMOVER COMPLETAMENTE ASSINATURA MANUSCRITA

Essa alteração é definitiva.

REMOVER TODA E QUALQUER REFERÊNCIA À ASSINATURA MANUSCRITA DO SISTEMA.

Remover:

área de desenho de assinatura;
assinatura pelo dedo;
assinatura em tablet;
assinatura manuscrita;
terminal de assinatura;
botão "assinar desenhando";
qualquer imagem de assinatura manuscrita;
qualquer fluxo relacionado à assinatura manuscrita.

Não utilizar mais assinatura manuscrita em nenhuma tela.

13. NOVO MODELO DE ASSINATURA — GOV.BR

A assinatura dos documentos será realizada externamente pelo usuário através do serviço de assinatura do GOV.BR.

No protótipo, simular o fluxo de forma clara e realista.

O Reabilitah não precisa implementar a integração real com o GOV.BR neste momento.

O protótipo deve demonstrar como essa integração funcionará no sistema real.

14. NOVO FLUXO DE DOCUMENTO

O fluxo principal será:

Criar documento

↓

Salvar documento

↓

Documento sem assinatura

↓

Gerar/baixar PDF

↓

Usuário realiza assinatura externamente pelo GOV.BR

↓

Usuário retorna ao Reabilitah

↓

Anexa o PDF assinado

↓

Sistema registra o PDF assinado como nova versão/estado do documento

↓

Documento passa para Assinado

15. DOCUMENTO SEM ASSINATURA

Quando um documento for criado:

Status:

Pendente de assinatura

O sistema deverá armazenar a versão original gerada.

Essa versão será preservada permanentemente.

Exemplo:

Versão 01 — Documento original

Status:

Pendente de assinatura

Criado por: Abel

Data: 26/08/2026

Hora: 14:32

16. BAIXAR DOCUMENTO PARA ASSINATURA

Na visualização de um documento pendente, apresentar:

Visualizar PDF

Baixar PDF para assinatura

Ao selecionar baixar:

informar claramente:

"Baixe este documento, realize a assinatura através do GOV.BR e depois envie o PDF assinado novamente para o Reabilitah."

Adicionar um botão:

Baixar PDF

17. ANEXAR PDF ASSINADO

Na mesma tela do documento pendente, apresentar:

Enviar documento assinado

ou

Anexar PDF assinado

Ao clicar:

abrir uma área para selecionar um arquivo PDF do computador/dispositivo.

Aceitar somente:

PDF

Mostrar o arquivo selecionado antes da confirmação.

Exemplo:

documento_assinado.pdf

[Visualizar]

[Cancelar]

[Enviar documento assinado]

18. CONFIRMAÇÃO DO PDF ASSINADO

Antes de registrar o arquivo:

"Você está enviando o PDF assinado deste documento. Após a confirmação, o arquivo será registrado no histórico e ficará disponível na auditoria."

Botões:

Cancelar

Confirmar envio

19. PDF ASSINADO COMO NOVA VERSÃO

Quando o PDF assinado for enviado:

Não substituir silenciosamente o documento original.

Registrar uma nova versão/estado.

Exemplo:

Versão 01

Documento criado

Pendente de assinatura

↓

Versão 02

PDF assinado anexado

Assinado

Isso permitirá visualizar tanto o documento original quanto o documento efetivamente assinado.

20. STATUS DO DOCUMENTO

Todo documento deverá possuir status.

Utilizar:

Pendente de assinatura

Assinado

Documento desativado

Quando houver nova documentação ou fluxo que exija nova assinatura, utilizar novamente:

Pendente de assinatura

O status deverá aparecer visualmente em todas as áreas relevantes.

21. DOCUMENTO ASSINADO

Quando o PDF assinado for anexado e confirmado:

Status:

Assinado

Utilizar identificação visual verde.

O documento deverá permitir:

Visualizar

Visualizar PDF

Baixar PDF

Visualizar auditoria

Visualizar versões

Desativar

quando o usuário possuir permissão.

Não mostrar:

Editar

22. AUDITORIA — PRIORIDADE MÁXIMA

A Auditoria é uma das partes mais importantes do sistema.

Ela deve preservar TODOS os estados do documento.

Nunca excluir versões anteriores.

Registrar pelo menos:

criação;
geração do PDF;
download;
envio do PDF assinado;
assinatura/documento assinado;
desativação;
reativação;
demais ações relevantes.
23. TODAS AS VERSÕES DEVEM SER VISUALIZÁVEIS

Dentro da Auditoria, apresentar uma linha do tempo/versionamento.

Exemplo:

VERSÃO 01

Documento criado

26/08/2026 — 14:32

Criado por: Abel

Status: Pendente de assinatura

VERSÃO 02

PDF assinado anexado

26/08/2026 — 15:10

Enviado por: Abel

Status: Assinado

VERSÃO 03

Documento desativado

27/08/2026 — 09:42

Desativado por: João

Motivo:

"Documento substituído por outro."

24. ABRIR QUALQUER VERSÃO

Essa funcionalidade é obrigatória.

O usuário deve poder clicar em:

Versão 01

e visualizar exatamente o documento daquela versão.

Depois clicar em:

Versão 02

e visualizar o documento assinado.

Depois clicar em:

Versão 03

e visualizar o estado correspondente.

Não mostrar somente informações textuais sobre a versão.

O documento completo daquela versão deve ser visualizável.

25. COMPARAÇÃO VISUAL DE VERSÕES

Quando possível, adicionar uma opção:

Visualizar versão

para abrir a versão selecionada em tela própria.

Apresentar:

Versão 01 de 03

com navegação:

← Anterior

Próxima →

Isso deve funcionar no protótipo.

26. AUDITORIA — BUSCA

Adicionar busca dentro da Auditoria.

Permitir pesquisar:

ID do documento;
nome do documento;
nome do paciente;
apelido;
usuário responsável;
texto do documento;
versão.

Adicionar filtros:

status;
usuário;
período;
tipo de documento;
paciente.
27. DOCUMENTO — VISUALIZAÇÃO

Ao abrir um documento, manter duas opções:

Documento

Auditoria

Na aba Documento, a apresentação deve ser praticamente a mesma do PDF.

O usuário deve sentir que está visualizando o documento oficial e não uma tela de aplicativo.

28. DOCUMENTO E PDF COM O MESMO VISUAL

A versão visualizada na aba:

Documento

deve ser extremamente semelhante à versão:

Visualizar PDF

O conteúdo, espaçamento, cabeçalho, rodapé, título e estrutura devem ser equivalentes.

A diferença é apenas a forma de visualização.

29. DOCUMENTO PROFISSIONAL

Remover o excesso de elementos decorativos.

O documento deve possuir aparência profissional.

Utilizar:

fundo branco;
margens adequadas;
fonte profissional;
texto preto;
título centralizado;
título em negrito;
tamanho do título maior que o corpo;
corpo do texto organizado;
espaçamento adequado;
estrutura limpa;
área de assinaturas quando aplicável;
identificação documental.

Não utilizar:

cards coloridos;
fundos verdes;
sombras;
elementos decorativos;
ícones desnecessários;
aparência de dashboard;
excesso de bordas.

A identidade visual verde do Reabilitah deve permanecer nas telas do sistema, mas o documento em si deve parecer um documento oficial.

30. LAYOUT A4

Todos os documentos devem utilizar formato:

A4

O layout institucional configurado deve ser aplicado automaticamente.

O documento deverá possuir:

Cabeçalho institucional

↓

Conteúdo do documento

↓

Área de assinaturas, quando aplicável

↓

Rodapé institucional

↓

Identificação técnica

31. IDENTIFICAÇÃO TÉCNICA

No final do documento, manter uma identificação discreta, preferencialmente em até duas linhas.

Exemplo:

ID: DOC-000152 | Versão: 02 | Criado por: Abel | 26/08/2026 14:32

Paciente: Carlos Eduardo Pereira | Status: Assinado

32. LAYOUT INSTITUCIONAL NAS CONFIGURAÇÕES

Manter a configuração de:

Layout Institucional

Porém, ela deve possuir somente os elementos necessários.

Permitir:

Anexo superior

Upload de imagem retangular.

Anexo inferior

Upload de imagem retangular.

Esses anexos serão utilizados automaticamente em todos os documentos.

33. PRÉ-VISUALIZAÇÃO DO LAYOUT

Manter o botão:

Visualizar modelo

Ao clicar, mostrar uma folha A4 simulando um documento real.

Utilizar:

anexo superior configurado;
título fictício;
texto fictício;
área de assinatura fictícia;
anexo inferior;
ID;
versão;
data;
hora.

Essa visualização deve parecer um PDF oficial.

34. FICHA ACOLHIMENTO

Manter a regra definida anteriormente:

O cadastro de um paciente gera automaticamente o primeiro documento:

FICHA ACOLHIMENTO

O prontuário continua sendo o conjunto de documentos do paciente.

A Ficha Acolhimento deverá:

aparecer primeiro no histórico;
possuir ID;
possuir versão;
possuir status;
possuir auditoria;
poder ser visualizada;
poder ser exportada em PDF;
poder ser baixada;
poder ser desativada;
seguir o novo fluxo de assinatura GOV.BR.
35. PRONTUÁRIO

O Prontuário não deve aparecer como um documento independente.

Ele representa o conjunto documental do paciente.

Na tela do paciente:

Prontuário

deve permitir acesso organizado aos documentos que compõem o prontuário.

O:

Histórico

deve mostrar a linha cronológica desses documentos.

A primeira entrada deverá ser:

Ficha Acolhimento

36. FLUXO COMPLETO PARA APRESENTAÇÃO

Criar um fluxo navegável no protótipo:

ETAPA 1

Usuário entra em:

Pacientes

↓

Seleciona paciente

↓

Seleciona:

+ Novo documento

ETAPA 2

Seleciona:

Termo de Acolhimento

↓

Preenche documento

↓

Salvar

↓

Status:

Pendente de assinatura

ETAPA 3

Abrir documento

↓

Visualizar PDF

↓

Baixar PDF para assinatura

ETAPA 4

Simular que o usuário assinou externamente pelo GOV.BR.

Depois retornar ao sistema.

↓

Anexar PDF assinado

ETAPA 5

Selecionar arquivo PDF

↓

Visualizar arquivo

↓

Confirmar envio

↓

Nova versão registrada

↓

Status:

Assinado

ETAPA 6

Abrir:

Auditoria

Mostrar:

Versão 01 — Documento original

Versão 02 — Documento assinado

ETAPA 7

Clicar em:

Versão 01

Mostrar o documento original.

Clicar em:

Versão 02

Mostrar o PDF/documento assinado.

Essa navegação precisa funcionar no protótipo.

37. FLUXO DE DESATIVAÇÃO

Documento assinado

↓

Desativar

↓

Confirmação

↓

Motivo obrigatório

↓

Documento desativado

↓

Auditoria registra a ação

↓

Documento continua disponível

↓

Usuário pode visualizar as versões anteriores.

38. FLUXO DE REATIVAÇÃO

Documento desativado

↓

Reativar

↓

Confirmação

↓

Motivo obrigatório

↓

Registro na auditoria

↓

Documento volta a ficar disponível conforme as regras documentais.

Caso a reativação exija novo documento assinado, apresentar:

Pendente de assinatura

e permitir novamente:

Baixar PDF

↓

Anexar PDF assinado

↓

Assinado

39. REGRA ABSOLUTA DE PRESERVAÇÃO

Nunca excluir definitivamente:

documentos;
versões;
PDFs;
estados;
auditorias;
justificativas;
datas;
horários;
usuários responsáveis.

A exclusão física de informações não deve ser representada no protótipo.

O conceito é:

OCULTAR/DESATIVAR ≠ EXCLUIR

40. CONFIRMAÇÕES

Adicionar confirmação para ações críticas:

Criar documento;
Salvar documento;
Enviar PDF assinado;
Desativar documento;
Reativar documento;
Alterar permissões;
Desativar profissional;
Reativar profissional;
Alterar dados administrativos.

Não adicionar confirmação para ações triviais como abrir ou visualizar documentos.

41. RESULTADO ESPERADO

O Reabilitah deve agora possuir um fluxo documental simples e profissional:

CRIAR

↓

DOCUMENTO ORIGINAL

↓

PENDENTE DE ASSINATURA

↓

BAIXAR PDF

↓

ASSINAR EXTERNAMENTE PELO GOV.BR

↓

ANEXAR PDF ASSINADO

↓

NOVA VERSÃO

↓

ASSINADO

↓

AUDITORIA

↓

TODAS AS VERSÕES DISPONÍVEIS

↓

DESATIVAR, SE NECESSÁRIO

↓

HISTÓRICO PRESERVADO

A prioridade absoluta é que nenhum documento seja sobrescrito e nenhuma versão seja perdida.

A Auditoria deve funcionar como um verdadeiro histórico documental, permitindo abrir e visualizar qualquer versão existente.

O sistema deve parecer preparado para uma futura implementação real, mesmo que a integração com o GOV.BR seja apenas simulada neste protótipo.

Não criar funcionalidades familiares ou de comunicação com familiares nesta versão.

Não utilizar assinatura manuscrita em nenhuma parte do sistema.

Não permitir edição de documentos em nenhuma parte do sistema.

Não apagar documentos ou versões definitivamente.