# Guia de desenvolvimento do frontend — Reabilitah

> Base: análise do código local de `referencia-frontend/aula20261/front`, revisão `0f61e2ce69bca925aaa923373f97e5b02d1850f7`.
> Data: 08/09/2026. Este documento orienta implementações futuras; a estrutura proposta abaixo ainda não foi criada.

## 1. Objetivo e referências

Seguir a organização de desenvolvimento do projeto de aula: rotas do Next.js, layouts compartilhados, componentes reutilizáveis, serviços HTTP, contratos TypeScript e Redux para estado global. A aparência deve continuar seguindo o Figma do Reabilitah.

As fontes têm responsabilidades diferentes:

| Fonte | O que define |
| --- | --- |
| [Frontend de referência](../referencia-frontend/aula20261/front/app) | Organização de código e fluxo entre páginas, serviços e estado |
| [Protótipo Figma](export-figma-make/src/app) | Composição visual, textos, hierarquia e navegação do produto |
| [Decisões do projeto](CLAUDE.md) | Escopo e regras de negócio |
| [Mapeamento de documentos](documentos-mapeados.md) | Campos, formatos e assinantes dos documentos reais |
| [Guia de implementação](GUIA-IMPLEMENTACAO.md) | Ordem de execução das funcionalidades |

Quando houver divergência de negócio, consultar o mapeamento e as decisões registradas. Este guia não transforma as simplificações do exemplo de aula em requisitos do Reabilitah.

**Vocabulário deste documento:** “observado” descreve código existente na referência; “adotar” e “proposta” descrevem o padrão recomendado para as próximas implementações.

## 2. O que foi observado no repositório clonado

| Tema | Implementação observada | Arquivo de referência |
| --- | --- | --- |
| Rotas | App Router, login público e grupo `(sistema)` | [Login](../referencia-frontend/aula20261/front/app/login/page.tsx) e [layout interno](../referencia-frontend/aula20261/front/app/%28sistema%29/layout.tsx) |
| Layout | Composição de Sidebar, Header, conteúdo e Footer | [Componentes](../referencia-frontend/aula20261/front/app/components) |
| Listagem | Página busca dados via serviço e mantém lista em `useState` | [Usuários](../referencia-frontend/aula20261/front/app/%28sistema%29/usuarios/page.tsx) |
| Cadastro e edição | Um formulário recebe entidade existente opcional | [UsuarioForm](../referencia-frontend/aula20261/front/app/%28sistema%29/usuarios/componentes/UsuarioForm.tsx) |
| Navegação | `Link` para links; `useRouter` para navegação após ações | Login, lista e formulário |
| HTTP | Instância Axios compartilhada e funções por domínio | [api.ts](../referencia-frontend/aula20261/front/app/services/api.ts), [usuarioService.ts](../referencia-frontend/aula20261/front/app/services/usuarioService.ts) |
| Contratos | Tipos de autenticação, entidade e props em arquivos separados | [types](../referencia-frontend/aula20261/front/app/types) |
| Estado global | Redux Toolkit, Provider raiz, slices e tipos da store | [redux](../referencia-frontend/aula20261/front/app/redux) |
| Estado local | Campos controlados, lista e registro carregado em hooks | Formulário, listagem e edição |
| Estilos | Classes utilitárias Tailwind diretamente no JSX | Páginas e componentes |
| Qualidade | TypeScript estrito e configuração ESLint do Next | [tsconfig](../referencia-frontend/aula20261/front/tsconfig.json), [ESLint](../referencia-frontend/aula20261/front/eslint.config.mjs) |

A referência usa Next 16.1.6, React 19.2.3, Tailwind 4, Axios, Redux Toolkit, React Redux e js-cookie. O Reabilitah atualmente usa Next 15.5.25, React 19.1.0 e Tailwind 4; Axios e Redux ainda não estão instalados. Seguir a arquitetura não exige atualizar Next/React neste momento.

O backend Java do repositório de aula não altera a escolha de NestJS/PostgreSQL registrada para este projeto.

