# Padrão do backend NestJS — Reabilitah

> Base: código do professor em `referencia-backend/controle-financeiro-nestjs-api/`, analisado em 08/09/2026.
> Objetivo: implementar o backend do Reabilitah mantendo bastante proximidade com a organização e as ferramentas desse exemplo.
> Este guia descreve o código encontrado e estabelece adaptações para o nosso domínio. Os exemplos propostos aqui ainda não estão implementados.

## 1. Direção adotada

A base técnica deste guia é **NestJS + TypeScript + TypeORM + PostgreSQL**, seguindo o projeto do professor. Vamos manter módulos por funcionalidade, controllers para as rotas, services para as regras, DTOs para entrada e entities para persistência.

O [GUIA-IMPLEMENTACAO.md](GUIA-IMPLEMENTACAO.md) recomendava Prisma quando ainda não havia essa referência. Para implementar seguindo o professor, **usar TypeORM no lugar de Prisma**: traduzir os modelos ilustrativos daquele guia para entities e migrations do TypeORM. A ordem das fases e as regras de negócio continuam úteis. Não manter dois ORMs para o mesmo backend.

A estrutura `apps/api` também era uma sugestão. Este documento usa `backend/` como localização proposta, ao lado de `frontend/`, sem exigir uma reorganização do repositório para começar.

Prioridade das fontes:

1. [Documentos reais mapeados](documentos-mapeados.md): campos, formatos e assinantes.
2. [CLAUDE.md](CLAUDE.md): regras e decisões do Reabilitah, considerando as atualizações mais recentes.
3. Este guia: padrão técnico baseado no backend do professor.
4. Projeto financeiro: exemplo de implementação; suas regras financeiras não são regras do prontuário.

## 2. O que existe na referência

Os caminhos abaixo são relativos a `referencia-backend/controle-financeiro-nestjs-api/`.

| Parte | Implementação observada | Arquivo para estudar |
|---|---|---|
| Inicialização | `NestFactory`, CORS, filtro global e porta 3010 | `src/main.ts` |
| Composição | Importação dos módulos e configuração assíncrona do TypeORM | `src/app.module.ts` |
| Configuração | `ConfigModule` global e `ConfigService` | `src/app.module.ts` |
| Persistência | PostgreSQL, `autoLoadEntities`, `SnakeNamingStrategy` | `src/app.module.ts` |
| Funcionalidade completa | CRUD de lançamentos com controller, service, DTOs e entity | `src/useCases/lancamentos/` |
| Autenticação | Passport, JWT Bearer e hash de senha com bcryptjs | `src/useCases/auth/` |
| Contexto do autor | Decorator HTTP, interceptor global e `AsyncLocalStorage` | `src/useCases/auth/user-context.*` |
| Transações | `DataSource`, `QueryRunner`, commit e rollback | `src/frameWork/transaction/transaction.service.ts` |
| Auditoria | Decorator `@Audit()`, triggers e estados anterior/posterior | `src/useCases/audit/` |
| Erros | Resposta JSON global padronizada | `src/frameWork/exceptions/exception.filter.ts` |
| Tarefas agendadas | Configuração no banco e execução em memória | `src/frameWork/scheduler/` |
| E-mail | Registros pendentes no banco e envio por SMTP | `src/frameWork/email/` |
| Manutenção | VACUUM e dump com `pg_dump` | `src/frameWork/dataBase/database.service.ts` |
| Testes | Jest, TestingModule e Supertest | `src/**/*.spec.ts`, `test/` |

O `package.json` declara NestJS core 10, TypeORM 0.3, TypeScript 5 e Jest 29, além de integrações Nest com versões principais diferentes. São faixas declaradas com `^`, não uma comprovação das versões instaladas nem de compatibilidade. Ao preparar nosso backend, validar a instalação, os peer dependencies e o build e versionar o lockfile.

O README da referência é essencialmente o padrão gerado pelo Nest. O padrão específico do professor está no código.

## 3. Organização de pastas

