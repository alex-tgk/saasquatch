# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SaaSQuatch** is a production-ready CLI tool that generates complete microservices architectures using Fastify, PostgreSQL/SQLite, Redis, and NATS.

**Current Status**: Phase 1 - Planning Complete, Ready for Implementation (Week 1: CLI Foundation)

**Branch**: `phase/one`

## Essential Documentation

Read these files **in order** before starting work:

1. **START-HERE.md** - Project resumption guide and roadmap
2. **.claude/agents/decision-tree/08-final-implementation-prompt.md** - Complete implementation guide with code examples
3. **.claude/agents/decision-tree/09-GETTING-STARTED.md** - Week-by-week implementation plan
4. **.claude/agents/decision-tree/07-requirements-summary.md** - Full requirements specification

## Project Architecture

### High-Level Structure (When Implemented)

The project is a **pnpm monorepo** that will generate pnpm monorepos for users:

```
saasquatch/                          # CLI tool repository
├── packages/
│   ├── cli/                         # Main CLI (@saasquatch/cli)
│   │   ├── src/
│   │   │   ├── commands/            # init.ts (main command)
│   │   │   ├── prompts/             # Interactive questionnaire
│   │   │   ├── generators/          # Project/service generators
│   │   │   ├── types/               # Config types (Zod schemas)
│   │   │   └── utils/               # Template utilities
│   │   └── test/
│   ├── templates/                   # Fastify service templates
│   │   ├── auth-service/            # JWT authentication template
│   │   ├── user-service/            # User management template
│   │   ├── api-gateway/             # API gateway template
│   │   ├── infrastructure/          # Docker Compose, Redis, PostgreSQL, NATS
│   │   └── shared/                  # Shared utilities templates
│   ├── core/                        # Shared utilities for CLI
│   └── docs/                        # CLI documentation
└── examples/                        # Example generated projects
```

### Generated Project Structure

When users run `npx @saasquatch/cli init my-project`, they get:

```
my-project/
├── saasquatch.config.json              # Configuration file
├── services/
│   ├── auth-service/                # Port 3001 - JWT authentication
│   ├── user-service/                # Port 3002 - User management
│   └── api-gateway/                 # Port 3000 - Entry point
├── infrastructure/
│   ├── docker-compose.yml
│   ├── redis/
│   ├── postgresql/
│   └── nats/
├── shared/                          # Shared types/config/utils
└── docs/                            # Auto-generated documentation
```

## Technology Stack

### CLI Tool
- **Language**: TypeScript (strict mode)
- **CLI Framework**: Commander.js + Inquirer.js
- **Generator**: Plop.js with Handlebars templates
- **Package Manager**: pnpm (workspaces)
- **Testing**: Jest

### Generated Services (Fastify)
- **Framework**: Fastify 4.x (plugin-based architecture)
- **Database**: PostgreSQL 16 OR SQLite + LiteFS (user choice)
- **Cache**: Redis 7
- **Message Queue**: NATS 2.10
- **Multi-Tenancy**: Schema-per-tenant (PostgreSQL)
- **Logging**: Pino (structured)
- **Tracing**: OpenTelemetry
- **Validation**: JSON Schema (Fastify native)

## Fastify Patterns (Critical for Generated Services)

All generated Fastify services must follow these patterns:

### 1. Plugin-Based Architecture
```typescript
// Each feature is a Fastify plugin
import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
  fastify.decorate('authService', new AuthService());
});
```

### 2. JSON Schema Validation
```typescript
// All routes use JSON Schema for validation
const schema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  }
};

fastify.post('/users', { schema }, handler);
```

### 3. Dependency Injection
Services use a simple IoC container pattern for managing dependencies.

### 4. Centralized Error Handling
Global error handler with structured responses.

## Development Workflow

### Prerequisites
```bash
node --version   # Must be 20+
pnpm --version   # Install: npm install -g pnpm
docker --version # Docker Desktop required
```

### Initial Setup (Week 1, Day 1-2)
```bash
# Create monorepo structure
mkdir -p packages/{cli,templates,core,docs}
cd packages/cli
pnpm init

# Install dependencies
pnpm add commander inquirer chalk ora plop handlebars zod fs-extra execa listr2 yaml
pnpm add -D typescript tsx jest @types/node @types/jest
```

