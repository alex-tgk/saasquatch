# SaaSquatch - Production-Ready Microservices CLI

A powerful CLI tool that generates complete, production-ready microservices architectures using **Fastify**, **PostgreSQL/SQLite**, **Redis**, and **NATS** in seconds.

**Current Status**: Phase 1 - CLI Foundation (70% Complete)

📋 **[View Product Requirements Document (PRD)](docs/planning/prd-latest.md)** - Comprehensive project roadmap, gap analysis, and implementation plan

## 🎯 What is SaaSquatch?

SaaSquatch is a **CLI tool generator**—not a framework. It generates complete microservices projects that are:

- ✅ **Production-ready** out of the box
- ✅ **Zero AI dependencies** in generated code (pure TypeScript/Fastify)
- ✅ **Fully typed** with TypeScript strict mode
- ✅ **Well-tested** with Jest and comprehensive test templates
- ✅ **Observability-first** with structured logging and health checks
- ✅ **Multi-tenant capable** with schema-per-tenant PostgreSQL

## 🚀 Quick Start

### Prerequisites

```bash
node --version    # Must be 20+
pnpm --version    # Install: npm install -g pnpm
docker --version  # Docker Desktop required
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd saasquatch

# Install dependencies
pnpm install

# Build the CLI
pnpm -r build
```

### Setup Global CLI (Recommended)

Make `saasquatch` available globally on your system:

```bash
# From project root
./scripts/setup-global-cli.sh

# Or manually
cd packages/cli
pnpm build
npm link
cd ../..
```

### Generate Your First Project

**Option 1: Global CLI (Recommended)**

```bash
# Use from anywhere
saasquatch init my-awesome-project
```

**Option 2: Development Mode (With Live Reload)**

```bash
# From project root
./scripts/dev-cli.sh init my-awesome-project

# Or manually
cd packages/cli
pnpm dev init my-awesome-project
```

**Option 3: Direct Execution**

```bash
cd packages/cli
node dist/cli.js init my-awesome-project
```

The CLI will prompt you with an interactive questionnaire and generate:

```
my-awesome-project/
├── saasquatch.config.json              # Configuration file
├── services/
│   ├── auth-service/                   # Port 3001 - JWT authentication
│   ├── user-service/                   # Port 3002 - User management
│   └── api-gateway/                    # Port 3000 - Entry point
├── infrastructure/
│   ├── docker-compose.yml
│   ├── redis/
│   ├── postgresql/
│   └── nats/
├── shared/                             # Shared types/config/utils
└── docs/                               # Auto-generated documentation
```

## 📦 Project Structure

```
saasquatch/                          # CLI tool repository
├── packages/
│   ├── cli/                          # Main CLI (@saasquatch/cli)
│   │   ├── src/
│   │   │   ├── commands/             # init.ts (main command)
│   │   │   ├── prompts/              # Interactive questionnaire
│   │   │   ├── generators/           # Project/service generators
│   │   │   ├── types/                # Zod schemas and types
│   │   │   └── utils/                # Template utilities
│   │   └── test/
│   ├── templates/                    # Service templates (coming)
│   ├── core/                         # Shared utilities (coming)
│   └── docs/                         # CLI documentation (coming)
├── .claude/                          # Claude Code configuration
│   ├── agents/                       # Claude agents for development
│   ├── docs/                         # Documentation and decision records
│   ├── scripts/                      # Automation scripts
│   ├── skills/                       # Custom Claude skills
│   └── commands/                     # Custom slash commands
├── CLAUDE.md                         # Project guidelines for Claude
└── START-HERE.md                     # Development roadmap
```

## 🔧 Development Commands

### Build & Test

```bash
# Install all dependencies
pnpm install

# Build entire monorepo
pnpm -r build

# Run tests
pnpm -r test

# Run linter
pnpm -r lint

# Clean all build artifacts
pnpm -r clean
```

### CLI Development

**Quick Start (Development Mode)**

