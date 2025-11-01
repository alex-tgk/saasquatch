import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import handlebars from 'handlebars';
import { execaCommand } from 'execa';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'yaml';
import type { Config, Service } from '../types/config.types.js';
import { TemplateRenderer } from '../utils/template-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ProjectGenerator {
  private config: Config;
  private templatesDir: string;
  private renderer: TemplateRenderer;

  constructor(config: Config) {
    this.config = config;
    // Templates directory is at packages/templates
    this.templatesDir = path.resolve(__dirname, '../../../templates');
    this.renderer = new TemplateRenderer();
  }

  async generate(projectDir: string): Promise<void> {
    // Create base project structure
    await this.createProjectStructure(projectDir);

    // Generate root files
    await this.generateRootFiles(projectDir);

    // Generate services
    await this.generateServices(projectDir);

    // Generate shared utilities
    await this.generateShared(projectDir);

    // Generate infrastructure files
    await this.generateInfrastructure(projectDir);

    // Generate documentation
    await this.generateDocumentation(projectDir);

    // Initialize git repository
    await this.initializeGit(projectDir);
  }

  private async createProjectStructure(projectDir: string): Promise<void> {
    const dirs = [
      'services',
      'shared',
      'shared/types',
      'shared/utils',
      'shared/config',
      'infrastructure',
      'infrastructure/docker',
      'docs',
      '.vscode',
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectDir, dir));
    }
  }

  private async generateRootFiles(projectDir: string): Promise<void> {
    // Package.json
    const packageJson = {
      name: this.config.project.name,
      version: '0.1.0',
      private: true,
      description: this.config.project.description || 'A modern SaaS platform',
      author: this.config.project.author || '',
      license: 'MIT',
      engines: {
        node: '>=20.0.0',
        [this.config.project.packageManager]: this.getPackageManagerVersion(),
      },
      scripts: this.getRootScripts(),
      devDependencies: {
        '@types/node': '^20.10.0',
        'typescript': '^5.3.3',
        'tsx': '^4.7.0',
        'rimraf': '^5.0.5',
        'concurrently': '^8.2.2',
        'dotenv': '^16.3.1',
        'husky': '^9.0.11',
        '@commitlint/cli': '^18.4.3',
        '@commitlint/config-conventional': '^18.4.3',
        'prettier': '^3.1.1',
        'eslint': '^9.39.0',
        '@typescript-eslint/eslint-plugin': '^8.27.0',
        '@typescript-eslint/parser': '^8.27.0',
      },
    };

    await fs.writeJSON(
      path.join(projectDir, 'package.json'),
      packageJson,
      { spaces: 2 }
    );

    // pnpm-workspace.yaml (for pnpm monorepos)
    if (this.config.project.packageManager === 'pnpm') {
      const workspaceYaml = `packages:
  - 'services/*'
  - 'shared'
`;
      await fs.writeFile(
        path.join(projectDir, 'pnpm-workspace.yaml'),
        workspaceYaml
      );
    }

    // TypeScript configuration
    const tsConfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        lib: ['ES2022'],
        moduleResolution: 'NodeNext',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: './dist',
        rootDir: '.',
        resolveJsonModule: true,
        isolatedModules: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
      include: ['services/**/*', 'shared/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
    };

    await fs.writeJSON(
      path.join(projectDir, 'tsconfig.json'),
      tsConfig,
      { spaces: 2 }
    );

    // .gitignore
    const gitignore = `# Dependencies
node_modules
.pnp
.pnp.js

# Production
dist
build

# Environment
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# OS
.DS_Store
*.swp
*.swo
*~

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/settings.json
.idea
*.iml
.fleet

# Testing
coverage
.nyc_output

# Docker
docker-compose.override.yml
.docker

# Temporary files
tmp
temp
.tmp
`;

    await fs.writeFile(path.join(projectDir, '.gitignore'), gitignore);

    // .env.example
    const envExample = `# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${this.config.project.name}

# Redis
REDIS_URL=redis://localhost:6379

# NATS
NATS_URL=nats://localhost:4222

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# API
API_PORT=3000
API_HOST=0.0.0.0

# Logging
LOG_LEVEL=${this.config.observability.logging.level}

# Multi-tenancy
ENABLE_MULTI_TENANCY=${this.config.infrastructure.database.multiTenancy?.enabled ? 'true' : 'false'}
`;

    await fs.writeFile(path.join(projectDir, '.env.example'), envExample);

    // README.md
    const readme = `# ${this.config.project.name}

${this.config.project.description || 'A modern SaaS platform built with Fastify microservices'}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
${this.getInstallCommand()}

# Start infrastructure (Docker required)
docker-compose up -d

# Start all services in development mode
${this.getDevCommand()}
\`\`\`

## 📦 Architecture

This project uses a microservices architecture with the following services:

${this.config.services.map(s => `- **${s.name}** (Port ${s.port}): ${s.description || 'Service'}`).join('\n')}

## 🛠️ Technology Stack

- **Framework**: Fastify ${this.config.framework.version}
- **Database**: ${this.config.infrastructure.database.type === 'postgresql' ? 'PostgreSQL' : 'SQLite + LiteFS'}
- **Cache**: Redis
- **Message Queue**: NATS
- **Logging**: Pino
- **Observability**: ${this.config.observability.tracing.enabled ? 'OpenTelemetry' : 'Basic health checks'}

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🧪 Testing

\`\`\`bash
# Run unit tests
${this.getTestCommand()}

# Run integration tests
${this.getTestCommand()} integration

# Run with coverage
${this.getTestCommand()} --coverage
\`\`\`

## 📝 License

MIT
`;

    await fs.writeFile(path.join(projectDir, 'README.md'), readme);

    // VS Code settings
    const vscodeSettings = {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true,
      },
      'typescript.tsdk': 'node_modules/typescript/lib',
      'typescript.enablePromptUseWorkspaceTsdk': true,
    };

    await fs.writeJSON(
      path.join(projectDir, '.vscode/settings.json'),
      vscodeSettings,
      { spaces: 2 }
    );
  }

  private async generateServices(projectDir: string): Promise<void> {
    for (const service of this.config.services) {
      await this.generateService(projectDir, service);
    }
  }

  private async generateService(projectDir: string, service: Service): Promise<void> {
    const serviceDir = path.join(projectDir, 'services', service.name);
    await fs.ensureDir(serviceDir);

    // Create service directory structure
    const serviceDirs = [
      'src',
      'src/plugins',
      'src/routes',
      'src/services',
      'src/schemas',
      'src/utils',
      'src/config',
      'test',
      'test/unit',
      'test/integration',
    ];

    for (const dir of serviceDirs) {
      await fs.ensureDir(path.join(serviceDir, dir));
    }

    // Template context
    const context = {
      project: this.config.project,
      service,
      infrastructure: this.config.infrastructure,
      observability: this.config.observability,
    };

    // Generate swagger config
    await this.renderer.renderToFile(
      'base-service/src/config/swagger.config.ts.hbs',
      path.join(serviceDir, 'src/config/swagger.config.ts'),
      context
    );

    // Generate package.json using template
    await this.renderer.renderToFile(
      'base-service/package.json.hbs',
      path.join(serviceDir, 'package.json'),
      context
    );

    // Generate app.ts using template
    await this.renderer.renderToFile(
      'base-service/src/app.ts.hbs',
      path.join(serviceDir, 'src/app.ts'),
      context
    );

    // Generate index.ts using template
    await this.renderer.renderToFile(
      'base-service/src/index.ts.hbs',
      path.join(serviceDir, 'src/index.ts'),
      context
    );

    // Generate plugins
    if (service.features.database) {
      await this.renderer.renderToFile(
        'base-service/src/plugins/database.ts.hbs',
        path.join(serviceDir, 'src/plugins/database.ts'),
        context
      );
    }
    if (service.features.cache) {
      await this.renderer.renderToFile(
        'base-service/src/plugins/redis.ts.hbs',
        path.join(serviceDir, 'src/plugins/redis.ts'),
        context
      );
    }
    if (service.features.messageQueue) {
      await this.renderer.renderToFile(
        'base-service/src/plugins/nats.ts.hbs',
        path.join(serviceDir, 'src/plugins/nats.ts'),
        context
      );
    }
    if (service.features.authentication || service.features.jwt) {
      await this.renderer.renderToFile(
        'base-service/src/plugins/auth.ts.hbs',
        path.join(serviceDir, 'src/plugins/auth.ts'),
        context
      );
    }

    // Generate health check routes
    if (service.features.healthChecks) {
      await this.renderer.renderToFile(
        'base-service/src/routes/health.ts.hbs',
        path.join(serviceDir, 'src/routes/health.ts'),
        context
      );
    }

    // Generate TypeScript config using template
    await this.renderer.renderToFile(
      'base-service/tsconfig.json.hbs',
      path.join(serviceDir, 'tsconfig.json'),
      context
    );
  }

  // Legacy method - kept for backwards compatibility but now uses templates
  private async generateServiceLegacy(projectDir: string, service: Service): Promise<void> {
    const serviceDir = path.join(projectDir, 'services', service.name);
    await fs.ensureDir(serviceDir);

    // Create service directory structure
    const serviceDirs = [
      'src',
      'src/plugins',
      'src/routes',
      'src/services',
      'src/schemas',
      'src/utils',
      'test',
      'test/unit',
      'test/integration',
    ];

    for (const dir of serviceDirs) {
      await fs.ensureDir(path.join(serviceDir, dir));
    }

    // Generate package.json for service (LEGACY - now using templates)
    const packageJson = {
      name: `@${this.config.project.name}/${service.name}`,
      version: '0.1.0',
      private: true,
      type: 'module',
      description: service.description || `${service.name} service`,
      main: './dist/index.js',
      scripts: {
        dev: 'tsx watch src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
      },
      dependencies: {
        'fastify': '^4.24.0',
        'fastify-plugin': '^5.0.1',
        '@fastify/type-provider-typebox': '^4.0.0',
        '@sinclair/typebox': '^0.32.5',
        '@fastify/cors': '^8.5.0',
        '@fastify/helmet': '^11.1.1',
        '@fastify/rate-limit': '^9.1.0',
        '@fastify/compress': '^6.5.0',
        '@fastify/env': '^4.3.0',
        '@fastify/swagger': '^8.13.0',
        '@fastify/swagger-ui': '^2.1.0',
        'pino': '^8.17.2',
        'pino-pretty': '^10.3.1',
        ...(service.features.database ? {
          'knex': '^3.1.0',
          'pg': this.config.infrastructure.database.type === 'postgresql' ? '^8.11.3' : undefined,
          'better-sqlite3': this.config.infrastructure.database.type === 'sqlite' ? '^9.2.2' : undefined,
        } : {}),
        ...(service.features.cache ? {
          'ioredis': '^5.3.2',
        } : {}),
        ...(service.features.messageQueue ? {
          'nats': '^2.19.0',
        } : {}),
        ...(service.features.jwt ? {
          '@fastify/jwt': '^8.0.0',
          'bcrypt': '^5.1.1',
        } : {}),
      },
      devDependencies: {
        '@types/node': '^20.10.0',
        '@types/bcrypt': service.features.jwt ? '^6.0.0' : undefined,
        'typescript': '^5.3.3',
        'tsx': '^4.7.0',
        'jest': '^29.7.0',
        '@types/jest': '^29.5.11',
        'supertest': '^7.1.4',
        '@types/supertest': '^6.0.3',
      },
    };

    // Clean up undefined values
    Object.keys(packageJson.dependencies).forEach(key => {
      if ((packageJson.dependencies as any)[key] === undefined) {
        delete (packageJson.dependencies as any)[key];
      }
    });

    Object.keys(packageJson.devDependencies).forEach(key => {
      if ((packageJson.devDependencies as any)[key] === undefined) {
        delete (packageJson.devDependencies as any)[key];
      }
    });

    await fs.writeJSON(
      path.join(serviceDir, 'package.json'),
      packageJson,
      { spaces: 2 }
    );

    // Generate main app file
    await this.generateAppFile(serviceDir, service);

    // Generate index file
    await this.generateIndexFile(serviceDir, service);

    // Generate plugins
    if (service.features.database) {
      await this.generateDatabasePlugin(serviceDir, service);
    }
    if (service.features.cache) {
      await this.generateRedisPlugin(serviceDir, service);
    }
    if (service.features.messageQueue) {
      await this.generateNatsPlugin(serviceDir, service);
    }
    if (service.features.authentication || service.features.jwt) {
      await this.generateAuthPlugin(serviceDir, service);
    }

    // Generate health check routes
    if (service.features.healthChecks) {
      await this.generateHealthRoutes(serviceDir, service);
    }

    // Generate TypeScript config for service
    const tsConfig = {
      extends: '../../tsconfig.json',
      compilerOptions: {
        rootDir: './src',
        outDir: './dist',
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'test'],
    };

    await fs.writeJSON(
      path.join(serviceDir, 'tsconfig.json'),
      tsConfig,
      { spaces: 2 }
    );
  }

  private async generateAppFile(serviceDir: string, service: Service): Promise<void> {
    const appContent = `import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
${service.features.cors ? "import cors from '@fastify/cors';" : ''}
${service.features.rateLimit ? "import rateLimit from '@fastify/rate-limit';" : ''}
${service.features.compression ? "import compress from '@fastify/compress';" : ''}
${service.features.healthChecks ? "import { healthRoutes } from './routes/health.js';" : ''}
${service.features.database ? "import { databasePlugin } from './plugins/database.js';" : ''}
${service.features.cache ? "import { redisPlugin } from './plugins/redis.js';" : ''}
${service.features.messageQueue ? "import { natsPlugin } from './plugins/nats.js';" : ''}
${service.features.authentication || service.features.jwt ? "import { authPlugin } from './plugins/auth.js';" : ''}

export async function buildApp(opts = {}) {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
    ...opts,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  ${service.features.cors ? `await app.register(cors, {
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });` : ''}

  ${service.features.rateLimit ? `await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });` : ''}

  ${service.features.compression ? 'await app.register(compress);' : ''}

  ${service.features.database ? 'await app.register(databasePlugin);' : ''}
  ${service.features.cache ? 'await app.register(redisPlugin);' : ''}
  ${service.features.messageQueue ? 'await app.register(natsPlugin);' : ''}
  ${service.features.authentication || service.features.jwt ? 'await app.register(authPlugin);' : ''}

  // Register routes
  ${service.features.healthChecks ? 'await app.register(healthRoutes);' : ''}

  // Default route
  app.get('/', async (request, reply) => {
    return { 
      service: '${service.name}',
      version: '0.1.0',
      status: 'running' 
    };
  });

  return app;
}
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/app.ts'),
      appContent
    );
  }

  private async generateIndexFile(serviceDir: string, service: Service): Promise<void> {
    const indexContent = `import { buildApp } from './app.js';

