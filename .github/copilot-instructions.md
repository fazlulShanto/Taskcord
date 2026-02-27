# Taskcord - AI Coding Agent Instructions

## Project Overview

Taskcord is a pnpm-based monorepo for task management with Discord integration. It consists of three main apps (Fastify API, React dashboard, Discord bot) and shared packages (database, config).

## Architecture & Structure

### Monorepo Layout

- **apps/api**: Fastify REST API with modular route structure
- **apps/dashboard**: React + Vite + TanStack Router dashboard
- **apps/discord-bot**: Discord.js bot with slash commands
- **packages/database**: Drizzle ORM models and DAL layer (shared across apps)
- **packages/config-{eslint,typescript}**: Shared configuration

### Key Dependencies

- **Build**: Turborepo for orchestration, tsdown for API/bot builds
- **API**: Fastify with fastify-zod for schema validation, Redis for caching
- **Database**: Drizzle ORM + PostgreSQL, migrations in `packages/database/drizzle/`
- **Dashboard**: TanStack Router (file-based routing), TanStack Query, shadcn/ui components

## Development Workflows

### Running Services

```bash
# All services (via Turborepo)
pnpm dev                    # Runs all apps

# Individual services
pnpm dev:api                # API on port 5001
pnpm dev:dashboard          # Dashboard on port 5173
pnpm dev:bot                # Discord bot

# Specific app via filter
pnpm --filter api dev
```

### Building

```bash
pnpm build                  # Build all apps
pnpm build:api              # Build API only
turbo run build --filter=api  # Alternative syntax
```

### Database Operations

```bash
cd packages/database
pnpm generate               # Generate migration from schema changes
pnpm push                   # Push schema to database
pnpm studio                 # Open Drizzle Studio
pnpm magic                  # Generate + push in one command
```

### Docker Deployment

- **Dev**: `docker compose -f docker-compose.local.yml up` (hot reload enabled)
- **Prod**: `docker compose -f docker-compose.prod.yml up -d --build`
- See `DOCKER.md` for detailed deployment instructions

## Code Patterns & Conventions

### API Module Structure (apps/api/src/modules/)

Each feature module follows this pattern:

```
modules/
  project/
    index.ts              # Registers schemas and routes
    project.route.ts      # Fastify route definitions
    project.controller.ts # Request handlers
    project.service.ts    # Business logic
    project.schema.ts     # Zod schemas
```

**Route Registration Pattern**:

```typescript
// modules/project/index.ts
export default fastifyPlugin(async (fastify, options) => {
    zodProjectSchemas.map((schema) => fastify.addSchema(schema));
    await fastify.register(ProjectRoute, options);
});
```

**Route Definition Pattern**:

```typescript
// project.route.ts
fastify.get(
    "/:id",
    {
        onRequest: [fastify.jwtAuth], // JWT middleware
        schema: {
            tags: ["Projects"],
            params: { $ref: "projectSchemaWithId" },
            response: { 200: { $ref: "projectResponse" } },
        },
    },
    controller.getProject.bind(controller)
);
```

### Schema Validation (Zod + Swagger)

- Define Zod schemas in `*.schema.ts` files
- Convert to JSON Schema: `GlobalUtils.zodToSchema(schemas)`
- Register with `fastify.addSchema()` for Swagger docs at `/api/docs`
- Reference schemas using `$ref` in route definitions

### Database Patterns

- **Models**: Located in `packages/database/src/models/*.model.ts`
- **DAL Classes**: Static methods in `packages/database/src/dal/*.dal.ts`
- **Drizzle Schema Pattern**:

```typescript
export const projectModel = pgTable("projects", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    creatorId: uuid("creator_id").references(() => usersModel.id),
    // ...
});
export type DbProject = typeof projectModel.$inferSelect;
export type DbNewProject = typeof projectModel.$inferInsert;
```

### Authentication & Authorization

- JWT tokens managed via `@fastify/jwt` plugin
- Auth decorator: `fastify.jwtAuth` (use in `onRequest` array)
- JWT payload interface in `apps/api/src/plugins/jwt.ts`
- Token extraction from `Authorization: Bearer <token>` header

### Frontend Patterns (apps/dashboard)

- **Routing**: File-based with TanStack Router (routes in `src/routes/`)
- **API Client**: Centralized URLs in `src/lib/api.tsx`
- **State**: Zustand stores in `src/stores/`
- **Queries**: TanStack Query hooks in `src/queries/`
- **Components**: shadcn/ui in `src/components/ui/`
- **Aliases**: Use `@/` for src, `@components/`, `@queries/`, `@stores/`, `@ui/`

### Adding shadcn Components

```bash
cd apps/dashboard
pnpx shadcn@latest add <component-name>
```

## Environment Configuration

### API Environment Variables

- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (prod/staging/local)
- `DATABASE_URL` / `PG_DB_URL`: PostgreSQL connection
- `REDIS_URL`: Redis connection
- `JWT_SECRET`: JWT signing secret
- `BACKEND_HOST_URL`: API base URL
- `DISCORD_OAUTH_REDIRECT_URL`: Discord OAuth callback path

### Dashboard Environment Variables

- `VITE_PROD_API_URL`: Production API URL
- `VITE_DEV_API_URL`: Development API URL

## Common Tasks

### Adding a New API Endpoint

1. Create/extend module in `apps/api/src/modules/<module-name>/`
2. Define Zod schemas in `<module>.schema.ts`
3. Add route in `<module>.route.ts` with schema references
4. Implement controller method in `<module>.controller.ts`
5. Add service logic in `<module>.service.ts`
6. Register module in `modules/index.ts` if new

### Adding Database Tables

1. Create model in `packages/database/src/models/<table>.model.ts`
2. Run `pnpm generate` in packages/database
3. Review migration in `packages/database/drizzle/`
4. Run `pnpm push` to apply migration
5. Create DAL class in `packages/database/src/dal/<table>.dal.ts` if needed

### Testing

- API tests use Vitest + Supertest (see `apps/api/src/test/`)
- Run with `pnpm test` or `pnpm --filter api test`

## Important Notes

- **Node Version**: Requires Node.js >=22 (see root `package.json`)
- **Package Manager**: pnpm 10.12.1+ (enforced in `packageManager` field)
- **Migrations**: Auto-run on API startup via `runMigrations()` in `server.ts`
- **Redis**: Required for API caching (`fastify.cacheDb` decorator)
- **API Versioning**: Routes prefixed with `/api/edge/*` or `/api/stable/*`
- **CORS**: Configured in `apps/api/src/plugins/cors.ts`
