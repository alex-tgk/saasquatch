import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import chalk from 'chalk';
import ora from 'ora';

interface RouteDetails {
  service: string;
  name: string;
  path: string;
  methods: string[];
  authentication: boolean;
  validation: boolean;
}

interface ProjectConfig {
  services: Array<{
    name: string;
    features: {
      jwt?: boolean;
      database?: boolean;
    };
  }>;
}

export class RouteGenerator {
  private config: ProjectConfig;
  private projectPath: string;

  constructor(config: ProjectConfig, projectPath: string) {
    this.config = config;
    this.projectPath = projectPath;
  }

  async generateRoute(details: RouteDetails): Promise<void> {
    const spinner = ora(`Generating route: ${details.name}`).start();

    try {
      const servicePath = path.join(this.projectPath, 'services', details.service);
      const routePath = path.join(servicePath, 'src/routes', `${details.name}.ts`);

      // Check if service exists
      if (!await fs.pathExists(servicePath)) {
        throw new Error(`Service '${details.service}' does not exist`);
      }

      // Check if route already exists
      if (await fs.pathExists(routePath)) {
        throw new Error(`Route '${details.name}' already exists in service '${details.service}'`);
      }

      // Generate route file
      const routeContent = this.generateRouteContent(details);
      await fs.writeFile(routePath, routeContent);

      // Update app.ts to register the route
      await this.updateAppRoutes(servicePath, details);

      // Generate test file
      await this.generateRouteTest(servicePath, details);

      spinner.succeed(chalk.green(`Route ${details.name} generated successfully`));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed to generate route: ${error.message}`));
      throw error;
    }
  }

  private generateRouteContent(details: RouteDetails): string {
    const routeName = details.name;
    const routePath = details.path;
    const hasGetList = details.methods.includes('get-list');
    const hasGetOne = details.methods.includes('get-one');
    const hasPost = details.methods.includes('post');
    const hasPut = details.methods.includes('put');
    const hasDelete = details.methods.includes('delete');
    const requiresAuth = details.authentication;
    const hasValidation = details.validation;

    let content = `import { FastifyInstance } from 'fastify';\n`;

    if (requiresAuth) {
      content += `import { authenticate } from '../plugins/auth.js';\n`;
    }

    content += `\n`;
    content += `export default async function ${routeName}Routes(fastify: FastifyInstance) {\n`;

    // GET list endpoint
    if (hasGetList) {
      content += `\n  // List all ${routeName}\n`;
      content += `  fastify.get('${routePath}', {\n`;

      if (hasValidation) {
        content += `    schema: {\n`;
        content += `      response: {\n`;
        content += `        200: {\n`;
        content += `          type: 'array',\n`;
        content += `          items: {\n`;
        content += `            type: 'object',\n`;
        content += `            properties: {\n`;
        content += `              id: { type: 'string' },\n`;
        content += `              name: { type: 'string' },\n`;
        content += `              created_at: { type: 'string', format: 'date-time' },\n`;
        content += `              updated_at: { type: 'string', format: 'date-time' }\n`;
        content += `            }\n`;
        content += `          }\n`;
        content += `        }\n`;
        content += `      }\n`;
        content += `    },\n`;
      }

      if (requiresAuth) {
        content += `    onRequest: [fastify.authenticate],\n`;
      }

      content += `  }, async (request, reply) => {\n`;
      content += `    try {\n`;
      content += `      // TODO: Implement list logic\n`;
      content += `      const items = [];\n`;
      content += `      return reply.code(200).send(items);\n`;
      content += `    } catch (error: any) {\n`;
      content += `      request.log.error({ error }, 'Failed to list ${routeName}');\n`;
      content += `      return reply.code(500).send({ error: 'Failed to list ${routeName}' });\n`;
      content += `    }\n`;
      content += `  });\n`;
    }

    // GET by ID endpoint
    if (hasGetOne) {
      content += `\n  // Get ${routeName} by ID\n`;
      content += `  fastify.get('${routePath}/:id', {\n`;

      if (hasValidation) {
        content += `    schema: {\n`;
        content += `      params: {\n`;
        content += `        type: 'object',\n`;
        content += `        required: ['id'],\n`;
        content += `        properties: {\n`;
        content += `          id: { type: 'string' }\n`;
        content += `        }\n`;
        content += `      },\n`;
        content += `      response: {\n`;
        content += `        200: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            id: { type: 'string' },\n`;
        content += `            name: { type: 'string' },\n`;
        content += `            created_at: { type: 'string', format: 'date-time' },\n`;
        content += `            updated_at: { type: 'string', format: 'date-time' }\n`;
        content += `          }\n`;
        content += `        },\n`;
        content += `        404: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            error: { type: 'string' }\n`;
        content += `          }\n`;
        content += `        }\n`;
        content += `      }\n`;
        content += `    },\n`;
      }

      if (requiresAuth) {
        content += `    onRequest: [fastify.authenticate],\n`;
      }

      content += `  }, async (request, reply) => {\n`;
      content += `    try {\n`;
      content += `      const { id } = request.params as { id: string };\n`;
      content += `      \n`;
      content += `      // TODO: Implement get by ID logic\n`;
      content += `      const item = null;\n`;
      content += `      \n`;
      content += `      if (!item) {\n`;
      content += `        return reply.code(404).send({ error: '${routeName} not found' });\n`;
      content += `      }\n`;
      content += `      \n`;
      content += `      return reply.code(200).send(item);\n`;
      content += `    } catch (error: any) {\n`;
      content += `      request.log.error({ error }, 'Failed to get ${routeName}');\n`;
      content += `      return reply.code(500).send({ error: 'Failed to get ${routeName}' });\n`;
      content += `    }\n`;
      content += `  });\n`;
    }

    // POST endpoint
    if (hasPost) {
      content += `\n  // Create new ${routeName}\n`;
      content += `  fastify.post('${routePath}', {\n`;

      if (hasValidation) {
        content += `    schema: {\n`;
        content += `      body: {\n`;
        content += `        type: 'object',\n`;
        content += `        required: ['name'],\n`;
        content += `        properties: {\n`;
        content += `          name: { type: 'string', minLength: 1 }\n`;
        content += `        }\n`;
        content += `      },\n`;
        content += `      response: {\n`;
        content += `        201: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            id: { type: 'string' },\n`;
        content += `            name: { type: 'string' },\n`;
        content += `            created_at: { type: 'string', format: 'date-time' },\n`;
        content += `            updated_at: { type: 'string', format: 'date-time' }\n`;
        content += `          }\n`;
        content += `        }\n`;
        content += `      }\n`;
        content += `    },\n`;
      }

      if (requiresAuth) {
        content += `    onRequest: [fastify.authenticate],\n`;
      }

      content += `  }, async (request, reply) => {\n`;
      content += `    try {\n`;
      content += `      const data = request.body as { name: string };\n`;
      content += `      \n`;
      content += `      // TODO: Implement create logic\n`;
      content += `      const item = {\n`;
      content += `        id: 'generated-id',\n`;
      content += `        ...data,\n`;
      content += `        created_at: new Date().toISOString(),\n`;
      content += `        updated_at: new Date().toISOString()\n`;
      content += `      };\n`;
      content += `      \n`;
      content += `      return reply.code(201).send(item);\n`;
      content += `    } catch (error: any) {\n`;
      content += `      request.log.error({ error }, 'Failed to create ${routeName}');\n`;
      content += `      return reply.code(500).send({ error: 'Failed to create ${routeName}' });\n`;
      content += `    }\n`;
      content += `  });\n`;
    }

    // PUT endpoint
    if (hasPut) {
      content += `\n  // Update ${routeName} by ID\n`;
      content += `  fastify.put('${routePath}/:id', {\n`;

      if (hasValidation) {
        content += `    schema: {\n`;
        content += `      params: {\n`;
        content += `        type: 'object',\n`;
        content += `        required: ['id'],\n`;
        content += `        properties: {\n`;
        content += `          id: { type: 'string' }\n`;
        content += `        }\n`;
        content += `      },\n`;
        content += `      body: {\n`;
        content += `        type: 'object',\n`;
        content += `        properties: {\n`;
        content += `          name: { type: 'string', minLength: 1 }\n`;
        content += `        }\n`;
        content += `      },\n`;
        content += `      response: {\n`;
        content += `        200: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            id: { type: 'string' },\n`;
        content += `            name: { type: 'string' },\n`;
        content += `            created_at: { type: 'string', format: 'date-time' },\n`;
        content += `            updated_at: { type: 'string', format: 'date-time' }\n`;
        content += `          }\n`;
        content += `        },\n`;
        content += `        404: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            error: { type: 'string' }\n`;
        content += `          }\n`;
        content += `        }\n`;
        content += `      }\n`;
        content += `    },\n`;
      }

      if (requiresAuth) {
        content += `    onRequest: [fastify.authenticate],\n`;
      }

      content += `  }, async (request, reply) => {\n`;
      content += `    try {\n`;
      content += `      const { id } = request.params as { id: string };\n`;
      content += `      const data = request.body as { name?: string };\n`;
      content += `      \n`;
      content += `      // TODO: Implement update logic\n`;
      content += `      const item = null;\n`;
      content += `      \n`;
      content += `      if (!item) {\n`;
      content += `        return reply.code(404).send({ error: '${routeName} not found' });\n`;
      content += `      }\n`;
      content += `      \n`;
      content += `      const updated = {\n`;
      content += `        ...item,\n`;
      content += `        ...data,\n`;
      content += `        updated_at: new Date().toISOString()\n`;
      content += `      };\n`;
      content += `      \n`;
      content += `      return reply.code(200).send(updated);\n`;
      content += `    } catch (error: any) {\n`;
      content += `      request.log.error({ error }, 'Failed to update ${routeName}');\n`;
      content += `      return reply.code(500).send({ error: 'Failed to update ${routeName}' });\n`;
      content += `    }\n`;
      content += `  });\n`;
    }

    // DELETE endpoint
    if (hasDelete) {
      content += `\n  // Delete ${routeName} by ID\n`;
      content += `  fastify.delete('${routePath}/:id', {\n`;

      if (hasValidation) {
        content += `    schema: {\n`;
        content += `      params: {\n`;
        content += `        type: 'object',\n`;
        content += `        required: ['id'],\n`;
        content += `        properties: {\n`;
        content += `          id: { type: 'string' }\n`;
        content += `        }\n`;
        content += `      },\n`;
        content += `      response: {\n`;
        content += `        204: {\n`;
        content += `          type: 'null'\n`;
        content += `        },\n`;
        content += `        404: {\n`;
        content += `          type: 'object',\n`;
        content += `          properties: {\n`;
        content += `            error: { type: 'string' }\n`;
        content += `          }\n`;
        content += `        }\n`;
        content += `      }\n`;
        content += `    },\n`;
      }

      if (requiresAuth) {
        content += `    onRequest: [fastify.authenticate],\n`;
      }

      content += `  }, async (request, reply) => {\n`;
      content += `    try {\n`;
      content += `      const { id } = request.params as { id: string };\n`;
      content += `      \n`;
      content += `      // TODO: Implement delete logic\n`;
      content += `      const deleted = false;\n`;
      content += `      \n`;
      content += `      if (!deleted) {\n`;
      content += `        return reply.code(404).send({ error: '${routeName} not found' });\n`;
      content += `      }\n`;
      content += `      \n`;
      content += `      return reply.code(204).send();\n`;
      content += `    } catch (error: any) {\n`;
      content += `      request.log.error({ error }, 'Failed to delete ${routeName}');\n`;
      content += `      return reply.code(500).send({ error: 'Failed to delete ${routeName}' });\n`;
      content += `    }\n`;
      content += `  });\n`;
    }

    content += `}\n`;

    return content;
  }

  private async updateAppRoutes(servicePath: string, details: RouteDetails): Promise<void> {
    const appPath = path.join(servicePath, 'src/app.ts');
    const appContent = await fs.readFile(appPath, 'utf-8');

    // Add import at the top
    const importStatement = `import ${details.name}Routes from './routes/${details.name}.js';\n`;

    // Find where to insert the import (after other route imports)
    const routeImportRegex = /import.*Routes from.*\/routes\/.*\.js';?\n/g;
    const matches = appContent.match(routeImportRegex);

    let updatedContent = appContent;

    if (matches && matches.length > 0) {
      // Insert after the last route import
      const lastMatch = matches[matches.length - 1];
      const insertIndex = appContent.lastIndexOf(lastMatch) + lastMatch.length;
      updatedContent =
        appContent.slice(0, insertIndex) +
        importStatement +
        appContent.slice(insertIndex);
    } else {
      // Insert after the first import block
      const firstImportEnd = appContent.indexOf('\n\n');
      updatedContent =
        appContent.slice(0, firstImportEnd) +
        '\n' + importStatement +
        appContent.slice(firstImportEnd);
    }

    // Add route registration
    const routeRegistration = `  fastify.register(${details.name}Routes);\n`;

    // Find where to insert the registration (before the return statement)
    const returnIndex = updatedContent.lastIndexOf('  return fastify;');

    if (returnIndex !== -1) {
      updatedContent =
        updatedContent.slice(0, returnIndex) +
        routeRegistration +
        '\n' +
        updatedContent.slice(returnIndex);
    }

    await fs.writeFile(appPath, updatedContent);
  }

  private async generateRouteTest(servicePath: string, details: RouteDetails): Promise<void> {
    const testPath = path.join(servicePath, 'test/integration', `${details.name}.test.ts`);

    const testContent = `import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { buildApp } from '../../src/app.js';
import { FastifyInstance } from 'fastify';

describe('${details.name} Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET ${details.path}', () => {
    it('should list ${details.name}', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '${details.path}'${details.authentication ? `,
        headers: {
          authorization: 'Bearer test-token'
        }` : ''}
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe('POST ${details.path}', () => {
    it('should create ${details.name}', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '${details.path}',${details.authentication ? `
        headers: {
          authorization: 'Bearer test-token'
        },` : ''}
        payload: {
          name: 'Test Item'
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('Test Item');
    });
  });
});
`;

    await fs.writeFile(testPath, testContent);
  }
}