const start = async () => {
  try {
    const app = await buildApp();
    
    const port = parseInt(process.env.PORT || '${service.port}', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    console.log(\`${service.name} running on http://\${host}:\${port}\`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/index.ts'),
      indexContent
    );
  }

  private async generateDatabasePlugin(serviceDir: string, service: Service): Promise<void> {
    const dbType = this.config.infrastructure.database.type;
    const pluginContent = `import fp from 'fastify-plugin';
import knex, { Knex } from 'knex';

declare module 'fastify' {
  interface FastifyInstance {
    db: Knex;
  }
}

async function databasePlugin(fastify: any) {
  const config: Knex.Config = {
    client: '${dbType === 'postgresql' ? 'pg' : 'better-sqlite3'}',
    connection: ${dbType === 'postgresql' 
      ? `process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || '${service.name.replace(/-/g, '_')}',
    }`
      : `process.env.DATABASE_URL || './data/${service.name}.db'`
    },
    ${dbType === 'sqlite' ? `useNullAsDefault: true,` : ''}
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
  };

  const db = knex(config);

  // Test connection
  try {
    await db.raw('SELECT 1');
    fastify.log.info('Database connected successfully');
  } catch (error) {
    fastify.log.error('Database connection failed:', error);
    throw error;
  }

  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await db.destroy();
  });
}

export default fp(databasePlugin, {
  name: 'database',
});

export { databasePlugin };
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/plugins/database.ts'),
      pluginContent
    );
  }

  private async generateRedisPlugin(serviceDir: string, service: Service): Promise<void> {
    const pluginContent = `import fp from 'fastify-plugin';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

async function redisPlugin(fastify: any) {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('connect', () => {
    fastify.log.info('Redis connected successfully');
  });

  redis.on('error', (error) => {
    fastify.log.error('Redis connection error:', error);
  });

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
}

export default fp(redisPlugin, {
  name: 'redis',
});

export { redisPlugin };
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/plugins/redis.ts'),
      pluginContent
    );
  }

  private async generateNatsPlugin(serviceDir: string, service: Service): Promise<void> {
    const pluginContent = `import fp from 'fastify-plugin';
import { connect, NatsConnection, StringCodec } from 'nats';

declare module 'fastify' {
  interface FastifyInstance {
    nats: NatsConnection;
    natsCodec: StringCodec;
  }
}

async function natsPlugin(fastify: any) {
  try {
    const nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
      name: '${service.name}',
    });

    const sc = StringCodec();

    fastify.log.info('NATS connected successfully');

    fastify.decorate('nats', nc);
    fastify.decorate('natsCodec', sc);

    fastify.addHook('onClose', async () => {
      await nc.drain();
      await nc.close();
    });
  } catch (error) {
    fastify.log.error('NATS connection failed:', error);
    throw error;
  }
}

