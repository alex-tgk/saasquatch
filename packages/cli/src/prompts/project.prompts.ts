import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  type Config,
  type Project,
  type Infrastructure,
  type Service,
  ConfigBuilder,
  DEFAULT_SERVICES,
} from '../types/config.types.js';

export interface ProjectAnswers {
  projectName: string;
  description?: string;
  author?: string;
  databaseType: 'postgresql' | 'sqlite';
  enableMultiTenancy: boolean;
  includeAuthService: boolean;
  includeUserService: boolean;
  includeApiGateway: boolean;
  useCases: string[];
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

export async function promptProjectConfig(): Promise<Partial<Config>> {
  console.log(chalk.cyan('\n🚀 SaaSaaS Project Configuration\n'));

  const answers = await inquirer.prompt<ProjectAnswers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-saas-platform',
      validate: (input: string) => {
        if (input.length === 0) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name must be lowercase alphanumeric with hyphens';
        }
        return true;
      },
      filter: (input: string) => input.toLowerCase().replace(/\s+/g, '-'),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A modern SaaS platform built with Fastify microservices',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: '',
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Choose your database:',
      choices: [
        {
          name: `${chalk.blue('PostgreSQL')} - Traditional, proven, enterprise-grade`,
          value: 'postgresql',
          short: 'PostgreSQL',
        },
        {
          name: `${chalk.green('SQLite + LiteFS')} - Modern, embeddable, edge-ready`,
          value: 'sqlite',
          short: 'SQLite',
        },
      ],
      default: 'postgresql',
    },
    {
      type: 'confirm',
      name: 'enableMultiTenancy',
      message: 'Enable multi-tenancy support?',
      default: false,
      when: (answers) => answers.databaseType === 'postgresql',
    },
    {
      type: 'confirm',
      name: 'includeApiGateway',
      message: 'Include API Gateway service?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeAuthService',
      message: 'Include JWT Authentication service?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeUserService',
      message: 'Include User Management service?',
      default: true,
      when: (answers) => answers.includeAuthService,
    },
    {
      type: 'checkbox',
      name: 'useCases',
      message: 'Select use cases to optimize for:',
      choices: [
        {
          name: 'SaaS / Multi-tenant applications',
          value: 'saas',
          checked: false,
        },
        {
          name: 'E-commerce platforms',
          value: 'ecommerce',
          checked: false,
        },
        {
          name: 'API-first platforms',
          value: 'api-first',
          checked: true,
        },
        {
          name: 'Real-time applications',
          value: 'realtime',
          checked: false,
        },
      ],
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager:',
      choices: ['pnpm', 'npm', 'yarn'],
      default: 'pnpm',
    },
  ]);

  // Advanced configuration for power users
  const advancedAnswers = await promptAdvancedConfig(answers);

  return buildConfigFromAnswers({ ...answers, ...advancedAnswers });
}

async function promptAdvancedConfig(basicAnswers: ProjectAnswers) {
  const { configureAdvanced } = await inquirer.prompt<{ configureAdvanced: boolean }>([
    {
      type: 'confirm',
      name: 'configureAdvanced',
      message: 'Configure advanced settings?',
      default: false,
    },
  ]);

  if (!configureAdvanced) {
    return {};
  }

  return inquirer.prompt([
    {
      type: 'list',
      name: 'databaseStrategy',
      message: 'Database strategy:',
      choices: [
        {
          name: 'Separate database per service (recommended)',
          value: 'separate',
        },
        {
          name: 'Shared database across services',
          value: 'shared',
        },
      ],
      default: 'separate',
    },
    {
      type: 'list',
      name: 'logLevel',
      message: 'Default log level:',
      choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'info',
    },
    {
      type: 'confirm',
      name: 'enableTracing',
      message: 'Enable OpenTelemetry tracing?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'enableMetrics',
      message: 'Enable Prometheus metrics?',
      default: false,
    },
    {
      type: 'list',
      name: 'deploymentTarget',
      message: 'Primary deployment target:',
      choices: [
        {
          name: 'Docker Compose (development & small deployments)',
          value: 'docker-compose',
        },
        {
          name: 'Kubernetes (production)',
          value: 'kubernetes',
        },
        {
          name: 'Native (direct execution)',
          value: 'native',
        },
      ],
      default: 'docker-compose',
    },
    {
      type: 'number',
      name: 'testCoverage',
      message: 'Target test coverage percentage:',
      default: 80,
      validate: (input: number) => {
        if (input < 0 || input > 100) {
          return 'Coverage must be between 0 and 100';
        }
        return true;
      },
    },
  ]);
}

