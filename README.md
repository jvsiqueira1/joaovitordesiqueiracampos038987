<div align="center">

# Pet Manager Frontend

**SPA em React + TypeScript + Tailwind para gerenciamento de Pets e Tutores**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## Índice

- [Features](#features)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Docker](#docker)
- [Health Check](#health-check)
- [Arquitetura](#arquitetura)
- [API Endpoints](#api-endpoints)
- [Notas](#notas)

---

## Features

- [x] Autenticação JWT com refresh token automático
- [x] **Pets** — CRUD completo, upload/remoção de foto, listagem paginada e busca
- [x] **Tutores** — CRUD completo, upload/remoção de foto, vínculo com pets
- [x] Lazy loading por módulos
- [x] Docker multi-stage (Node + Nginx)
- [x] Health page com liveness/readiness

---

## Quick Start

**1. Instale as dependências**

```bash
npm install
```

**2. Configure o ambiente**

```bash
cp .env.example .env
```

```env
VITE_API_URL=https://pet-manager-api.geia.vip
```

**3. Execute**

```bash
npm run dev
```

Acesse: http://localhost:5173

> **Credenciais:** `admin` / `admin`

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificar lint |
| `npm run lint:fix` | Corrigir lint |
| `npm run format` | Formatar com Prettier |

---

## Docker

**Build**

```bash
docker build -t pet-manager-frontend --build-arg VITE_API_URL=https://pet-manager-api.geia.vip .
```

**Run**

```bash
docker run --rm -p 8080:80 pet-manager-frontend
```

Acesse: http://localhost:8080

---

## Health Check

Rota: `/health`

| Check | Descrição |
|-------|-----------|
| Liveness | Aplicação renderizando |
| Readiness | Conexão com a API (`/v1/pets?page=0&size=1`) |

---

## Arquitetura

```
src/
├── app/                    # Rotas, layout, lazy loading
├── core/
│   ├── api/                # Axios, parser de paginação, ApiError
│   ├── auth/               # AuthFacade, refresh interceptor, storage
│   └── health/             # HealthPage
├── features/
│   ├── pets/               # Models, service, facade, pages, components
│   └── tutores/            # Models, service, facade, pages, components
└── shared/
    └── hooks/              # useObservable, useDebounce
```

### Camadas

| Camada | Responsabilidade |
|--------|------------------|
| **Service** | Comunicação HTTP com a API (tipado) |
| **Facade** | Estado (loading, error, itens), orquestra chamadas |
| **Pages/Components** | UI com React + Tailwind |

---

## API Endpoints

Base URL: `https://pet-manager-api.geia.vip`

<details>
<summary><strong>Auth</strong></summary>

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/autenticacao/login` | Login |
| PUT | `/autenticacao/refresh` | Refresh token |

</details>

<details>
<summary><strong>Pets</strong></summary>

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/v1/pets` | Listar (paginado + filtro nome) |
| GET | `/v1/pets/{id}` | Obter por ID |
| POST | `/v1/pets` | Criar |
| PUT | `/v1/pets/{id}` | Atualizar |
| DELETE | `/v1/pets/{id}` | Remover |
| POST | `/v1/pets/{id}/fotos` | Upload de foto |
| DELETE | `/v1/pets/{id}/fotos/{fotoId}` | Remover foto |

</details>

<details>
<summary><strong>Tutores</strong></summary>

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/v1/tutores` | Listar (paginado + filtro nome) |
| GET | `/v1/tutores/{id}` | Obter por ID |
| POST | `/v1/tutores` | Criar |
| PUT | `/v1/tutores/{id}` | Atualizar |
| DELETE | `/v1/tutores/{id}` | Remover |
| POST | `/v1/tutores/{id}/fotos` | Upload de foto |
| DELETE | `/v1/tutores/{id}/fotos/{fotoId}` | Remover foto |

</details>

<details>
<summary><strong>Vínculo Pet ↔ Tutor</strong></summary>

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/v1/tutores/{id}/pets/{petId}` | Vincular |
| DELETE | `/v1/tutores/{id}/pets/{petId}` | Desvincular |

</details>

---

## Notas

- **Paginação:** 10 itens por página
- **Busca:** debounce no input com fallback de filtro local quando a API não aplica o filtro