O projeto separa funcionalidades em `useCases` e infraestrutura compartilhada em `frameWork`. Apesar do nome `useCases`, a implementação usa services por funcionalidade; não há uma classe separada por caso de uso nem uma camada própria de interfaces de repositório.

Estrutura proposta, próxima da referência:

```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── frameWork/
│   │   ├── database/
│   │   │   ├── data-source.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── transaction/
│   │   │   ├── transaction.module.ts
│   │   │   └── transaction.service.ts
│   │   └── exceptions/
│   │       └── exception.filter.ts
│   └── useCases/
│       ├── auth/
│       ├── pacientes/
│       │   ├── dto/
│       │   │   ├── create-paciente.dto.ts
│       │   │   ├── update-paciente.dto.ts
│       │   │   └── list-pacientes.dto.ts
│       │   ├── entities/
│       │   │   ├── paciente.entity.ts
│       │   │   └── responsavel.entity.ts
│       │   ├── pacientes.controller.ts
│       │   ├── pacientes.service.ts
│       │   ├── pacientes.service.spec.ts
│       │   └── pacientes.module.ts
│       ├── tipos-documento/
│       ├── documentos/
│       ├── assinaturas/
│       ├── audit/
│       ├── equipe/
│       └── pdf/
├── test/
├── .env.example
├── package.json
├── nest-cli.json
└── tsconfig.json
```

As pastas sugeridas para migrations, seeds, PDF e os módulos do prontuário são adições nossas. E-mail e scheduler só entram quando houver uma funcionalidade que precise deles.

Convenções:

- Manter `useCases` e `frameWork` para facilitar a comparação com o exemplo.
- Padronizar a subpasta como `entities/`: a referência mistura `entities`, `entity`, `entitys` e `entitiy`.
- Usar `database/` sempre com a mesma grafia: a referência tem pasta `dataBase` e imports `database`, uma inconsistência relevante para ambientes que distinguem maiúsculas e minúsculas.
- Arquivos em kebab-case; classes em PascalCase; propriedades e métodos em camelCase.
- Usar nomes de domínio em português e métodos comuns como `create`, `findAll` e `findById`, como o professor.
- Usar `SnakeNamingStrategy` para nomes do banco; evitar misturar `created_at` e `createdAt` nas propriedades TypeScript.
- Manter injeção por construtor. Não criar repositories ou services manualmente dentro do controller.

## 4. Responsabilidade de cada arquivo

| Arquivo | Responsabilidade | Aplicação no Reabilitah |
|---|---|---|
| `*.module.ts` | Registrar imports, controllers, providers e exports | Disponibilizar repositories e serviços do módulo |
| `*.controller.ts` | Receber HTTP, aplicar guards/pipes e chamar o service | Receber `POST /pacientes` |
| `*.service.ts` | Executar regras, consultas e transações | Cadastrar paciente e responsáveis |
| `dto/*.dto.ts` | Definir e validar entradas permitidas | Aceitar nome e campos opcionais do paciente |
| `entities/*.entity.ts` | Mapear tabelas, colunas, relações e restrições | Persistir `Paciente` e `DocumentoVersao` |
| `*.guard.ts` | Autorizar o acesso à rota | Conferir login e permissão para desativar documento |
| `*.interceptor.ts` | Envolver a execução da requisição | Propagar o autor autenticado |
| `*.filter.ts` | Traduzir exceções para resposta HTTP | Retornar erro no formato esperado pelo frontend |

Fluxo de uma requisição protegida:

```text
HTTP → JwtAuthGuard → guard de permissões → interceptor de contexto
     → pipes/DTO → controller → service → repository ou QueryRunner
     → PostgreSQL → resposta

Em caso de exceção: filtro global → resposta de erro
```

O guard de permissões e a validação global dos DTOs são complementos necessários ao exemplo.

## 5. Como criar um módulo seguindo o professor

O modelo é [LancamentosModule](../referencia-backend/controle-financeiro-nestjs-api/src/useCases/lancamentos/lancamentos.module.ts).