## 3. Estrutura a adotar

Manter o diretório existente `frontend/src/app`. Na referência, os arquivos ficam diretamente em `front/app`; a camada `src` é a única diferença necessária de raiz. O alias atual `@/*` aponta para `src/*`, portanto `@/app/services/...` funciona com esta organização.

```text
frontend/
  public/
    logo-login.png
  src/app/
    layout.tsx
    globals.css
    page.tsx
    login/page.tsx
    (sistema)/
      layout.tsx
      home/page.tsx
      pacientes/
        page.tsx
        novo/page.tsx
        [id]/
          page.tsx
          editar/page.tsx
          documentos/novo/page.tsx
        componentes/
          PacienteForm.tsx
          PacienteResumo.tsx
          PacienteHistorico.tsx
      documentos/
        page.tsx
        [id]/page.tsx
        componentes/
          FormularioDocumento.tsx
          CampoDocumento.tsx
          DocumentoVisualizacao.tsx
          DocumentoAuditoria.tsx
          DocumentoLinhas.tsx
      configuracoes/page.tsx
      equipe/
        page.tsx
        novo/page.tsx
        [id]/editar/page.tsx
        componentes/
          ProfissionalForm.tsx
          PermissoesForm.tsx
    components/
      Header.tsx
      Sidebar.tsx
      BottomNav.tsx
      Footer.tsx
      ui/
        Button.tsx
        Input.tsx
        Select.tsx
        Textarea.tsx
        Card.tsx
        Badge.tsx
        Modal.tsx
        EstadoVazio.tsx
        MensagemErro.tsx
    services/
      api.ts
      authService.ts
      pacienteService.ts
      documentoService.ts
      equipeService.ts
    types/
      auth.ts
      pacientes.ts
      documentos.ts
      equipe.ts
    redux/
      store.ts
      StoreProvider.tsx
      hooks.ts
      slices/authSlice.ts
```

A árvore é uma proposta de destino, não uma lista de arquivos a criar vazios. Acrescentar cada arquivo quando a funcionalidade precisar dele. Não mover o projeto para `apps/web` apenas para implementar este guia; o monorepo do guia anterior é uma proposta distinta de infraestrutura.

Convenções:

- Componentes em PascalCase, como `PacienteForm.tsx`.
- Serviços em camelCase com sufixo `Service`; funções descritivas, como `buscarPacientes` e `desativarDocumento`.
- Tipos, contratos e nomes de funções de domínio em português, seguindo o projeto de aula.
- `components` para componentes compartilhados e `componentes` dentro da funcionalidade, como na referência.
- Usar `[id]` nas novas rotas. A referência usa `[codigo]`; não misturar os dois nomes para o mesmo identificador.
- Imports absolutos para camadas compartilhadas e relativos para componentes próximos.
- Não importar arquivos de `docs/export-figma-make` nem de `referencia-frontend` em código de produção.

## 4. Responsabilidades das camadas

Fluxo padrão:

```text
Interação → página/formulário → serviço do domínio → api.ts → backend
Resposta → estado local ou Redux → renderização dos componentes
```

| Camada | Responsabilidade | Limite |
| --- | --- | --- |
| `page.tsx` | Compor a tela, ler parâmetros, coordenar carregamento e navegação | Evitar concentrar todo o formulário e todos os diálogos |
| `layout.tsx` | Estrutura compartilhada, providers e fronteira da área interna | Não buscar novamente a mesma sessão em cada página |
| Componente de domínio | Formulário ou apresentação específicos da funcionalidade | Não virar componente global só por ser grande |
| `components/ui` | Aparência, acessibilidade, eventos e estados visuais reutilizáveis | Não importar serviços, store ou conhecer pacientes/documentos |
| `services` | Fazer requisições, enviar DTOs e retornar dados tipados | Não exibir alertas, navegar ou controlar JSX |
| `types` | Contratos de dados, estados e props compartilhadas | Não executar requisições ou acessar cookies |
| `redux` | Estado que precisa ser compartilhado, principalmente sessão | Não armazenar todos os formulários e resultados de listagens |

