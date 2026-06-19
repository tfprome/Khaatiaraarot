# Khaatiaraarot

Bangladeshi ecommerce platform. Next.js frontend + Express.js backend.

## Project Structure

```
Khaatiaraarot/
├── khaatiaraarot-web/     # Next.js frontend (port 3000)
└── khaatiaraarot-api/     # Express.js backend (port 4000)
```

---

## Backend Setup (`khaatiaraarot-api`)

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 1. Install dependencies
```bash
cd khaatiaraarot-api
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Open `.env` and fill in:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from [console.cloudinary.com](https://console.cloudinary.com)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — SMTP credentials (use [Mailtrap](https://mailtrap.io) for dev)

Everything else (DB, Redis, JWT secrets) is pre-filled for local dev.

### 3. Start database and Redis
```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5434` (data persisted in Docker volume)
- **Redis** on port `6379`
- Migrations run automatically on first boot

### 4. Start dev server
```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:4000/api/v1` | API base |
| `http://localhost:4000/api/v1/docs` | Swagger UI |

### Next time (containers already exist)
```bash
docker compose up -d
npm run dev
```

### Other commands
```bash
npm run build          # compile TypeScript
npm run start          # run compiled build
npm run db:generate    # generate new migration from schema changes
npm run db:migrate     # apply migrations (drizzle-kit)
npm run db:studio      # open Drizzle Studio (DB GUI)
```

---

## Frontend Setup (`khaatiaraarot-web`)

```bash
cd khaatiaraarot-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Overview

| Group | Base path |
|-------|-----------|
| Auth | `/api/v1/auth` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Banners | `/api/v1/banners` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Admin | `/api/v1/admin/*` |

Full interactive docs at `/api/v1/docs`. Admin routes require `Authorization: Bearer <token>` with admin role.

---

## Production Notes

- Generate fresh JWT secrets — never use the dev defaults from `.env.example`
- Set `NODE_ENV=production` for JSON logging and reduced log verbosity
- Configure `ALLOWED_ORIGIN` to your frontend domain

---

## Admin Account

- Email = admin@khaatiaraarot.com
- PASSWORD = Admin@123456
