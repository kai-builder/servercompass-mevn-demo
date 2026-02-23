'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Public environment variables — safe to expose in the UI/API.
// Private values (DATABASE_URL, API_SECRET_KEY) stay server-side only.
const PUBLIC_KEYS = ['APP_NAME', 'API_URL', 'ENVIRONMENT', 'VERSION'];

function getPublicEnvs() {
  return PUBLIC_KEYS.map((key) => {
    const value = (process.env[key] || '').trim() || 'Not set';
    return { key, value, isNotSet: value === 'Not set' };
  });
}

// ---------------------------------------------------------------------------
// API routes (registered before static middleware so they take priority)
// ---------------------------------------------------------------------------

app.get('/api/env', (_req, res) => {
  res.json({ envs: getPublicEnvs() });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'servercompass-mevn-demo' });
});

// ---------------------------------------------------------------------------
// Serve Vue 3 production build
// ---------------------------------------------------------------------------

const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(CLIENT_DIST));

// SPA fallback — let Vue Router handle unknown paths
app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`servercompass-mevn-demo listening on http://localhost:${PORT}`);
});
