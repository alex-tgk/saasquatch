import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { execaCommand } from 'execa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('saasquatch init command', () => {
  const testOutputDir = path.join(__dirname, '../../.test-output');
  const projectName = 'test-project';
  const projectPath = path.join(testOutputDir, projectName);
  const cliPath = path.join(__dirname, '../../dist/cli.js');

  beforeEach(async () => {
    // Clean up test output directory
    await fs.remove(testOutputDir);
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    // Clean up after tests
    await fs.remove(testOutputDir);
  });

  it('should generate a basic project structure', async () => {
    // Run the CLI with non-interactive mode (when implemented)
    // For now, we'll test the project generator directly
    const { ProjectGenerator } = await import('../../src/generators/project.generator.js');
    
    const config = {
      project: {
        name: projectName,
        description: 'Test project',
        packageManager: 'pnpm' as const,
      },
      framework: {
        name: 'fastify' as const,
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          version: '16',
          strategy: 'separate' as const,
        },
        cache: {
          type: 'redis' as const,
          version: '7',
        },
        messageQueue: {
          type: 'nats' as const,
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          type: 'service' as const,
          features: {
            database: true,
            cache: true,
            messageQueue: true,
            authentication: true,
            jwt: true,
            healthChecks: true,
            cors: true,
            rateLimit: true,
            compression: true,
          },
        },
      ],
      observability: {
        logging: {
          provider: 'pino' as const,
          level: 'info' as const,
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose' as const,
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate(projectPath);

    // Verify project structure
    expect(await fs.pathExists(projectPath)).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'saasquatch.config.json'))).toBe(false); // Not generated yet
    expect(await fs.pathExists(path.join(projectPath, '.gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'README.md'))).toBe(true);
  }, 60000); // 60 second timeout

  it('should create service directories', async () => {
    const { ProjectGenerator } = await import('../../src/generators/project.generator.js');
    
    const config = {
      project: {
        name: projectName,
        description: 'Test project',
        packageManager: 'pnpm' as const,
      },
      framework: {
        name: 'fastify' as const,
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          version: '16',
          strategy: 'separate' as const,
        },
        cache: {
          type: 'redis' as const,
          version: '7',
        },
        messageQueue: {
          type: 'nats' as const,
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          type: 'service' as const,
          features: {
            database: true,
            cache: true,
            messageQueue: true,
            authentication: true,
            jwt: true,
            healthChecks: true,
            cors: true,
            rateLimit: true,
            compression: true,
          },
        },
      ],
      observability: {
        logging: {
          provider: 'pino' as const,
          level: 'info' as const,
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose' as const,
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate(projectPath);

    // Verify service structure
    const servicePath = path.join(projectPath, 'services', 'auth-service');
    expect(await fs.pathExists(servicePath)).toBe(true);
    expect(await fs.pathExists(path.join(servicePath, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(servicePath, 'src', 'app.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(servicePath, 'src', 'index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(servicePath, 'src', 'plugins'))).toBe(true);
    expect(await fs.pathExists(path.join(servicePath, 'src', 'routes'))).toBe(true);
  }, 60000);

  it('should generate valid package.json', async () => {
    const { ProjectGenerator } = await import('../../src/generators/project.generator.js');
    
    const config = {
      project: {
        name: projectName,
        description: 'Test project',
        packageManager: 'pnpm' as const,
      },
      framework: {
        name: 'fastify' as const,
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          version: '16',
          strategy: 'separate' as const,
        },
        cache: {
          type: 'redis' as const,
          version: '7',
        },
        messageQueue: {
          type: 'nats' as const,
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          type: 'service' as const,
          features: {
            database: true,
            cache: true,
            messageQueue: true,
            authentication: true,
            jwt: true,
            healthChecks: true,
            cors: true,
            rateLimit: true,
            compression: true,
          },
        },
      ],
      observability: {
        logging: {
          provider: 'pino' as const,
          level: 'info' as const,
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose' as const,
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate(projectPath);

    // Read and validate package.json
    const packageJson = await fs.readJSON(path.join(projectPath, 'package.json'));
    
    expect(packageJson.name).toBe(projectName);
    expect(packageJson.description).toBe('Test project');
    expect(packageJson.private).toBe(true);
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.devDependencies).toBeDefined();
  }, 60000);

  it('should generate infrastructure files', async () => {
    const { ProjectGenerator } = await import('../../src/generators/project.generator.js');
    
    const config = {
      project: {
        name: projectName,
        description: 'Test project',
        packageManager: 'pnpm' as const,
      },
      framework: {
        name: 'fastify' as const,
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          version: '16',
          strategy: 'separate' as const,
        },
        cache: {
          type: 'redis' as const,
          version: '7',
        },
        messageQueue: {
          type: 'nats' as const,
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          type: 'service' as const,
          features: {
            database: true,
            cache: true,
            messageQueue: true,
            authentication: true,
            jwt: true,
            healthChecks: true,
            cors: true,
            rateLimit: true,
            compression: true,
          },
        },
      ],
      observability: {
        logging: {
          provider: 'pino' as const,
          level: 'info' as const,
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose' as const,
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate(projectPath);

    // Verify infrastructure files
    expect(await fs.pathExists(path.join(projectPath, 'docker-compose.yml'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, 'infrastructure'))).toBe(true);
    expect(await fs.pathExists(path.join(projectPath, '.env.example'))).toBe(true);
  }, 60000);

  it('should handle git initialization gracefully', async () => {
    const { ProjectGenerator } = await import('../../src/generators/project.generator.js');
    
    const config = {
      project: {
        name: projectName,
        description: 'Test project',
        packageManager: 'pnpm' as const,
      },
      framework: {
        name: 'fastify' as const,
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          version: '16',
          strategy: 'separate' as const,
        },
        cache: {
          type: 'redis' as const,
          version: '7',
        },
        messageQueue: {
          type: 'nats' as const,
          version: '2.10',
        },
      },
      services: [
        {
          name: 'test-service',
          port: 3001,
          type: 'service' as const,
          features: {
            database: false,
            cache: false,
            messageQueue: false,
            authentication: false,
            jwt: false,
            healthChecks: true,
            cors: true,
            rateLimit: false,
            compression: false,
          },
        },
      ],
      observability: {
        logging: {
          provider: 'pino' as const,
          level: 'info' as const,
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose' as const,
      },
    };

    const generator = new ProjectGenerator(config);
    
    // This should complete within 60 seconds even if git hangs
    const startTime = Date.now();
    await generator.generate(projectPath);
    const duration = Date.now() - startTime;
    
    // Should complete in reasonable time (< 30 seconds for small project)
    expect(duration).toBeLessThan(30000);
    
    // Project should exist regardless of git status
    expect(await fs.pathExists(projectPath)).toBe(true);
  }, 60000);
});