```bash
# From project root - starts dev CLI with auto-reload
./scripts/dev-cli.sh init my-test-project

# Or manually
cd packages/cli
pnpm dev init my-test-project
```

**Standard Commands**

```bash
cd packages/cli

# Start development with live reload
pnpm dev

# Build for production
pnpm build

# Test the CLI locally
node dist/cli.js init test-project

# Run CLI tests
pnpm test

# Run linter
pnpm lint
```

**Global Installation (for testing across directories)**

```bash
# From project root
./scripts/setup-global-cli.sh

# Then use from anywhere
saasquatch init my-project
saasquatch --help
saasquatch --version
```

### Generate a Test Project

```bash
# Using development mode
cd packages/cli
pnpm dev init test-output

# Verify the generated project
cd test-output
cat saasquatch.config.json
ls -la services/
```

## 📋 Configuration Schema

The core of the tool is `saasquatch.config.json`. It's fully typed with Zod validation:

```json
{
  "version": "1.0.0",
  "project": {
    "name": "my-awesome-project",
    "description": "My microservices project",
    "packageManager": "pnpm"
  },
  "framework": {
    "name": "fastify",
    "version": "4.x"
  },
  "infrastructure": {
    "cache": { "type": "redis" },
    "database": { 
      "type": "postgresql",
      "multiTenancy": true
    },
    "messageQueue": { "type": "nats" }
  },
  "services": [
    {
      "name": "auth-service",
      "port": 3001,
      "features": {
        "database": true,
        "cache": true,
        "authentication": true
      }
    }
  ],
  "observability": {
    "logging": "pino",
    "healthChecks": true,
    "tracing": true
  }
}
```

## 🏗️ Implementation Phases

### Phase 1: CLI Foundation (Week 1) ✅ IN PROGRESS

**Goal**: Working CLI that generates basic project structure

- [x] Setup pnpm monorepo with packages structure
- [x] Zod configuration schema
- [x] Interactive prompts with Inquirer
- [x] `saasquatch init` command with Commander
- [x] Project generator using Plop/Handlebars
- [x] Configuration validation
- [ ] Basic folder structure generation
- [ ] Tests for CLI

**Success Criteria**: `pnpm dev init test-project` creates valid config + folders

### Phase 2: Fastify Auth Service (Week 2) 🔜 NEXT

Create perfect auth service template with:
- JWT authentication (register, login, logout, refresh)
- Plugin architecture
- JSON Schema validation on all routes
- Password hashing with bcrypt
- Comprehensive test suite

### Phase 3: User Service + Infrastructure (Week 3)

- User CRUD service with multi-tenancy
- Docker Compose templates
- NATS event publishing
- Service-to-service communication

### Phase 4: Testing & Documentation (Week 4)

- Auto-generated unit tests
- Integration test templates
- OpenAPI/Swagger documentation
- Architecture diagrams
- Service READMEs

## 🛠️ Technology Stack

### CLI Tool

- **Language**: TypeScript (strict mode)
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Code Generator**: Plop.js with Handlebars
- **Package Manager**: pnpm workspaces
- **Validation**: Zod
- **Testing**: Jest

### Generated Services (Fastify)

