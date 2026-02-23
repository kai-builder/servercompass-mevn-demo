<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface EnvVar {
  key: string
  value: string
  isNotSet: boolean
}

interface ApiResponse {
  envs: EnvVar[]
}

const envVars = ref<EnvVar[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const setCount = computed(() => envVars.value.filter((e) => !e.isNotSet).length)
const totalCount = computed(() => envVars.value.length)

onMounted(async () => {
  try {
    const res = await fetch('/api/env')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: ApiResponse = await res.json()
    envVars.value = data.envs
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch environment variables'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="header-left">
        <span class="eyebrow">MEVN Stack Demo</span>
        <h1 class="site-title">Server Compass</h1>
        <p class="site-subtitle">
          MongoDB · Express · Vue · Node.js — self-hosted on your own VPS
        </p>
      </div>
      <div class="header-badges">
        <span class="badge badge-vue">Vue 3</span>
        <span class="badge badge-express">Express</span>
        <span class="badge badge-node">Node.js</span>
      </div>
    </div>
  </header>

  <main class="main-content">

    <!-- Stack info strip -->
    <div class="stack-strip">
      <div class="stack-item">
        <span class="stack-icon">M</span>
        <span class="stack-label">MongoDB</span>
      </div>
      <span class="stack-sep">+</span>
      <div class="stack-item">
        <span class="stack-icon">E</span>
        <span class="stack-label">Express</span>
      </div>
      <span class="stack-sep">+</span>
      <div class="stack-item">
        <span class="stack-icon">V</span>
        <span class="stack-label">Vue 3</span>
      </div>
      <span class="stack-sep">+</span>
      <div class="stack-item">
        <span class="stack-icon">N</span>
        <span class="stack-label">Node.js</span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="state-card">
      <div class="spinner"></div>
      <p class="state-text">Loading environment variables&hellip;</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="state-card state-error">
      <div class="state-icon">&#9888;</div>
      <p class="state-title">Could not load environment variables</p>
      <p class="state-text">{{ error }}</p>
    </div>

    <!-- Main card -->
    <template v-else>
      <div class="env-card">
        <div class="env-card-header">
          <div>
            <h2 class="card-title">Public Environment Variables</h2>
            <p class="card-subtitle">
              Fetched from <code>/api/env</code> by the Vue frontend
            </p>
          </div>
          <div class="env-summary">
            <span class="summary-count">{{ setCount }}/{{ totalCount }}</span>
            <span class="summary-label">configured</span>
          </div>
        </div>

        <div class="env-list">
          <div
            v-for="envVar in envVars"
            :key="envVar.key"
            class="env-row"
            :class="{ 'env-row--unset': envVar.isNotSet }"
          >
            <div class="env-row-left">
              <span class="env-key">{{ envVar.key }}</span>
              <span
                class="env-status-dot"
                :class="envVar.isNotSet ? 'dot--unset' : 'dot--set'"
              ></span>
            </div>
            <span class="env-value" :class="{ 'env-value--unset': envVar.isNotSet }">
              {{ envVar.value }}
            </span>
          </div>
        </div>

        <p class="env-hint">
          Private values (<code>DATABASE_URL</code>, <code>API_SECRET_KEY</code>) are
          server-side only and never exposed.
          <a href="/api/env" target="_blank" rel="noopener">View raw JSON &rarr;</a>
        </p>
      </div>

      <!-- Architecture card -->
      <div class="arch-card">
        <h2 class="card-title">How This Works</h2>
        <div class="arch-flow">
          <div class="arch-step">
            <div class="arch-step-icon arch-step-icon--vue">V</div>
            <div>
              <div class="arch-step-title">Vue 3 Frontend</div>
              <div class="arch-step-desc">
                Composition API + Vite build.<br />
                Fetches <code>/api/env</code> on mount.
              </div>
            </div>
          </div>
          <div class="arch-arrow">&rarr;</div>
          <div class="arch-step">
            <div class="arch-step-icon arch-step-icon--express">E</div>
            <div>
              <div class="arch-step-title">Express Backend</div>
              <div class="arch-step-desc">
                Serves Vue static build.<br />
                Exposes <code>/api/env</code> + <code>/health</code>.
              </div>
            </div>
          </div>
          <div class="arch-arrow">&rarr;</div>
          <div class="arch-step">
            <div class="arch-step-icon arch-step-icon--mongo">M</div>
            <div>
              <div class="arch-step-title">MongoDB</div>
              <div class="arch-step-desc">
                Connected via <code>DATABASE_URL</code>.<br />
                Ready for your collections.
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>

  <footer class="site-footer">
    <p>
      Deployed with
      <a href="https://servercompass.app/" target="_blank" rel="noopener">Server Compass</a>
      &mdash; the modern way to self-host MEVN apps on your own VPS.
    </p>
    <p class="footer-powered">
      Powered by the MEVN Stack &bull; MongoDB + Express + Vue 3 + Node.js
    </p>
  </footer>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────── */
.site-header {
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, #0f1e3a 0%, var(--bg) 100%);
  padding: 28px 32px;
}

.header-inner {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 6px;
}

.site-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.2;
}

.site-subtitle {
  font-size: 14px;
  color: var(--muted);
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: flex-start;
  padding-top: 4px;
}

.badge {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.badge-vue {
  background: rgba(110, 231, 211, 0.12);
  color: var(--accent);
  border-color: rgba(110, 231, 211, 0.25);
}

.badge-express {
  background: rgba(127, 183, 255, 0.12);
  color: var(--accent-2);
  border-color: rgba(127, 183, 255, 0.25);
}

.badge-node {
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.25);
}

.main-content {
  flex: 1;
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Stack strip ─────────────────────────────────────────────────────────── */
.stack-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  flex-wrap: wrap;
}

.stack-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stack-icon {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 700;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(110, 231, 211, 0.12);
  color: var(--accent);
  border: 1px solid rgba(110, 231, 211, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stack-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.stack-sep {
  color: var(--border);
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
}

/* ── State cards ─────────────────────────────────────────────────────────── */
.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: center;
}

.state-card.state-error {
  border-color: rgba(248, 113, 113, 0.35);
}

.state-icon {
  font-size: 28px;
  color: var(--danger);
}

.state-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.state-text {
  font-size: 14px;
  color: var(--muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Env card ────────────────────────────────────────────────────────────── */
.env-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.env-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 13px;
  color: var(--muted);
}

.card-subtitle code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  background: rgba(110, 231, 211, 0.1);
  color: var(--accent);
  padding: 1px 5px;
  border-radius: 4px;
}

.env-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.summary-count {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.summary-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ── Env list ────────────────────────────────────────────────────────────── */
.env-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.env-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  background: rgba(255, 255, 255, 0.01);
  border-bottom: 1px solid var(--border);
  gap: 12px;
  transition: background 0.15s;
}

.env-row:last-child {
  border-bottom: none;
}

.env-row:hover {
  background: rgba(110, 231, 211, 0.04);
}

.env-row-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.env-key {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-2);
  white-space: nowrap;
}

.env-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--set {
  background: var(--success);
  box-shadow: 0 0 5px var(--success);
}

.dot--unset {
  background: var(--warning);
  box-shadow: 0 0 5px var(--warning);
}

.env-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text);
  text-align: right;
  word-break: break-all;
}

.env-value--unset {
  color: var(--warning);
  font-style: italic;
}

.env-hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
}