Exemplo de registro do módulo de pacientes, supondo as classes indicadas já criadas:

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Responsavel]),
    TransactionModule,
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
```

`TypeOrmModule.forFeature` registra os repositories disponíveis naquele módulo. No service, seguir o padrão do professor:

```ts
constructor(
  @InjectRepository(Paciente)
  private readonly pacientesRepository: Repository<Paciente>,
  private readonly transactionService: TransactionService,
) {}
```

A referência registra `TransactionService` diretamente em vários módulos. Nossa adaptação é criar `TransactionModule`, registrar o serviço uma vez e exportá-lo. O uso pelo service continua igual.

Depois, importar `PacientesModule` em `AppModule`. Exportar serviços somente quando outro módulo precisar utilizá-los.

## 6. DTOs e validação das entradas

Na referência, `CreateLancamentoDto` apenas declara propriedades e `UpdateLancamentoDto` usa `PartialType`. Não há `ValidationPipe` global nem dependências `class-validator`/`class-transformer` declaradas. A anotação TypeScript, sozinha, não valida o JSON recebido.

Para o Reabilitah:

- Adicionar as dependências de validação e configurar `ValidationPipe` com `whitelist`, `forbidNonWhitelisted` e `transform`.
- Criar DTOs para body e query; evitar `@Query() query: any` repassado diretamente ao `where`.
- Usar `ParseIntPipe` se a chave for inteira, ou `ParseUUIDPipe` se for UUID. `@Param('id') id: number` não converte o parâmetro sozinho.
- Declarar somente os campos que o cliente pode enviar. IDs internos, autor, hash, versão e timestamps são definidos pelo backend.
- Usar `PartialType` para atualização de cadastro, como paciente. Documento imutável não terá um DTO genérico de edição.
- Validar os campos dinâmicos de documentos no service contra os metadados do tipo: obrigatoriedade, tipo do valor, opções permitidas e campos desconhecidos.

Exemplo parcial, após adicionar as dependências de validação:

```ts
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePacienteDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  nome: string;
}
```

Os demais campos cadastrais serão opcionais conforme o mapeamento. Uma exigência específica, como SISREG para emitir formulário estadual, deve ser validada na operação que precisa dela.

## 7. Banco, entities e migrations

Manter da referência:

- `TypeOrmModule.forRootAsync` com `ConfigService` no módulo raiz.
- PostgreSQL e `SnakeNamingStrategy`.
- `@Entity`, `@Column`, chave primária e repositories injetados.
- `TypeOrmModule.forFeature` em cada módulo.
- `QueryRunner` para operações com múltiplas gravações relacionadas.

Complementos para nosso projeto:

- Criar um `DataSource` próprio para executar migrations pela CLI, compartilhando a configuração de conexão. Não pressupor que `autoLoadEntities` da aplicação configure a CLI.
- Versionar criação e alteração de tabelas, constraints e funções de auditoria em migrations.
- Desabilitar `synchronize` em ambientes com dados preservados. Converter explicitamente variáveis booleanas e numéricas; a referência passa `DB_SYNCHRONIZE` diretamente ao TypeORM.
- Usar JSONB para snapshots e valores dos formulários dinâmicos. A entity de auditoria da referência usa `json`; a função SQL trabalha com variáveis `jsonb`.
- Definir chaves estrangeiras sem exclusão em cascata de histórico, versões ou assinaturas.
- Criar uma restrição única para `(documento_id, numero_versao)` e controlar concorrência ao produzir a próxima versão.
- Versionar também os metadados/textos necessários para reproduzir o documento antigo. Um número de versão do template sem guardar seu conteúdo histórico não basta.

O exemplo usa IDs inteiros autogerados e a trigger converte o autor para `integer`. Manter inteiros aproxima nossa implementação da referência. Caso o time escolha UUID, adaptar conjuntamente entities, DTOs, pipes, contexto e função SQL; não copiar o cast para inteiro.

## 8. Transações e identificação do autor

O [TransactionService do professor](../referencia-backend/controle-financeiro-nestjs-api/src/frameWork/transaction/transaction.service.ts) abre um `QueryRunner`, inicia a transação e executa:

```sql
SELECT set_config('app.current_user_id', $1, true);
```

O valor vem do contexto da requisição. O terceiro argumento torna essa configuração local à transação, permitindo à trigger identificar o autor da alteração naquela conexão.

O fluxo completo implementado na referência é:

1. `JwtStrategy` disponibiliza `request.user`.
2. `UserContextInterceptor`, registrado com `APP_INTERCEPTOR` em `AuditModule`, cria o contexto em `AsyncLocalStorage`.
3. `TransactionService` lê o contexto e configura o autor no PostgreSQL.
4. O service grava usando `queryRunner.manager`.
5. A trigger consulta `app.current_user_id` e insere o log.

Para nosso backend, preservar esse desenho com os seguintes ajustes:

- Obter o autor somente da autenticação validada. Remover os fallbacks para headers `user-id` e `x-user-id` enviados pelo cliente.
- Não ignorar silenciosamente falha ao configurar o autor em uma escrita que exige rastreabilidade.
- Todas as gravações da operação devem usar o mesmo `queryRunner.manager`. Um repository injetado usado dentro desse bloco pode executar fora da transação.
- Serviços chamados dentro da mesma operação devem receber o manager/contexto transacional; não abrir transações independentes para cada etapa.
- Liberar a conexão em `finally`, inclusive quando a inicialização falhar. Definir um único responsável por `release`.
- Fazer rollback apenas se a transação ainda estiver ativa. Não tentar desfazer um commit já concluído porque uma tarefa posterior falhou.
- Para tarefas automáticas, definir explicitamente a identidade do sistema; não inventar um usuário HTTP.

No exemplo financeiro, `commitTransaction` e `rollbackTransaction` já liberam o runner. Se adotarmos liberação central em `finally`, adaptar esses métodos para não liberar duas vezes. Há chamadas diretas a commit/rollback no serviço de e-mail sem `release`; esse trecho precisa de correção antes de reaproveitar.

Exemplo de operação atômica do nosso domínio:

```text
Criar documento:
  iniciar transação e configurar autor
  validar paciente, tipo, campos e permissão
  inserir documento
  inserir versão 1 com snapshot e hash
  registrar evento de criação
  confirmar transação