export default fp(natsPlugin, {
  name: 'nats',
});

export { natsPlugin };
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/plugins/nats.ts'),
      pluginContent
    );
  }

  private async generateAuthPlugin(serviceDir: string, service: Service): Promise<void> {
    const pluginContent = `import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      tenantId?: string;
    };
  }
}

async function authPlugin(fastify: any) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  });

  fastify.decorate('authenticate', async function(request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fp(authPlugin, {
  name: 'auth',
});

export { authPlugin };
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/plugins/auth.ts'),
      pluginContent
    );
  }

  private async generateHealthRoutes(serviceDir: string, service: Service): Promise<void> {
    const routeContent = `import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'healthy',
      service: '${service.name}',
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/ready', async (request, reply) => {
    const checks: Record<string, boolean> = {};
    
    ${service.features.database ? `// Check database
    try {
      await fastify.db.raw('SELECT 1');
      checks.database = true;
    } catch (error) {
      checks.database = false;
    }` : ''}
    
    ${service.features.cache ? `// Check Redis
    try {
      await fastify.redis.ping();
      checks.redis = true;
    } catch (error) {
      checks.redis = false;
    }` : ''}
    
    ${service.features.messageQueue ? `// Check NATS
    try {
      checks.nats = fastify.nats.isClosed() === false;
    } catch (error) {
      checks.nats = false;
    }` : ''}

    const allHealthy = Object.values(checks).every(v => v === true);
    const status = allHealthy ? 'ready' : 'not ready';
    
    reply.code(allHealthy ? 200 : 503);
    return {
      status,
      checks,
      service: '${service.name}',
      timestamp: new Date().toISOString(),
    };
  });
};
`;

    await fs.writeFile(
      path.join(serviceDir, 'src/routes/health.ts'),
      routeContent
    );
  }

  private async generateShared(projectDir: string): Promise<void> {
    // Shared package.json
    const packageJson = {
      name: `@${this.config.project.name}/shared`,
      version: '0.1.0',
      private: true,
      type: 'module',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
      },
      devDependencies: {
        '@types/node': '^20.10.0',
        'typescript': '^5.3.3',
      },
    };

    await fs.writeJSON(
      path.join(projectDir, 'shared/package.json'),
      packageJson,
      { spaces: 2 }
    );

    // Shared TypeScript config
    const tsConfig = {
      extends: '../tsconfig.json',
      compilerOptions: {
        rootDir: '.',
        outDir: './dist',
        composite: true,
        declaration: true,
        declarationMap: true,
      },
      include: ['**/*.ts'],
      exclude: ['node_modules', 'dist'],
    };

    await fs.writeJSON(
      path.join(projectDir, 'shared/tsconfig.json'),
      tsConfig,
      { spaces: 2 }
    );

    // Shared types
    const typesContent = `// Common types shared across services

