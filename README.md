README.md — SharkEvents

# 🦈 SharkEvents

SharkEvents é uma plataforma de criação e gestão de eventos construída com **Next.js 16**, **Supabase** e **Tailwind CSS**.

Permite criar eventos, inscrever utilizadores, gerir check-ins via QR Code e acompanhar estatísticas em tempo real.

---

## 🚀 Funcionalidades

- Autenticação (Supabase Auth)
- Criação de eventos
- Sistema de inscrições
- Limite de capacidade por evento
- Dashboard de organizador
- Lista de inscritos
- Check-in via QR Code
- Estatísticas básicas por evento
- Atualização dinâmica de inscrições

---

## 🧰 Stack Tecnológico

- Next.js (App Router)
- React 18
- TypeScript
- Supabase (Auth + Database)
- Tailwind CSS

---

# 📥 1. Instalação completa (Windows / macOS / Linux)

## 🔧 Passo 1 — Instalar dependências obrigatórias

### 🟢 Instalar Node.js

O projeto requer **Node.js 18+**

### ✔ Verificar se já tens instalado:

```bash
node -v
npm -v

Se aparecer uma versão ≥ 18 → OK.

❌ Se NÃO tiveres Node.js
Instala aqui:👉 https://nodejs.org/
Depois confirma:

node -v
npm -v


🧩 (Opcional) Instalar Git

git --version

Se não existir:👉 https://git-scm.com/downloads

📥 Passo 2 — Clonar o repositório

git clone https://github.com/flvm-png/sharkevents.git
cd sharkevents


📦 Passo 3 — Instalar dependências
npm:

npm install

ou pnpm:

pnpm install


🔐 Passo 4 — Configurar variáveis de ambiente
Criar ficheiro .env.local na raiz:

touch .env.local

Adicionar:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

📌 Encontras isto em:Supabase → Project Settings → API

🗄️ Passo 5 — Base de dados (Supabase)
📌 Tabela: events

id uuid primary key
title text
description text
location text
date timestamp
slug text
capacity int4
organizer_id uuid
created_at timestamp


📌 Tabela: event_registrations

id uuid primary key default gen_random_uuid()
event_id uuid
user_id uuid
checked_in boolean default false
created_at timestamp


▶️ Passo 6 — Correr o projeto

npm run dev

ou

pnpm dev


🌐 Passo 7 — Abrir no browser

http://localhost:3000


🧠 Fluxo da aplicação
👤 Utilizador normal
	•	Regista-se / faz login
	•	Vê lista de eventos
	•	Inscreve-se em eventos
	•	Pode fazer check-in via QR code

🎟️ Eventos
	•	Têm capacidade máxima
	•	Mostram número de inscritos
	•	Mostram estado do evento
	•	Permitem check-in

🧑‍💼 Organizador
	•	Cria eventos
	•	Acede ao dashboard
	•	Vê inscritos por evento
	•	Vê check-ins em tempo real
	•	Estatísticas básicas

📱 Sistema de QR Code
	•	Utilizador gera QR após inscrição
	•	QR é escaneado no evento
	•	Campo checked_in é atualizado para true
	•	Entrada é validada automaticamente

🧪 Problemas comuns
❌ "not authenticated"
	•	Verificar .env.local
	•	Confirmar login no browser

❌ Erros de cookies / dashboard vazio

rm -rf .next
npm run dev


❌ Eventos não aparecem
	•	Verificar se organizer_id está correto
	•	Confirmar inserts no Supabase

📌 Roadmap
	•	Dashboard com gráficos
	•	Export CSV de inscritos
	•	Notificações em tempo real
	•	Perfis de utilizador
	•	Mobile UI otimizada
	•	Scanner QR em tempo real

👨‍💻 Autor
Projeto desenvolvido por SharkEvents

