# SaaSaaS Quick Reference Guide

Last Updated: 2025-11-01

---

## Recent Features

### ✅ Dashboard Integration
**What**: Complete Next.js 14 monitoring dashboard for generated microservices
**When**: 2025-11-01
**Status**: Production Ready

**Quick Start**:
```bash
# Dashboard is now auto-generated with all projects
npx @saasquatch/cli init my-project --yes
cd my-project
pnpm install
pnpm dev  # Dashboard runs on http://localhost:3100
```

**Features**:
- Real-time service health monitoring
- Live log streaming with filtering
- Performance metrics visualization (CPU, memory, requests, latency)
- NATS message queue inspector
- Redis cache viewer and management

**Files**: 41 templates in `packages/templates/dashboard/`

---

### ✅ Dynamic Port Allocation
**What**: Self-healing port management that automatically resolves port conflicts
**When**: 2025-11-01
**Status**: Production Ready

**How It Works**:
1. Service tries preferred port (from config/env)
2. If occupied, auto-allocates port in range: preferredPort + 100-200
3. Creates `.port-cache.json` for service discovery
4. Shows clear warnings in console

**Example**:
```
⚠️  Port 3001 is in use. auth-service is using port 3101 instead.
✅ auth-service running on http://0.0.0.0:3101
```

**Implementation**: `packages/templates/base-service/src/utils/port-manager.ts.hbs`

---

## Project Commands

### Development
```bash
# CLI development
cd packages/cli
npm run build              # Build CLI
npm run dev                # Build in watch mode

# Generate test project
cd .output
node ../packages/cli/dist/cli.js init test-project --yes

# Run generated project
cd test-project
npm install                # Install dependencies (all services)
docker-compose up -d       # Start infrastructure
pnpm dev                   # Start all services + dashboard
```

### Service Commands (in generated project)
```bash
# Individual service
cd services/auth-service
npm install
npm run dev                # Start with hot reload
npm run build              # Build for production
npm test                   # Run tests

# All services (from root)
pnpm dev                   # All services + dashboard
pnpm build                 # Build all
pnpm test                  # Test all
```

---

## Template Locations

### Core Templates
- `packages/templates/base-service/` - Base Fastify service
- `packages/templates/auth-service/` - JWT authentication
- `packages/templates/user-service/` - User CRUD
- `packages/templates/api-gateway/` - API gateway
- `packages/templates/dashboard/` - Next.js monitoring dashboard
- `packages/templates/infrastructure/` - Docker Compose, etc.

### Key Files
- `packages/cli/src/generators/project.generator.ts` - Main generator
- `packages/cli/src/utils/handlebars-helpers.ts` - Template helpers
- `packages/templates/base-service/src/utils/port-manager.ts.hbs` - Port allocation

---

## Handlebars Context

Available in all `.hbs` templates:

```handlebars
{{project.name}}                           # Project name
{{project.description}}                    # Project description
{{project.packageManager}}                 # pnpm, npm, yarn

{{#each services}}
  {{this.name}}                            # Service name (e.g., "auth-service")
  {{this.port}}                            # Service port (e.g., 3001)
  {{this.features.database}}               # true/false
  {{this.features.cache}}                  # true/false
  {{this.features.messageQueue}}           # true/false
  {{this.features.jwt}}                    # true/false
{{/each}}

{{infrastructure.database.type}}           # postgresql, sqlite
{{infrastructure.cache.type}}              # redis
{{infrastructure.messageQueue.type}}       # nats

{{dashboard.port}}                         # 3100 (default)
```

### Custom Helpers
```handlebars
{{snakeCase "my-service"}}                 # my_service
{{uppercase "my-service"}}                 # MY_SERVICE
{{capitalize "my-service"}}                # My-service
{{eq a b}}                                 # a === b
{{or a b c}}                               # a || b || c
{{and a b c}}                              # a && b && c
{{not value}}                              # !value
{{json context}}                           # JSON.stringify(context, null, 2)
```

