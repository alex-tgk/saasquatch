# SaaSaaS Project Context - Session 2025-10-31

**Context Fingerprint**: `saasquatch-20251031-phase1-week1`
**Captured**: 2025-10-31 23:50 UTC
**Branch**: `main`
**Phase**: Phase 1 - CLI Foundation (Week 1)

---

## 📊 Project Status

### Overview
**SaaSaaS** (SaaS-as-a-Service) - Production-ready CLI tool that generates complete microservices architectures using Fastify, PostgreSQL/SQLite, Redis, and NATS.

- **Repository**: https://github.com/alex-tgk/saasquatch
- **Version**: 0.1.0
- **Overall Completion**: 20% (6/30 tasks)
- **Current Phase**: Phase 1 - CLI Foundation
- **Current Week**: Week 1
- **Time Invested**: 16 hours
- **Time Remaining**: ~112.5 hours

### Progress Breakdown

| Phase | Week | Status | Completion | Tasks |
|-------|------|--------|------------|-------|
| Phase 1 | Week 1 | 🔄 In Progress | 75% | 6/8 completed |
| Phase 2 | Week 2 | ⏳ Pending | 0% | 0/6 started |
| Phase 3 | Week 3 | ⏳ Pending | 0% | 0/5 started |
| Phase 4 | Week 4 | ⏳ Pending | 0% | 0/11 started |

### Current Task

**TASK-007**: Create base service Handlebars template
- **Status**: 🔄 In Progress
- **Priority**: Critical
- **Started**: 2025-11-01 00:15 UTC
- **Estimated**: 4 hours
- **Blocks**: 23 downstream tasks

---

## 🏗️ Architecture Overview

### Tech Stack

#### CLI Tool
- **Language**: TypeScript 5.3+ (strict mode)
- **Runtime**: Node.js 20+
- **Package Manager**: pnpm
- **CLI Framework**: Commander.js 11.1+
- **Prompts**: Inquirer.js 9.3+
- **Templates**: Handlebars 4.7+
- **Code Generation**: Plop.js 4.0+
- **Validation**: Zod 3.22+
- **Testing**: Jest 29.7+

#### Generated Services
- **Framework**: Fastify 4.24+ (plugin-based)
- **Database**: PostgreSQL 16 OR SQLite + LiteFS
- **Cache**: Redis 7
- **Message Queue**: NATS 2.10
- **Authentication**: JWT + bcrypt
- **Logging**: Pino (structured JSON)
- **Tracing**: OpenTelemetry
- **Testing**: Jest + Supertest

### Repository Structure

```
saasquatch/                          # CLI tool repository (pnpm monorepo)
├── packages/
│   ├── cli/                         # Main CLI (@saasquatch/cli)
│   │   ├── src/
│   │   │   ├── commands/            # init.ts
│   │   │   ├── prompts/             # project.prompts.ts
│   │   │   ├── generators/          # project.generator.ts
│   │   │   ├── types/               # config.types.ts (Zod schemas)
│   │   │   └── utils/               # template-renderer.ts, handlebars-helpers.ts
│   │   └── test/                    # Jest tests
│   ├── templates/                   # Handlebars templates
│   │   ├── base-service/            # ✅ Reusable Fastify base
│   │   ├── auth-service/            # ⏳ JWT authentication (Phase 2)
│   │   ├── user-service/            # ⏳ User management (Phase 3)
│   │   ├── api-gateway/             # ⏳ API gateway (Phase 3)
│   │   ├── infrastructure/          # Docker Compose, Redis, PostgreSQL, NATS
│   │   ├── shared/                  # Shared utilities templates
│   │   └── docs/                    # Documentation templates
│   ├── core/                        # Shared utilities for CLI
│   └── docs/                        # CLI documentation
├── .taskmaster/                     # Task tracking system
│   └── tasks.json                   # 30 tasks with metadata
└── .context/                        # Context snapshots
    ├── session-2025-10-31.json      # Machine-readable context
    └── SESSION-CONTEXT.md           # This file
```

### Generated Project Structure

When users run `npx @saasquatch/cli init my-project`:

