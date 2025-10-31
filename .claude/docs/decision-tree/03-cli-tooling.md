# CLI Tool Architecture & Code Generation Strategy

## Executive Summary

The CLI tool is the user-facing interface of SaaSaaS. This document covers CLI frameworks, templating engines, code generation strategies, and the overall developer experience.

---

## Part 1: CLI Framework Selection

### Commander.js vs Inquirer.js vs Oclif

#### Commander.js + Inquirer.js (Recommended)

**Rating**: ⭐⭐⭐⭐⭐

**Strengths**:
- **Commander**: Best command-line parsing
- **Inquirer**: Best interactive prompts
- **Combination**: Industry standard approach
- **Flexibility**: Full control over UX
- **Lightweight**: Minimal dependencies

**Architecture**:
```typescript
import { Command } from 'commander';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('saasquatch')
  .description('SaaS-as-a-Service CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new SaaS project')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-saas'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose microservice framework:',
        choices: ['NestJS', 'Fastify', 'FeathersJS']
      }
    ]);

    await generateProject(answers);
  });

program
  .command('add-service')
  .description('Add a new microservice')
  .action(async () => {
    // Interactive service generation
  });
```

**Example UX**:
```bash
$ saasquatch init

   _____ ____  ___   _____ ____  ___   _____
  / ___// __ \/   | / ___// __ \/   | / ___/
  \__ \/ /_/ / /| | \__ \/ /_/ / /| | \__ \
 ___/ / __  / ___ |___/ / __  / ___ |___/ /
/____/_/ /_/_/  |_/____/_/ /_/_/  |_/____/

Welcome to SaaS-as-a-Service Generator!

? Project name: my-awesome-saas
? Choose microservice framework: NestJS
? Include cache layer? Yes
? Cache type: Redis
? Include database? Yes
? Database type: PostgreSQL
? Include message queue? Yes
? Message queue type: NATS
? Deployment target: Docker Compose

✨ Generating your SaaS platform...
✓ Created project structure
✓ Generated API gateway
✓ Generated auth service
✓ Generated user service
✓ Configured Redis cache
✓ Configured PostgreSQL database
✓ Configured NATS message queue
✓ Generated Docker Compose files

🚀 Your SaaS platform is ready!

Next steps:
  cd my-awesome-saas
  npm install
  docker-compose up -d
  npm run dev
```

---

#### Oclif (Alternative for Plugin Ecosystem)

**Rating**: ⭐⭐⭐⭐

**Strengths**:
- **Framework**: Complete CLI framework
- **Plugins**: Built-in plugin architecture
- **TypeScript**: First-class TypeScript support
- **Auto-documentation**: Generates help automatically
- **Testing**: Built-in testing utilities

**Weaknesses**:
- **Heavier**: More opinionated and larger
- **Learning Curve**: More concepts to learn

**Best For**:
- CLIs that need plugin ecosystems
- Large, complex CLI tools
- Teams familiar with oclif

---

## Part 2: Templating & Code Generation

### Template Engine Options

#### Option 1: Handlebars (Recommended)

**Rating**: ⭐⭐⭐⭐⭐

**Strengths**:
- **Logic-less**: Clean separation of template and logic
- **Helpers**: Powerful custom helpers
- **Partials**: Reusable template parts
- **Precompilation**: Fast rendering
- **Popular**: Large community

**Template Example**:
```handlebars
// templates/nestjs/service/controller.ts.hbs
import { Controller, Get, Post, Body } from '@nestjs/common';
import { {{pascalCase name}}Service } from './{{kebabCase name}}.service';
import { Create{{pascalCase name}}Dto } from './dto/create-{{kebabCase name}}.dto';

@Controller('{{pluralize (kebabCase name)}}')
export class {{pascalCase name}}Controller {
  constructor(
    private readonly {{camelCase name}}Service: {{pascalCase name}}Service
  ) {}

  @Get()
  findAll() {
    return this.{{camelCase name}}Service.findAll();
  }

  @Post()
  create(@Body() dto: Create{{pascalCase name}}Dto) {
    return this.{{camelCase name}}Service.create(dto);
  }

  {{#if includeCache}}
  @Get(':id')
  @UseCache()
  findOne(@Param('id') id: string) {
    return this.{{camelCase name}}Service.findOne(id);
  }
  {{/if}}
}
```