### Build Commands (Once Implemented)
```bash
# Install dependencies
pnpm install

# Build CLI
pnpm -r build

# Run tests
pnpm -r test

# Run CLI locally during development
cd packages/cli
pnpm dev

# Test CLI generation
pnpm dev init test-project
```

## Configuration Schema

The core of the tool is `saasquatch.config.json`, defined with Zod in `packages/cli/src/types/config.types.ts`:

```typescript
{
  "version": "1.0.0",
  "project": { "name", "description", "packageManager" },
  "framework": { "name": "fastify", "version" },
  "infrastructure": {
    "cache": { "type": "redis" },
    "database": { "type": "postgresql" | "sqlite", "multiTenancy" },
    "messageQueue": { "type": "nats" }
  },
  "services": [
    { "name", "port", "features": { "database", "cache", "messageQueue", "authentication" } }
  ],
  "observability": { "logging", "healthChecks", "tracing" }
}
```

## Implementation Phases

### Phase 1: CLI Foundation (Week 1) ← CURRENT PHASE

**Goal**: Working CLI that generates basic project structure

**Tasks**:
- Setup pnpm monorepo with packages/cli, packages/templates, packages/core
- Create Zod configuration schema (`config.types.ts`)
- Build interactive prompts with Inquirer (`project.prompts.ts`)
- Implement `saasquatch init` command with Commander
- Create project generator using Plop/Handlebars
- Generate `saasquatch.config.json` + basic folder structure

**Success**: `npx saasquatch init test-project` creates config + folders

### Phase 2: Fastify Auth Service (Week 2)

Create perfect auth service template with:
- JWT authentication (login, register, logout, refresh)
- Plugin architecture (auth, database, redis plugins)
- JSON Schema validation on all routes
- Password hashing (bcrypt)
- Comprehensive tests

### Phase 3: User Service + Infrastructure (Week 3)

- User CRUD service with multi-tenancy (schema-per-tenant)
- Docker Compose template (Redis, PostgreSQL, NATS)
- NATS event publishing
- Integration between services

### Phase 4: Testing & Documentation (Week 4)

- Auto-generated unit tests (Jest)
- Integration test templates
- OpenAPI/Swagger documentation
- Architecture diagrams (Mermaid)
- Service READMEs
- Health checks and observability

## Critical Principles

### 1. AI = Build-Time Only

**✅ Claude helps BUILD the CLI tool**
- Generate template code
- Create test suites
- Write documentation
- Suggest patterns

**❌ Generated services have ZERO AI dependencies**
- Pure TypeScript/Fastify code
- Traditional, well-architected services
- Indistinguishable from pre-AI code

### 2. One Thing Perfect

Build auth service as the **gold standard** before adding more features.

### 3. Tests As You Go

Generate tests while building templates, not as an afterthought.

## Template System

Templates use **Handlebars (.hbs)** and are processed during generation:

```
packages/templates/auth-service/
├── src/
│   ├── app.ts.hbs                   # Handlebars template
│   ├── plugins/
│   │   ├── auth.plugin.ts.hbs
│   │   └── database.plugin.ts.hbs
│   └── routes/
│       └── auth.routes.ts.hbs
├── package.json.hbs                 # Package.json template
└── Dockerfile.hbs
```

Context passed to templates:
```typescript
{
  project: { name, description },
  infrastructure: { database: { type }, cache, messageQueue },
  service: { name, port, features },
  // ... full config
}
```

## Common Development Tasks

### Running the CLI Locally
```bash
cd packages/cli
pnpm dev init my-test-project
```

### Testing Template Generation
```bash
# Generate test project
pnpm dev init test-output

# Verify structure
cd test-output
ls -la
cat saasquatch.config.json
```

### Running Generated Services (After Week 3)
```bash
cd test-output
docker-compose up -d              # Start infrastructure
pnpm dev                          # Start all services
curl http://localhost:3001/health # Test auth service
```

### Adding a New Template
1. Create template directory in `packages/templates/`
2. Add `.hbs` files with Handlebars placeholders
3. Register template in `project.generator.ts`
4. Add corresponding service config type
5. Update prompts to include new template