- **Framework**: Fastify 4.x
- **Database**: PostgreSQL 16 OR SQLite + LiteFS
- **Cache**: Redis 7
- **Message Queue**: NATS 2.10
- **Multi-Tenancy**: Schema-per-tenant (PostgreSQL)
- **Logging**: Pino (structured)
- **Tracing**: OpenTelemetry
- **Validation**: JSON Schema (Fastify native)

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project guidelines for Claude Code
- **[START-HERE.md](./START-HERE.md)** - Development roadmap and phase checklist
- **[.claude/docs/](.//.claude/docs/)** - Technical decision records and architecture notes

## 🧠 Claude Code Integration

This project is optimized for development with [Claude Code](https://claude.com/claude-code):

### Claude Agents

Located in `.claude/agents/`:

- **component-generator**: Generate and review React components
- **monorepo-optimizer**: Optimize build performance and bundle sizes
- **rapid-prototyping**: Create interactive documentation and showcases
- **dx-orchestrator**: Automate developer experience setup
- **agent-orchestrator**: Coordinate complex multi-step tasks

### Claude Skills & Commands

- Custom slash commands in `.claude/commands/`
- Custom skills in `.claude/skills/`
- Automation scripts in `.claude/scripts/`

See `.claude/docs/` for MCP server recommendations and quick start guides.

## 🎯 Key Features

### Interactive Project Generation

```bash
saasquatch init my-project

# Prompts for:
# - Project name and description
# - Framework version (Fastify 4.x)
# - Database choice (PostgreSQL vs SQLite)
# - Services to include (Auth, User, custom)
# - Infrastructure (Redis, NATS, etc)
# - Observability (logging, tracing)
```

### Production-Ready Defaults

Generated services include:

- ✅ TypeScript strict mode configuration
- ✅ Health check endpoints (`/health`, `/ready`)
- ✅ Structured logging with Pino
- ✅ OpenTelemetry tracing setup
- ✅ Comprehensive error handling
- ✅ CORS and security headers
- ✅ Request validation with JSON Schema
- ✅ Database connection pooling
- ✅ Redis caching setup
- ✅ NATS event publishing/subscribing

### Fastify Plugin Architecture

All services follow plugin-based architecture for maximum modularity:

```typescript
import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
  // Plugin implementation
  fastify.decorate('authService', new AuthService());
});
```

### Multi-Tenancy Support

For PostgreSQL, automatic schema-per-tenant:

```typescript
const tenantId = request.user.tenantId;
await db.raw(`SET search_path TO tenant_${tenantId}`);
// All queries now scoped to tenant
```

## 🧪 Testing

### CLI Tests

```bash
cd packages/cli
pnpm test                    # Run all tests
pnpm test --watch          # Watch mode
pnpm test --coverage       # Coverage report
```

### Generated Service Tests

Each generated service includes Jest + React Testing Library setup with:

- Unit tests for services, utilities, plugins
- Integration test templates
- Target: 80%+ coverage

## 📈 Performance Metrics

### CLI Generation Time

- **Target**: < 2 minutes
- **Includes**: Config creation, folder structure, git initialization

### Generated Service Performance

- **Startup time**: < 1 second
- **Health check latency**: < 10ms
- **NATS event propagation**: < 100ms

## 🚨 Common Issues

### Node Version Mismatch

```bash
# Ensure Node 20+
node --version

# If needed, use nvm
nvm use 20
```

### pnpm Not Installed

```bash
npm install -g pnpm
pnpm --version
```

### Docker Not Running

```bash
# Start Docker Desktop or Docker daemon
docker ps
```

### Permission Errors on macOS

```bash
# Run with sudo if needed
sudo pnpm install
```

## 🤝 Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for project guidelines
2. Check [START-HERE.md](./START-HERE.md) for current phase tasks
3. Create a feature branch: `git checkout -b feat/your-feature`
4. Follow commit message format (see CLAUDE.md)
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Resources

- **[Fastify Documentation](https://fastify.dev/)**
- **[Commander.js Guide](https://github.com/tj/commander.js)**
- **[Inquirer.js Examples](https://github.com/SBoudrias/Inquirer.js)**
- **[Zod Validation](https://zod.dev/)**
- **[Plop.js Generator](https://plopjs.com/)**

## 📞 Support

For issues, questions, or suggestions:

1. Check existing [GitHub Issues](./issues)
2. Review [CLAUDE.md](./CLAUDE.md) for architecture details
3. See [.claude/docs/](.//.claude/docs/) for technical decisions

---

**Made with ❤️ for developers who want production-ready microservices in seconds.**

*Last Updated: 2025-10-31*  
*Current Branch: feat/week1-cli-foundation*  
*Phase: Week 1 - CLI Foundation*
