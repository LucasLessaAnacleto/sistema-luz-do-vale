# Frontend — Reabilitah

Next.js (App Router), React, TypeScript e Tailwind. Organização baseada em
`referencia-frontend/front`; layout baseado em `docs/export-figma-make`.

## Rodar

```bash
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000/login. A página de apresentação está em `/landing`.

Credenciais fictícias do mock:

- Email: `demo@reabilitah.com.br`
- Senha: `Demo123!`

O login valida essas credenciais, mostra erros e redireciona para `/` após
sucesso. O mock guarda um token fictício (`demo-token`) e o usuário fictício em cookies de 7 dias com
`js-cookie` no `authSlice`. Ao recarregar, valida os dois cookies antes de recuperar a sessão;
ao sair, remove ambos. Os cookies podem ser usados por outras abas do mesmo
navegador. Nenhuma senha digitada, token real ou dado pessoal é persistido.
O mock serve apenas ao desenvolvimento da interface e não implementa autenticação
de backend.

## Organização

- `src/app/components/ui`: controles visuais reutilizáveis (`Button`, `Input`).
- `src/app/components`: marca e estado de verificação de sessão.
- `src/app/types`: contratos de autenticação e usuário, sem senha no tipo de leitura.
- `src/app/services/authService.ts`: contrato usado pela interface.
- `src/app/services/mocks/authMock.ts`: validação e latência simuladas.
- `src/app/services/api.ts`: Axios centralizado, pronto para a API.
- `src/app/redux`: store compartilhada, Provider e slice que salva, recupera e remove os cookies da sessão simulada.
- `src/app/login`: formulário com `useActionState`, mensagens e coordenação do login.
- `src/app/(sistema)`: layout que verifica sessão e página inicial mínima com logout.

Campos, mensagens e estado pendente do formulário ficam em `useActionState`. O Redux guarda o usuário fictício
e o estado da sessão. Como na referência, o `authSlice` usa `js-cookie` para
persistir a sessão; o Provider dispara a recuperação após a montagem no navegador.
Assim, o estado inicial permanece igual durante a renderização do Next.js no
servidor e no cliente. O cookie do mock não autoriza acesso a dados de backend.

## Substituir o mock pela API

Configure `NEXT_PUBLIC_API_URL` em `.env.local` (modelo em `.env.example`) e troque
o mock de `authService.ts` por chamadas ao cliente `api.ts`. O login real precisará
retornar o token e os dados de usuário exigidos pela API. Na referência, o
`authSlice` salva `token` e `usuario` em cookies, e `api.ts` envia o token como
`Authorization: Bearer`. Nosso mock não cria nem envia um token fictício.

Os caminhos HTTP serão definidos com o backend. Normalize os erros da API no
serviço para mensagens adequadas à interface. Remova os cookies do mock nessa
integração e valide a sessão com o backend: os cookies atuais controlam apenas a
interface, não a autorização dos dados.

## Verificação

```bash
npm run build
```

Verificar em `/login`: campos obrigatórios, senha incorreta sem redirecionamento,
valores preservados após erro, botão de envio ocupado, login válido, recarga em
`/`, retorno de `/login` para `/` quando já logado, logout e acesso direto
anônimo a `/`. Conferir também teclado e largura de celular.