Na referência, `UsuarioForm` chama o serviço e navega. Podemos manter esse padrão em formulários específicos de domínio. A regra é escolher um único responsável pela operação: se o formulário recebe `onSalvar` da página, a página executa a requisição; o formulário não deve repeti-la.

## 5. Rotas, layout e limites de cliente

Adotar o grupo `(sistema)` para as telas internas. O grupo organiza arquivos e layout; ele não aparece na URL e não protege a rota sozinho.

| URL proposta | Tela e comportamento |
| --- | --- |
| `/` | Durante a implementação atual, login existente; após migração, redirecionar para `/login` |
| `/login` | Entrada sem Sidebar/Header internos |
| `/home` | Indicadores, avisos, documentos recentes e aniversariantes |
| `/pacientes` | Busca e listagem |
| `/pacientes/novo` | Cadastro |
| `/pacientes/[id]` | Prontuário e histórico |
| `/pacientes/[id]/editar` | Completar/editar cadastro |
| `/pacientes/[id]/documentos/novo` | Selecionar tipo e preencher documento |
| `/documentos` | Central com filtros |
| `/documentos/[id]` | Documento, versões e auditoria |
| `/equipe` | Profissionais e permissões |
| `/configuracoes` | Perfil e configurações institucionais |

Não criar duas cópias do login: mover a implementação atual quando a migração de rotas começar.

- Usar `Link` para navegação normal e router após ações concluídas.
- Após login válido ou expiração de sessão, preferir substituir a entrada no histórico com `router.replace`.
- Manter o layout raiz como Server Component e colocar o Provider em um componente cliente separado.
- Declarar `"use client"` nas fronteiras que usam hooks, eventos ou APIs do navegador. Não marcar toda página estática como cliente por hábito.
- Não reproduzir a navegação do Figma com um `useState('screen')` no componente raiz.
- O layout interno pode combinar Sidebar no desktop e BottomNav no celular, preservando os quatro destinos do Figma: Início, Pacientes, Documentos e Configurações. Equipe é acessada pelas configurações.
- O Header e a navegação devem reagir ao estado via selector, sem ler `store.getState()` durante a renderização.
- Validar parâmetros antes de buscar. Não converter automaticamente todo ID para número: o backend do Reabilitah pode usar UUID.
- Ao mudar o ID de uma rota, refazer o carregamento e descartar a resposta anterior.

## 6. Componentes e padrão visual

A referência orienta a separação do código. O Figma orienta o visual: fonte Inter, fundo claro, verde oliva, campos e botões arredondados.

Manter os tokens em `globals.css` e usar classes semânticas como `bg-primary`, `text-foreground` e `border-border`. Evitar repetir valores hexadecimais em cada tela. O login atual já estabelece esses tokens; ampliá-los conforme surgirem novos componentes.

Extrair os controles compartilhados quando forem reutilizados:

| Componente | Contrato mínimo |
| --- | --- |
| Button | Props nativas, variante, desabilitado, estado de envio e conteúdo |
| Input/Select/Textarea | ID, label associado, valor/evento quando controlado, ajuda e erro |
| Badge | Rótulo e variante semântica; status não depende só de cor |
| Modal | Título, abrir/fechar, foco, fechamento por teclado quando aplicável e retorno de foco |
| EstadoVazio | Mensagem contextual e ação opcional |
| MensagemErro | Mensagem legível e opção de tentar novamente quando possível |

Requisitos de cada tela:

- Funcionar em telas estreitas sem rolagem horizontal da página; tabelas podem ter área própria de rolagem.
- Ter foco visível, labels associados, botões com tipo explícito e ícones decorativos com `aria-hidden`.
- Exibir erros junto ao campo e mensagens de operação em região acessível.
- Respeitar redução de movimento nas animações.
- Evitar criar um segundo título principal ou `main` dentro do conteúdo quando o layout já define essa região.
- Reaproveitar componentes do Figma após revisar imports, props e dependências. Há imports com maiúsculas que divergem dos nomes físicos dos arquivos, como `Button` versus `button.tsx`; padronizar antes de copiar para evitar falhas em ambientes com filesystem sensível a maiúsculas.

