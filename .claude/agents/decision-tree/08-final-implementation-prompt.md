# SaaSaaS Implementation Prompt

## Build a Production-Ready Microservices Generator CLI

This is your comprehensive implementation guide for building SaaSaaS - a CLI tool that generates complete, production-ready microservices architectures using Fastify.

---

## 🎯 Project Overview

Build a CLI tool called **SaaSaaS** (SaaS-as-a-Service) that generates complete microservices platforms for SaaS applications. The tool should target the broad developer community with excellent DX, comprehensive documentation, and production-ready code.

**Key Principle**: Generate traditional, well-architected code. AI assistance is used during development only, never at runtime. The generated services should be indistinguishable from code written before AI tools existed.

---

## 🏗️ Phase 1: CLI Tool Foundation

### Step 1: Project Structure

Create a pnpm monorepo with this structure:

```
saasaas/
├── packages/
│   ├── cli/                    # Main CLI package
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   └── init.ts    # Main init command
│   │   │   ├── prompts/
│   │   │   │   └── project.prompts.ts
│   │   │   ├── generators/
│   │   │   │   ├── project.generator.ts
│   │   │   │   └── service.generator.ts
│   │   │   ├── utils/
│   │   │   │   ├── template.util.ts
│   │   │   │   ├── file.util.ts
│   │   │   │   └── validation.util.ts
│   │   │   ├── types/
│   │   │   │   └── config.types.ts
│   │   │   ├── index.ts
│   │   │   └── cli.ts
│   │   ├── test/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── templates/              # Fastify service templates
│   │   ├── base-service/       # Base Fastify service
│   │   ├── auth-service/       # JWT authentication
│   │   ├── user-service/       # User management
│   │   ├── api-gateway/        # API gateway
│   │   ├── infrastructure/     # Docker, Redis, PostgreSQL, NATS
│   │   ├── shared/             # Shared utilities
│   │   └── package.json
│   │
│   ├── core/                   # Shared utilities
│   │   ├── src/
│   │   │   ├── logger/
│   │   │   ├── config/
│   │   │   └── errors/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── docs/                   # Documentation
│       ├── getting-started.md
│       ├── cli-reference.md
│       └── fastify-patterns.md
│
├── examples/                   # Example generated projects
│   └── basic-saas/
├── .changeset/                 # Changesets for versioning
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
└── README.md
```

**Initialize with**:
```bash
mkdir saasaas && cd saasaas
pnpm init
# Create pnpm-workspace.yaml
# Create packages structure
```

---

### Step 2: Core Dependencies

**packages/cli/package.json**:
```json
{
  "name": "@saasaas/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "saasaas": "./dist/cli.js"
  },
  "dependencies": {
    "commander": "^11.1.0",
    "inquirer": "^9.2.12",
    "chalk": "^5.3.0",
    "ora": "^7.0.1",
    "plop": "^4.0.1",
    "handlebars": "^4.7.8",
    "change-case": "^5.3.0",
    "pluralize": "^8.0.0",
    "fs-extra": "^11.2.0",
    "execa": "^8.0.1",
    "listr2": "^7.0.2",
    "yaml": "^2.3.4",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/inquirer": "^9.0.7",
    "@types/fs-extra": "^11.0.4",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

---

### Step 3: Configuration Schema

**packages/cli/src/types/config.types.ts**:
```typescript
import { z } from 'zod';

