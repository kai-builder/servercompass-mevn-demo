# syntax=docker/dockerfile:1
# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy manifest files first so this layer is cached independently of
# source-code changes (re-runs only when package*.json change).
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Stage 2: minimal runtime ─────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY package.json ./
COPY server.js    ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
