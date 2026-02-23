# MEVN Stack Demo — Server Compass

> A production-ready MEVN stack application template for self-hosting with [Server Compass](https://servercompass.app/).

**MongoDB · Express · Vue 3 · Node.js** — deploy this full-stack JavaScript app to any VPS in minutes.

## What Is This?

This demo showcases how to self host a MEVN stack application using [Server Compass](https://servercompass.app/). It uses a proper monorepo structure with a Vue 3 frontend (built with Vite) and an Express backend, exactly as you would structure a production MEVN app.

- **Vue 3 frontend** — Composition API, `<script setup>`, TypeScript, built with Vite
- **Express backend** — serves the Vue build, exposes `/api/env` and `/health`
- **MongoDB-ready** — `DATABASE_URL` wired for MongoDB connection string
- **Multi-stage Docker build** — optimized for minimal image size and fast rebuilds

## Project Structure

```
servercompass-mevn-demo/
├── client/                 # Vue 3 frontend (Vite + TypeScript)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── App.vue         # Dashboard fetching /api/env
│       └── style.css
├── server/                 # Express backend
│   ├── index.js
│   └── package.json
├── package.json            # Root scripts
├── Dockerfile
└── .env.example
```

## Environment Variables

| Variable | Public | Description |
|---|---|---|
| `APP_NAME` | Yes | Application name displayed in the UI |
| `API_URL` | Yes | Server Compass API endpoint |
| `ENVIRONMENT` | Yes | Deployment environment (`production`, `staging`) |
| `VERSION` | Yes | Application version |
| `DATABASE_URL` | No | MongoDB connection string — server-side only |
| `API_SECRET_KEY` | No | API secret — server-side only |

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | Vue 3 dashboard (public env vars displayed) |
| `GET /api/env` | JSON — public environment variables |
| `GET /health` | Health check `{ "status": "ok" }` |

## Local Development

### Prerequisites
- Node.js 22+
- npm 10+

### Install dependencies

```bash
# Install client and server dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Run in development mode

```bash
# Terminal 1 — Express backend (port 3000)
npm run dev:server

# Terminal 2 — Vue Vite dev server (port 5173, proxies /api to :3000)
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173).

## Docker

### Build

```bash
docker build -t servercompass-mevn-demo .
```

### Run

```bash
docker run -p 3000:3000 --env-file .env servercompass-mevn-demo
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables inline

```bash
docker run -p 3000:3000 \
  -e APP_NAME="My MEVN App" \
  -e API_URL="https://api.servercompass.app" \
  -e ENVIRONMENT="production" \
  -e VERSION="1.0.0" \
  -e DATABASE_URL="mongodb://user:password@host:27017/db" \
  -e API_SECRET_KEY="your-secret" \
  servercompass-mevn-demo
```

## Deploy to Your VPS

Deploy this MEVN stack application to any VPS in minutes with [Server Compass](https://servercompass.app/) — the modern way to self host MEVN apps on your own server.

1. Push this repo to GitHub
2. Connect your VPS to [Server Compass](https://servercompass.app/)
3. Point Server Compass at this repository
4. Set your environment variables in the Server Compass dashboard
5. Deploy — Server Compass builds the Docker image and runs it

## Keywords

self host MEVN, deploy MEVN to VPS, install MEVN stack, MEVN docker deployment, self-hosted Vue Express MongoDB, Vue 3 self-hosted, Express Node.js VPS deployment, MEVN stack production

---

Deployed with [Server Compass](https://servercompass.app/) — self-host MEVN stack apps on your own VPS.
