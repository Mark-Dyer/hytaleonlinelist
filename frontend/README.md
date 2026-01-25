# Hytale Online List - Frontend

Next.js 16 frontend for Hytale Online List.

## Prerequisites

- Node.js 22+ (for local development without Docker)
- npm 10+ (for local development without Docker)
- Docker & Docker Compose (for containerized development)

## Local Development

### Option 1: Docker Compose

Run the production build locally in Docker.

**Start the service:**

```bash
cd frontend
docker compose up --build
```

**Start in detached mode (background):**

```bash
docker compose up --build -d
```

**View logs:**

```bash
docker compose logs -f frontend
```

**Stop the service:**

```bash
docker compose down
```

The app will be available at `http://localhost:3000`.

### Option 2: npm (Direct - Recommended for Development)

For active development with hot reloading:

```bash
cd frontend
npm install
npm run dev
```

The dev server will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file for local development:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL (for SEO) | `http://localhost:3000` |

**Note:** `NEXT_PUBLIC_*` variables are embedded at build time, not runtime.

## Building for Production

### Docker Build

```bash
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.hytaleonlinelist.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.hytaleonlinelist.com \
  -t hytale-online-list-frontend .
```

### npm Build

```bash
cd frontend
npm run build
npm start
```

## Production Deployment (Coolify)

For Coolify deployment, use the following settings:

| Setting | Value |
|---------|-------|
| Build Pack | Dockerfile |
| Base Directory | `frontend` |
| Dockerfile Location | `Dockerfile` |

**Build Arguments (required):**

Configure these in Coolify's build settings:

| Argument | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.hytaleonlinelist.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.hytaleonlinelist.com` |

**Important:** Since `NEXT_PUBLIC_*` variables are baked in at build time, you must configure them as **build arguments**, not runtime environment variables.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript types
├── public/               # Static assets
├── Dockerfile            # Production Docker build
├── docker-compose.yml    # Local development setup
├── .dockerignore         # Docker build exclusions
├── next.config.ts        # Next.js configuration
└── package.json          # npm configuration
```

## Standalone Output

This project uses Next.js standalone output mode (`output: 'standalone'` in `next.config.ts`). This creates a minimal production bundle that includes only the necessary dependencies, resulting in smaller Docker images (~150MB vs ~500MB+).