## 7. Estado local, global e derivado

| Informação | Onde manter |
| --- | --- |
| Usuário autenticado, permissões e estado da sessão | Redux, slice `auth` |
| Senha digitada | Apenas no formulário durante a operação |
| Campos de cadastro e erros de validação | `useState` do formulário |
| Lista, detalhe carregado, carregamento e erro de requisição | Página ou hook da funcionalidade |
| Modal aberto, seleção temporária e aba local | Componente responsável |
| Filtros/paginação que devem sobreviver a voltar ou compartilhar link | Parâmetros da URL, quando essa necessidade existir |
| Filtros simples e temporários | Estado local |
| Lista filtrada, contagens e permissões calculadas | Derivar dos dados existentes |
| Documentos, assinaturas e auditoria persistidos | Backend; frontend mantém apenas a representação necessária à tela |

Usar Redux Toolkit como na referência, com `RootState`, `AppDispatch` e hooks tipados em `redux/hooks.ts`. O arquivo de hooks é uma melhoria proposta, não existe no exemplo.

Para adaptar ao App Router, criar a store uma vez por instância do Provider e manter a instância estável. Não depender de singleton global que possa compartilhar sessão entre renderizações do servidor. Manter reducers puros: cookies, requisições e navegação ficam fora deles.

Não copiar `carrinhoSlice`: é um esqueleto de outro domínio, com reducers vazios.

Estados explícitos recomendados:

```ts
export type StatusSessao =
  | "verificando"
  | "autenticado"
  | "nao-autenticado"
  | "erro";

export type EstadoRequisicao<T> =
  | { status: "carregando" }
  | { status: "sucesso"; dados: T }
  | { status: "erro"; mensagem: string };
```

Lista vazia é uma resposta bem-sucedida com zero registros. Não mostrar “Nenhum paciente encontrado” enquanto a primeira requisição ainda está carregando. Um erro de rede ao verificar sessão também não equivale automaticamente a credenciais inválidas.

## 8. Serviços, contratos e lógica assíncrona

Adotar uma instância Axios em `services/api.ts` e serviços por domínio. Instalar Axios e Redux quando a integração começar, sem copiar todo o package.json da referência.

### Contratos

- Usar interfaces/type para dados serializáveis. A classe `Usuario` do exemplo não é obrigatória para seguir o padrão.
- Separar resposta de leitura, payload de criação e payload de atualização.
- Não incluir senha no tipo público do usuário autenticado.
- Evitar `any`; para conteúdo configurável, usar tipos de valores e validar contra os metadados do documento.
- Definir IDs, enums, paginação e formato das datas junto com o backend. Os nomes abaixo são ilustrativos, não contratos já publicados.
- Formatar datas na apresentação; não usar texto `dd/MM/yyyy` como formato de transporte por padrão. Distinguir data civil, como nascimento, de instante com fuso, como assinatura.

Exemplo proposto de separação:

```ts
export interface Paciente {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface CriarPacienteRequest {
  nome: string;
  cpf?: string;
}

export interface PacienteFormProps {
  pacienteExistente?: Paciente;
}
```

### Requisições

- Configurar a URL base por ambiente, por exemplo `NEXT_PUBLIC_API_URL`. Ela é pública e não deve conter segredos.
- Usar caminhos relativos nos serviços. O endereço e os endpoints da aula não são contratos do NestJS.
- Cada função retorna o dado tipado; falhas chegam ao chamador como erro. Não retornar lista vazia para esconder falha HTTP.
- Usar `async/await`, `try/catch/finally` e mensagens coerentes com a operação.
- Bloquear envios repetidos enquanto a gravação está em andamento.
- Navegar apenas depois da confirmação de sucesso.
- Preservar dados digitados quando a gravação falhar.
- Em carregamentos com `useEffect`, declarar dependências e cancelar ou ignorar respostas obsoletas na limpeza.
- Separar “salvou, mas falhou ao atualizar a lista” de “não salvou”. Uma falha de recarga não deve incentivar a duplicação da gravação.
- Não inserir `alert`, router ou `debugger` nos serviços.