Se alguma gravação falhar: desfazer o conjunto e liberar a conexão.
```

## 9. Autenticação e permissões

Preservar `AuthModule`, `AuthService`, `JwtStrategy`, `JwtAuthGuard` e o decorator `@UserContext()`.

Na referência, `POST /auth/register` é público, a senha é transformada em hash com bcryptjs, o login retorna `{ access_token }` e o guard extrai o token de `Authorization: Bearer ...`. O token expira em um dia pela configuração local.

Adaptações necessárias:

| Ponto | Padrão para o Reabilitah |
|---|---|
| Cadastro de usuários | Restrito à administração; primeiro administrador criado por procedimento de bootstrap/seed controlado |
| Segredo JWT | Variável de ambiente obrigatória, compartilhada entre emissão e validação |
| Payload | Tipado e consistente: o exemplo emite `username`, mas a strategy tenta ler `login` |
| Usuário inativo | Verificar situação atual ao autorizar a requisição, inclusive com token ainda válido |
| Permissões | Acrescentar guard/decorator de permissões; estar autenticado não autoriza toda operação |
| Senha | Persistir somente hash e nunca incluí-lo nas respostas ou snapshots de auditoria |
| Autor | ID autenticado no backend, nunca um campo aceito do body |

O guia anterior propõe JWT em cookie httpOnly. Isso é uma adaptação do transporte: a referência usa Bearer. Se mantivermos cookie no frontend web, adaptar emissão, extração, logout, CORS e proteção contra CSRF. Não documentar cookie como algo que já existe no projeto do professor.

## 10. Auditoria técnica e versões dos documentos

A referência tem uma base útil de auditoria:

- `@Audit()` marca entities com metadados.
- `AuditTriggerService` percorre os metadados do TypeORM e cria triggers no início da aplicação.
- A trigger registra `INSERT`, `UPDATE` e `DELETE`, tabela, ID, usuário, estado anterior, estado posterior e horário.
- `AuditService` permite consultar registros e possui paginação com `data` e `meta`.

**Essa auditoria não implementa, por si só, o versionamento do prontuário.** Ela registra alterações de linhas do banco. Nosso domínio também precisa registrar o significado da ação, a justificativa, o conteúdo exibido e as assinaturas daquela versão.

| Estrutura | Finalidade |
|---|---|
| `Audit` | Histórico técnico de alterações persistidas |
| `Documento` | Identidade do documento e referência à situação/versão atual |
| `DocumentoVersao` | Snapshot imutável do conteúdo e metadados de uma versão |
| `DocumentoLinha` | Registro de folhas-tabela, com histórico preservado |
| `Assinatura` | Assinante, papel, método e vínculo ao conteúdo assinado |
| Evento documental | Ações como baixar PDF, desativar ou reativar, com autor e justificativa aplicável |

Manter o conceito de triggers e contexto de autor. Para ambientes com histórico real, criar/alterar triggers por migration, sem remover automaticamente a auditoria de uma tabela porque um decorator deixou de ser carregado. A referência sincroniza e remove triggers no startup e apenas registra erro se a configuração falhar; o nosso ambiente deve detectar e impedir operação sem a auditoria exigida.

Não aplicar `@Audit()` indiscriminadamente a credenciais: o snapshot integral de `NEW`/`OLD` pode copiar o hash de senha. Selecionar ou excluir campos antes de registrar estados.

Pontos do domínio a fechar na implementação:

- Baixar PDF precisa gerar evento auditável. Os docs atuais também o listam como ação de versão; explicitar se haverá nova versão ou apenas evento, sem invalidar uma assinatura por uma simples leitura.
- Documentos sem assinantes exigidos precisam de uma regra de conclusão; não presumir que todos ficam pendentes de assinatura.
- Em controle de saída, o retorno só é conhecido depois. Registrar complemento/evento ou nova versão da linha, preservando o que foi assinado na saída.
- Papéis alternativos, como acolhido **ou** testemunha, não podem ser tratados como dois assinantes obrigatórios simultâneos.
- Alterar o cadastro do paciente ou o layout institucional não deve modificar retroativamente um documento já emitido.

## 11. Aplicação aos módulos do Reabilitah

| Módulo | Responsabilidade | Base do professor |
|---|---|---|
| `auth` | Login, identidade e contexto | `auth` |
| `pacientes` | Cadastro, responsáveis, consulta e desativação | Estrutura de `lancamentos` |
| `tipos-documento` | Metadados, campos, emissor, formato e papéis | Module/service/repository do exemplo, com novas entities |
| `documentos` | Criação, versões, linhas, desativação e reativação | Service transacional + regras do prontuário |
| `assinaturas` | Coleta e associação à versão/linha | Novo módulo no mesmo padrão |
| `audit` | Consulta técnica e integração com contexto | `audit` |
| `equipe` | Profissionais, usuários e permissões | Entity de usuário + padrão de CRUD adaptado |
| `pdf` | Documento A4 e exportação de prontuário | Novo módulo no mesmo padrão |

Os tipos de documento serão dados do banco, conforme o guia de implementação. Não criar um controller/service para cada formulário físico. O service de documentos valida metadados e executa operações comuns aos tipos.

Rotas propostas para orientar os controllers:

| Método e rota | Operação |
|---|---|
| `POST /auth/login` | Autenticar |
| `POST /pacientes` | Cadastrar |
| `GET /pacientes` | Listar com filtros permitidos e paginação |
| `GET /pacientes/:id` | Consultar prontuário cadastral |
| `PATCH /pacientes/:id` | Completar/atualizar cadastro |
| `POST /pacientes/:id/desativar` | Desativar preservando histórico |
| `GET /tipos-documento` | Consultar tipos e metadados |
| `POST /documentos` | Criar documento e versão inicial |
| `GET /documentos/:id/versoes` | Consultar histórico de versões |
| `POST /documentos/:id/desativar` | Desativar com justificativa |
| `POST /documentos/:id/reativar` | Gerar nova versão conforme regra vigente |
| `POST /documentos/:id/linhas` | Acrescentar registro em folha-tabela |
| `POST /assinaturas` | Registrar assinatura validando papel e vínculo |
| `GET /documentos/:id/pdf` | Exportar documento com evento de auditoria |
| `GET /pacientes/:id/prontuario/pdf` | Exportar prontuário completo |

Não copiar `remove()` de lançamentos para o prontuário: ele usa exclusão física. Também não copiar o `update()` para conteúdo de documento. Atualizações de cadastro e de estado precisam de operações delimitadas e auditadas.

## 12. Respostas, erros e consultas

Manter o formato do filtro global do professor:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Nome é obrigatório",
  "timestamp": "2026-09-08T20:00:00.000Z",
  "path": "/pacientes"
}
```

