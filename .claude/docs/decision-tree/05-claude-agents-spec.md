# Claude Code Agents, Skills, and Commands Specification

## Purpose

This document outlines the comprehensive Claude Code integration strategy for the SaaSaaS CLI, including agents, skills, and custom commands.

---

## Part 1: Agent Architecture

### Agent Categories

```
agents/
├── generators/              # Code generation agents
│   ├── service-generator.md
│   ├── crud-generator.md
│   ├── integration-adder.md
│   ├── test-generator.md
│   └── client-generator.md
├── operations/              # Operational agents
│   ├── deployment-helper.md
│   ├── migration-runner.md
│   ├── monitoring-setup.md
│   └── security-audit.md
├── optimization/            # Optimization agents
│   ├── performance-optimizer.md
│   ├── dependency-updater.md
│   └── refactoring-assistant.md
└── documentation/           # Documentation agents
    ├── api-documenter.md
    ├── architecture-diagrammer.md
    └── readme-generator.md
```

---

## Part 2: Core Agents (MVP - Priority 1)

### 1. Service Generator Agent

**File**: `agents/generators/service-generator.md`

**Purpose**: Generate a complete new microservice from scratch.

**Trigger Conditions**:
- User types "create a new service" or similar
- User runs `/generate service` command
- When the project needs a new microservice

**Capabilities**:
```yaml
inputs:
  - service_name: string
  - framework: nestjs | fastify | feathersjs
  - port: number (auto-assign if not provided)
  - features:
      - database: boolean
      - cache: boolean
      - message_queue: boolean
      - authentication: boolean

outputs:
  - Complete service directory structure
  - Configured dependencies
  - Docker configuration
  - Basic health check endpoint
  - README with setup instructions
  - Tests scaffolding
```

**Agent Prompt Template**:
```markdown
You are a Microservice Generator Agent specialized in creating production-ready microservices.

**Task**: Generate a new microservice named "{{service_name}}" using {{framework}}.

**Requirements**:
1. Read the project's `saasquatch.config.json` to understand existing architecture
2. Generate service using the appropriate template from `cli/templates/frameworks/{{framework}}`
3. Assign port (check existing services to avoid conflicts)
4. If database is enabled, generate:
   - Entity/model files
   - Repository pattern implementation
   - Database connection configuration
5. If cache is enabled, generate:
   - Cache service wrapper
   - Cache configuration
6. If message queue is enabled, generate:
   - Event publishers
   - Event subscribers
   - Queue configuration
7. Update `saasquatch.config.json` with new service
8. Update `docker-compose.yml` with new service
9. Generate comprehensive README.md

**Output Structure**:
```
services/{{service_name}}/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   ├── modules/
│   └── common/
├── test/
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

**Best Practices**:
- Follow project conventions from existing services
- Use TypeScript strict mode
- Include comprehensive error handling
- Add structured logging
- Include health check endpoints
- Generate OpenAPI documentation
```

---

### 2. CRUD Generator Agent

**File**: `agents/generators/crud-generator.md`

**Purpose**: Generate complete CRUD operations for an entity.

**Trigger Conditions**:
- User types "create CRUD for X" or similar
- User runs `/generate crud` command
- When adding new data models

**Capabilities**:
```yaml
inputs:
  - service_name: string (which service to add to)
  - entity_name: string
  - fields: array of field definitions
  - relations: array of relationships
  - features:
      - pagination: boolean
      - filtering: boolean
      - sorting: boolean
      - search: boolean
      - soft_delete: boolean

outputs:
  - Entity/Model class
  - DTO classes (Create, Update, Response)
  - Service class with CRUD methods
  - Controller with REST endpoints
  - Repository pattern (if using database)
  - Unit tests for all generated code
  - Integration test examples
```

**Example Usage**:
```bash
# Via CLI
saasquatch generate crud --service=user-service --entity=Product