Estados mínimos por operação:

| Situação | Comportamento |
| --- | --- |
| Carregamento inicial | Indicador de carregamento |
| Sucesso sem registros | Estado vazio |
| Falha de rede | Mensagem e nova tentativa |
| Envio de formulário | Botão desabilitado com indicação de envio |
| Validação rejeitada | Erros por campo quando a API fornecer esse contrato |
| Sessão expirada | Limpar sessão e encaminhar ao login |
| Sem permissão | Mensagem de acesso negado |
| Registro inexistente | Estado de não encontrado |
| Conflito de versão/estado | Informar conflito e recarregar o documento antes de nova ação |

## 9. Autenticação e permissões

**Observado na aula:** login retorna token; o frontend o salva em Redux e cookie via js-cookie; um interceptor envia Bearer; uma segunda chamada busca o usuário; o layout verifica o usuário no Redux.

**Adaptação para o Reabilitah:** preservar serviços + Redux + layout interno, seguindo a proposta de cookie HttpOnly já registrada no [guia de implementação](GUIA-IMPLEMENTACAO.md). Esse contrato ainda precisa ser implementado no backend.

Fluxo proposto:

1. Enviar credenciais ao serviço de autenticação.
2. Backend validar e estabelecer o cookie de sessão.
3. Consultar o usuário autenticado e suas permissões.
4. Atualizar Redux com dados públicos de sessão.
5. Navegar para `/home` apenas após sucesso.
6. Ao recarregar o navegador, verificar a sessão antes de decidir o acesso.
7. No logout, solicitar encerramento da sessão ao backend e limpar o estado da aplicação; tratar falha de encerramento sem afirmar que a sessão foi revogada.

O JavaScript não lê o cookie HttpOnly. Portanto, não copiar o interceptor que lê token via js-cookie para essa estratégia. O cliente deverá enviar credenciais conforme a configuração de origem; o backend define cookies, CORS e proteção das operações autenticadas.

Não armazenar token, senha ou prontuário em localStorage ou cookies criados pelo frontend. O Redux representa a sessão para a interface, mas não concede autorização: a API verifica cada operação e acesso ao registro.

Durante `verificando`, renderizar espera. Diferenciar ausência de sessão de falha temporária de rede. Não esconder tudo indefinidamente com `return null`.

O login atual em `frontend/src/app/page.tsx` é somente visual, com validação HTML e mensagem de indisponibilidade. A integração deve substituir esse comportamento; este documento não afirma que a autenticação já funciona.

## 10. Formulários de cadastro e edição

Seguir a reutilização de `UsuarioForm`: um `PacienteForm` para novo cadastro e edição, recebendo dados existentes opcionais.

- A página de edição carrega os dados antes de montar o formulário.
- Se o ID puder mudar sem desmontar, reinicializar pelo novo registro de forma explícita, sem sobrescrever alterações do usuário a cada render.
- Inputs controlados devem começar com valores definidos; evitar alternar entre `undefined` e string.
- Adotar atualização funcional de estado quando depender do valor anterior.
- Para cadastro de paciente, apenas nome é obrigatório conforme a regra registrada; completar demais campos depois.
- Validar campos opcionais quando preenchidos.
- Dados de responsável devem permitir vários registros; não limitar a uma pessoa pelo formato do protótipo.
- Criação e edição de profissional não devem obrigar preenchimento de senha da mesma maneira; alteração de senha é uma operação própria.
- Usar `form action` com função cliente, como na referência, ou `onSubmit` com `preventDefault`. Não executar ambos para a mesma gravação. A action cliente do exemplo não é uma Server Action.
- Cancelar deve voltar ao contexto adequado. Ao salvar com sucesso, refletir a resposta do servidor.