Adaptar o filtro para aceitar `message` como string ou lista de mensagens de validação. Mapear erros conhecidos para mensagens de domínio e não devolver detalhes SQL ou erros internos ao cliente. O filtro atual expõe `driverError.detail`, `driverError.message` e mensagens de exceções genéricas.

Usar 400 para entrada inválida, 401 para ausência/falha de autenticação, 403 para permissão insuficiente, 404 para recurso inexistente e 409 para conflito de estado ou unicidade. A referência usa 400 para lançamento não encontrado, mas já usa 404 em consultas da auditoria.

Para listagens, reaproveitar a resposta de `AuditService`:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Limitar o tamanho de página, validar inteiros estritamente e declarar os filtros permitidos em DTO. O exemplo de lançamentos repassa a query inteira ao repository; o de auditoria aceita colunas da entity e usa `parseInt`, que pode aceitar prefixos numéricos de entradas inválidas. Não reproduzir essas permissividades.

## 13. Configuração e execução local

Variáveis observadas na configuração principal: `DB_HOST`, `DB_USERNAME`, `DB`, `DB_PASSWORD` e `DB_SYNCHRONIZE`. O serviço de dump também lê `DB_PORT` e `PG_DUMP_PATH`, enquanto a conexão principal fixa a porta em 5432.