export interface User {
  id: string;
  email: string;
  name?: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: string;
  checks?: Record<string, boolean>;
}
`;

    await fs.writeFile(
      path.join(projectDir, 'shared/types/index.ts'),
      typesContent
    );

    // Shared utilities
    const utilsContent = `// Common utilities shared across services

export function parseEnvInt(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function parseEnvBool(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
`;

    await fs.writeFile(
      path.join(projectDir, 'shared/utils/index.ts'),
      utilsContent
    );

    // Shared config
    const configContent = `// Common configuration utilities

export interface CommonConfig {
  environment: 'development' | 'production' | 'test';
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  port: number;
  host: string;
}

export function loadCommonConfig(): CommonConfig {
  return {
    environment: (process.env.NODE_ENV || 'development') as CommonConfig['environment'],
    logLevel: (process.env.LOG_LEVEL || 'info') as CommonConfig['logLevel'],
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  };
}

export const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2',
} as const;

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH001',
  AUTH_TOKEN_EXPIRED: 'AUTH002',
  AUTH_TOKEN_INVALID: 'AUTH003',
  AUTH_UNAUTHORIZED: 'AUTH004',
  
  // Validation
  VALIDATION_FAILED: 'VAL001',
  INVALID_INPUT: 'VAL002',
  
  // Database
  DB_CONNECTION_ERROR: 'DB001',
  DB_QUERY_ERROR: 'DB002',
  
  // General
  INTERNAL_SERVER_ERROR: 'ERR001',
  NOT_FOUND: 'ERR002',
  BAD_REQUEST: 'ERR003',
} as const;
`;

    await fs.writeFile(
      path.join(projectDir, 'shared/config/index.ts'),
      configContent
    );

    // Index file for shared
    const indexContent = `export * from './types/index.js';