---

## JSX in Handlebars

When writing React components in `.hbs` files:

```handlebars
{{!-- WRONG: Handlebars will interpret {{ as delimiter --}}
<div style={{ backgroundColor: 'red' }} />

{{!-- CORRECT: Use backslash to escape --}}
<div style=\{{ backgroundColor: 'red' }} />
```

---

## Port Allocation

### Default Ports
- API Gateway: 3000
- Auth Service: 3001
- User Service: 3002
- Dashboard: 3100

### Auto-Allocation Range
If preferred port is occupied:
- Fallback: `preferredPort + 100` to `preferredPort + 200`
- Example: If 3001 is taken, tries 3101-3201

### Port Cache
Location: `.port-cache.json` (project root, gitignored)

```json
{
  "auth-service": {
    "serviceName": "auth-service",
    "preferredPort": 3001,
    "actualPort": 3101,
    "timestamp": "2025-11-01T05:33:08.608Z"
  }
}
```

---

## Common Issues & Solutions

### Issue: ERR_MODULE_NOT_FOUND
**Cause**: Template file exists but not being generated
**Solution**: Add file generation to `ProjectGenerator.generateService()`

### Issue: Handlebars syntax error with JSX
**Cause**: JSX `{{` conflicts with Handlebars delimiters
**Solution**: Use backslash escape: `\{{`

### Issue: Port already in use (EADDRINUSE)
**Cause**: Service port is occupied
**Solution**: Port manager handles automatically, service will use fallback port

### Issue: Missing Handlebars helper
**Cause**: Helper not registered
**Solution**: Add to `packages/cli/src/utils/handlebars-helpers.ts`

---

## Testing Checklist

### After Making Template Changes
1. Rebuild CLI: `cd packages/cli && npm run build`
2. Generate test project: `cd .output && node ../packages/cli/dist/cli.js init test --yes`
3. Install deps: `cd test && npm install` (per service)
4. Test services: `npm run dev` (check for errors)
5. Test dashboard: Visit http://localhost:3100

### Before Committing
1. All templates render without errors
2. Generated code compiles (TypeScript)
3. Services start successfully
4. Health endpoints respond
5. Tests pass (if applicable)

---

## Git Workflow

### Commit Message Format
```
feat: implement feature name

- Bullet point describing change
- Another change
- Implementation details

Testing: Brief description of tests performed

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Common Prefixes
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Test additions/changes

---

## Architecture Patterns

### Services (Fastify)
- Plugin-based architecture
- JSON Schema validation on all routes
- Structured logging (Pino)
- Health checks: /health, /ready
- OpenAPI/Swagger documentation at /docs

### Dashboard (Next.js)
- App Router (Next.js 14)
- Server Components for performance
- Client Components for interactivity
- Server-Sent Events for real-time updates
- shadcn/ui component system

### Database
- PostgreSQL: Schema-per-tenant for multi-tenancy
- SQLite: File-based with LiteFS for distribution
- Knex.js for query building
- Migrations and seeds

---

## Dependencies

### CLI
- commander: CLI framework
- inquirer: Interactive prompts
- handlebars: Template engine
- zod: Validation
- fs-extra: File operations

### Services
- fastify: Web framework
- pino: Logging
- get-port: Dynamic port allocation
- @fastify/jwt: Authentication
- knex: Database
- ioredis: Redis
- nats: Message queue

### Dashboard
- next: Framework
- react: UI library
- shadcn/ui: Components
- recharts: Charts
- tailwindcss: Styling

---

## Quick Links

- Project Root: `/Users/acarroll/dev/projects/saasquatch`
- CLI Source: `packages/cli/src/`
- Templates: `packages/templates/`
- Generated Projects: `.output/`
- Context Snapshots: `.context/`

---

**Last Session**: Dashboard Integration + Dynamic Port Allocation
**Next Focus**: Testing dashboard in browser, multi-service scenarios
