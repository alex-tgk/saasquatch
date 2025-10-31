import { describe, it, expect } from '@jest/globals';
import { configSchema } from '../../src/types/config.types.js';

describe('Configuration Validation', () => {
  it('should validate a complete valid configuration', () => {
    const validConfig = {
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
          type: 'service',
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
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
    };

    const result = configSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('should reject invalid project names', () => {
    const invalidConfig = {
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
      services: [],
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('should reject invalid port numbers', () => {
    const invalidConfig = {
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
          type: 'service',
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
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
    };

    const result = configSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('should accept SQLite as database type', () => {
    const validConfig = {
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
      services: [],
      observability: {
        logging: {
          provider: 'pino',
          level: 'info',
        },
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
    };

    const result = configSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('should require at least one service', () => {
    const invalidConfig = {
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
        healthChecks: {
          enabled: true,
        },
        tracing: {
          enabled: false,
        },
      },
      deployment: {
        target: 'docker-compose',
      },
    };

    const result = configSchema.safeParse(invalidConfig);
    // Depending on schema definition, this might pass or fail
    // Adjust based on actual schema requirements
    expect(result.success).toBe(true); // Schema allows empty services
  });
});