export * from './utils/index.js';
export * from './config/index.js';
`;

    await fs.writeFile(
      path.join(projectDir, 'shared/index.ts'),
      indexContent
    );
  }

  private async generateInfrastructure(projectDir: string): Promise<void> {
    // Docker Compose file
    const dockerCompose = {
      version: '3.8',
      services: {
        ...(this.config.infrastructure.database.type === 'postgresql' ? {
          postgres: {
            image: `postgres:${this.config.infrastructure.database.version || '16-alpine'}`,
            environment: {
              POSTGRES_USER: 'postgres',
              POSTGRES_PASSWORD: 'postgres',
              POSTGRES_DB: this.config.project.name.replace(/-/g, '_'),
            },
            ports: ['5432:5432'],
            volumes: [
              './infrastructure/docker/postgres-data:/var/lib/postgresql/data',
              './infrastructure/init.sql:/docker-entrypoint-initdb.d/init.sql:ro',
            ],
            healthcheck: {
              test: ['CMD-SHELL', 'pg_isready -U postgres'],
              interval: '10s',
              timeout: '5s',
              retries: 5,
            },
          },
        } : {}),
        redis: {
          image: `redis:${this.config.infrastructure.cache.version || '7-alpine'}`,
          ports: ['6379:6379'],
          volumes: [
            './infrastructure/docker/redis-data:/data',
          ],
          healthcheck: {
            test: ['CMD', 'redis-cli', 'ping'],
            interval: '10s',
            timeout: '5s',
            retries: 5,
          },
        },
        nats: {
          image: `nats:${this.config.infrastructure.messageQueue.version || '2.10-alpine'}`,
          ports: [
            '4222:4222',
            '8222:8222',
          ],
          command: '--http_port 8222',
          healthcheck: {
            test: ['CMD', 'nc', '-z', 'localhost', '4222'],
            interval: '10s',
            timeout: '5s',
            retries: 5,
          },
        },
      },
      networks: {
        default: {
          name: `${this.config.project.name}-network`,
        },
      },
      volumes: {
        'postgres-data': {},
        'redis-data': {},
      },
    };

    await fs.writeFile(
      path.join(projectDir, 'docker-compose.yml'),
      `# Docker Compose configuration for ${this.config.project.name}
# Generated by SaaSaaS CLI

${yaml.stringify(dockerCompose)}`
    );

    // PostgreSQL initialization script
    if (this.config.infrastructure.database.type === 'postgresql') {
      const initSql = `-- Initialization script for PostgreSQL
-- Creates databases for each service that needs one

${this.config.services
  .filter(s => s.features.database)
  .map(s => `CREATE DATABASE ${s.name.replace(/-/g, '_')};`)
  .join('\n')}

-- Create extensions
\\c ${this.config.services.find(s => s.features.database)?.name.replace(/-/g, '_') || this.config.project.name.replace(/-/g, '_')}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
${this.config.infrastructure.database.multiTenancy?.enabled ? 'CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";' : ''}
`;

      await fs.writeFile(
        path.join(projectDir, 'infrastructure/init.sql'),
        initSql
      );
    }

    // Development environment setup script
    const setupScript = `#!/bin/bash

echo "🚀 Setting up development environment for ${this.config.project.name}"

