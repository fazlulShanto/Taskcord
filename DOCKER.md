# Docker Deployment Guide

## Overview

This project has two Docker Compose configurations:

- **`docker-compose.local.yml`** - Development environment with hot reload
- **`docker-compose.prod.yml`** - Production environment with optimized builds

## Development Setup

### Requirements

- Docker with BuildKit enabled
- Docker Compose v3.8+

### Running Development Environment

```bash
# Start services with hot reload
docker compose -f docker-compose.local.yml up

# Rebuild and start (after dependency changes)
docker compose -f docker-compose.local.yml up --build

# Stop services
docker compose -f docker-compose.local.yml down

# Stop and remove volumes (clean slate)
docker compose -f docker-compose.local.yml down -v
```

**Features:**

- ✅ Hot reload enabled (changes reflect immediately)
- ✅ Source code mounted as volumes
- ✅ Fast pnpm installs with BuildKit cache mounts
- ✅ Development mode with tsx watch

**Access:**

- API: http://localhost:4005
- PostgreSQL: localhost:5435
- Redis: localhost:6385

---

## Production Setup

### Before Deployment

1. **Create production environment file:**

   ```bash
   cp .env.prod.example .env.prod
   ```

2. **Edit `.env.prod` with your production values:**

   - Strong passwords for database
   - Production domain URLs
   - Discord OAuth credentials
   - Strong JWT secret
   - CORS origins

3. **Add health check endpoint** (if not exists):
   Ensure your API has a `/health` endpoint for Docker health checks.

### Running Production Environment

```bash
# Build and start production services
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check service status
docker compose -f docker-compose.prod.yml ps

# Stop services
docker compose -f docker-compose.prod.yml down

# Update services (after code changes)
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

**Features:**

- ✅ Multi-stage optimized builds (smaller images)
- ✅ Production runtime with compiled code
- ✅ Health checks for all services
- ✅ Automatic restart policies
- ✅ Log rotation configured
- ✅ Isolated production network
- ✅ Persistent data volumes

**Access:**

- API: http://localhost:4005
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Dockerfile Architecture

### Multi-Stage Build (`Dockerfile.api`)

**Builder Stage:**

- Installs all dependencies
- Copies source code
- Builds TypeScript → JavaScript
- Uses BuildKit cache for pnpm store

**Runtime Stage:**

- Minimal Node.js Alpine image
- Only compiled artifacts
- Production node_modules
- Smaller image size (~50% reduction)

### Cache Optimization

BuildKit cache mounts speed up installs:

```dockerfile
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile
```

Benefits:

- First build: ~2-3 minutes
- Subsequent builds (no dep changes): ~30-60 seconds
- Cache persists between builds

---

## Common Commands

### Development

```bash
# Start in background
docker compose -f docker-compose.local.yml up -d

# Watch logs for specific service
docker compose -f docker-compose.local.yml logs -f api

# Execute command in running container
docker compose -f docker-compose.local.yml exec api pnpm --filter api test

# Access database
docker compose -f docker-compose.local.yml exec db psql -U postgres -d taskcord
```

### Production

```bash
# Deploy updates
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --build

# Backup database
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres taskcord > backup.sql

# Restore database
cat backup.sql | docker compose -f docker-compose.prod.yml exec -T db psql -U postgres taskcord

# Monitor resource usage
docker stats
```

---

## Troubleshooting

### Port Conflicts

If ports are already in use:

- Local: Change ports in `docker-compose.local.yml`
- Prod: Change ports in `docker-compose.prod.yml`

### Build Cache Issues

Clear BuildKit cache:

```bash
docker builder prune -a
```

### Network Issues

Recreate networks:

```bash
docker compose -f docker-compose.local.yml down
docker network prune
docker compose -f docker-compose.local.yml up
```

### Hot Reload Not Working (Dev)

Ensure:

1. Using `target: builder` in docker-compose.local.yml
2. Command is set to dev mode: `["pnpm", "--filter", "api", "dev"]`
3. Volumes are correctly mounted

### Service Won't Start (Prod)

Check health status:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs api
```

---

## Environment Variables

### Required for Production

- `POSTGRES_PASSWORD` - Strong database password
- `JWT_SECRET` - Strong random secret (min 32 chars)
- `DISCORD_AUTH_CLIENT_SECRET` - From Discord Developer Portal
- `CORS_ORIGIN_LIST` - Your production domain(s)

### Network Communication

Inside Docker, services use service names:

- Database: `postgresql://postgres:password@db:5432/taskcord`
- Redis: `redis://redis:6379`

**Don't use `localhost` or `127.0.0.1` in container env vars!**

---

## Security Considerations

### Production Checklist

- [ ] Strong database password set
- [ ] JWT secret is random and secure
- [ ] CORS origins restricted to your domain
- [ ] `.env.prod` not committed to git
- [ ] Health check endpoint doesn't expose sensitive data
- [ ] Log rotation configured (prevents disk fill)
- [ ] Database backups scheduled
- [ ] SSL/TLS termination at reverse proxy (nginx/traefik)

### Recommended: Reverse Proxy

Use nginx or Traefik in front of your containers for:

- SSL/TLS termination
- Rate limiting
- Load balancing
- Security headers

---

## Performance Tips

1. **Use BuildKit:** Always enable for faster builds

   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Layer Caching:** Don't invalidate dependency layers unnecessarily

   - Dockerfile copies package.json files first
   - Then installs dependencies
   - Then copies source code

3. **Multi-stage Builds:** Keep production images small

   - Builder: ~800MB
   - Runtime: ~200MB

4. **pnpm Store Cache:** Speeds up subsequent installs
   - Cached in `/root/.pnpm-store`
   - Persists between builds

---

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push
        run: |
          docker compose -f docker-compose.prod.yml build
          docker compose -f docker-compose.prod.yml push

      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d'
```

---

## Support

For issues related to:

- Docker setup: Check this README
- Application code: See main project README
- Dependencies: Check package.json files
