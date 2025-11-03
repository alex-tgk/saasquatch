import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('saasquatch add command', () => {
  let testDir: string;
  let cliPath: string;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `saasquatch-test-${Date.now()}`);
    await fs.ensureDir(testDir);

    // Path to CLI binary
    cliPath = path.resolve(__dirname, '../dist/cli.js');

    // Create a minimal saasquatch.config.json
    const config = {
      version: '1.0.0',
      project: {
        name: 'test-project',
        description: 'Test project',
        packageManager: 'pnpm'
      },
      framework: {
        name: 'fastify',
        version: '4.x'
      },
      infrastructure: {
        database: {
          type: 'postgresql' as const,
          multiTenancy: true
        },
        cache: {
          type: 'redis' as const
        },
        messageQueue: {
          type: 'nats' as const
        }
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          features: {
            database: true,
            cache: true,
            messageQueue: true,
            jwt: true,
            healthChecks: true,
            cors: true,
            compression: true
          }
        }
      ],
      observability: {
        logging: { level: 'info' },
        healthChecks: true,
        tracing: { enabled: false }
      }
    };

    await fs.writeJSON(path.join(testDir, 'saasquatch.config.json'), config, { spaces: 2 });

    // Create services directory
    await fs.ensureDir(path.join(testDir, 'services'));
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.remove(testDir);
  });

  describe('add service', () => {
    it('should show error when not in a SaaSQuatch project', async () => {
      const emptyDir = path.join(os.tmpdir(), `saasquatch-empty-${Date.now()}`);
      await fs.ensureDir(emptyDir);

      try {
        await execa('node', [cliPath, 'add', 'service', 'test-service', '-y', '--path', emptyDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
        expect(error.stderr).toContain('Not a SaaSQuatch project');
      } finally {
        await fs.remove(emptyDir);
      }
    });

    it('should add a new service with defaults using -y flag', async () => {
      const result = await execa(
        'node',
        [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir],
        { reject: false }
      );

      expect(result.exitCode).toBe(0);

      // Check config was updated
      const config = await fs.readJSON(path.join(testDir, 'saasquatch.config.json'));
      expect(config.services).toHaveLength(2);
      expect(config.services[1].name).toBe('user-service');
      expect(config.services[1].port).toBe(3002); // Auto-assigned next port
      expect(config.services[1].features.database).toBe(true);

      // Check service directory was created
      const servicePath = path.join(testDir, 'services', 'user-service');
      expect(await fs.pathExists(servicePath)).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'src/app.ts'))).toBe(true);
    });

    it('should generate service with correct structure', async () => {
      await execa('node', [cliPath, 'add', 'service', 'payment-service', '-y', '--path', testDir]);

      const servicePath = path.join(testDir, 'services', 'payment-service');

      // Check directory structure
      expect(await fs.pathExists(path.join(servicePath, 'src'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'src/plugins'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'src/routes'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'src/models'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'src/repositories'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'test'))).toBe(true);

      // Check files exist
      expect(await fs.pathExists(path.join(servicePath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'tsconfig.json'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'Dockerfile'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, '.env.example'))).toBe(true);
      expect(await fs.pathExists(path.join(servicePath, 'jest.config.ts'))).toBe(true);
    });

    it('should reject invalid service name', async () => {
      try {
        // Invalid name with uppercase
        await execa('node', [cliPath, 'add', 'service', 'InvalidService', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
      }
    });

    it('should reject duplicate service name', async () => {
      try {
        // Try to add a service that already exists
        await execa('node', [cliPath, 'add', 'service', 'auth-service', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
      }
    });

    it('should auto-assign next available port', async () => {
      await execa('node', [cliPath, 'add', 'service', 'service1', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'service', 'service2', '-y', '--path', testDir]);

      const config = await fs.readJSON(path.join(testDir, 'saasquatch.config.json'));
      const ports = config.services.map((s: any) => s.port);

      // Should have unique ports
      expect(new Set(ports).size).toBe(ports.length);

      // Ports should be sequential
      expect(ports[1]).toBe(3002);
      expect(ports[2]).toBe(3003);
    });
  });

  describe('add route', () => {
    it('should add a new route to existing service', async () => {
      // First create a service
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);

      // Add a route to it
      const result = await execa(
        'node',
        [cliPath, 'add', 'route', 'users', '-y', '--path', testDir],
        { reject: false }
      );

      expect(result.exitCode).toBe(0);

      // Check route file was created
      const routePath = path.join(testDir, 'services', 'user-service', 'src/routes', 'users.ts');
      expect(await fs.pathExists(routePath)).toBe(true);

      // Check route file contains expected content
      const routeContent = await fs.readFile(routePath, 'utf-8');
      expect(routeContent).toContain('usersRoutes');
      expect(routeContent).toContain('GET');
      expect(routeContent).toContain('POST');
      expect(routeContent).toContain('/users');
    });

    it('should fail when service does not exist', async () => {
      try {
        await execa('node', [cliPath, 'add', 'route', 'items', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
        expect(error.stderr).toContain('No services found');
      }
    });

    it('should update app.ts to register route', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'route', 'users', '-y', '--path', testDir]);

      const appPath = path.join(testDir, 'services', 'user-service', 'src/app.ts');
      const appContent = await fs.readFile(appPath, 'utf-8');

      expect(appContent).toContain('import usersRoutes');
      expect(appContent).toContain('fastify.register(usersRoutes)');
    });

    it('should create route test file', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'route', 'users', '-y', '--path', testDir]);

      const testPath = path.join(testDir, 'services', 'user-service', 'test/integration', 'users.test.ts');
      expect(await fs.pathExists(testPath)).toBe(true);

      const testContent = await fs.readFile(testPath, 'utf-8');
      expect(testContent).toContain('describe');
      expect(testContent).toContain('GET /users');
      expect(testContent).toContain('POST /users');
    });
  });

  describe('add model', () => {
    it('should add a new model to existing service', async () => {
      // First create a service
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);

      // Add a model to it
      const result = await execa(
        'node',
        [cliPath, 'add', 'model', 'User', '-y', '--path', testDir],
        { reject: false }
      );

      expect(result.exitCode).toBe(0);

      // Check model file was created
      const modelPath = path.join(testDir, 'services', 'user-service', 'src/models', 'user.model.ts');
      expect(await fs.pathExists(modelPath)).toBe(true);

      // Check model file contains expected content
      const modelContent = await fs.readFile(modelPath, 'utf-8');
      expect(modelContent).toContain('export interface User');
      expect(modelContent).toContain('CreateUserDTO');
      expect(modelContent).toContain('UpdateUserDTO');
    });

    it('should fail when service does not exist', async () => {
      try {
        await execa('node', [cliPath, 'add', 'model', 'Product', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
        expect(error.stderr).toContain('No services found');
      }
    });

    it('should create repository file', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'model', 'User', '-y', '--path', testDir]);

      const repoPath = path.join(testDir, 'services', 'user-service', 'src/repositories', 'user.repository.ts');
      expect(await fs.pathExists(repoPath)).toBe(true);

      const repoContent = await fs.readFile(repoPath, 'utf-8');
      expect(repoContent).toContain('UserRepository');
      expect(repoContent).toContain('BaseRepository');
      expect(repoContent).toContain('findAll');
      expect(repoContent).toContain('findById');
      expect(repoContent).toContain('create');
      expect(repoContent).toContain('update');
      expect(repoContent).toContain('delete');
    });

    it('should create migration file', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'model', 'User', '-y', '--path', testDir]);

      const migrationsDir = path.join(testDir, 'services', 'user-service', 'migrations');
      const files = await fs.readdir(migrationsDir);

      // Should have at least one migration file
      const migrationFiles = files.filter(f => f.includes('create_items'));
      expect(migrationFiles.length).toBeGreaterThan(0);
    });

    it('should create model test file', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);
      await execa('node', [cliPath, 'add', 'model', 'User', '-y', '--path', testDir]);

      const testPath = path.join(testDir, 'services', 'user-service', 'test/unit', 'user.repository.test.ts');
      expect(await fs.pathExists(testPath)).toBe(true);

      const testContent = await fs.readFile(testPath, 'utf-8');
      expect(testContent).toContain('UserRepository');
      expect(testContent).toContain('describe');
      expect(testContent).toContain('create');
      expect(testContent).toContain('findById');
    });

    it('should reject invalid model name (not PascalCase)', async () => {
      await execa('node', [cliPath, 'add', 'service', 'user-service', '-y', '--path', testDir]);

      try {
        // Invalid name (lowercase)
        await execa('node', [cliPath, 'add', 'model', 'user', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
      }
    });
  });

  describe('add command validation', () => {
    it('should show error for invalid type', async () => {
      try {
        await execa('node', [cliPath, 'add', 'invalid-type', 'test', '-y', '--path', testDir]);
        throw new Error('Expected command to fail');
      } catch (error: any) {
        expect(error.exitCode).toBe(1);
        expect(error.stderr).toContain('Unknown type');
      }
    });

    it('should show help when no type is provided', async () => {
      try {
        await execa('node', [cliPath, 'add', '--help']);
        throw new Error('Expected command to show help');
      } catch (error: any) {
        // Help exits with code 0
        if (error.exitCode === 0) {
          expect(error.stdout).toContain('Add a new service, route, or model');
        }
      }
    });
  });
});