A regra de formulário reutilizado para cadastro/edição não se aplica a documentos imutáveis.

## 11. Telas e lógica do Reabilitah

| Tela | Responsabilidade e composição |
| --- | --- |
| Dashboard | Indicadores vindos de dados reais, avisos válidos, documentos recentes e aniversariantes; não fixar o usuário do protótipo |
| Pacientes | Busca, lista, acesso ao cadastro e detalhe; tratar carregamento, vazio e erro |
| Cadastro/edição | PacienteForm, dados pessoais, dependências e responsáveis |
| Detalhe do paciente | Resumo e abas Prontuário/Histórico; histórico consultado por paciente |
| Central de documentos | Busca, filtros por paciente/tipo/status/responsável e acesso à visualização |
| Novo documento | Obter tipos/metadados, escolher tipo e preencher formulário genérico |
| Visualização | Conteúdo da versão, status, ações permitidas e auditoria navegável |
| Equipe | Lista de profissionais, cadastro/edição, ativação e permissões |
| Configurações | Perfil e layout institucional; módulos concretos conforme contrato disponível |

Portal familiar, agenda e relatórios presentes como telas órfãs no Figma não entram automaticamente no escopo. O quadro de avisos do dashboard permanece como funcionalidade distinta do portal familiar.

### Motor de documentos

O núcleo do sistema é um formulário dirigido por metadados:

- `FormularioDocumento` coordena valores, grupos e validação.
- `CampoDocumento` escolhe o controle pelo tipo de campo: texto, número, data, seleção ou booleano.
- `DocumentoVisualizacao` mostra o snapshot e a versão do template correspondente.
- `DocumentoLinhas` apresenta documentos acumulativos.
- `DocumentoAuditoria` lista ações e permite consultar a versão selecionada.

É esperado ter uma seleção por **tipo de campo**. Evitar blocos por nome de documento como `if (tipo === "termo-acolhimento")` para cada formulário.

Regras:

1. Não criar rota ou botão de edição de documento emitido.
2. Desativação e reativação exigem justificativa e confirmação de resultado pelo backend.
3. Renderizar o snapshot histórico, incluindo os dados do paciente na emissão. Alterar o cadastro atual não altera o documento antigo.
4. Documento em folha-tabela tem linhas com identidade, autoria e regras de assinatura próprias.
5. Não marcar “Assinado” apenas porque um arquivo foi selecionado; o status vem da API após processamento.
6. Assinantes e método dependem do tipo e das decisões pendentes. Não fixar GOV.BR como caminho universal.
7. PDF deve ser obtido do fluxo de geração/armazenamento definido para o sistema; `window.print()` do protótipo não substitui essa integração.
8. Distinguir emissores institucional e estadual, requisitos SISREG e versões de texto fixo.
9. Desativar/reativar e anexar assinatura devem atualizar status e auditoria usando o resultado persistido.
10. Não implementar exclusão definitiva como ação visual.

O lote mapeado tem 17 itens, incluindo a capa do prontuário. Conforme as decisões registradas, a capa não deve virar um tipo de documento preenchível. Não inferir “17 formulários” dessa contagem.

## 12. Ajustes necessários em relação ao exemplo de aula

Estes pontos foram observados na análise estática. Não são resultados de testes executados na referência.

