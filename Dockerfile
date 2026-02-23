# syntax=docker/dockerfile:1

# ── Stage 1: Build Vue 3 frontend ────────────────────────────────────────────
FROM node:22-alpine AS client-builder

WORKDIR /app/client

# Copy manifest first — layer is cached until package*.json changes
COPY client/package*.json ./
RUN npm ci

# Copy source and build
COPY client/ .
RUN npm run build

# ── Stage 2: Minimal production runtime ──────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Install server dependencies (production only)
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy Express source
COPY server/ ./server/

# Copy Vue build output from client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