// Configuration schema using Zod
export const ConfigSchema = z.object({
  version: z.string().default('1.0.0'),

  project: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    author: z.string().optional(),
    packageManager: z.enum(['npm', 'yarn', 'pnpm']).default('pnpm'),
  }),

  framework: z.object({
    name: z.literal('fastify'),
    version: z.string().default('^4.24.0'),
  }),

  infrastructure: z.object({
    cache: z.object({
      type: z.literal('redis'),
      version: z.string().default('7-alpine'),
    }),

    database: z.object({
      type: z.enum(['postgresql', 'sqlite']),
      version: z.string().optional(),
      strategy: z.enum(['shared', 'separate']).default('separate'),
      multiTenancy: z.object({
        enabled: z.boolean().default(false),
        model: z.enum(['schema-per-tenant', 'database-per-tenant', 'row-level']).default('schema-per-tenant'),
      }).optional(),
    }),

    messageQueue: z.object({
      type: z.literal('nats'),
      version: z.string().default('2.10-alpine'),
    }),
  }),

  services: z.array(z.object({
    name: z.string(),
    port: z.number(),
    type: z.enum(['standard', 'gateway', 'auth']).optional(),
    features: z.object({
      database: z.boolean().default(false),
      cache: z.boolean().default(false),
      messageQueue: z.boolean().default(false),
      authentication: z.boolean().default(false),
      multiTenant: z.boolean().default(false),
    }),
  })),

  observability: z.object({
    logging: z.object({
      provider: z.literal('pino'),
      level: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
    }),
    healthChecks: z.boolean().default(true),
    tracing: z.object({
      provider: z.enum(['opentelemetry', 'none']).default('opentelemetry'),
      enabled: z.boolean().default(true),
    }),
  }),

  deployment: z.object({
    target: z.literal('docker-compose'),
    registry: z.string().optional(),
  }),

  useCases: z.array(z.enum(['saas', 'ecommerce', 'api-first', 'realtime'])).default([]),
});

export type Config = z.infer<typeof ConfigSchema>;
```

---

### Step 4: Interactive Prompts

**packages/cli/src/prompts/project.prompts.ts**:
```typescript
import inquirer from 'inquirer';
import type { Config } from '../types/config.types.js';

export async function promptProjectConfig(): Promise<Partial<Config>> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-saas-platform',
      validate: (input) => input.length > 0 || 'Project name is required',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A modern SaaS platform',
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Choose database:',
      choices: [
        { name: 'PostgreSQL (Traditional, proven)', value: 'postgresql' },
        { name: 'SQLite + LiteFS (Modern, embeddable)', value: 'sqlite' },
      ],
      default: 'postgresql',
    },
    {
      type: 'confirm',
      name: 'enableMultiTenancy',
      message: 'Enable multi-tenancy support?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'includeAuthService',
      message: 'Include JWT authentication service?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeUserService',
      message: 'Include user management service?',
      default: true,
    },
    {
      type: 'checkbox',
      name: 'useCases',
      message: 'Select use cases to optimize for:',
      choices: [
        { name: 'SaaS / Multi-tenant applications', value: 'saas' },
        { name: 'E-commerce platforms', value: 'ecommerce' },
        { name: 'API-first platforms', value: 'api-first' },
      ],
    },
  ]);

  // Transform answers into config
  const config: Partial<Config> = {
    project: {
      name: answers.projectName,
      description: answers.description,
      packageManager: 'pnpm',
    },
    infrastructure: {
      cache: { type: 'redis', version: '7-alpine' },
      database: {
        type: answers.databaseType,
        strategy: 'separate',
        multiTenancy: answers.enableMultiTenancy ? {
          enabled: true,
          model: 'schema-per-tenant',
        } : undefined,
      },
      messageQueue: { type: 'nats', version: '2.10-alpine' },
    },
    services: [],
    useCases: answers.useCases,
  };

  // Add services based on selections
  if (answers.includeAuthService) {
    config.services!.push({
      name: 'auth-service',
      port: 3001,
      type: 'auth',
      features: {
        database: true,
        cache: true,
        messageQueue: false,
        authentication: true,
        multiTenant: false,
      },
    });
  }

  if (answers.includeUserService) {
    config.services!.push({
      name: 'user-service',
      port: 3002,
      features: {
        database: true,
        cache: true,
        messageQueue: true,
        authentication: true,
        multiTenant: answers.enableMultiTenancy,
      },
    });
  }

  // Always add API gateway
  config.services!.push({
    name: 'api-gateway',
    port: 3000,
    type: 'gateway',
    features: {
      database: false,
      cache: true,
      messageQueue: false,
      authentication: false,
      multiTenant: false,
    },
  });

  return config;
}
```

---

### Step 5: Main CLI Command

**packages/cli/src/commands/init.ts**:
```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { promptProjectConfig } from '../prompts/project.prompts.js';
import { ProjectGenerator } from '../generators/project.generator.js';
import { ConfigSchema } from '../types/config.types.js';