| Evidência | Ajuste ao implementar |
| --- | --- |
| Login chama `router.push("/home")` após o catch | Redirecionar somente quando token/sessão e usuário forem obtidos |
| `authSlice` lê cookies na carga do módulo e escreve cookies nos reducers | Bootstrap explícito da sessão; reducers sem efeitos externos |
| Store exportada como singleton | Instância estável por Provider na adaptação ao App Router |
| Header lê `store.getState()` | Usar selector para renderização reativa |
| Layout interno usa efeito sem dependências | Dependências explícitas e estado de verificação de sessão |
| API base e URLs absolutas espalhadas nos serviços | URL de ambiente centralizada e endpoints relativos |
| `alterarStatusUsuario` exibe alert no serviço | Serviço propaga erro; interface decide mensagem |
| Formulário de edição retorna cedo quando resultado numérico é maior que zero | Definir retorno do backend e condição de sucesso antes de copiar o fluxo |
| Classe Usuario contém senha junto com dados de leitura | Separar DTOs e excluir senha da sessão |
| Listagem mostra email sob cabeçalho CPF e verde para INATIVO | Revisar correspondência entre coluna, valor, rótulo e cor |
| Listagem não diferencia carregando de vazio | Estados de requisição explícitos |
| Existem `debugger`, imports sem uso e carrinho incompleto | Não transportar resíduos do exemplo |
| Sidebar tem largura fixa sem variante mobile | Implementar comportamento responsivo conforme Figma |

## 13. Ordem de adoção no frontend existente

1. Extrair controles compartilhados do login quando forem usados por outra tela, preservando o visual já feito.
2. Criar a rota `/login` e definir o redirecionamento da raiz.
3. Adicionar Axios, Redux Toolkit e React Redux; configurar serviços, tipos e Provider.
4. Integrar sessão real e layout `(sistema)` com navegação responsiva.
5. Implementar pacientes: listagem, cadastro, detalhe e edição com formulário reutilizado.
6. Implementar motor genérico de documentos e histórico.
7. Integrar versões, justificativas, assinaturas e PDF conforme contratos disponíveis.
8. Completar dashboard, equipe e configurações.

Ao adicionar ESLint, usar configuração compatível com o Next 15 instalado. Não copiar automaticamente a configuração de Next 16 da referência. O frontend atual tem `dev`, `build` e `start`; ainda não tem script `lint` ou suíte de testes.

## 14. Critério de conclusão de uma funcionalidade

- [ ] Rotas e arquivos seguem a estrutura da funcionalidade.
- [ ] Componentes visuais compartilhados não conhecem API ou Redux.
- [ ] Requisições estão em serviços e contratos têm tipos explícitos.
- [ ] Estado local/global foi escolhido conforme a seção 7.
- [ ] Tela trata carregamento, vazio, erro, sucesso e envio em andamento.
- [ ] Formulário preserva valores em falha e impede envio duplicado.
- [ ] Navegação após gravação acontece somente no sucesso.
- [ ] Permissões e estados de documento limitam as ações da interface e são validados pelo backend.
- [ ] Layout funciona no celular e teclado; labels, foco e mensagens são acessíveis.
- [ ] Sem credenciais, prontuários ou dados de pacientes em logs.
- [ ] Sem dados simulados apresentados como persistidos.
- [ ] Build passa e o fluxo alterado foi verificado manualmente.
- [ ] Quando houver testes configurados, cobrem comportamentos relevantes: erro de login, envio duplicado, troca de registro durante busca e imutabilidade/assinaturas na integração.

Comandos atuais, a partir da raiz do repositório:

```powershell
cd frontend
npm.cmd run dev
npm.cmd run build
```

Executar o build separadamente do servidor de desenvolvimento. Instalar dependências com `npm.cmd ci` em uma instalação limpa. Para este guia documental, basta revisar conteúdo e links; não há necessidade de executar o frontend de aula.

## 15. Limites e decisões pendentes

- A API NestJS e seus endpoints não existem neste repositório no momento da análise. Definir contratos antes de integrar telas.
- Cookie HttpOnly é a direção do guia existente; a implementação depende do backend.
- O método de assinatura e perguntas do mapeamento continuam pendentes; este guia não as fecha.
- Redux/Axios, a nova árvore de rotas e os componentes listados são próximos passos, não alterações realizadas junto com este documento.
- Não foi realizada auditoria visual ou execução do projeto clonado. A análise usou seus arquivos de frontend, configurações e dependências.