**Custom Helpers**:
```typescript
import Handlebars from 'handlebars';
import { pascalCase, camelCase, kebabCase } from 'change-case';
import pluralize from 'pluralize';

Handlebars.registerHelper('pascalCase', (str) => pascalCase(str));
Handlebars.registerHelper('camelCase', (str) => camelCase(str));
Handlebars.registerHelper('kebabCase', (str) => kebabCase(str));
Handlebars.registerHelper('pluralize', (str) => pluralize(str));
```

---

#### Option 2: EJS (Alternative)

**Rating**: ⭐⭐⭐⭐

**Strengths**:
- **JavaScript**: Embedded JavaScript in templates
- **Familiar**: HTML-like syntax
- **Powerful**: Full JavaScript logic

**Weaknesses**:
- **Less Clean**: Logic mixed with templates
- **Harder to Maintain**: Complex templates can be messy

**Best For**:
- Teams preferring JavaScript in templates
- Complex template logic

---

#### Option 3: Plop.js (High-Level Generator)

**Rating**: ⭐⭐⭐⭐⭐ (Best for Generator Scripts)

**Strengths**:
- **Purpose-Built**: Made for code generation
- **Inquirer Integration**: Built-in prompts
- **Actions**: Add, modify, delete files
- **Handlebars**: Uses Handlebars by default
- **Simple DSL**: Easy to write generators

**Example Generator**:
```javascript
// plopfile.js
export default function (plop) {
  plop.setGenerator('microservice', {
    description: 'Generate a new microservice',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Service name:'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Framework:',
        choices: ['nestjs', 'fastify', 'feathersjs']
      },
      {
        type: 'confirm',
        name: 'includeDatabase',
        message: 'Include database connection?'
      }
    ],
    actions: (data) => {
      const actions = [];

      // Base service files
      actions.push({
        type: 'addMany',
        destination: 'services/{{kebabCase name}}',
        base: 'templates/{{framework}}',
        templateFiles: 'templates/{{framework}}/**/*.hbs'
      });

      // Conditional database files
      if (data.includeDatabase) {
        actions.push({
          type: 'add',
          path: 'services/{{kebabCase name}}/src/database.ts',
          templateFile: 'templates/database/connection.ts.hbs'
        });
      }

      return actions;
    }
  });
}
```

**Why Plop for SaaSaaS**:
- Perfect for multi-file generation
- Built-in best practices for generators
- Easy to extend with custom actions
- Already includes Inquirer
- Popular in React/Node communities

---

### Template Organization Strategy

```
cli/templates/
├── frameworks/
│   ├── nestjs/
│   │   ├── base/                      # Base NestJS structure
│   │   │   ├── src/
│   │   │   │   ├── main.ts.hbs
│   │   │   │   ├── app.module.ts.hbs
│   │   │   │   └── app.controller.ts.hbs
│   │   │   ├── test/
│   │   │   ├── package.json.hbs
│   │   │   ├── tsconfig.json
│   │   │   └── nest-cli.json
│   │   ├── modules/
│   │   │   ├── auth/                  # Auth module template
│   │   │   ├── users/                 # Users module template
│   │   │   └── crud/                  # Generic CRUD template
│   │   └── integrations/
│   │       ├── redis/                 # Redis integration
│   │       ├── postgres/              # PostgreSQL integration
│   │       └── nats/                  # NATS integration
│   ├── fastify/
│   │   └── ... (similar structure)
│   └── feathersjs/
│       └── ... (similar structure)
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.hbs
│   │   ├── docker-compose.yml.hbs
│   │   └── .dockerignore
│   ├── kubernetes/
│   │   ├── deployment.yaml.hbs
│   │   ├── service.yaml.hbs
│   │   └── ingress.yaml.hbs
│   └── helm/
│       └── chart/
├── services/
│   ├── redis-cache/                   # Redis cache service
│   ├── database/                      # Database service wrapper
│   ├── api-gateway/                   # API gateway
│   └── event-bus/                     # Event bus service
├── ci-cd/
│   ├── github-actions/
│   │   └── workflows/
│   ├── gitlab-ci/
│   └── jenkins/
└── shared/
    ├── config/                        # Shared config
    ├── types/                         # Shared TypeScript types
    └── utils/                         # Shared utilities
```

---

## Part 3: Code Generation Strategy

### Generation Approach

