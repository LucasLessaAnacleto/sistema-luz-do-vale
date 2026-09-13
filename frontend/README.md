# Frontend — Reabilitah

Next.js (App Router), React, TypeScript e Tailwind. Organização baseada em
`referencia-frontend/front`; layout baseado em `docs/export-figma-make`.

## Rodar

```bash
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000/login. A página pública continua em `/`.

Credenciais fictícias do mock:

- Email: `demo@reabilitah.com.br`
- Senha: `Demo123!`

O login valida essas credenciais, mostra erros e redireciona para `/home` após
sucesso. A sessão de demonstração sobrevive à recarga na mesma aba por um marcador
em `sessionStorage`; ao sair, o marcador é removido. Nenhuma senha, token ou dado
pessoal é persistido. O mock serve apenas ao desenvolvimento da interface e não
implementa autenticação de backend.

## Organização

- `src/app/components/ui`: controles visuais reutilizáveis (`Button`, `Input`).
- `src/app/components`: marca e estado de verificação de sessão.
- `src/app/types`: contratos de autenticação e usuário, sem senha no tipo de leitura.
- `src/app/services/authService.ts`: contrato usado pela interface.
- `src/app/services/mocks/authMock.ts`: credenciais, latência e sessão simuladas.
- `src/app/services/api.ts`: Axios centralizado, pronto para a API.
- `src/app/redux`: store compartilhada, Provider e slice de sessão com reducers simples.
- `src/app/login`: formulário, mensagens e coordenação do login.
- `src/app/(sistema)`: layout que verifica sessão e página inicial mínima com logout.

Campos, mensagens e envio ficam no estado local. O Redux guarda apenas o usuário
público e o estado da sessão. Serviços não navegam nem exibem mensagens; reducers
não acessam armazenamento. A recuperação de sessão acontece no layout `(sistema)` ao acessar a área interna
e na página de login para reconhecer uma sessão existente. Essas telas chamam o
serviço em um `useEffect` e despacham ações simples; não usamos thunks. O Provider
apenas disponibiliza a store. Falhas de verificação permitem nova tentativa.

## Substituir o mock pela API

Configure `NEXT_PUBLIC_API_URL` em `.env.local` (modelo em `.env.example`) e troque
as implementações de `authService.ts` por chamadas ao cliente `api.ts`, mantendo:

- `loginService(LoginRequest): Promise<LoginResponse>` — retorna `{ usuario }`.
- `buscarUsuarioLogado(): Promise<Usuario | null>` — ausência de sessão retorna
  `null`; falhas de rede/servidor devem lançar erro.
- `logoutService(): Promise<void>` — resolve somente após encerramento confirmado.

Os caminhos HTTP serão definidos com o backend. Normalize os erros da API no
serviço para mensagens adequadas à interface. A API deverá definir o cookie
HttpOnly, validar cada acesso e configurar CORS/credenciais e proteção das escritas.
O Axios já envia credenciais; a interface e o Redux não precisam receber tokens.
Remova o mock da aplicação nessa integração. O layout cliente controla navegação,
mas a autorização dos dados será responsabilidade do backend.

## Verificação

```bash
npm run build
```

Verificar em `/login`: campos obrigatórios, senha incorreta sem redirecionamento,
valores preservados após erro, botão de envio ocupado, login válido, recarga em
`/home`, retorno de `/login` para `/home` quando já logado, logout e acesso direto
anônimo a `/home`. Conferir também teclado e largura de celular.