Para nosso `.env.example`, documentar valores fictícios para banco e acrescentar `DB_PORT`, `PORT`, `JWT_SECRET` e a origem permitida do frontend. Validar variáveis obrigatórias ao iniciar. Não copiar credenciais do Compose nem endereços locais do professor.

O Compose da referência usa PostgreSQL 16 Alpine com volume persistente. Essa estrutura serve de base para o banco local. A configuração CORS deve receber nossas origens explícitas; a referência permite também subdomínios temporários de `trycloudflare.com`.

Scripts existentes no exemplo, a preservar no backend:

```bash
npm install
npm run start:dev
npm run build
npm run test -- --runInBand
npm run test:e2e
npm run test:cov
```

Após termos lockfile, usar `npm ci` nas instalações reproduzíveis. Se o repositório adotar outro gerenciador, manter a escolha consistente. Acrescentar scripts para migrations e seed: eles não existem no `package.json` analisado.

`npm run lint` e `npm run format` do professor alteram arquivos (`--fix`/`--write`). Para CI, criar também comandos que apenas verificam.

Não assumir que o `vercel.json` comprova a implantação do projeto. A referência combina servidor HTTP com tarefas cron em memória e `pg_dump` local; validar a infraestrutura escolhida antes de reutilizar essa configuração.

## 14. Trechos auxiliares que exigem adaptação

Estes achados vêm da leitura do código, não de testes executados:

| Achado concreto | Adaptação antes de reaproveitar |
|---|---|
| Scheduler agenda novamente mesmo após mudar `isActive` para falso | Parar/remover o timer ao desativar e testar esse fluxo |
| Reagendamento ocorre após commit dentro do mesmo `try` | Separar falha de agendamento de rollback do banco |
| Cron importado de `@nestjs/schedule/node_modules/cron` | Usar dependência pública compatível, sem caminho interno de pacote |
| E-mail usa `rejectUnauthorized: false` | Manter validação do certificado TLS na configuração real |
| Dump tem caminho Windows padrão e é anexado a e-mail | Definir backup e restauração apropriados ao ambiente e ao prontuário, sem envio automático herdado do exemplo |
| `AuditTriggerService` libera runner somente no caminho de sucesso | Garantir liberação também quando houver falha |
| Logs de debug imprimem usuário/contexto | Remover os logs temporários ao adaptar a autenticação |

Esses módulos auxiliares não são pré-requisitos para cadastrar pacientes e criar documentos. Estudá-los como referência de serviços compartilhados e implementar quando o escopo precisar.

## 15. Testes e ordem de implementação

Os testes de lançamentos do exemplo verificam apenas se controller/service existem e não fornecem os mocks das dependências injetadas. O e2e importa `AppModule`, que inicializa banco e outros módulos, e verifica apenas `Hello World!`. Portanto, os arquivos são ponto de partida de estrutura, não evidência de cobertura funcional.

Usar Jest e `TestingModule`, fornecendo mocks de repository e de transações nos testes unitários. Usar PostgreSQL isolado nos testes de integração de triggers e JSONB; não apontar testes para o banco da instituição.

Sequência de implementação baseada nas fases existentes:

1. Inicializar `backend/` com a estrutura modular, configuração, PostgreSQL e TypeORM; validar build e migrations.
2. Adaptar autenticação, contexto do autor, transações e filtro de erros.
3. Implementar pacientes e responsáveis seguindo o módulo de lançamentos, com desativação e validação.
4. Implementar auditoria técnica e verificar que o autor gravado corresponde ao login.
5. Criar entities de tipos/campos e o motor de documentos, começando por Evolução Geral.
6. Implementar snapshots, linhas e operações de desativar/reativar em transações.
7. Implementar assinaturas conforme as decisões de negócio e geração de PDF.
8. Completar equipe, permissões e funcionalidades auxiliares previstas.

Validações que precisam demonstrar comportamento real:

- Criar paciente somente com nome; rejeitar nome vazio e campos não permitidos.
- Recusar operação sem login, com usuário inativo ou sem permissão.
- Registrar o autor autenticado mesmo se o cliente enviar um header com outro ID.
- Desfazer todas as gravações quando uma etapa transacional falhar.
- Preservar versões anteriores ao desativar/reativar; recusar sobrescrita/exclusão do conteúdo histórico.
- Impedir duplicação do número de versão em duas requisições concorrentes.
- Manter nome do autor consultável após desativação do profissional.
- Concluir assinatura apenas quando os papéis aplicáveis estiverem atendidos.
- Gerar PDF histórico sem alterá-lo ao mudar posteriormente cadastro ou template.

## 16. Checklist para cada módulo novo

- [ ] Pasta em `useCases` com module, controller, service, DTOs e entities.
- [ ] Entities registradas em `forFeature`; módulo importado no lugar correto.
- [ ] Controller fino e regras concentradas no service.
- [ ] DTOs e parâmetros validados; filtros e paginação delimitados.
- [ ] Autenticação e permissões aplicadas às operações.
- [ ] Alterações do banco descritas em migration.
- [ ] Gravações relacionadas usam a mesma transação e registram o autor.
- [ ] Nenhuma exclusão física de dados históricos do prontuário.
- [ ] Erros no formato global, sem detalhes internos do banco.
- [ ] Testes relevantes ao comportamento e build aprovados.

Assim, cada módulo fica reconhecível para quem estudou o projeto do professor, enquanto as regras de prontuário, documentos e assinaturas permanecem fiéis ao Reabilitah.