# Check for required tools
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v ${this.config.project.packageManager} >/dev/null 2>&1 || { echo "${this.config.project.packageManager} is required but not installed. Aborting." >&2; exit 1; }

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file from .env.example"
fi

# Install dependencies
echo "📦 Installing dependencies..."
${this.getInstallCommand()}

# Start infrastructure
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run database migrations (if applicable)
${this.config.services.some(s => s.features.database) ? `
echo "🗄️  Running database migrations..."
# Add migration commands here
` : ''}

echo "✨ Development environment setup complete!"
echo ""
echo "Run '${this.getDevCommand()}' to start all services"
`;

    await fs.writeFile(
      path.join(projectDir, 'infrastructure/setup.sh'),
      setupScript
    );

    // Make setup script executable
    await fs.chmod(path.join(projectDir, 'infrastructure/setup.sh'), 0o755);
  }

  private async generateDocumentation(projectDir: string): Promise<void> {
    // Architecture documentation
    const architectureDoc = `# Architecture Overview

## System Architecture

${this.config.project.name} is built using a microservices architecture with the following components:

### Services

${this.config.services.map(s => `#### ${s.name}
- **Port**: ${s.port}
- **Type**: ${s.type || 'standard'}
- **Description**: ${s.description || 'Service'}
- **Features**: ${Object.entries(s.features).filter(([_, v]) => v).map(([k]) => k).join(', ')}
`).join('\n')}

### Infrastructure Components

- **Database**: ${this.config.infrastructure.database.type}
  ${this.config.infrastructure.database.multiTenancy?.enabled ? '- Multi-tenancy: ' + this.config.infrastructure.database.multiTenancy.model : ''}
- **Cache**: ${this.config.infrastructure.cache.type}
- **Message Queue**: ${this.config.infrastructure.messageQueue.type}

## Communication Patterns

### Synchronous Communication
Services communicate via REST APIs using HTTP/HTTPS protocols.

### Asynchronous Communication
Event-driven communication using NATS for decoupled, scalable messaging.

## Data Management

### Database Strategy
${this.config.infrastructure.database.strategy === 'separate' 
  ? 'Each service maintains its own database (Database per Service pattern).'
  : 'Services share a common database with logical separation.'}

${this.config.infrastructure.database.multiTenancy?.enabled ? `
### Multi-Tenancy
Implemented using ${this.config.infrastructure.database.multiTenancy.model} approach.
` : ''}

## Security

- JWT-based authentication
- Rate limiting on API Gateway
- CORS configuration
- Environment-based secrets management

## Observability

- **Logging**: Structured logging with ${this.config.observability.logging.provider}
- **Health Checks**: Each service exposes /health and /ready endpoints
${this.config.observability.tracing.enabled ? '- **Tracing**: Distributed tracing with OpenTelemetry' : ''}
${this.config.observability.metrics?.enabled ? '- **Metrics**: Prometheus metrics collection' : ''}

## Deployment

Target: ${this.config.deployment.target}

### Docker Compose (Development)
All services and infrastructure components are containerized and orchestrated using Docker Compose.

### Production Deployment
${this.config.deployment.target === 'kubernetes' 
  ? 'Kubernetes manifests for production deployment with horizontal scaling capabilities.'
  : 'Docker Compose can be used for small production deployments with proper configuration.'}
`;

    await fs.writeFile(
      path.join(projectDir, 'docs/architecture.md'),
      architectureDoc
    );

    // Development guide
    const developmentDoc = `# Development Guide

## Prerequisites

- Node.js >= 20.0.0
- ${this.config.project.packageManager} package manager
- Docker and Docker Compose
- Git

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ${this.config.project.name}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   ${this.getInstallCommand()}
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Start infrastructure services**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

5. **Run services in development mode**
   \`\`\`bash
   ${this.getDevCommand()}
   \`\`\`

## Project Structure

\`\`\`
${this.config.project.name}/
├── services/           # Microservices
│   ├── ${this.config.services[0]?.name}/
│   └── ...
├── shared/            # Shared code and types
├── infrastructure/    # Docker and deployment configs
├── docs/             # Documentation
└── package.json      # Root package.json
\`\`\`

## Development Workflow

### Adding a New Service

1. Create service directory: \`services/new-service\`
2. Initialize package.json
3. Implement Fastify application
4. Add to docker-compose.yml if needed
5. Update documentation

### Running Tests

\`\`\`bash
# Run all tests
${this.getTestCommand()}

# Run tests for specific service
${this.getTestCommand()} --scope=@${this.config.project.name}/service-name

# Run with coverage
${this.getTestCommand()} --coverage
\`\`\`

### Code Style

- TypeScript with strict mode
- ESLint for linting
- Prettier for formatting
- Husky for git hooks

### Database Migrations

${this.config.infrastructure.database.type === 'postgresql' ? `
\`\`\`bash
# Create a new migration
cd services/[service-name]
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest

# Rollback migrations
npx knex migrate:rollback
\`\`\`
` : 'SQLite migrations are handled automatically on service startup.'}

## Debugging

### Logging

