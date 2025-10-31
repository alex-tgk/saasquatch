import { describe, it, expect } from '@jest/globals';
import { ConfigSchema as configSchema } from '../../src/types/config.types.js';

describe('Configuration Validation', () => {
  it('should validate a complete valid configuration', () => {
    const validConfig = {
      version: '1.0.0',
      project: {
        name: 'my-project',
        description: 'Test project',
        packageManager: 'pnpm',
      },
      framework: {
        name: 'fastify',
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql',
          version: '16',
          strategy: 'separate',
        },
        cache: {
          type: 'redis',
          version: '7',
        },
        messageQueue: {
          type: 'nats',
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 3001,
          type: 'auth',
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
          provider: 'pino',
          level: 'info',
        },
        healthChecks: true,
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
      useCases: [],
    };

    const result = configSchema.safeParse(validConfig);
    if (!result.success) {
      console.error('Validation errors:', result.error.issues);
    }
    expect(result.success).toBe(true);
  });

  it('should reject invalid project names', () => {
    const invalidConfig = {
      version: '1.0.0',
      project: {
        name: 'My Project!', // Invalid characters
        description: 'Test project',
        packageManager: 'pnpm',
      },
      framework: {
        name: 'fastify',
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql',
          version: '16',
          strategy: 'separate',
        },
        cache: {
          type: 'redis',
          version: '7',
        },
        messageQueue: {
          type: 'nats',
          version: '2.10',
        },
      },
      services: [
        {
          name: 'test-service',
          port: 3001,
          features: {},
        },
      ],
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: true,
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
      useCases: [],
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('should reject invalid port numbers', () => {
    const invalidConfig = {
      version: '1.0.0',
      project: {
        name: 'my-project',
        description: 'Test project',
        packageManager: 'pnpm',
      },
      framework: {
        name: 'fastify',
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql',
          version: '16',
          strategy: 'separate',
        },
        cache: {
          type: 'redis',
          version: '7',
        },
        messageQueue: {
          type: 'nats',
          version: '2.10',
        },
      },
      services: [
        {
          name: 'auth-service',
          port: 99999, // Invalid port
          features: {},
        },
      ],
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: true,
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
      useCases: [],
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('should accept SQLite as database type', () => {
    const validConfig = {
      version: '1.0.0',
      project: {
        name: 'my-project',
        description: 'Test project',
        packageManager: 'pnpm',
      },
      framework: {
        name: 'fastify',
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'sqlite',
          version: '3',
          strategy: 'separate',
        },
        cache: {
          type: 'redis',
          version: '7',
        },
        messageQueue: {
          type: 'nats',
          version: '2.10',
        },
      },
      services: [
        {
          name: 'test-service',
          port: 3001,
          features: {},
        },
      ],
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: true,
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
      useCases: [],
    };

    const result = configSchema.safeParse(validConfig);
    if (!result.success) {
      console.error('Validation errors:', result.error.issues);
    }
    expect(result.success).toBe(true);
  });

  it('should require at least one service', () => {
    const invalidConfig = {
      version: '1.0.0',
      project: {
        name: 'my-project',
        description: 'Test project',
        packageManager: 'pnpm',
      },
      framework: {
        name: 'fastify',
        version: '4.x',
      },
      infrastructure: {
        database: {
          type: 'postgresql',
          version: '16',
          strategy: 'separate',
        },
        cache: {
          type: 'redis',
          version: '7',
        },
        messageQueue: {
          type: 'nats',
          version: '2.10',
        },
      },
      services: [], // Empty services array
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: true,
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
      useCases: [],
    };

    const result = configSchema.safeParse(invalidConfig);
    // Schema requires at least 1 service
    expect(result.success).toBe(false);
  });
});