# Interactive prompts
? Entity name: Product
? Fields:
  - name: string (required)
  - description: text
  - price: decimal (required)
  - stockQuantity: integer
  - categoryId: uuid (foreign key)
? Enable pagination? Yes
? Enable search? Yes
? Enable soft delete? Yes

✓ Generated Product entity
✓ Generated DTOs
✓ Generated ProductService
✓ Generated ProductController
✓ Generated tests
✓ Updated ProductModule
```

---

### 3. Integration Adder Agent

**File**: `agents/generators/integration-adder.md`

**Purpose**: Add database, cache, or message queue to an existing service.

**Trigger Conditions**:
- User types "add Redis to X service"
- User types "add database to X service"
- User runs `/add integration` command

**Capabilities**:
```yaml
inputs:
  - service_name: string
  - integration_type: database | cache | message_queue
  - integration_config: object

outputs:
  - Integration configuration files
  - Service wrapper classes
  - Connection management
  - Health checks
  - Updated environment variables
  - Updated docker-compose.yml
  - Migration files (for database)
```

---

### 4. Test Generator Agent

**File**: `agents/generators/test-generator.md`

**Purpose**: Generate comprehensive tests for existing code.

**Trigger Conditions**:
- User types "generate tests for X"
- User runs `/generate tests` command
- After generating new features

**Capabilities**:
```yaml
inputs:
  - target: service | module | class | function
  - test_types: unit | integration | e2e
  - coverage_goal: number (percentage)

outputs:
  - Unit tests (Jest/Mocha)
  - Integration tests
  - E2E tests
  - Mock implementations
  - Test fixtures
  - Coverage reports
```

---

### 5. API Documentation Agent

**File**: `agents/documentation/api-documenter.md`

**Purpose**: Generate comprehensive API documentation.

**Trigger Conditions**:
- User types "document the API"
- User runs `/generate docs` command
- After generating new endpoints

**Capabilities**:
```yaml
inputs:
  - service_name: string | all
  - format: openapi | swagger | postman | insomnia

outputs:
  - OpenAPI 3.0 specification
  - Swagger UI setup
  - Postman collection
  - API usage examples
  - Authentication documentation
```

---

## Part 3: Operational Agents (Priority 2)

### 6. Deployment Helper Agent

**File**: `agents/operations/deployment-helper.md`

**Purpose**: Assist with deployment configurations and processes.

**Trigger Conditions**:
- User types "help me deploy"
- User runs `/deploy setup` command
- When preparing for production

**Capabilities**:
```yaml
inputs:
  - target_platform: docker-compose | kubernetes | aws | gcp | azure
  - environment: development | staging | production

outputs:
  - Kubernetes manifests (if k8s)
  - Helm charts
  - CI/CD pipeline configurations
  - Environment variable templates
  - Deployment scripts
  - Rollback procedures
```

---

### 7. Migration Generator Agent

**File**: `agents/operations/migration-runner.md`

**Purpose**: Generate and manage database migrations.

**Capabilities**:
```yaml
inputs:
  - service_name: string
  - migration_type: create_table | alter_table | seed_data
  - changes: object

outputs:
  - Migration files (TypeORM/Prisma/Sequelize)
  - Rollback migrations
  - Seed data scripts
```

---

### 8. Monitoring Setup Agent

**File**: `agents/operations/monitoring-setup.md`

**Purpose**: Add comprehensive monitoring to services.

**Capabilities**:
```yaml
inputs:
  - services: array of service names
  - monitoring_stack: prometheus | datadog | newrelic

outputs:
  - Metrics exporters
  - Grafana dashboards
  - Alert rules
  - Log aggregation setup
  - APM configuration
```

---

## Part 4: Optimization Agents (Priority 3)

### 9. Performance Optimizer Agent

**File**: `agents/optimization/performance-optimizer.md`

**Purpose**: Analyze and optimize service performance.

**Trigger Conditions**:
- User types "optimize performance"
- User runs `/optimize performance` command
- After profiling reveals bottlenecks

**Capabilities**:
```yaml
analysis:
  - Database query optimization
  - Caching strategy review
  - API response times
  - Memory usage
  - CPU usage