All services use structured logging with Pino. Log levels can be configured via \`LOG_LEVEL\` environment variable.

### Health Checks

Each service exposes:
- \`/health\` - Basic health status
- \`/ready\` - Readiness probe with dependency checks

### Common Issues

1. **Port already in use**: Check if services are already running
2. **Database connection failed**: Ensure Docker containers are running
3. **Redis connection failed**: Check Redis container status
4. **NATS connection failed**: Verify NATS container is healthy

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## Resources

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Docker Documentation](https://docs.docker.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
`;

    await fs.writeFile(
      path.join(projectDir, 'docs/development.md'),
      developmentDoc
    );

    // API documentation placeholder
    const apiDoc = `# API Documentation

## Overview

Base URL: \`http://localhost:3000\` (API Gateway)

All API endpoints are versioned and follow RESTful conventions.

## Authentication

JWT-based authentication is required for most endpoints.

### Getting a Token

\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Using the Token

Include the token in the Authorization header:

\`\`\`http
Authorization: Bearer <token>
\`\`\`

## Services

${this.config.services.map(s => `### ${s.name}

Base URL: \`http://localhost:${s.port}\`

#### Health Check

\`\`\`http
GET /health
\`\`\`

Response:
\`\`\`json
{
  "status": "healthy",
  "service": "${s.name}",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`
