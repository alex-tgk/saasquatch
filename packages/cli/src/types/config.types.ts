import { z } from 'zod';

// ===== Sub-schemas =====

const ProjectSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Project name must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  author: z.string().optional(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm']).default('pnpm'),
});

const FrameworkSchema = z.object({
  name: z.literal('fastify'),
  version: z.string().default('^4.24.0'),
});

const CacheSchema = z.object({
  type: z.literal('redis'),
  version: z.string().default('7-alpine'),
});

const MultiTenancySchema = z.object({
  enabled: z.boolean().default(false),
  model: z.enum(['schema-per-tenant', 'database-per-tenant', 'row-level']).default('schema-per-tenant'),
});

const DatabaseSchema = z.object({
  type: z.enum(['postgresql', 'sqlite']),
  version: z.string().optional(),
  strategy: z.enum(['shared', 'separate']).default('separate'),
  multiTenancy: MultiTenancySchema.optional(),
});

const MessageQueueSchema = z.object({
  type: z.literal('nats'),
  version: z.string().default('2.10-alpine'),
});

const InfrastructureSchema = z.object({
  cache: CacheSchema,
  database: DatabaseSchema,
  messageQueue: MessageQueueSchema,
});

const ServiceFeaturesSchema = z.object({
  database: z.boolean().default(false),
  cache: z.boolean().default(false),
  messageQueue: z.boolean().default(false),
  authentication: z.boolean().default(false),
  multiTenant: z.boolean().default(false),
  rateLimit: z.boolean().default(false),
  cors: z.boolean().default(false),
  compression: z.boolean().default(false),
  healthChecks: z.boolean().default(true),
  jwt: z.boolean().default(false),
});

const ServiceSchema = z.object({
  name: z.string().min(1),
  port: z.number().int().min(1000).max(65535),
  type: z.enum(['standard', 'gateway', 'auth']).optional(),
  features: ServiceFeaturesSchema,
  description: z.string().optional(),
});

const LoggingSchema = z.object({
  provider: z.literal('pino'),
  level: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

const TracingSchema = z.object({
  provider: z.enum(['opentelemetry', 'none']).default('opentelemetry'),
  enabled: z.boolean().default(true),
});

const ObservabilitySchema = z.object({
  logging: LoggingSchema,
  healthChecks: z.boolean().default(true),
  tracing: TracingSchema,
  metrics: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['prometheus', 'none']).default('none'),
  }).optional(),
});

const DeploymentSchema = z.object({
  target: z.enum(['docker-compose', 'kubernetes', 'native']).default('docker-compose'),
  registry: z.string().optional(),
  namespace: z.string().optional(),
});

// ===== Main Configuration Schema =====

export const ConfigSchema = z.object({
  version: z.string().default('1.0.0'),
  project: ProjectSchema,
  framework: FrameworkSchema,
  infrastructure: InfrastructureSchema,
  services: z.array(ServiceSchema).min(1),
  observability: ObservabilitySchema,
  deployment: DeploymentSchema,
  useCases: z.array(z.enum(['saas', 'ecommerce', 'api-first', 'realtime'])).default([]),
  features: z.object({
    multiTenancy: z.boolean().default(false),
    authentication: z.boolean().default(true),
    rateLimit: z.boolean().default(true),
    cors: z.boolean().default(true),
    compression: z.boolean().default(true),
    swagger: z.boolean().default(true),
    testing: z.object({
      unit: z.boolean().default(true),
      integration: z.boolean().default(true),
      e2e: z.boolean().default(false),
      coverage: z.number().min(0).max(100).default(80),
    }).optional(),
  }).optional(),
});

// ===== TypeScript Types =====

export type Config = z.infer<typeof ConfigSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Framework = z.infer<typeof FrameworkSchema>;
export type Infrastructure = z.infer<typeof InfrastructureSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type ServiceFeatures = z.infer<typeof ServiceFeaturesSchema>;
export type Database = z.infer<typeof DatabaseSchema>;
export type MultiTenancy = z.infer<typeof MultiTenancySchema>;
export type Observability = z.infer<typeof ObservabilitySchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;

// ===== Validation Helpers =====

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config);
}

export function validatePartialConfig(config: unknown): Partial<Config> {
  return ConfigSchema.partial().parse(config);
}

// ===== Default Configurations =====

export const DEFAULT_SERVICES: Service[] = [
  {
    name: 'api-gateway',
    port: 3000,
    type: 'gateway',
    features: {
      database: false,
      cache: true,
      messageQueue: false,
      authentication: false,
      multiTenant: false,
      rateLimit: true,
      cors: true,
      compression: true,
      healthChecks: true,
      jwt: false,
    },
    description: 'API Gateway - Entry point for all services',
  },
  {
    name: 'auth-service',
    port: 3001,
    type: 'auth',
    features: {
      database: true,
      cache: true,
      messageQueue: false,
      authentication: true,
      multiTenant: false,
      rateLimit: false,
      cors: false,
      compression: false,
      healthChecks: true,
      jwt: true,
    },
    description: 'Authentication Service - JWT-based authentication',
  },
  {
    name: 'user-service',
    port: 3002,
    type: 'standard',
    features: {
      database: true,
      cache: true,
      messageQueue: true,
      authentication: true,
      multiTenant: true,
      rateLimit: false,
      cors: false,
      compression: false,
      healthChecks: true,
      jwt: false,
    },
    description: 'User Management Service - User CRUD operations',
  },
];

export const DEFAULT_INFRASTRUCTURE: Infrastructure = {
  cache: {
    type: 'redis',
    version: '7-alpine',
  },
  database: {
    type: 'postgresql',
    version: '16-alpine',
    strategy: 'separate',
    multiTenancy: {
      enabled: false,
      model: 'schema-per-tenant',
    },
  },
  messageQueue: {
    type: 'nats',
    version: '2.10-alpine',
  },
};

// ===== Config Builder Utilities =====

export class ConfigBuilder {
  private config: Partial<Config> = {};

  setProject(project: Partial<Project>): this {
    this.config.project = { ...this.config.project, ...project } as Project;
    return this;
  }

  setInfrastructure(infrastructure: Partial<Infrastructure>): this {
    this.config.infrastructure = {
      ...DEFAULT_INFRASTRUCTURE,
      ...this.config.infrastructure,
      ...infrastructure
    } as Infrastructure;
    return this;
  }

  addService(service: Service): this {
    if (!this.config.services) {
      this.config.services = [];
    }
    this.config.services.push(service);
    return this;
  }

  setUseCases(useCases: Config['useCases']): this {
    this.config.useCases = useCases;
    return this;
  }

  build(): Config {
    // Set defaults if not provided
    if (!this.config.framework) {
      this.config.framework = { name: 'fastify', version: '^4.24.0' };
    }
    if (!this.config.infrastructure) {
      this.config.infrastructure = DEFAULT_INFRASTRUCTURE;
    }
    if (!this.config.services || this.config.services.length === 0) {
      this.config.services = DEFAULT_SERVICES;
    }
    if (!this.config.observability) {
      this.config.observability = {
        logging: { provider: 'pino', level: 'info' },
        healthChecks: true,
        tracing: { provider: 'opentelemetry', enabled: true },
      };
    }
    if (!this.config.deployment) {
      this.config.deployment = { target: 'docker-compose' };
    }

    return validateConfig(this.config);
  }
}