#### Phase 1: Project Initialization
```typescript
class ProjectGenerator {
  async generate(config: ProjectConfig) {
    // 1. Create directory structure
    await this.createDirectoryStructure(config);

    // 2. Generate monorepo setup (if selected)
    if (config.monorepo) {
      await this.generateMonorepoConfig(config);
    }

    // 3. Generate core services
    await this.generateApiGateway(config);
    await this.generateAuthService(config);

    // 4. Generate infrastructure
    await this.generateInfrastructure(config);

    // 5. Generate configuration
    await this.generateConfig(config);

    // 6. Initialize git
    await this.initializeGit(config);

    // 7. Install dependencies
    if (config.installDeps) {
      await this.installDependencies(config);
    }
  }
}
```

#### Phase 2: Service Generation
```typescript
class ServiceGenerator {
  async generate(config: ServiceConfig) {
    const template = this.getTemplate(config.framework);

    // 1. Generate base service structure
    await template.generateBase(config);

    // 2. Add integrations
    if (config.database) {
      await template.addDatabaseIntegration(config.database);
    }

    if (config.cache) {
      await template.addCacheIntegration(config.cache);
    }

    if (config.messageQueue) {
      await template.addMessageQueueIntegration(config.messageQueue);
    }

    // 3. Generate CRUD endpoints (if requested)
    if (config.generateCRUD) {
      await template.generateCRUD(config.entities);
    }

    // 4. Add authentication (if requested)
    if (config.requiresAuth) {
      await template.addAuthGuards();
    }

    // 5. Generate tests
    await template.generateTests(config);

    // 6. Generate API documentation
    await template.generateApiDocs(config);
  }
}
```

---

## Part 4: CLI Commands Structure

### Primary Commands

```bash
saasquatch init                    # Initialize new project
saasquatch add service             # Add new microservice
saasquatch add integration         # Add integration (DB, cache, queue)
saasquatch generate crud           # Generate CRUD for entity
saasquatch generate client         # Generate API client
saasquatch config                  # Manage configuration
saasquatch deploy                  # Deploy services
saasquatch dev                     # Start development environment
```

### Command Details

#### `saasquatch init`
```typescript
{
  prompts: [
    { name: 'projectName', type: 'input' },
    { name: 'description', type: 'input' },
    { name: 'framework', type: 'list', choices: frameworks },
    { name: 'packageManager', type: 'list', choices: ['npm', 'yarn', 'pnpm'] },
    { name: 'monorepo', type: 'confirm', message: 'Use monorepo?' },
    { name: 'infrastructure', type: 'checkbox', choices: services },
    { name: 'deploymentTarget', type: 'list', choices: targets },
    { name: 'cicd', type: 'list', choices: cicdOptions }
  ],
  actions: [
    'Generate project structure',
    'Generate core services',
    'Setup infrastructure',
    'Configure CI/CD',
    'Install dependencies'
  ]
}
```

#### `saasquatch add service`
```typescript
{
  prompts: [
    { name: 'serviceName', type: 'input' },
    { name: 'framework', type: 'list' },
    { name: 'port', type: 'number', default: 'auto' },
    { name: 'database', type: 'confirm' },
    { name: 'cache', type: 'confirm' },
    { name: 'messageQueue', type: 'confirm' },
    { name: 'authentication', type: 'confirm' },
    { name: 'generateCRUD', type: 'confirm' }
  ],
  actions: [
    'Generate service code',
    'Add to API gateway',
    'Update docker-compose.yml',
    'Update k8s manifests',
    'Generate API documentation'
  ]
}
```

#### `saasquatch generate crud`
```typescript
{
  prompts: [
    { name: 'service', type: 'list', choices: 'existing services' },
    { name: 'entityName', type: 'input' },
    { name: 'fields', type: 'editor', message: 'Define fields (JSON)' },
    { name: 'includeRelations', type: 'confirm' },
    { name: 'includeSearch', type: 'confirm' },
    { name: 'includePagination', type: 'confirm' }
  ],
  actions: [
    'Generate entity/model',
    'Generate DTO classes',
    'Generate service',
    'Generate controller',
    'Generate tests',
    'Update module'
  ]
}
```

---

## Part 5: Configuration Management

### Project Configuration File

**Location**: `saasquatch.config.json`