recommendations:
  - Add database indexes
  - Implement caching layers
  - Use connection pooling
  - Add pagination
  - Optimize N+1 queries
  - Use CDN for static assets

actions:
  - Generate optimized queries
  - Add cache layers
  - Implement lazy loading
  - Add database indexes
```

---

### 10. Dependency Updater Agent

**File**: `agents/optimization/dependency-updater.md`

**Purpose**: Safely update project dependencies.

**Capabilities**:
```yaml
analysis:
  - Check for outdated dependencies
  - Identify security vulnerabilities
  - Check breaking changes
  - Review changelogs

actions:
  - Update package.json
  - Run tests after updates
  - Generate migration guide for breaking changes
  - Create PR with updates
```

---

## Part 5: Skills (Reusable Capabilities)

### Skills Architecture

**Location**: `.claude/skills/`

```
skills/
├── code-generation/
│   ├── generate-controller.skill
│   ├── generate-service.skill
│   └── generate-dto.skill
├── database/
│   ├── create-migration.skill
│   ├── generate-entity.skill
│   └── optimize-query.skill
├── testing/
│   ├── generate-unit-test.skill
│   ├── generate-integration-test.skill
│   └── generate-e2e-test.skill
└── infrastructure/
    ├── setup-redis.skill
    ├── setup-postgres.skill
    └── setup-message-queue.skill
```

### Skill Example: Generate Controller

**File**: `.claude/skills/code-generation/generate-controller.skill`

```yaml
name: generate-controller
description: Generate a REST controller with standard CRUD endpoints
language: typescript

inputs:
  - name: entityName
    type: string
    required: true
  - name: framework
    type: enum
    values: [nestjs, fastify, feathersjs]
    required: true
  - name: includeAuth
    type: boolean
    default: false

