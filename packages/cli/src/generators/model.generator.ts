import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';

interface Field {
  name: string;
  type: string;
}

interface ModelDetails {
  service: string;
  name: string;
  tableName: string;
  fields: Field[];
  timestamps: boolean;
  softDelete: boolean;
}

interface ProjectConfig {
  services: Array<{
    name: string;
    features: {
      database?: boolean;
    };
  }>;
  infrastructure: {
    database: {
      multiTenancy: boolean;
    };
  };
}

export class ModelGenerator {
  private config: ProjectConfig;
  private projectPath: string;

  constructor(config: ProjectConfig, projectPath: string) {
    this.config = config;
    this.projectPath = projectPath;
  }

  async generateModel(details: ModelDetails): Promise<void> {
    const spinner = ora(`Generating model: ${details.name}`).start();

    try {
      const servicePath = path.join(this.projectPath, 'services', details.service);

      // Check if service exists
      if (!await fs.pathExists(servicePath)) {
        throw new Error(`Service '${details.service}' does not exist`);
      }

      // Check if service has database enabled
      const service = this.config.services.find(s => s.name === details.service);
      if (!service?.features?.database) {
        throw new Error(`Service '${details.service}' does not have database enabled`);
      }

      // Generate model interface
      await this.generateModelInterface(servicePath, details);

      // Generate repository
      await this.generateRepository(servicePath, details);

      // Generate migration
      await this.generateMigration(servicePath, details);

      // Generate model test
      await this.generateModelTest(servicePath, details);

      spinner.succeed(chalk.green(`Model ${details.name} generated successfully`));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed to generate model: ${error.message}`));
      throw error;
    }
  }

  private async generateModelInterface(servicePath: string, details: ModelDetails): Promise<void> {
    const modelPath = path.join(servicePath, 'src/models', `${details.name.toLowerCase()}.model.ts`);

    // Build interface content
    let content = `export interface ${details.name} {\n`;

    // Add fields
    for (const field of details.fields) {
      const tsType = this.mapTypeToTypeScript(field.type);
      content += `  ${field.name}: ${tsType};\n`;
    }

    // Add timestamps if enabled
    if (details.timestamps) {
      content += `  created_at: Date;\n`;
      content += `  updated_at: Date;\n`;
    }

    // Add soft delete if enabled
    if (details.softDelete) {
      content += `  deleted_at: Date | null;\n`;
    }

    // Add tenant_id if multi-tenancy is enabled
    if (this.config.infrastructure.database.multiTenancy) {
      content += `  tenant_id: string;\n`;
    }

    content += `}\n\n`;

    // Add create DTO interface
    content += `export interface Create${details.name}DTO {\n`;
    for (const field of details.fields) {
      // Skip auto-generated fields
      if (field.name === 'id' || field.name === 'created_at' || field.name === 'updated_at') {
        continue;
      }
      const tsType = this.mapTypeToTypeScript(field.type);
      content += `  ${field.name}: ${tsType};\n`;
    }
    content += `}\n\n`;

    // Add update DTO interface
    content += `export interface Update${details.name}DTO {\n`;
    for (const field of details.fields) {
      // Skip auto-generated and immutable fields
      if (field.name === 'id' || field.name === 'created_at' || field.name === 'updated_at') {
        continue;
      }
      const tsType = this.mapTypeToTypeScript(field.type);
      content += `  ${field.name}?: ${tsType};\n`;
    }
    content += `}\n`;

    await fs.writeFile(modelPath, content);
  }

  private async generateRepository(servicePath: string, details: ModelDetails): Promise<void> {
    const repoPath = path.join(servicePath, 'src/repositories', `${details.name.toLowerCase()}.repository.ts`);

    const modelName = details.name;
    const tableName = details.tableName;
    const hasSoftDelete = details.softDelete;
    const hasMultiTenancy = this.config.infrastructure.database.multiTenancy;

    let content = `import { Knex } from 'knex';
import { ${modelName}, Create${modelName}DTO, Update${modelName}DTO } from '../models/${details.name.toLowerCase()}.model.js';
import { BaseRepository } from './base.repository.js';

export class ${modelName}Repository extends BaseRepository<${modelName}> {
  constructor(db: Knex) {
    super(db, '${tableName}');
  }

  async findAll(tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<${modelName}[]> {
    const query = this.db(this.tableName)${hasSoftDelete ? '.whereNull(\'deleted_at\')' : ''};
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}
    return query.select('*');
  }

  async findById(id: string, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<${modelName} | undefined> {
    const query = this.db(this.tableName)
      .where('id', id)${hasSoftDelete ? '\n      .whereNull(\'deleted_at\')' : ''};
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}
    return query.first();
  }

  async create(data: Create${modelName}DTO, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<${modelName}> {
    const record = {
      ...data,${hasMultiTenancy ? '\n      tenant_id: tenantId,' : ''}
      created_at: new Date(),
      updated_at: new Date()
    };

    const [result] = await this.db(this.tableName)
      .insert(record)
      .returning('*');

    return result;
  }

  async update(id: string, data: Update${modelName}DTO, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<${modelName} | undefined> {
    const query = this.db(this.tableName)
      .where('id', id)${hasSoftDelete ? '\n      .whereNull(\'deleted_at\')' : ''};
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}

    const record = {
      ...data,
      updated_at: new Date()
    };

    const [result] = await query
      .update(record)
      .returning('*');

    return result;
  }

  async delete(id: string, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<boolean> {
    const query = this.db(this.tableName).where('id', id);
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}

    ${hasSoftDelete ? `
    const [result] = await query
      .update({ deleted_at: new Date() })
      .returning('id');
    return !!result;` : `
    const deleted = await query.delete();
    return deleted > 0;`}
  }
${hasSoftDelete ? `
  async hardDelete(id: string, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<boolean> {
    const query = this.db(this.tableName).where('id', id);
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}
    const deleted = await query.delete();
    return deleted > 0;
  }

  async restore(id: string, tenantId${hasMultiTenancy ? '' : '?'}: string): Promise<${modelName} | undefined> {
    const query = this.db(this.tableName)
      .where('id', id)
      .whereNotNull('deleted_at');
    ${hasMultiTenancy ? 'query.where(\'tenant_id\', tenantId);' : 'if (tenantId) query.where(\'tenant_id\', tenantId);'}

    const [result] = await query
      .update({ deleted_at: null, updated_at: new Date() })
      .returning('*');

    return result;
  }
` : ''}
}
`;

    await fs.writeFile(repoPath, content);
  }

  private async generateMigration(servicePath: string, details: ModelDetails): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').slice(0, 14);
    const migrationName = `${timestamp}_create_${details.tableName}.ts`;
    const migrationPath = path.join(servicePath, 'migrations', migrationName);

    const hasMultiTenancy = this.config.infrastructure.database.multiTenancy;

    let content = `import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('${details.tableName}', (table) => {
`;

    // Add fields
    for (const field of details.fields) {
      content += this.generateColumnDefinition(field, '    ');
    }

    // Add tenant_id if multi-tenancy is enabled
    if (hasMultiTenancy) {
      content += `    table.string('tenant_id').notNullable();\n`;
    }

    // Add timestamps if enabled
    if (details.timestamps) {
      content += `    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();\n`;
      content += `    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();\n`;
    }

    // Add soft delete if enabled
    if (details.softDelete) {
      content += `    table.timestamp('deleted_at').nullable();\n`;
    }

    // Add indexes
    if (hasMultiTenancy) {
      content += `\n    // Indexes\n`;
      content += `    table.index('tenant_id');\n`;
    }

    if (details.softDelete) {
      content += `    table.index('deleted_at');\n`;
    }

    content += `  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('${details.tableName}');
}
`;

    await fs.writeFile(migrationPath, content);
  }

  private async generateModelTest(servicePath: string, details: ModelDetails): Promise<void> {
    const testPath = path.join(servicePath, 'test/unit', `${details.name.toLowerCase()}.repository.test.ts`);

    const modelName = details.name;
    const hasMultiTenancy = this.config.infrastructure.database.multiTenancy;

    const content = `import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import Knex from 'knex';
import { ${modelName}Repository } from '../../src/repositories/${details.name.toLowerCase()}.repository.js';

describe('${modelName}Repository', () => {
  let db: Knex.Knex;
  let repository: ${modelName}Repository;
  ${hasMultiTenancy ? 'const testTenantId = \'test-tenant\';' : ''}

  beforeAll(async () => {
    // Setup test database connection
    db = Knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.TEST_DB_NAME || 'test_db'
      }
    });

    repository = new ${modelName}Repository(db);

    // Run migrations
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    // Clean up test data
    await db('${details.tableName}').delete();
  });

  describe('create', () => {
    it('should create a new ${modelName.toLowerCase()}', async () => {
      const data = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type)}`)
          .join(',\n        ')}
      };

      const result = await repository.create(data${hasMultiTenancy ? ', testTenantId' : ''});

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      ${details.fields
        .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
        .map(f => `expect(result.${f.name}).toBe(data.${f.name});`)
        .join('\n      ')}
    });
  });

  describe('findById', () => {
    it('should find ${modelName.toLowerCase()} by id', async () => {
      const data = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type)}`)
          .join(',\n        ')}
      };

      const created = await repository.create(data${hasMultiTenancy ? ', testTenantId' : ''});
      const found = await repository.findById(created.id${hasMultiTenancy ? ', testTenantId' : ''});

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return undefined for non-existent id', async () => {
      const found = await repository.findById('non-existent-id'${hasMultiTenancy ? ', testTenantId' : ''});
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update ${modelName.toLowerCase()}', async () => {
      const data = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type)}`)
          .join(',\n        ')}
      };

      const created = await repository.create(data${hasMultiTenancy ? ', testTenantId' : ''});

      const updateData = {
        ${details.fields[1] ? `${details.fields[1].name}: ${this.getMockValue(details.fields[1].type, true)}` : ''}
      };

      const updated = await repository.update(created.id, updateData${hasMultiTenancy ? ', testTenantId' : ''});

      expect(updated).toBeDefined();
      ${details.fields[1] ? `expect(updated?.${details.fields[1].name}).toBe(updateData.${details.fields[1].name});` : ''}
    });
  });

  describe('delete', () => {
    it('should delete ${modelName.toLowerCase()}', async () => {
      const data = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type)}`)
          .join(',\n        ')}
      };

      const created = await repository.create(data${hasMultiTenancy ? ', testTenantId' : ''});
      const deleted = await repository.delete(created.id${hasMultiTenancy ? ', testTenantId' : ''});

      expect(deleted).toBe(true);

      const found = await repository.findById(created.id${hasMultiTenancy ? ', testTenantId' : ''});
      expect(found).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should find all ${modelName.toLowerCase()}s', async () => {
      const data1 = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type)}`)
          .join(',\n        ')}
      };
      const data2 = {
        ${details.fields
          .filter(f => f.name !== 'id' && f.name !== 'created_at' && f.name !== 'updated_at')
          .map(f => `${f.name}: ${this.getMockValue(f.type, true)}`)
          .join(',\n        ')}
      };

      await repository.create(data1${hasMultiTenancy ? ', testTenantId' : ''});
      await repository.create(data2${hasMultiTenancy ? ', testTenantId' : ''});

      const all = await repository.findAll(${hasMultiTenancy ? 'testTenantId' : ''});

      expect(all.length).toBe(2);
    });
  });
});
`;

    await fs.writeFile(testPath, content);
  }

  private mapTypeToTypeScript(dbType: string): string {
    const typeMap: { [key: string]: string } = {
      'string': 'string',
      'text': 'string',
      'varchar': 'string',
      'uuid': 'string',
      'integer': 'number',
      'int': 'number',
      'bigint': 'number',
      'float': 'number',
      'decimal': 'number',
      'boolean': 'boolean',
      'bool': 'boolean',
      'timestamp': 'Date',
      'datetime': 'Date',
      'date': 'Date',
      'json': 'any',
      'jsonb': 'any'
    };

    return typeMap[dbType.toLowerCase()] || 'string';
  }

  private generateColumnDefinition(field: Field, indent: string): string {
    const { name, type } = field;
    const lowerType = type.toLowerCase();

    let definition = `${indent}table`;

    // Map database types to Knex column types
    if (lowerType === 'uuid') {
      definition += `.uuid('${name}')`;
      if (name === 'id') {
        definition += '.primary().defaultTo(knex.raw(\'gen_random_uuid()\'))';
      }
    } else if (lowerType === 'string' || lowerType === 'varchar') {
      definition += `.string('${name}')`;
    } else if (lowerType === 'text') {
      definition += `.text('${name}')`;
    } else if (lowerType === 'integer' || lowerType === 'int') {
      definition += `.integer('${name}')`;
      if (name === 'id') {
        definition += '.primary()';
      }
    } else if (lowerType === 'bigint') {
      definition += `.bigInteger('${name}')`;
    } else if (lowerType === 'float' || lowerType === 'decimal') {
      definition += `.decimal('${name}')`;
    } else if (lowerType === 'boolean' || lowerType === 'bool') {
      definition += `.boolean('${name}')`;
    } else if (lowerType === 'timestamp' || lowerType === 'datetime') {
      definition += `.timestamp('${name}')`;
    } else if (lowerType === 'date') {
      definition += `.date('${name}')`;
    } else if (lowerType === 'json') {
      definition += `.json('${name}')`;
    } else if (lowerType === 'jsonb') {
      definition += `.jsonb('${name}')`;
    } else {
      definition += `.string('${name}')`;
    }

    definition += '.notNullable();\n';

    return definition;
  }

  private getMockValue(type: string, alternate = false): string {
    const lowerType = type.toLowerCase();

    if (lowerType === 'string' || lowerType === 'varchar' || lowerType === 'text') {
      return alternate ? '\'Updated Test\'' : '\'Test\'';
    } else if (lowerType === 'uuid') {
      return alternate
        ? '\'22222222-2222-2222-2222-222222222222\''
        : '\'11111111-1111-1111-1111-111111111111\'';
    } else if (lowerType === 'integer' || lowerType === 'int' || lowerType === 'bigint') {
      return alternate ? '200' : '100';
    } else if (lowerType === 'float' || lowerType === 'decimal') {
      return alternate ? '200.5' : '100.5';
    } else if (lowerType === 'boolean' || lowerType === 'bool') {
      return alternate ? 'false' : 'true';
    } else {
      return alternate ? '\'alternate\'' : '\'value\'';
    }
  }
}