```
my-project/
├── saasquatch.config.json           # Configuration file
├── pnpm-workspace.yaml              # Monorepo config
├── docker-compose.yml               # Infrastructure
├── services/
│   ├── auth-service/                # Port 3001 - JWT authentication
│   ├── user-service/                # Port 3002 - User management
│   └── api-gateway/                 # Port 3000 - Entry point
├── infrastructure/
│   ├── postgresql/                  # Schema setup scripts
│   ├── redis/                       # Configuration
│   └── nats/                        # Configuration
├── shared/                          # Shared types/config/utils
└── docs/                            # Auto-generated documentation
```

---

## 🎯 Key Architectural Decisions

| Decision | Choice | Rationale | Impact |
|----------|--------|-----------|--------|
| CLI Framework | Commander + Inquirer + Plop | Commander for structure, Inquirer for prompts, Plop for generation | 10/10 |
| Template Engine | Handlebars | Logic-less, excellent for code generation, widely adopted | 9/10 |
| Validation | Zod | TypeScript-first schema validation with runtime safety | 10/10 |
| Generated Framework | Fastify 4.x | Performance-focused, plugin-based, native JSON Schema validation | 10/10 |
| Database Strategy | PostgreSQL 16 OR SQLite | PostgreSQL for production, SQLite for edge with LiteFS | 9/10 |
| Multi-Tenancy | Schema-per-tenant | Best balance of isolation, performance, manageability | 8/10 |
| Message Queue | NATS 2.10 | Lightweight, cloud-native, excellent for microservices | 8/10 |
| Monorepo | pnpm workspaces | Efficient disk usage, fast installs, modern | 9/10 |
| Authentication | JWT + Redis | Stateless tokens with centralized revocation capability | 9/10 |
| Observability | Pino + OpenTelemetry | Fast structured logging + standard tracing | 7/10 |

---

## 📋 Implementation Phases

### Phase 1: CLI Foundation (Week 1) - 🔄 75% Complete

**Goal**: Working CLI that generates basic project structure

**Tasks**:
- ✅ TASK-001: Setup pnpm monorepo structure
- ✅ TASK-002: Install CLI dependencies
- ✅ TASK-003: Create Zod configuration schema
- ✅ TASK-004: Implement interactive prompts
- ✅ TASK-005: Build saasquatch init command
- ✅ TASK-006: Implement project generator core
- 🔄 TASK-007: Create base service Handlebars template (IN PROGRESS)
- ⏳ TASK-008: Test end-to-end CLI generation

**Success Criteria**: `npx saasquatch init test-project` creates config + folders

### Phase 2: Fastify Auth Service (Week 2) - ⏳ Pending

**Goal**: Perfect auth service as gold standard

**Tasks**:
- TASK-009: Auth service plugin architecture
- TASK-010: JWT authentication service
- TASK-011: Auth routes with JSON Schema validation
- TASK-012: Password hashing with bcrypt
- TASK-013: Comprehensive auth tests
- TASK-014: OpenAPI/Swagger documentation

**Success Criteria**: Complete auth service with register, login, JWT flow, 80%+ test coverage

### Phase 3: User Service + Infrastructure (Week 3) - ⏳ Pending

**Goal**: Multi-tenant user service with infrastructure

**Tasks**:
- TASK-015: User service CRUD operations
- TASK-016: Schema-per-tenant multi-tenancy
- TASK-017: NATS event publishing
- TASK-018: Docker Compose template
- TASK-019: Integration testing

**Success Criteria**: Multi-tenant user service, Docker Compose starts all services

### Phase 4: Testing & Documentation (Week 4) - ⏳ Pending

**Goal**: Production-ready MVP with 80%+ test coverage

**Tasks**:
- TASK-020: Generate unit tests for all services
- TASK-021: Structured logging with Pino
- TASK-022: Health check endpoints
- TASK-023: OpenTelemetry tracing
- TASK-024: Per-service README files
- TASK-025: Architecture diagrams (Mermaid)
- TASK-026: Root README with quickstart
- TASK-027: Create example project
- TASK-028: Write CLI documentation
- TASK-029: Final end-to-end test
- TASK-030: Prepare for npm publish

**Success Criteria**: Full documentation, 80%+ coverage, example project, ready for npm

---

## 🚨 Critical Principles

### 1. AI = Build-Time Only
**Claude helps BUILD the CLI tool. Generated services have ZERO AI dependencies.**

- ✅ Use Claude to generate template code
- ✅ Use Claude to create test suites
- ✅ Use Claude to write documentation
- ❌ Generated code should NOT depend on AI at runtime
- ❌ Output must be traditional, well-architected TypeScript/Fastify