```json
{
  "version": "1.0.0",
  "projectName": "my-awesome-saas",
  "framework": "nestjs",
  "packageManager": "pnpm",
  "monorepo": true,

  "infrastructure": {
    "cache": {
      "type": "redis",
      "host": "${REDIS_HOST:-localhost}",
      "port": 6379
    },
    "database": {
      "type": "postgresql",
      "host": "${DB_HOST:-localhost}",
      "port": 5432
    },
    "messageQueue": {
      "type": "nats",
      "host": "${NATS_HOST:-localhost}",
      "port": 4222
    }
  },

  "services": [
    {
      "name": "api-gateway",
      "framework": "fastify",
      "port": 3000,
      "type": "gateway"
    },
    {
      "name": "auth-service",
      "framework": "nestjs",
      "port": 3001,
      "dependencies": ["database", "cache"]
    },
    {
      "name": "user-service",
      "framework": "nestjs",
      "port": 3002,
      "dependencies": ["database", "cache", "messageQueue"]
    }
  ],

  "deployment": {
    "target": "docker-compose",
    "registry": "ghcr.io/myorg",
    "healthCheckPath": "/health"
  },

  "cicd": {
    "provider": "github-actions",
    "autoTest": true,
    "autoDeploy": false
  }
}
```

### Service Configuration File

**Location**: `services/user-service/service.config.json`

```json
{
  "name": "user-service",
  "version": "1.0.0",
  "framework": "nestjs",
  "port": 3002,

  "dependencies": {
    "database": {
      "type": "postgresql",
      "schema": "users"
    },
    "cache": {
      "type": "redis",
      "prefix": "user:"
    },
    "messageQueue": {
      "type": "nats",
      "subjects": ["user.created", "user.updated", "user.deleted"]
    }
  },

  "features": {
    "authentication": true,
    "authorization": true,
    "validation": true,
    "logging": true,
    "monitoring": true
  },

  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "uuid", "primary": true },
        { "name": "email", "type": "string", "unique": true },
        { "name": "name", "type": "string" },
        { "name": "createdAt", "type": "timestamp" }
      ]
    }
  ]
}
```

---

## Part 6: Developer Experience Features

### Live Reload Development

```bash
# Start all services in development mode
saasquatch dev

# Start specific services
saasquatch dev --services=api-gateway,user-service

# Watch for changes
saasquatch dev --watch
```

### Interactive Service Browser

```bash
# Launch interactive dashboard
saasquatch dashboard

┌─────────────────────────────────────────┐
│ SaaSaaS Service Dashboard               │
├─────────────────────────────────────────┤
│ Services:                               │
│  ● api-gateway      :3000  ✓ Healthy   │
│  ● auth-service     :3001  ✓ Healthy   │
│  ● user-service     :3002  ✓ Healthy   │
│                                         │
│ Infrastructure:                         │
│  ● Redis            :6379  ✓ Connected │
│  ● PostgreSQL       :5432  ✓ Connected │
│  ● NATS             :4222  ✓ Connected │
│                                         │
│ [1] View logs  [2] Restart service      │
│ [3] Add service  [4] Generate CRUD      │
└─────────────────────────────────────────┘
```

### CLI Autocomplete

```bash
# Install autocomplete
saasquatch completion install

# Now supports tab completion
saasquatch add <TAB>
  service    integration    crud
```

---

## Part 7: Testing Strategy

### Generated Tests

```typescript
// Auto-generated test structure
describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'DATABASE',
          useValue: mockDatabase
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Test generated based on entity definition
    });
  });

  // ... more tests
});
```

---

## Recommended CLI Stack

### Core Dependencies
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "inquirer": "^9.2.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.0",
    "plop": "^4.0.0",
    "handlebars": "^4.7.8",
    "change-case": "^5.0.0",
    "pluralize": "^8.0.0",
    "fs-extra": "^11.0.0",
    "execa": "^8.0.0",
    "listr2": "^7.0.0",
    "yaml": "^2.3.0"
  }
}
```

### CLI Structure
```
cli/
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── add-service.ts
│   │   ├── generate.ts
│   │   └── dev.ts
│   ├── generators/
│   │   ├── project.generator.ts
│   │   ├── service.generator.ts
│   │   └── crud.generator.ts
│   ├── templates/
│   │   └── ... (as described above)
│   ├── utils/
│   │   ├── template.util.ts
│   │   ├── file.util.ts
│   │   └── validation.util.ts
│   └── index.ts
├── templates/
│   └── ... (template files)
└── package.json
```

---

**Decision Status**: ✅ Complete
**Recommended Stack**:
- **CLI Framework**: Commander.js + Inquirer.js
- **Generator**: Plop.js
- **Templates**: Handlebars
- **Testing**: Jest with auto-generated tests

**Next**: User clarification questions and final prompt synthesis