## Observability Patterns

All generated services include:

### Health Checks
```typescript
GET /health  → { status: "healthy" }
GET /ready   → { status: "ready", checks: { database, redis, nats } }
```

### Structured Logging (Pino)
```typescript
logger.info({ userId: 123, action: 'login' }, 'User logged in');
```

### OpenTelemetry Tracing
Basic tracing setup for distributed requests.

## Multi-Tenancy Pattern

For PostgreSQL, schema-per-tenant:

```typescript
// Tenant context from JWT
const tenantId = request.user.tenantId;

// Switch schema
await db.raw(`SET search_path TO tenant_${tenantId}`);

// All queries now scoped to tenant
const users = await db('users').select('*');
```

## Testing Strategy

### CLI Tests (Jest)
- Unit tests for generators, prompts, utilities
- Integration tests for full `init` command
- Snapshot tests for generated files

### Generated Service Tests
- Unit tests for services, plugins, utilities (auto-generated)
- Integration tests (templates provided)
- Coverage target: 80%+

## Available Claude Agents

Located in `.claude/agents/`:

- **template-generator**: Help create Handlebars templates
- **config-schema-designer**: Design/validate Zod schemas
- **fastify-expert**: Fastify best practices and patterns
- **test-suite-creator**: Generate comprehensive tests

## Success Metrics

### MVP Complete When:

**Functionality**:
- ✅ `saasquatch init` generates working project in < 2 min
- ✅ Auth service: register, login, JWT flow works
- ✅ User service: CRUD + multi-tenancy works
- ✅ Docker Compose starts all services

**Code Quality**:
- ✅ TypeScript strict mode compiles
- ✅ 80%+ test coverage
- ✅ JSON Schema on all routes
- ✅ Structured logging (Pino)
- ✅ Health checks on all services

**Documentation**:
- ✅ Root README with quickstart
- ✅ OpenAPI/Swagger at /docs
- ✅ Architecture diagrams
- ✅ Per-service READMEs

## Common Pitfalls

1. **Don't overcomplicate templates** - Start simple, hard-code good defaults
2. **Don't skip tests** - Generate them alongside templates
3. **Don't defer documentation** - Templates generate docs too
4. **Use wildcards in Handlebars** - Avoid repetitive template code

## Project Context Recovery

If resuming work after a break:

1. Check current branch: `git branch --show-current` (should be `phase/one`)
2. Read START-HERE.md for current status
3. Review 09-GETTING-STARTED.md for current week's tasks
4. Check 08-final-implementation-prompt.md for code examples

## Git Workflow

```bash
# Working on feature
git add .
git commit -m "feat: implement configuration schema

- Added Zod schema for saasquatch.config.json
- Added TypeScript types
- Added validation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Important Files by Phase

**Week 1 (CLI Foundation)**:
- `packages/cli/src/types/config.types.ts` - Zod schema (CRITICAL)
- `packages/cli/src/prompts/project.prompts.ts` - Interactive prompts
- `packages/cli/src/commands/init.ts` - Main command
- `packages/cli/src/generators/project.generator.ts` - Generator logic

**Week 2 (Auth Service)**:
- `packages/templates/auth-service/` - All auth templates
- `packages/templates/base-service/` - Base Fastify structure

**Week 3 (Infrastructure)**:
- `packages/templates/infrastructure/docker-compose.yml.hbs`
- `packages/templates/user-service/` - Multi-tenant patterns

**Week 4 (Testing & Docs)**:
- `packages/templates/*/test/` - Test templates
- `packages/templates/docs/` - Documentation templates

## External Resources

- **Fastify Documentation**: https://fastify.dev/
- **Zod Documentation**: https://zod.dev/
- **Commander.js**: https://github.com/tj/commander.js
- **Inquirer.js**: https://github.com/SBoudrias/Inquirer.js
- **Handlebars**: https://handlebarsjs.com/

## Notes for Claude

- This is a CLI tool generator, not a runtime framework
- Generated code should be traditional, AI-agnostic TypeScript
- Prioritize DX: clear errors, good docs, fast generation
- Build one perfect service (auth) before expanding
- Follow Fastify best practices religiously
- All routes need JSON Schema validation
- All services need health checks + structured logging
