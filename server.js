'use strict';

require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Public environment variables safe to expose in the UI/API.
// Private values (DATABASE_URL, API_SECRET_KEY) stay server-side only.
const PUBLIC_KEYS = ['APP_NAME', 'API_URL', 'ENVIRONMENT', 'VERSION'];

function getPublicEnvs() {
  return PUBLIC_KEYS.map((key) => {
    const value = (process.env[key] || '').trim() || 'Not set';
    return { key, value, isNotSet: value === 'Not set' };
  });
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (_req, res) => {
  const envs = getPublicEnvs();

  const rows = envs
    .map(({ key, value, isNotSet }) => {
      const cls = isNotSet ? 'value not-set' : 'value';
      return `
        <div class="env-row">
          <span class="key">${key}</span>
          <span class="${cls}">${value}</span>
        </div>`;
    })
    .join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Server Compass MEVN Demo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #0c1427;
      --surface: #111e35;
      --border:  #1e2f4a;
      --accent:  #4f9cf9;
      --text:    #e2eaf6;
      --muted:   #7a93b8;
      --warn:    #f7b733;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    header {
      padding: 20px 32px;
      background: linear-gradient(135deg, #0f1f3a, var(--bg));
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }
    .meta {
      font-size: 13px;
      color: var(--muted);
    }
    main {
      padding: 32px;
      max-width: 680px;
      margin: 0 auto;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 16px;
    }
    .env-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 0;
      border-bottom: 1px solid var(--border);
    }
    .env-row:last-child { border-bottom: none; }
    .key   { font-weight: 600; color: var(--accent); font-size: 14px; }
    .value { font-size: 14px; color: var(--text); }
    .not-set { color: var(--warn); }
    .hint {
      margin-top: 16px;
      font-size: 13px;
      color: var(--muted);
    }
    .hint a { color: var(--accent); text-decoration: none; }
    .hint a:hover { text-decoration: underline; }
    footer {
      margin-top: 32px;
      text-align: center;
      font-size: 12px;
      color: var(--muted);
      padding-bottom: 24px;
    }
    footer a { color: var(--accent); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    @media (max-width: 600px) {
      main { padding: 20px; }
      .card { padding: 18px; }
      .env-row { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
  </style>
</head>
<body>
  <header>
    <span class="eyebrow">MEVN stack demo</span>
    <h1>Server Compass Demo Environment Variables</h1>
    <span class="meta">Served by Express.js + Vue.js</span>
  </header>
  <main>
    <div class="card">
      <div class="card-title">Public environment variables</div>
      ${rows}
      <p class="hint">
        Only public variables are shown here. Private server values stay on the
        backend.<br />Try the JSON view at
        <a href="/api/env">/api/env</a>.
      </p>
    </div>
    <footer>
      Deployed with
      <a href="https://servercompass.app/" target="_blank" rel="noopener">Server Compass</a>
      &mdash; self-host MEVN apps on your own VPS.
    </footer>
  </main>
</body>
</html>`);
});

app.get('/api/env', (_req, res) => {
  res.json({ envs: getPublicEnvs() });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'servercompass-mevn-demo' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`servercompass-mevn-demo listening on port ${PORT}`);
});