### 2. One Thing Perfect
**Build auth service as the gold standard before expanding.**

- Perfect one template before adding more
- Auth service is the reference implementation
- Quality over quantity

### 3. Tests As You Go
**Generate tests while building templates, not as afterthought.**

- Tests validate patterns
- 80%+ coverage target
- Unit + integration tests

### 4. Documentation = Code
**Docs are generated from templates. Keep in sync.**

- Good docs = good templates
- OpenAPI/Swagger auto-generated
- Architecture diagrams in Mermaid

---

## 🔑 Key Files Reference

### Documentation
- `START-HERE.md` - Project resumption guide
- `CLAUDE.md` - Claude Code instructions
- `GLOBAL-CLI-SETUP.md` - Global installation guide
- `packages/cli/TESTING.md` - Testing guide

### Configuration
- `pnpm-workspace.yaml` - Monorepo config
- `packages/cli/package.json` - CLI dependencies
- `packages/cli/tsconfig.json` - TypeScript strict mode
- `.taskmaster/tasks.json` - 30 tasks with full metadata

### Core Implementation (Critical Files)
- **`packages/cli/src/types/config.types.ts`** ⭐⭐⭐ - Zod schema (MOST CRITICAL)
- `packages/cli/src/prompts/project.prompts.ts` - Interactive prompts
- `packages/cli/src/commands/init.ts` - Main CLI command
- `packages/cli/src/generators/project.generator.ts` - Generator orchestration
- `packages/cli/src/utils/template-renderer.ts` - Handlebars engine
- `packages/cli/src/utils/handlebars-helpers.ts` - Custom helpers

### Templates
- `packages/templates/base-service/` - Reusable Fastify base (TASK-007)
- `packages/templates/infrastructure/` - Docker Compose
- `packages/templates/shared/` - Shared utilities

---

## 📊 Configuration Schema

**File**: `saasquatch.config.json`
**Defined in**: `packages/cli/src/types/config.types.ts`
**Validation**: Runtime validation with Zod + TypeScript types

### Schema Structure

```typescript
{
  project: {
    name: string,           // Lowercase alphanumeric with hyphens
    description?: string,
    author?: string,
    packageManager: "npm" | "yarn" | "pnpm"  // Default: pnpm
  },

  framework: {
    name: "fastify",        // Only Fastify supported
    version: string         // Default: "^4.24.0"
  },

  infrastructure: {
    cache: {
      type: "redis",
      version: string       // Default: "7-alpine"
    },
    database: {
      type: "postgresql" | "sqlite",
      version?: string,
      strategy: "shared" | "separate",  // Default: separate
      multiTenancy?: {
        enabled: boolean,
        model: "schema-per-tenant" | "database-per-tenant" | "row-level"
      }
    },
    messageQueue: {
      type: "nats",
      version: string       // Default: "2.10-alpine"
    }
  },

  services: [
    {
      name: string,
      port: number,
      features: {
        database: boolean,
        cache: boolean,
        messageQueue: boolean,
        authentication: boolean,
        multiTenant: boolean
      }
    }
  ],

  observability: {
    logging: { provider: "pino", level: string },
    healthChecks: { enabled: boolean },
    tracing: { provider: "opentelemetry", enabled: boolean }
  }
}
```

---

## 🎯 Current Challenges & Next Actions

### Active Challenge
**TASK-007: Base Service Handlebars Template**
- Status: In Progress (started 24 min ago)
- Blocker: No
- Estimated: 2-3 hours remaining
- Impact: Blocks 23 downstream tasks

**What needs to be built**:
1. Minimal Fastify app structure (`app.ts.hbs`)
2. Plugin loading system (fastify-plugin)
3. Health check endpoint (`GET /health`)
4. Pino logging configuration
5. TypeScript setup (`tsconfig.json.hbs`)

### Critical Path
1. **Complete TASK-007** (2.5 hours) → Unblocks TASK-008
2. **Execute TASK-008** (2 hours) → Validates Week 1, unblocks Phase 2
3. **Begin TASK-009** (6 hours) → Start Phase 2 auth service

### Immediate Next Actions

