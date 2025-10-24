
# InfraPlus — Águas Seguras (MVP + Upload + Filtros Avançados)

Plataforma tipo "Reclame Aqui" para problemas de **água**.

## Destaques do MVP
- **Autenticação** (JWT) com roles `CITIZEN` e `ADMIN`
- **Denúncias** com geolocalização, comentários e **imagens** (upload local com `multer`)
- **Aba Pública** com abas de **Abertas** e **Resolvidas**
- **Mapa** (Leaflet) com marcadores
- **Dashboard Admin** com KPIs e mudança de status
- **Filtros avançados**: por **período** (`startDate`, `endDate`) e por **raio** (`centerLat`, `centerLng`, `radiusKm`)
- **Paginação** (`page`, `pageSize`) e busca (`q`)
- **Docker Compose** (MySQL + Adminer + API + Frontend)
- **Seeds**: admin + usuários + denúncias fake de Saquarema
- **CI** (GitHub Actions) + templates de issues e PR

## Como rodar com Docker
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build

# Frontend: http://localhost:5173
# API:      http://localhost:3000
# Uploads:  http://localhost:3000/uploads/<arquivo>
# Adminer:  http://localhost:8080 (server: db, user: root, pass: root)
```

## Acesso rápido
- **Admin**: `admin@demo.com` / `admin123`
- **Cidadãos** (senha `senha123`): `joao@demo.com`, `maria@demo.com`, `carlos@demo.com`

## API principal
- `POST /api/auth/register` | `POST /api/auth/login` | `GET /api/auth/me`
- `GET /api/reports` — filtros: `status`, `category`, `q`, `startDate`, `endDate`, `centerLat`, `centerLng`, `radiusKm`, `page`, `pageSize`
- `GET /api/reports/:id`
- `POST /api/reports` — cria denúncia (JSON)
- `POST /api/reports/with-upload` — cria denúncia com **multipart/form-data** (`images[]`)
- `PATCH /api/reports/:id/status` — ADMIN
- `POST /api/comments` — adiciona comentário (autenticado)
- `GET /api/stats/summary` — KPIs para Dashboard

## Páginas
- `/` Home (login + últimas denúncias)
- `/publico` Denúncias Públicas (abas **Abertas** | **Resolvidas**)
- `/mapa` Mapa de denúncias
- `/nova` Nova denúncia (com upload de imagens)
- `/admin` Dashboard (ADMIN)
- `/report/:id` Detalhe com comentários

## Rodar local (sem Docker)
```bash
# Backend
cd backend
cp .env.example .env   # ajuste DATABASE_URL para seu MySQL local
pnpm i
pnpm prisma:generate
pnpm db:push
pnpm seed
pnpm dev

# Frontend
cd ../frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000
pnpm i
pnpm dev
```