function buildConfigFromAnswers(answers: any): Partial<Config> {
  const builder = new ConfigBuilder();

  // Set project configuration
  builder.setProject({
    name: answers.projectName,
    description: answers.description || undefined,
    author: answers.author || undefined,
    packageManager: answers.packageManager,
  });

  // Set infrastructure configuration
  const infrastructure: Partial<Infrastructure> = {
    database: {
      type: answers.databaseType,
      version: answers.databaseType === 'postgresql' ? '16-alpine' : undefined,
      strategy: answers.databaseStrategy || 'separate',
      multiTenancy: answers.enableMultiTenancy
        ? {
            enabled: true,
            model: 'schema-per-tenant',
          }
        : undefined,
    },
  };
  builder.setInfrastructure(infrastructure);

  // Build services array
  const services: Service[] = [];

  if (answers.includeApiGateway) {
    services.push({
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
    });
  }

  if (answers.includeAuthService) {
    services.push({
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
    });
  }

  if (answers.includeUserService) {
    services.push({
      name: 'user-service',
      port: 3002,
      type: 'standard',
      features: {
        database: true,
        cache: true,
        messageQueue: true,
        authentication: true,
        multiTenant: answers.enableMultiTenancy || false,
        rateLimit: false,
        cors: false,
        compression: false,
        healthChecks: true,
        jwt: false,
      },
      description: 'User Management Service',
    });
  }

  services.forEach(service => builder.addService(service));

  // Set use cases
  if (answers.useCases && answers.useCases.length > 0) {
    builder.setUseCases(answers.useCases);
  }

  // Build and return the configuration
  const config = builder.build();

  // Apply advanced settings if provided
  if (answers.logLevel) {
    config.observability.logging.level = answers.logLevel;
  }
  if (typeof answers.enableTracing === 'boolean') {
    config.observability.tracing.enabled = answers.enableTracing;
  }
  if (answers.enableMetrics) {
    config.observability.metrics = {
      enabled: true,
      provider: 'prometheus',
    };
  }
  if (answers.deploymentTarget) {
    config.deployment.target = answers.deploymentTarget;
  }
  if (answers.testCoverage !== undefined) {
    config.features = {
      multiTenancy: config.features?.multiTenancy ?? false,
      authentication: config.features?.authentication ?? true,
      rateLimit: config.features?.rateLimit ?? true,
      cors: config.features?.cors ?? true,
      compression: config.features?.compression ?? true,
      swagger: config.features?.swagger ?? true,
      testing: {
        unit: true,
        integration: true,
        e2e: false,
        coverage: answers.testCoverage,
      },
    };
  }

  return config;
}

// Additional prompt utilities

export async function promptForMissingServices(
  currentServices: Service[]
): Promise<Service[]> {
  const existingPorts = new Set(currentServices.map(s => s.port));
  const existingNames = new Set(currentServices.map(s => s.name));

  const { addMoreServices } = await inquirer.prompt<{ addMoreServices: boolean }>([
    {
      type: 'confirm',
      name: 'addMoreServices',
      message: 'Would you like to add additional services?',
      default: false,
    },
  ]);

  if (!addMoreServices) {
    return currentServices;
  }

  const newServices: Service[] = [];
  let addAnother = true;

  while (addAnother) {
    const serviceAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Service name:',
        validate: (input: string) => {
          if (!input) return 'Service name is required';
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Service name must be lowercase alphanumeric with hyphens';
          }
          if (existingNames.has(input)) {
            return 'Service name already exists';
          }
          return true;
        },
      },
      {
        type: 'number',
        name: 'port',
        message: 'Service port:',
        default: 3000 + currentServices.length + newServices.length,
        validate: (input: number) => {
          if (input < 1000 || input > 65535) {
            return 'Port must be between 1000 and 65535';
          }
          if (existingPorts.has(input)) {
            return 'Port already in use';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Service type:',
        choices: ['standard', 'gateway', 'auth'],
        default: 'standard',
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features:',
        choices: [
          { name: 'Database', value: 'database' },
          { name: 'Cache (Redis)', value: 'cache' },
          { name: 'Message Queue (NATS)', value: 'messageQueue' },
          { name: 'Authentication', value: 'authentication' },
          { name: 'Multi-tenant', value: 'multiTenant' },
          { name: 'Rate Limiting', value: 'rateLimit' },
          { name: 'CORS', value: 'cors' },
          { name: 'Compression', value: 'compression' },
        ],
      },
      {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another service?',
        default: false,
      },
    ]);

    const features: any = {
      database: false,
      cache: false,
      messageQueue: false,
      authentication: false,
      multiTenant: false,
      rateLimit: false,
      cors: false,
      compression: false,
      healthChecks: true,
      jwt: false,
    };

    serviceAnswers.features.forEach((feature: string) => {
      features[feature] = true;
    });

    newServices.push({
      name: serviceAnswers.name,
      port: serviceAnswers.port,
      type: serviceAnswers.type,
      features,
    });

    existingNames.add(serviceAnswers.name);
    existingPorts.add(serviceAnswers.port);
    addAnother = serviceAnswers.addAnother;
  }

  return [...currentServices, ...newServices];
}

export async function confirmConfiguration(config: Config): Promise<boolean> {
  console.log(chalk.cyan('\n📋 Configuration Summary:\n'));
  console.log(chalk.white('Project:'), chalk.green(config.project.name));
  console.log(chalk.white('Database:'), chalk.green(config.infrastructure.database.type));
  console.log(chalk.white('Services:'), config.services.map(s => chalk.green(s.name)).join(', '));
  console.log(chalk.white('Use Cases:'), config.useCases?.join(', ') || 'None specified');
  console.log();

  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed with this configuration?',
      default: true,
    },
  ]);

  return confirmed;
}