template: |
  import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
  {{#if includeAuth}}
  import { UseGuards } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  {{/if}}

  {{#if includeAuth}}@UseGuards(JwtAuthGuard){{/if}}
  @Controller('{{pluralize (kebabCase entityName)}}')
  export class {{pascalCase entityName}}Controller {
    constructor(private readonly service: {{pascalCase entityName}}Service) {}

    @Get()
    findAll() {
      return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: Create{{pascalCase entityName}}Dto) {
      return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: Update{{pascalCase entityName}}Dto) {
      return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }

tests:
  - |
    describe('{{pascalCase entityName}}Controller', () => {
      it('should return all items', async () => {
        // test implementation
      });
    });
```

---

## Part 6: Custom Commands (Slash Commands)

### Command Structure

**Location**: `.claude/commands/`

```
commands/
├── generate/
│   ├── service.md
│   ├── crud.md
│   ├── tests.md
│   └── docs.md
├── add/
│   ├── integration.md
│   ├── auth.md
│   └── monitoring.md
├── deploy/
│   ├── setup.md
│   ├── staging.md
│   └── production.md
└── optimize/
    ├── performance.md
    └── dependencies.md
```

### Command Example: /generate service

**File**: `.claude/commands/generate/service.md`

```markdown
---
name: generate-service
description: Generate a new microservice
usage: /generate service [name] [options]
---

# Generate Microservice Command

Generate a complete new microservice for the SaaSaaS project.

## Usage

```bash
/generate service user-service --framework=nestjs --database --cache
```

## Options

- `--framework`: Choose framework (nestjs, fastify, feathersjs)
- `--port`: Specify port number (default: auto-assign)
- `--database`: Include database integration
- `--cache`: Include cache integration
- `--message-queue`: Include message queue integration
- `--auth`: Include authentication guards

## Process

1. Invoke the Service Generator Agent
2. Agent will:
   - Read project configuration
   - Generate service from templates
   - Configure integrations
   - Update infrastructure files
   - Generate documentation
3. Run tests
4. Display success message with next steps

## Example

```bash
/generate service notification-service --framework=feathersjs --message-queue
```

This will create a FeathersJS-based notification service with NATS integration.
```

---

### Command Example: /add integration

**File**: `.claude/commands/add/integration.md`

```markdown
---
name: add-integration
description: Add infrastructure integration to existing service
usage: /add integration [type] --to [service]
---

# Add Integration Command

Add database, cache, or message queue to an existing service.

## Usage

```bash
/add integration redis --to user-service
/add integration postgres --to auth-service
/add integration nats --to notification-service
```

## Supported Integrations

- **Databases**: postgres, mongodb, sqlite
- **Caches**: redis, memcached
- **Message Queues**: nats, rabbitmq, kafka

## Process

1. Invoke the Integration Adder Agent
2. Agent will:
   - Add configuration
   - Generate service wrapper
   - Update environment variables
   - Update docker-compose
   - Add health checks
   - Generate usage examples
3. Test connection
4. Display usage instructions
```

---

## Part 7: Agent Orchestration

### Multi-Agent Workflows

Some tasks require multiple agents working together:

#### Workflow: Create Complete Feature

```yaml
workflow: create-feature
trigger: "Create a complete user management feature"

steps:
  1. service-generator:
      - Generate user-service
      - Include database + cache

  2. crud-generator:
      - Generate User CRUD
      - Generate Role CRUD
      - Add relationships

  3. integration-adder:
      - Add Redis caching
      - Add NATS events

  4. test-generator:
      - Generate unit tests
      - Generate integration tests

  5. api-documenter:
      - Generate OpenAPI spec
      - Create Postman collection

  6. monitoring-setup:
      - Add metrics
      - Add logging
      - Add health checks

result: Fully functional user management microservice
```

---

## Part 8: Learning System (Advanced)

### Agent Improvement Mechanism

```yaml
feedback_system:
  collection:
    - Track agent usage patterns
    - Collect user feedback
    - Monitor success rates
    - Identify common failures

  analysis:
    - Identify most-used patterns
    - Find common mistakes
    - Discover edge cases

  improvement:
    - Update templates
    - Refine prompts
    - Add new patterns
    - Create new skills

storage:
  location: .claude/data/
  files:
    - usage-stats.json
    - feedback.json
    - improvement-log.json
```

---

## Part 9: Agent Development Kit

### Creating New Agents

**Template**: `.claude/agents/_template.md`

```markdown
---
name: agent-name
type: generator | operational | optimization
priority: 1-5
version: 1.0.0
---

# Agent Name

## Purpose
Brief description of what this agent does.

## Trigger Conditions
- Condition 1
- Condition 2
- Condition 3

## Required Context
- Project configuration
- Service list
- Infrastructure state

## Inputs
```yaml
inputs:
  - name: input1
    type: string
    required: true
```

## Process
1. Step 1
2. Step 2
3. Step 3

## Outputs
- Output 1
- Output 2
- Output 3

## Examples
```bash
# Example usage
```

## Error Handling
- Error 1: How to handle
- Error 2: How to handle

## Testing
- Test case 1
- Test case 2
```

---

## Summary

### Agent Count by Priority

**Priority 1 (MVP)**: 5 agents
- service-generator
- crud-generator
- integration-adder
- test-generator
- api-documenter

**Priority 2**: 3 agents
- deployment-helper
- migration-runner
- monitoring-setup

**Priority 3**: 2 agents
- performance-optimizer
- dependency-updater

**Total**: 10 core agents

### Skills Count

**Estimated**: 20-30 reusable skills across:
- Code generation (8-10)
- Database operations (4-5)
- Testing (3-4)
- Infrastructure (5-6)

### Commands Count

**Estimated**: 15-20 slash commands across:
- Generate (5-6)
- Add (4-5)
- Deploy (3-4)
- Optimize (2-3)

---

**Next**: After user answers questions in `04-user-questions.md`, finalize the agent specifications based on priorities.