export function createInitCommand(): Command {
  return new Command('init')
    .argument('[project-name]', 'Project name')
    .description('Initialize a new SaaS project')
    .action(async (projectName?: string) => {
      console.log(chalk.bold.blue('\n🚀 SaaSaaS Project Generator\n'));

      // Step 1: Gather configuration
      const spinner = ora('Gathering project configuration...').start();

      let config;
      try {
        config = await promptProjectConfig();

        // Override project name if provided as argument
        if (projectName) {
          config.project!.name = projectName;
        }

        // Validate configuration
        const validatedConfig = ConfigSchema.parse(config);

        spinner.succeed('Configuration gathered');

        // Step 2: Write config file
        const projectDir = path.join(process.cwd(), validatedConfig.project.name);
        const configPath = path.join(projectDir, 'saasaas.config.json');

        await fs.ensureDir(projectDir);
        await fs.writeJSON(configPath, validatedConfig, { spaces: 2 });

        console.log(chalk.green(`\n✓ Config file created: ${configPath}\n`));

        // Step 3: Generate project
        const generator = new ProjectGenerator(validatedConfig);
        await generator.generate(projectDir);

        // Step 4: Success message
        console.log(chalk.bold.green('\n✨ Project created successfully!\n'));
        console.log(chalk.white('Next steps:'));
        console.log(chalk.gray(`  cd ${validatedConfig.project.name}`));
        console.log(chalk.gray('  pnpm install'));
        console.log(chalk.gray('  docker-compose up -d  # Start infrastructure'));
        console.log(chalk.gray('  pnpm dev              # Start all services\n'));

      } catch (error) {
        spinner.fail('Failed to create project');
        console.error(chalk.red(error));
        process.exit(1);
      }
    });
}
```

---

### Step 6: Project Generator

**packages/cli/src/generators/project.generator.ts**:
```typescript
import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { Listr } from 'listr2';
import type { Config } from '../types/config.types.js';
import { registerHandlebarsHelpers } from '../utils/template.util.js';

export class ProjectGenerator {
  private config: Config;
  private templatesDir: string;

  constructor(config: Config) {
    this.config = config;
    this.templatesDir = path.join(__dirname, '../../../templates');
    registerHandlebarsHelpers();
  }

  async generate(projectDir: string): Promise<void> {
    const tasks = new Listr([
      {
        title: 'Creating project structure',
        task: () => this.createProjectStructure(projectDir),
      },
      {
        title: 'Generating services',
        task: () => this.generateServices(projectDir),
      },
      {
        title: 'Setting up infrastructure',
        task: () => this.setupInfrastructure(projectDir),
      },
      {
        title: 'Creating shared utilities',
        task: () => this.createSharedUtilities(projectDir),
      },
      {
        title: 'Generating documentation',
        task: () => this.generateDocumentation(projectDir),
      },
    ]);

    await tasks.run();
  }

