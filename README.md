# SharkEvents

Aplicação web para criar e gerir eventos, com inscrições, limite de capacidade e check-in por QR Code.

**Demo:** https://sharkevents-ke7h.vercel.app/

> **Estado do projeto:** projeto base (starter) de apoio a professores no curso *Code Teens Web Development Genius*. Não está em produção e não tem utilizadores reais.

<!-- Adicionar aqui 2 a 3 screenshots: lista de eventos, página do evento com QR Code, dashboard do organizador. -->

---

## Funcionalidades

**Para participantes**
- Registo e login com email e password (Supabase Auth)
- Lista de eventos e página de detalhe por `slug`
- Inscrição e remoção de inscrição, com indicação de lugares ocupados e capacidade máxima
- QR Code pessoal de check-in, gerado depois da inscrição
- Dashboard com os eventos em que estou inscrito

**Para organizadores**
- Criação de eventos (título, descrição, data, local e capacidade)
- Dashboard com estatísticas por evento: inscritos, check-ins e capacidade
- Página de detalhe com a lista de inscritos e estado do check-in
- Exportação da lista de inscritos em CSV
- Eliminação de eventos

**Check-in**
- O QR Code abre `/checkin/[token]`, que marca a inscrição como `checked_in`
- Alternativa manual em `/checkin`, onde se cola o token e se confirma o check-in

---

## Stack

| Área | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Linguagem | TypeScript |
| Backend | Supabase (Auth + PostgreSQL) via `@supabase/ssr` |
| QR Code | `react-qr-code` |
| Validação | Zod |
| Deploy | Vercel |

---

## Estrutura

```
src/
├── app/
│   ├── events/            # lista e página de evento (/events, /events/[slug])
│   ├── create/            # criação de eventos
│   ├── dashboard/         # área do utilizador e do organizador
│   ├── checkin/           # check-in manual e por token (/checkin/[token])
│   ├── login/ register/   # autenticação
│   └── api/               # rotas de API (export CSV, entre outras)
├── components/            # Navbar, EventCard, EventAdminCard, ui/
├── hooks/                 # hooks de realtime (ainda não ligados à UI)
├── lib/supabase/          # clientes Supabase (browser e servidor)
└── types/
middleware.ts              # refresca a sessão do Supabase
```

---

## Como correr localmente

### Requisitos
- Node.js 20.9 ou superior
- Uma conta e um projeto no [Supabase](https://supabase.com)

### Passos

```bash
git clone https://github.com/flvm-png/sharkevents.git
cd sharkevents
npm install
```

Cria o ficheiro `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=o_teu_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=a_tua_chave_anon
```

Ambos os valores estão em *Supabase → Project Settings → API*. Nunca uses a chave `service_role` nestas variáveis e nunca faças commit do `.env.local`.

```bash
npm run dev
```

Abre http://localhost:3000.

Outros comandos: `npm run build`, `npm run start`, `npm run lint`.

---

## Base de dados (Supabase)

O código espera as seguintes tabelas e funções.

### `events`

| Coluna | Tipo |
| --- | --- |
| `id` | uuid (PK) |
| `title` | text |
| `description` | text |
| `location` | text |
| `date` | timestamp |
| `slug` | text |
| `capacity` | int |
| `organizer_id` | uuid (utilizador que criou o evento) |
| `created_at` | timestamp |

### `event_registrations`

| Coluna | Tipo |
| --- | --- |
| `id` | uuid (PK, `gen_random_uuid()`) |
| `event_id` | uuid (FK para `events`) |
| `user_id` | uuid (FK para `auth.users`) |
| `checked_in` | boolean (default `false`) |
| `checkin_token` | text/uuid (token usado no QR Code) |
| `created_at` | timestamp |

### Funções (RPC)

- `checkin_event(token_input)`: valida o token e marca o check-in
- `get_event_export(event_uuid)`: devolve `email` e `created_at` dos inscritos, usada no CSV

### Row Level Security

A aplicação acede ao Supabase diretamente a partir do browser com a chave `anon`, por isso **o RLS tem de estar ativo em todas as tabelas**. As políticas devem garantir, no mínimo, que:
- qualquer pessoa autenticada pode ler eventos;
- só o organizador pode editar ou eliminar o seu evento;
- cada utilizador só pode criar e apagar as suas próprias inscrições;
- só o organizador vê as inscrições do seu evento e pode exportá-las;
- o check-in só pode ser feito pelo organizador do evento.

<!-- Adicionar o SQL das tabelas, funções e políticas em supabase/migrations/ e ligar aqui. -->

---

## Limitações conhecidas e próximos passos

- **Capacidade:** o limite é verificado no cliente. O ideal é impô-lo na base de dados (função ou trigger), para evitar excesso de inscrições em pedidos simultâneos.
- **Check-in:** a página `/checkin/[token]` faz a alteração ao ser aberta; deve passar a pedir confirmação e a validar que quem o faz é organizador.
- **Código do servidor:** o helper `lib/supabase/server.ts` não lê a sessão a partir dos cookies, pelo que as rotas de API e Server Actions não reconhecem o utilizador. A interface não depende delas (exceto o export CSV), mas devem ser corrigidas ou removidas.
- **Tempo real:** existem hooks de realtime, mas ainda não estão ligados à interface nem às tabelas atuais.
- **Lista de inscritos:** mostra o identificador do utilizador em vez do nome ou email.
- Testes automáticos, integração contínua (lint, typecheck e build) e validação de formulários com Zod ainda por implementar.

---

## Como foi desenvolvido

A base inicial do projeto foi gerada com apoio de IA (Claude). A integração com o Supabase, o fluxo de inscrições e check-in, o dashboard e as melhorias seguintes foram desenvolvidos e ajustados por mim.

## Autor

Nuno Bastos — [GitHub](https://github.com/flvm-png) · [LinkedIn](https://www.linkedin.com/in/nuno-bastos-795b69270)