| Priority | Action | Details | Est. Hours | Blocks |
|----------|--------|---------|------------|--------|
| 1 | Complete TASK-007 | Base service template with plugins, health check, logging | 2.5 | 23 tasks |
| 2 | Execute TASK-008 | E2E test: `saasquatch init test-project` | 2.0 | 22 tasks |
| 3 | Begin TASK-009 | Auth service plugin architecture (Phase 2) | 6.0 | 18 tasks |

---

## 📈 Success Metrics

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

---

## 🔄 Recent Activity

### Recent Commits (Last 10)
```
bfe844f - feat: complete TASK-007 - Handlebars template system
16d1b7e - feat: complete TASK-006 - project generator core
7ee12c7 - feat: initialize Task Master project tracking system
72bcd98 - fix: add missing fastify-plugin dependency
516291f - fix: update generated project dependencies to latest
c1bf9ca - chore: install missing runtime dependencies
f6237f5 - fix: update tests to match current schema
8dd68b0 - docs: add comprehensive testing guide
0089aea - feat: add comprehensive test suite
0de4dc0 - fix: add timeouts to git init
```

### Session Activity
- Killed processes on ports 3000-4000
- Analyzed project state
- Created comprehensive context snapshot
- Ready to resume TASK-007

---

## 🧠 Knowledge Graph

### Component Relationships

```
CLI Tool
  ├─ validates input with → Config Schema (Zod)
  ├─ orchestrates → Project Generator
  │   ├─ uses → Template Engine (Handlebars)
  │   │   └─ generates → Fastify Service
  │   └─ uses → File System Utils
  └─ interacts with → User (Inquirer prompts)

Generated Project
  ├─ Auth Service (port 3001)
  │   ├─ uses → PostgreSQL/SQLite
  │   ├─ uses → Redis (token storage)
  │   └─ provides → JWT tokens
  ├─ User Service (port 3002)
  │   ├─ uses → PostgreSQL/SQLite
  │   ├─ uses → NATS (events)
  │   └─ requires → JWT tokens (from Auth)
  └─ API Gateway (port 3000)
      └─ routes to → Auth Service + User Service
```

---

## 📚 Dependencies

### CLI Tool Runtime Dependencies
- `commander@11.1.0` - CLI framework
- `inquirer@9.3.8` - Interactive prompts
- `handlebars@4.7.8` - Template engine
- `zod@3.22.4` - Schema validation
- `chalk@5.3.0` - Terminal styling
- `ora@7.0.1` - Spinners
- `listr2@7.0.2` - Task lists
- `execa@8.0.1` - Process execution
- `fs-extra@11.2.0` - File operations
- `plop@4.0.1` - Code generation
- `pluralize@8.0.0` - String pluralization
- `yaml@2.8.1` - YAML parsing

### CLI Tool Dev Dependencies
- `typescript@5.3.3`
- `tsx@4.7.0` - TypeScript execution
- `jest@29.7.0` - Testing
- `eslint@8.56.0` - Linting

### Generated Services Dependencies
- `fastify@^4.24.0` - Web framework
- `@fastify/jwt` - JWT authentication
- `@fastify/redis` - Redis client
- `@fastify/swagger` - OpenAPI documentation
- `pino@^8.16.0` - Structured logging
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `nats` - NATS client
- `zod` - Runtime validation

---

## 🏷️ Semantic Tags

`cli-tool` `code-generator` `fastify` `microservices` `typescript` `saas` `multi-tenancy` `jwt-auth` `postgresql` `redis` `nats` `handlebars` `pnpm-monorepo` `phase-1` `week-1` `template-engine` `plugin-architecture` `json-schema` `observability` `docker-compose`

---

## 📝 Context Metadata

- **Captured By**: Claude Code
- **Session ID**: 2025-10-31-context-save
- **Storage Format**: JSON + Markdown
- **Compression Level**: Comprehensive
- **Vector Embedding Ready**: Yes
- **Knowledge Graph Ready**: Yes
- **Next Context Save**: After TASK-007 completion

---

## 🔗 Quick Links

- **GitHub Repository**: https://github.com/alex-tgk/saasquatch
- **Current Branch**: `main`
- **Task Tracking**: `.taskmaster/tasks.json`
- **Context Snapshots**: `.context/`

---

*Generated: 2025-10-31 23:50 UTC*
*Context Version: 1.0.0*
*Fingerprint: saasquatch-20251031-phase1-week1*