  private async createProjectStructure(projectDir: string): Promise<void> {
    const dirs = [
      'services',
      'infrastructure',
      'shared/types',
      'shared/config',
      'shared/utils',
      'docs',
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectDir, dir));
    }

    // Create root package.json
    await this.createRootPackageJson(projectDir);

    // Create pnpm-workspace.yaml
    await fs.writeFile(
      path.join(projectDir, 'pnpm-workspace.yaml'),
      'packages:\n  - "services/*"\n  - "shared"\n'
    );
  }

  private async generateServices(projectDir: string): Promise<void> {
    for (const service of this.config.services) {
      await this.generateService(projectDir, service);
    }
  }

  private async generateService(projectDir: string, serviceConfig: any): Promise<void> {
    const serviceDir = path.join(projectDir, 'services', serviceConfig.name);
    const templateType = serviceConfig.type || 'standard';
    const templateDir = path.join(this.templatesDir, `${templateType}-service`);

    // Copy template
    await fs.copy(templateDir, serviceDir);

    // Process templates
    await this.processTemplates(serviceDir, {
      ...this.config,
      service: serviceConfig,
    });
  }

  private async processTemplates(dir: string, context: any): Promise<void> {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await this.processTemplates(filePath, context);
      } else if (file.name.endsWith('.hbs')) {
        // Process Handlebars template
        const template = await fs.readFile(filePath, 'utf-8');
        const compiled = Handlebars.compile(template);
        const result = compiled(context);

        // Write result (remove .hbs extension)
        const outputPath = filePath.replace(/\.hbs$/, '');
        await fs.writeFile(outputPath, result);
        await fs.remove(filePath);
      }
    }
  }

  private async setupInfrastructure(projectDir: string): Promise<void> {
    // Generate docker-compose.yml
    const dockerComposeTemplate = await fs.readFile(
      path.join(this.templatesDir, 'infrastructure/docker-compose.yml.hbs'),
      'utf-8'
    );
    const compiled = Handlebars.compile(dockerComposeTemplate);
    const result = compiled(this.config);

    await fs.writeFile(
      path.join(projectDir, 'docker-compose.yml'),
      result
    );

    // Copy infrastructure configs
    await fs.copy(
      path.join(this.templatesDir, 'infrastructure'),
      path.join(projectDir, 'infrastructure'),
      { filter: (src) => !src.endsWith('.hbs') }
    );
  }

  private async createSharedUtilities(projectDir: string): Promise<void> {
    await fs.copy(
      path.join(this.templatesDir, 'shared'),
      path.join(projectDir, 'shared')
    );
  }

  private async generateDocumentation(projectDir: string): Promise<void> {
    // Generate README.md
    const readmeTemplate = await fs.readFile(
      path.join(this.templatesDir, 'docs/README.md.hbs'),
      'utf-8'
    );
    const compiled = Handlebars.compile(readmeTemplate);
    const result = compiled(this.config);

    await fs.writeFile(path.join(projectDir, 'README.md'), result);

    // Generate architecture diagram
    await this.generateArchitectureDiagram(projectDir);
  }

  private async generateArchitectureDiagram(projectDir: string): Promise<void> {
    const services = this.config.services.map(s => ({
      name: s.name,
      port: s.port,
    }));

    const diagram = `
# Architecture

\`\`\`mermaid
graph TB
${services.map(s => `    ${s.name.replace(/-/g, '_')}[${s.name} :${s.port}]`).join('\n')}

    Redis[(Redis Cache)]
    DB[(${this.config.infrastructure.database.type === 'postgresql' ? 'PostgreSQL' : 'SQLite'})]
    NATS[(NATS)]

${services.map(s => `    ${services[0].name.replace(/-/g, '_')} --> ${s.name.replace(/-/g, '_')}`).join('\n')}
\`\`\`
`;

    await fs.writeFile(
      path.join(projectDir, 'docs/architecture.md'),
      diagram
    );
  }

  private async createRootPackageJson(projectDir: string): Promise<void> {
    const packageJson = {
      name: this.config.project.name,
      version: '1.0.0',
      description: this.config.project.description,
      private: true,
      scripts: {
        dev: 'pnpm -r --parallel dev',
        build: 'pnpm -r build',
        test: 'pnpm -r test',
        lint: 'pnpm -r lint',
      },
      devDependencies: {
        typescript: '^5.3.3',
        '@types/node': '^20.10.0',
      },
    };

    await fs.writeJSON(
      path.join(projectDir, 'package.json'),
      packageJson,
      { spaces: 2 }
    );
  }
}
```

---

## 🎨 Phase 2: Fastify Service Templates

### Template Structure

Create comprehensive templates for each service type. Here's the auth-service template structure:

**packages/templates/auth-service/**:
```
auth-service/
├── src/
│   ├── plugins/
│   │   ├── auth.plugin.ts.hbs
│   │   ├── database.plugin.ts.hbs
│   │   └── redis.plugin.ts.hbs
│   ├── routes/
│   │   ├── auth.routes.ts.hbs
│   │   └── schemas/
│   │       ├── login.schema.ts
│   │       └── register.schema.ts
│   ├── services/
│   │   ├── auth.service.ts.hbs
│   │   ├── token.service.ts.hbs
│   │   └── password.service.ts
│   ├── models/
│   │   └── user.model.ts.hbs
│   ├── config/
│   │   └── index.ts.hbs
│   ├── app.ts.hbs
│   └── server.ts.hbs
├── test/
│   ├── unit/
│   └── integration/
├── Dockerfile.hbs
├── package.json.hbs
├── tsconfig.json
└── README.md.hbs
```

### Key Template Files

**packages/templates/auth-service/src/app.ts.hbs**:
```typescript
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { pinoLogger } from './config/logger';
import authPlugin from './plugins/auth.plugin';
import databasePlugin from './plugins/database.plugin';
import redisPlugin from './plugins/redis.plugin';
import authRoutes from './routes/auth.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: pinoLogger,
  });

  // Security
  await app.register(helmet);
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Plugins
  await app.register(databasePlugin);
  await app.register(redisPlugin);
  await app.register(authPlugin);

  // Routes
  await app.register(authRoutes, { prefix: '/auth' });

  // Health checks
  app.get('/health', async () => ({ status: 'healthy' }));

  app.get('/ready', async () => ({
    status: 'ready',
    checks: {
      database: await app.checkDatabaseHealth(),
      redis: await app.checkRedisHealth(),
    },
  }));

  return app;
}
```

**packages/templates/auth-service/src/plugins/auth.plugin.ts.hbs**:
```typescript
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
```

---

## 🧪 Phase 3: Testing & Documentation

### Auto-Generated Tests

**Template: packages/templates/auth-service/test/unit/auth.service.test.ts**:
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../src/services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should hash the password', async () => {
      const user = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.password).not.toBe('password123');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      // Create user
      await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      // Login
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

---

## 🚀 Phase 4: Infrastructure Templates

### Docker Compose Template

**packages/templates/infrastructure/docker-compose.yml.hbs**:
```yaml
version: '3.8'