`).join('\n')}

## Error Responses

All errors follow a consistent format:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
\`\`\`

## Rate Limiting

API Gateway implements rate limiting:
- 100 requests per minute per IP address
- Custom limits for authenticated users

## OpenAPI/Swagger

When services are running, visit:
- API Gateway: http://localhost:3000/documentation
- Individual services: http://localhost:[port]/documentation
`;

    await fs.writeFile(
      path.join(projectDir, 'docs/api.md'),
      apiDoc
    );

    // Deployment guide
    const deploymentDoc = `# Deployment Guide

## Deployment Targets

### Docker Compose (Small/Medium Deployments)

1. **Prepare production environment**
   \`\`\`bash
   # Create production .env file
   cp .env.example .env.production
   # Update with production values
   \`\`\`

2. **Build services**
   \`\`\`bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   \`\`\`

3. **Deploy**
   \`\`\`bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   \`\`\`

### Kubernetes (Large/Enterprise Deployments)

1. **Build and push images**
   \`\`\`bash
   docker build -t registry.example.com/${this.config.project.name}/service-name:tag .
   docker push registry.example.com/${this.config.project.name}/service-name:tag
   \`\`\`

2. **Apply Kubernetes manifests**
   \`\`\`bash
   kubectl apply -f k8s/
   \`\`\`

3. **Verify deployment**
   \`\`\`bash
   kubectl get pods -n ${this.config.project.name}
   \`\`\`

## Environment Configuration

### Required Environment Variables

- \`NODE_ENV\`: production
- \`DATABASE_URL\`: Production database connection string
- \`REDIS_URL\`: Production Redis connection string
- \`NATS_URL\`: Production NATS connection string
- \`JWT_SECRET\`: Strong secret key for JWT signing

### Optional Configuration

- \`LOG_LEVEL\`: Logging verbosity (default: info)
- \`CORS_ORIGIN\`: Allowed CORS origins
- \`RATE_LIMIT_MAX\`: Maximum requests per window

## Monitoring

### Health Checks

Configure your monitoring system to check:
- \`/health\` endpoints for basic availability
- \`/ready\` endpoints for service readiness

### Logging

Configure log aggregation to collect logs from all services.

### Metrics

${this.config.observability.metrics?.enabled 
  ? 'Prometheus metrics available at `/metrics` endpoint on each service.'
  : 'Enable metrics collection by setting up Prometheus integration.'}

## Security Checklist

- [ ] Update all default passwords
- [ ] Configure firewall rules
- [ ] Enable HTTPS/TLS
- [ ] Rotate JWT secrets
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up backup procedures
- [ ] Configure monitoring alerts

## Scaling

### Horizontal Scaling

Services can be scaled horizontally:
\`\`\`bash
# Docker Compose
docker-compose up -d --scale service-name=3

# Kubernetes
kubectl scale deployment service-name --replicas=3
\`\`\`

### Database Scaling

${this.config.infrastructure.database.type === 'postgresql' 
  ? '- Configure read replicas for read-heavy workloads\n- Implement connection pooling\n- Consider partitioning for large tables'
  : '- Use LiteFS for distributed SQLite\n- Configure read replicas'}

## Backup and Recovery

### Database Backups

\`\`\`bash
# PostgreSQL backup
pg_dump -h localhost -U postgres database_name > backup.sql

# Restore
psql -h localhost -U postgres database_name < backup.sql
\`\`\`

### Redis Backups

Redis persistence is configured via RDB snapshots and AOF logs.

## Troubleshooting

### Common Deployment Issues

1. **Service fails to start**: Check logs with \`docker logs service-name\`
2. **Database connection issues**: Verify network connectivity and credentials
3. **High memory usage**: Review container resource limits
4. **Slow performance**: Check database indexes and query optimization

### Rollback Procedures

1. **Docker Compose**
   \`\`\`bash
   docker-compose down
   # Restore previous images
   docker-compose up -d
   \`\`\`

2. **Kubernetes**
   \`\`\`bash
   kubectl rollout undo deployment/service-name
   \`\`\`
`;

    await fs.writeFile(
      path.join(projectDir, 'docs/deployment.md'),
      deploymentDoc
    );
  }

  private async initializeGit(projectDir: string): Promise<void> {
    const spinner = ora('Initializing Git repository...').start();
    
    try {
      // Check if git is available
      spinner.text = 'Checking for git...';
      try {
        const gitVersion = await execaCommand('git --version', { cwd: projectDir, timeout: 5000 });
        spinner.text = `Found ${gitVersion.stdout.trim()}`;
      } catch (error) {
        spinner.info('Git not found, skipping repository initialization');
        return;
      }

      // Initialize git repo
      spinner.text = 'Running git init...';
      const initResult = await execaCommand('git init', { cwd: projectDir, timeout: 5000 });
      console.log(chalk.gray(`  ${initResult.stdout}`));
      
      // Configure git to skip hooks
      spinner.text = 'Configuring git (disabling hooks)...';
      try {
        await execaCommand('git config core.hooksPath /dev/null', { cwd: projectDir, timeout: 5000 });
        console.log(chalk.gray('  Hooks disabled'));
      } catch (e) {
        console.log(chalk.gray('  Could not disable hooks (continuing anyway)'));
      }
      
      // Stage files
      spinner.text = 'Staging files (git add .)...';
      const addStart = Date.now();
      try {
        await execaCommand('git add .', { cwd: projectDir, timeout: 10000 });
        console.log(chalk.gray(`  Staged in ${Date.now() - addStart}ms`));
      } catch (error) {
        spinner.fail('Failed to stage files');
        if (error instanceof Error) {
          console.log(chalk.red(`  Error: ${error.message}`));
        }
        return;
      }
      
      // Make initial commit
      spinner.text = 'Creating initial commit...';
      const commitStart = Date.now();
      try {
        const commitResult = await execaCommand(
          'git commit -m "Initial commit: Project scaffolded by SaaSquatch CLI" --no-verify --no-gpg-sign', 
          { 
            cwd: projectDir,
            timeout: 15000,
            env: {
              ...process.env,
              GIT_AUTHOR_NAME: 'SaaSquatch CLI',
              GIT_AUTHOR_EMAIL: 'cli@saasquatch.dev',
              GIT_COMMITTER_NAME: 'SaaSquatch CLI',
              GIT_COMMITTER_EMAIL: 'cli@saasquatch.dev',
              GIT_TERMINAL_PROMPT: '0', // Disable terminal prompts
            }
          }
        );
        console.log(chalk.gray(`  Committed in ${Date.now() - commitStart}ms`));
        console.log(chalk.gray(`  ${commitResult.stdout}`));
        spinner.succeed('Git repository initialized');
      } catch (error) {
        spinner.fail('Failed to create initial commit');
        if (error instanceof Error) {
          console.log(chalk.red(`  Error: ${error.message}`));
          console.log(chalk.gray(`  Timeout after ${Date.now() - commitStart}ms`));
        }
      }
    } catch (error) {
      spinner.fail('Git initialization failed');
      console.log(chalk.yellow('  ⚠️  Continuing without git repository'));
      if (error instanceof Error) {
        console.log(chalk.gray(`  ${error.message}`));
      }
    }
  }

  // Helper methods
  private getRootScripts(): Record<string, string> {
    const pm = this.config.project.packageManager;
    const runner = pm === 'npm' ? 'npm run' : pm;
    
    return {
      'dev': 'concurrently "npm:dev:*"',
      'dev:services': `concurrently ${this.config.services.map(s => `"cd services/${s.name} && ${runner} dev"`).join(' ')}`,
      'build': `${runner} ${pm === 'npm' ? '--' : '-r'} build`,
      'test': `${runner} ${pm === 'npm' ? '--' : '-r'} test`,
      'lint': `${runner} ${pm === 'npm' ? '--' : '-r'} lint`,
      'clean': 'rimraf node_modules services/*/node_modules shared/node_modules',
      'docker:up': 'docker-compose up -d',
      'docker:down': 'docker-compose down',
      'docker:logs': 'docker-compose logs -f',
      'setup': 'sh infrastructure/setup.sh',
    };
  }

  private getInstallCommand(): string {
    switch (this.config.project.packageManager) {
      case 'yarn':
        return 'yarn install';
      case 'pnpm':
        return 'pnpm install';
      default:
        return 'npm install';
    }
  }

  private getDevCommand(): string {
    switch (this.config.project.packageManager) {
      case 'yarn':
        return 'yarn dev';
      case 'pnpm':
        return 'pnpm dev';
      default:
        return 'npm run dev';
    }
  }

  private getTestCommand(type = ''): string {
    const base = this.config.project.packageManager === 'npm' 
      ? 'npm run test' 
      : `${this.config.project.packageManager} test`;
    
    return type ? `${base} ${type}` : base;
  }

  private getPackageManagerVersion(): string {
    switch (this.config.project.packageManager) {
      case 'yarn':
        return '>=1.22.0';
      case 'pnpm':
        return '>=8.0.0';
      default:
        return '>=10.0.0';
    }
  }
}