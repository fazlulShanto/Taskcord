Here's the complete formatted README.md content that you can directly copy:

# Taskcord

A monorepo containing a Discord bot and REST API for task management.

## 📦 Project Structure

```bash
apps/
├── api/         # REST API built with Fastify
└── discord-bot/ # Discord bot using discord.js
```

## 🚀 Features

### API

- RESTful endpoints for task management
- OpenAPI/Swagger documentation at `/api/docs`
- Health check and server monitoring endpoints
- Built with Fastify for high performance

### Discord Bot

- Slash command support
- Server information commands
- Administrative commands
- Built with discord.js

## 🛠️ Tech Stack

- **Language:** TypeScript
- **API Framework:** Fastify
- **Discord Framework:** discord.js
- **Package Manager:** pnpm (workspace)
- **Documentation:** OpenAPI/Swagger
- **Linting:** ESLint
- **Building:** tsup

## 🏗️ Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd taskcord
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
# For API
cp apps/api/.env.example apps/api/.env

# For Discord Bot
cp apps/discord-bot/.env.example apps/discord-bot/.env
```

4. Start development servers

```bash
# API
pnpm --filter api dev

# Discord Bot
pnpm --filter bot dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter api build
pnpm --filter bot build
```

## 📝 Environment Variables

### API

- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (prod/staging/local)
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection string

### Discord Bot

- `DISCORD_BOT_TOKEN` - Discord bot token
- `DISCORD_CLIENT_ID` - Discord application client ID
- `DISCORD_SHOULD_REGISTER_COMMANDS` - Whether to register slash commands

## 📚 Documentation

API documentation is available at `/api/docs` when running in local environment.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
