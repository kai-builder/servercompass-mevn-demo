# MEVN Demo - Server Compass

> A production-ready MEVN stack application template for self-hosting with [Server Compass](https://servercompass.app/)

MEVN (MongoDB + Express + Vue + Node.js) is one of the most popular full-stack JavaScript combinations for building modern web applications. This demo shows how to install MEVN, containerize it, and deploy MEVN to a VPS in minutes using Server Compass.

## Features

- Express.js backend serving a clean Vue-compatible UI
- Public environment variables displayed on the landing page
- JSON endpoint at `/api/env` for API consumers
- Health check at `/health` for container orchestration
- Private values (`DATABASE_URL`, `API_SECRET_KEY`) kept server-side only
- Optimized multi-stage Docker build with layer caching

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/kai-builder/servercompass-mevn-demo.git
cd servercompass-mevn-demo

# 2. Copy the example environment file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` for the UI or `http://localhost:3000/api/env` for JSON.

## Environment Variables

| Variable        | Description                          | Public |
|-----------------|--------------------------------------|--------|
| `APP_NAME`      | Application display name             | Yes    |
| `API_URL`       | Server Compass API endpoint          | Yes    |
| `ENVIRONMENT`   | Deployment environment               | Yes    |
| `VERSION`       | Application version                  | Yes    |
| `DATABASE_URL`  | MongoDB connection string            | No     |
| `API_SECRET_KEY`| Secret key for API authentication    | No     |
| `PORT`          | HTTP port (default: 3000)            | No     |

Public variables are shown in the UI and `/api/env`. Private variables remain on the server.

## Docker

```bash
# Build the image
docker build -t servercompass-mevn-demo .

# Run with environment variables
docker run -p 3000:3000 --env-file .env servercompass-mevn-demo

# Run with inline variables
docker run -p 3000:3000 \
  -e APP_NAME="My MEVN App" \
  -e ENVIRONMENT=production \
  -e VERSION=1.0.0 \
  servercompass-mevn-demo
```

The Dockerfile uses a two-stage build:
1. **deps** - installs production dependencies with `npm ci --omit=dev`
2. **runtime** - copies only what is needed into a minimal `node:22-alpine` image

## Deploy to Your VPS

Deploy this MEVN application to any VPS in minutes with [Server Compass](https://servercompass.app/) - the modern way to self host MEVN applications.

1. Sign in to [Server Compass](https://servercompass.app/)
2. Connect your VPS
3. Point Server Compass at this repository
4. Set your environment variables in the dashboard
5. Deploy

Server Compass handles Docker builds, zero-downtime restarts, SSL certificates, and environment variable management so you can focus on your application.

## Endpoints

| Endpoint    | Description                              |
|-------------|------------------------------------------|
| `GET /`     | Landing page with public env vars        |
| `GET /api/env` | JSON response with public env vars    |
| `GET /health`  | Health check (`{"status":"ok"}`)      |

## Deployed with Server Compass

This demo is maintained by the [Server Compass](https://servercompass.app/) team to showcase how easy it is to self host MEVN stack applications on your own infrastructure.

GitHub: https://github.com/kai-builder/servercompass-mevn-demo

---

**Keywords:** self host MEVN, deploy MEVN to VPS, install MEVN, MEVN docker deployment, self-hosted MEVN stack, MongoDB Express Vue Node.js self hosting