services:
  redis:
    image: redis:{{infrastructure.cache.version}}
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    networks:
      - saas-network

  {{#if (eq infrastructure.database.type 'postgresql')}}
  postgres:
    image: postgres:{{infrastructure.database.version}}
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-saas}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: ${POSTGRES_DB:-saas_db}
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - saas-network
  {{/if}}

  nats:
    image: nats:{{infrastructure.messageQueue.version}}
    ports:
      - '4222:4222'
      - '8222:8222'
    networks:
      - saas-network

  {{#each services}}
  {{this.name}}:
    build:
      context: ./services/{{this.name}}
      dockerfile: Dockerfile
    ports:
      - '{{this.port}}:{{this.port}}'
    environment:
      NODE_ENV: development
      PORT: {{this.port}}
      {{#if this.features.database}}
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: {{../project.name}}_{{this.name}}
      {{/if}}
      {{#if this.features.cache}}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      {{/if}}
      {{#if this.features.messageQueue}}
      NATS_URL: nats://nats:4222
      {{/if}}
    depends_on:
      - redis
      {{#if (eq ../infrastructure.database.type 'postgresql')}}
      - postgres
      {{/if}}
      - nats
    volumes:
      - ./services/{{this.name}}/src:/app/src
    networks:
      - saas-network
  {{/each}}

volumes:
  redis-data:
  {{#if (eq infrastructure.database.type 'postgresql')}}
  postgres-data:
  {{/if}}

networks:
  saas-network:
    driver: bridge
```

---

## 📚 Phase 5: Documentation Generation

### README Template

**packages/templates/docs/README.md.hbs**:
```markdown
# {{project.name}}

{{project.description}}

## Architecture

This project uses a microservices architecture built with Fastify.

### Services

{{#each services}}
- **{{this.name}}** (Port {{this.port}}){{#if this.type}} - {{this.type}}{{/if}}
{{/each}}

### Infrastructure

- **Cache**: {{infrastructure.cache.type}} {{infrastructure.cache.version}}
- **Database**: {{infrastructure.database.type}}{{#if infrastructure.database.version}} {{infrastructure.database.version}}{{/if}}
- **Message Queue**: {{infrastructure.messageQueue.type}} {{infrastructure.messageQueue.version}}

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start infrastructure services:
   ```bash
   docker-compose up -d
   ```

3. Start all services:
   ```bash
   pnpm dev
   ```

### Services URLs

{{#each services}}
- {{this.name}}: http://localhost:{{this.port}}
{{/each}}

## Development

### Adding a New Service

```bash
saasaas add service my-new-service
```

### Running Tests

```bash
pnpm test
```

### Building for Production

```bash
pnpm build
```

## API Documentation

Each service includes Swagger documentation:

{{#each services}}
- {{this.name}}: http://localhost:{{this.port}}/docs
{{/each}}

## License

MIT
```

---

## 🎯 Implementation Checklist

### Week 1: CLI Foundation
- [ ] Setup pnpm monorepo structure
- [ ] Install core dependencies (Commander, Inquirer, Plop, Handlebars)
- [ ] Create configuration schema with Zod
- [ ] Implement interactive prompts
- [ ] Build main `init` command
- [ ] Implement project generator
- [ ] Test end-to-end: generate a basic project

### Week 2: Fastify Templates
- [ ] Create base Fastify service template
- [ ] Build auth-service template (JWT, login, register)
- [ ] Build user-service template (CRUD, multi-tenant)
- [ ] Build API gateway template (routing, rate limiting)
- [ ] Implement plugin patterns (database, Redis, NATS)
- [ ] Add JSON Schema validation to all routes

### Week 3: Infrastructure & Testing
- [ ] Create Docker Compose templates
- [ ] Setup PostgreSQL with schema-per-tenant
- [ ] Integrate Redis caching
- [ ] Integrate NATS messaging
- [ ] Generate unit tests for all services
- [ ] Generate integration test templates
- [ ] Add health check endpoints

### Week 4: Documentation & Polish
- [ ] Generate README per service
- [ ] Add Swagger/OpenAPI documentation
- [ ] Create architecture diagrams (Mermaid)
- [ ] Write development guides
- [ ] Add structured logging (Pino)
- [ ] Add OpenTelemetry tracing
- [ ] Test complete workflow
- [ ] Create example projects

---

## 🤖 Claude Agents for Development

Use these agents to help you build the CLI:

### 1. template-generator
**Prompt**: "Help me create a Handlebars template for [feature]. The template should follow Fastify best practices and include [requirements]."

### 2. config-schema-designer
**Prompt**: "Review and improve the Zod schema for saasaas.config.json. Suggest validations, defaults, and better TypeScript types."

### 3. fastify-expert
**Prompt**: "Review this Fastify service code and suggest improvements for [plugin architecture/error handling/validation/performance]."

### 4. test-suite-creator
**Prompt**: "Generate comprehensive unit and integration tests for [service/feature]. Include edge cases and error scenarios."

---

## 🎯 Success Criteria

Your implementation is successful when:

1. **CLI works**: `saasaas init my-project` generates a complete working project
2. **Services run**: All generated services start without errors
3. **Tests pass**: All generated tests pass
4. **Documentation complete**: README, OpenAPI docs, and architecture diagrams generated
5. **Infrastructure works**: Docker Compose starts all services successfully
6. **Code quality**: Generated code passes TypeScript strict mode and ESLint

---

## 📦 Example Output

When complete, users should be able to run:

```bash
npx @saasaas/cli init my-awesome-saas
cd my-awesome-saas
pnpm install
docker-compose up -d
pnpm dev
```

And have a complete, production-ready SaaS platform running with:
- JWT authentication
- User management with multi-tenancy
- Redis caching
- PostgreSQL database (schema-per-tenant)
- NATS messaging
- OpenAPI documentation
- Comprehensive tests
- Health checks and logging

---

**Status**: Ready for implementation
**Estimated Time**: 4 weeks for MVP
**Next Step**: Begin with CLI foundation (Week 1)

Good luck! 🚀