.env-hint code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1px 5px;
  border-radius: 4px;
}

.env-hint a {
  color: var(--accent);
  margin-left: 4px;
}

/* ── Architecture card ───────────────────────────────────────────────────── */
.arch-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.arch-flow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.arch-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 160px;
}

.arch-step-icon {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 700;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arch-step-icon--vue {
  background: rgba(110, 231, 211, 0.15);
  color: var(--accent);
  border: 1px solid rgba(110, 231, 211, 0.25);
}

.arch-step-icon--express {
  background: rgba(127, 183, 255, 0.15);
  color: var(--accent-2);
  border: 1px solid rgba(127, 183, 255, 0.25);
}

.arch-step-icon--mongo {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.25);
}

.arch-step-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.arch-step-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
}

.arch-step-desc code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1px 4px;
  border-radius: 3px;
}

.arch-arrow {
  font-size: 20px;
  color: var(--border);
  flex-shrink: 0;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 20px 32px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-powered {
  font-size: 12px;
  opacity: 0.7;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .site-header {
    padding: 20px 16px;
  }

  .main-content {
    padding: 20px 16px;
  }

  .env-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .env-value {
    text-align: left;
  }

  .arch-arrow {
    transform: rotate(90deg);
    align-self: center;
  }

  .arch-flow {
    flex-direction: column;
  }
}
</style>
