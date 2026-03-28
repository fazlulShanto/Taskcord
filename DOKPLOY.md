# Dokploy Deployment (Railway Config)

This repo now includes a Railway-compatible `railpack.json` per deployable app:

- `apps/api/railpack.json`
- `apps/dashboard/railpack.json`
- `apps/discord-bot/railpack.json`

Each config is monorepo-safe and runs install/build/start from the repository root with pnpm filters.

## 1) Create Services In Dokploy

Create one Dokploy service per app from the same repository.

### API service

- Service type: Application
- Build provider: Railway config (Railpack)
- Root directory: `apps/api`
- Config file: `railpack.json`

### Dashboard service

- Service type: Application
- Build provider: Railway config (Railpack)
- Root directory: `apps/dashboard`
- Config file: `railpack.json`

### Discord bot service

- Service type: Application
- Build provider: Railway config (Railpack)
- Root directory: `apps/discord-bot`
- Config file: `railpack.json`

## 2) Environment Variables

Set these variables in Dokploy per service.

### API

Required or strongly recommended:

- `NODE_ENV=prod`
- `HOST=0.0.0.0`
- `PORT=5001` (or Dokploy-provided port)
- `DATABASE_URL=<postgres-connection-string>`
- `DATABASE_URL_NON_POOLING=<postgres-nonpooling-connection-string>`
- `REDIS_URL=<redis-connection-string>`
- `ALLOWED_ORIGINS=<comma-separated-frontend-origins>`

Optional (feature dependent):

- `SECRET`
- `PRIVATE`
- `PUBLIC`
- `GITHUB_APP_NAME`
- `GITHUB_WEBHOOK_SECRET`

### Dashboard

- `PORT=4173` (optional if Dokploy injects a port)
- `VITE_PROD_API_URL=<public-api-url>`
- `VITE_DEV_API_URL=<dev-api-url-if-needed>`

### Discord bot

- `NODE_ENV=prod`
- `DATABASE_URL=<postgres-connection-string>`
- `REDIS_URL=<redis-connection-string>`
- `DISCORD_TOKEN=<bot-token>`
- Any other bot-specific env variables used in `apps/discord-bot/src/config`

## 3) Notes

- Use pnpm-compatible Node runtime (Node 22+, as required by this repo).
- Railpack commands invoke pnpm directly through Corepack (`corepack pnpm@10.12.1 ...`) to avoid PATH/shim issues in some builders.
- The dashboard service runs `vite preview` and binds to `0.0.0.0`.
- If Dokploy sets `PORT`, the dashboard config uses it. Otherwise it falls back to `4173`.
- API and bot builds rely on workspace package `@taskcord/database`, which is why install/build commands are executed from monorepo root.
