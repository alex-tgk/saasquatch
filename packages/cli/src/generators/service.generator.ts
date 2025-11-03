import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import chalk from 'chalk';
import ora from 'ora';

interface ServiceConfig {
  name: string;
  port: number;
  features: {
    database?: boolean;
    cache?: boolean;
    messageQueue?: boolean;
    jwt?: boolean;
    healthChecks?: boolean;
    cors?: boolean;
    rateLimit?: boolean;
    compression?: boolean;
  };
}

interface ProjectConfig {
  version: string;
  project: {
    name: string;
    description: string;
    packageManager: string;
  };
  infrastructure: {
    database: {
      type: 'postgresql' | 'sqlite';
      multiTenancy: boolean;
    };
    cache: {
      type: 'redis';
    };
    messageQueue: {
      type: 'nats';
    };
  };
  services: ServiceConfig[];
}

export class ServiceGenerator {
  private config: ProjectConfig;
  private projectPath: string;
  private templatesPath: string;

  constructor(config: ProjectConfig, projectPath: string) {
    this.config = config;
    this.projectPath = projectPath;
    // Templates are in packages/templates relative to the CLI
    this.templatesPath = path.join(__dirname, '../../../templates');
  }

  async generateService(service: ServiceConfig): Promise<void> {
    const spinner = ora(`Generating service: ${service.name}`).start();

    try {
      const servicePath = path.join(this.projectPath, 'services', service.name);

      // Create service directory structure
      await this.createDirectoryStructure(servicePath);

      // Generate files from templates
      await this.generatePackageJson(servicePath, service);
      await this.generateTsConfig(servicePath);
      await this.generateEnvExample(servicePath, service);
      await this.generateDockerfile(servicePath, service);
      await this.generateApp(servicePath, service);
      await this.generatePlugins(servicePath, service);
      await this.generateRoutes(servicePath, service);
      await this.generateUtils(servicePath, service);

      if (service.features.database) {
        await this.generateModels(servicePath);
        await this.generateRepositories(servicePath);
        await this.generateMigrations(servicePath);
      }

      await this.generateTests(servicePath, service);

      spinner.succeed(chalk.green(`Service ${service.name} generated successfully`));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed to generate service: ${error.message}`));
      throw error;
    }
  }

  private async createDirectoryStructure(servicePath: string): Promise<void> {
    const directories = [
      'src',
      'src/config',
      'src/plugins',
      'src/routes',
      'src/models',
      'src/repositories',
      'src/services',
      'src/utils',
      'src/types',
      'test/unit',
      'test/integration',
      'migrations'
    ];

    for (const dir of directories) {
      await fs.ensureDir(path.join(servicePath, dir));
    }
  }

  private async generatePackageJson(servicePath: string, service: ServiceConfig): Promise<void> {
    const templatePath = path.join(this.templatesPath, 'base-service/package.json.hbs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(template);

    const context = {
      serviceName: service.name,
      servicePort: service.port,
      projectName: this.config.project.name,
      hasDatabase: service.features.database,
      hasCache: service.features.cache,
      hasMessageQueue: service.features.messageQueue,
      hasJWT: service.features.jwt,
      databaseType: this.config.infrastructure.database.type
    };

    const content = compiled(context);
    await fs.writeFile(path.join(servicePath, 'package.json'), content);
  }

  private async generateTsConfig(servicePath: string): Promise<void> {
    const templatePath = path.join(this.templatesPath, 'base-service/tsconfig.json.hbs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(template);

    const content = compiled({});
    await fs.writeFile(path.join(servicePath, 'tsconfig.json'), content);
  }

  private async generateEnvExample(servicePath: string, service: ServiceConfig): Promise<void> {
    const templatePath = path.join(this.templatesPath, 'base-service/.env.example.hbs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(template);

    const context = {
      servicePort: service.port,
      serviceName: service.name,
      hasDatabase: service.features.database,
      hasCache: service.features.cache,
      hasMessageQueue: service.features.messageQueue,
      hasJWT: service.features.jwt,
      databaseType: this.config.infrastructure.database.type,
      multiTenancy: this.config.infrastructure.database.multiTenancy
    };

    const content = compiled(context);
    await fs.writeFile(path.join(servicePath, '.env.example'), content);
  }

  private async generateDockerfile(servicePath: string, service: ServiceConfig): Promise<void> {
    const templatePath = path.join(this.templatesPath, 'base-service/Dockerfile.hbs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(template);

    const context = {
      servicePort: service.port,
      serviceName: service.name
    };

    const content = compiled(context);
    await fs.writeFile(path.join(servicePath, 'Dockerfile'), content);
  }

  private async generateApp(servicePath: string, service: ServiceConfig): Promise<void> {
    const templatePath = path.join(this.templatesPath, 'base-service/src/app.ts.hbs');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiled = Handlebars.compile(template);

    const context = {
      serviceName: service.name,
      servicePort: service.port,
      hasDatabase: service.features.database,
      hasCache: service.features.cache,
      hasMessageQueue: service.features.messageQueue,
      hasJWT: service.features.jwt,
      hasHealthChecks: service.features.healthChecks,
      hasCors: service.features.cors,
      hasRateLimit: service.features.rateLimit,
      hasCompression: service.features.compression,
      databaseType: this.config.infrastructure.database.type,
      multiTenancy: this.config.infrastructure.database.multiTenancy
    };

    const content = compiled(context);
    await fs.writeFile(path.join(servicePath, 'src/app.ts'), content);
  }

  private async generatePlugins(servicePath: string, service: ServiceConfig): Promise<void> {
    const plugins = ['swagger.config.ts'];

    if (service.features.database) {
      plugins.push('database.ts');
    }
    if (service.features.cache) {
      plugins.push('redis.ts');
    }
    if (service.features.messageQueue) {
      plugins.push('nats.ts');
      plugins.push('nats-publisher.ts');
      plugins.push('nats-subscriber.ts');
    }
    if (service.features.jwt) {
      plugins.push('auth.ts');
    }
    if (this.config.infrastructure.database.multiTenancy) {
      plugins.push('tenant.ts');
    }

    for (const plugin of plugins) {
      const templatePath = path.join(this.templatesPath, `base-service/src/plugins/${plugin}.hbs`);
      if (await fs.pathExists(templatePath)) {
        const template = await fs.readFile(templatePath, 'utf-8');
        const compiled = Handlebars.compile(template);

        const context = {
          serviceName: service.name,
          hasDatabase: service.features.database,
          hasCache: service.features.cache,
          hasMessageQueue: service.features.messageQueue,
          hasJWT: service.features.jwt,
          databaseType: this.config.infrastructure.database.type,
          multiTenancy: this.config.infrastructure.database.multiTenancy
        };

        const content = compiled(context);
        await fs.writeFile(
          path.join(servicePath, 'src/plugins', plugin.replace('.hbs', '')),
          content
        );
      }
    }

    // Generate config files
    const configPath = path.join(servicePath, 'src/config');
    const swaggerConfigTemplate = path.join(this.templatesPath, 'base-service/src/config/swagger.config.ts.hbs');

    if (await fs.pathExists(swaggerConfigTemplate)) {
      const template = await fs.readFile(swaggerConfigTemplate, 'utf-8');
      const compiled = Handlebars.compile(template);
      const content = compiled({ serviceName: service.name, servicePort: service.port });
      await fs.writeFile(path.join(configPath, 'swagger.config.ts'), content);
    }
  }

  private async generateRoutes(servicePath: string, service: ServiceConfig): Promise<void> {
    // Generate health route
    const healthTemplate = path.join(this.templatesPath, 'base-service/src/routes/health.ts.hbs');
    if (await fs.pathExists(healthTemplate)) {
      const template = await fs.readFile(healthTemplate, 'utf-8');
      const compiled = Handlebars.compile(template);

      const context = {
        hasDatabase: service.features.database,
        hasCache: service.features.cache,
        hasMessageQueue: service.features.messageQueue
      };

      const content = compiled(context);
      await fs.writeFile(path.join(servicePath, 'src/routes/health.ts'), content);
    }

    // Generate auth routes if JWT is enabled
    if (service.features.jwt) {
      const authTemplate = path.join(this.templatesPath, 'base-service/src/routes/auth.ts.hbs');
      if (await fs.pathExists(authTemplate)) {
        const template = await fs.readFile(authTemplate, 'utf-8');
        const compiled = Handlebars.compile(template);

        const context = {
          hasDatabase: service.features.database,
          hasCache: service.features.cache,
          multiTenancy: this.config.infrastructure.database.multiTenancy
        };

        const content = compiled(context);
        await fs.writeFile(path.join(servicePath, 'src/routes/auth.ts'), content);
      }
    }
  }

  private async generateUtils(servicePath: string, service: ServiceConfig): Promise<void> {
    const utils = ['circuit-breaker.ts', 'service-client.ts'];

    for (const util of utils) {
      const templatePath = path.join(this.templatesPath, `base-service/src/utils/${util}.hbs`);
      if (await fs.pathExists(templatePath)) {
        const template = await fs.readFile(templatePath, 'utf-8');
        const compiled = Handlebars.compile(template);
        const content = compiled({});
        await fs.writeFile(
          path.join(servicePath, 'src/utils', util.replace('.hbs', '')),
          content
        );
      }
    }
  }

  private async generateModels(servicePath: string): Promise<void> {
    // Generate base model interface
    const typesDef = `export interface BaseModel {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TenantModel extends BaseModel {
  tenant_id: string;
}
`;
    await fs.writeFile(path.join(servicePath, 'src/types/models.ts'), typesDef);
  }

  private async generateRepositories(servicePath: string): Promise<void> {
    // Generate base repository
    const baseRepo = `import { Knex } from 'knex';

export abstract class BaseRepository<T> {
  constructor(
    protected db: Knex,
    protected tableName: string
  ) {}

  async findAll(tenantId?: string): Promise<T[]> {
    const query = this.db(this.tableName);
    if (tenantId) {
      query.where('tenant_id', tenantId);
    }
    return query.select('*');
  }

  async findById(id: string, tenantId?: string): Promise<T | undefined> {
    const query = this.db(this.tableName).where('id', id);
    if (tenantId) {
      query.where('tenant_id', tenantId);
    }
    return query.first();
  }

  async create(data: Partial<T>): Promise<T> {
    const [result] = await this.db(this.tableName)
      .insert(data)
      .returning('*');
    return result;
  }

  async update(id: string, data: Partial<T>, tenantId?: string): Promise<T | undefined> {
    const query = this.db(this.tableName).where('id', id);
    if (tenantId) {
      query.where('tenant_id', tenantId);
    }
    const [result] = await query.update(data).returning('*');
    return result;
  }

  async delete(id: string, tenantId?: string): Promise<boolean> {
    const query = this.db(this.tableName).where('id', id);
    if (tenantId) {
      query.where('tenant_id', tenantId);
    }
    const deleted = await query.delete();
    return deleted > 0;
  }
}
`;
    await fs.writeFile(path.join(servicePath, 'src/repositories/base.repository.ts'), baseRepo);
  }

  private async generateMigrations(servicePath: string): Promise<void> {
    // Generate knexfile
    const knexfile = `import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: '${this.config.infrastructure.database.type === 'postgresql' ? 'pg' : 'better-sqlite3'}',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'dev_db'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './seeds'
    }
  },
  test: {
    client: '${this.config.infrastructure.database.type === 'postgresql' ? 'pg' : 'better-sqlite3'}',
    connection: process.env.TEST_DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'test_db'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  },
  production: {
    client: '${this.config.infrastructure.database.type === 'postgresql' ? 'pg' : 'better-sqlite3'}',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  }
};

export default config;
`;
    await fs.writeFile(path.join(servicePath, 'knexfile.ts'), knexfile);
  }

  private async generateTests(servicePath: string, service: ServiceConfig): Promise<void> {
    // Generate Jest config
    const jestConfig = `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
};
`;
    await fs.writeFile(path.join(servicePath, 'jest.config.ts'), jestConfig);

    // Generate test setup
    const testSetup = `import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test timeout
jest.setTimeout(30000);
`;
    await fs.writeFile(path.join(servicePath, 'test/setup.ts'), testSetup);

    // Generate sample unit test
    const unitTest = `import { describe, it, expect } from '@jest/globals';

describe('${service.name} Service', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });
});
`;
    await fs.writeFile(path.join(servicePath, 'test/unit/service.test.ts'), unitTest);
  }
}
