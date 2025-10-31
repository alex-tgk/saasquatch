import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { promptProjectConfig, confirmConfiguration } from '../prompts/project.prompts.js';
import { ProjectGenerator } from '../generators/project.generator.js';
import { ConfigSchema, type Config } from '../types/config.types.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createInitCommand(): Command {
  return new Command('init')
    .argument('[project-name]', 'Project name')
    .description('Initialize a new SaaS project with Fastify microservices')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('--dry-run', 'Preview what would be generated without creating files')
    .action(async (projectName?: string, options?: any) => {
      console.log(chalk.bold.blue('\n🚀 SaaSaaS Project Generator\n'));
      console.log(chalk.gray('Generate production-ready Fastify microservices\n'));

      let config: Config;
      const spinner = ora();

      try {
        // Step 1: Gather configuration
        if (options?.config) {
          // Load configuration from file
          spinner.start('Loading configuration from file...');
          const configPath = path.resolve(process.cwd(), options.config);

          if (!await fs.pathExists(configPath)) {
            spinner.fail(`Configuration file not found: ${configPath}`);
            process.exit(1);
          }

          const configData = await fs.readJSON(configPath);
          config = ConfigSchema.parse(configData);
          spinner.succeed('Configuration loaded');
        } else if (options?.yes) {
          // Use defaults with project name
          spinner.start('Using default configuration...');
          const partialConfig = {
            version: '1.0.0',
            project: {
              name: projectName || 'my-saas-platform',
              description: 'A modern SaaS platform built with Fastify microservices',
              packageManager: 'pnpm' as const,
            },
            framework: {
              name: 'fastify' as const,
              version: '^4.24.0',
            },
            infrastructure: {
              cache: {
                type: 'redis' as const,
                version: '7-alpine',
              },
              database: {
                type: 'postgresql' as const,
                version: '16-alpine',
                strategy: 'separate' as const,
              },
              messageQueue: {
                type: 'nats' as const,
                version: '2.10-alpine',
              },
            },
            services: [
              {
                name: 'api-gateway',
                port: 3000,
                type: 'gateway' as const,
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
              },
              {
                name: 'auth-service',
                port: 3001,
                type: 'auth' as const,
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
              },
              {
                name: 'user-service',
                port: 3002,
                type: 'standard' as const,
                features: {
                  database: true,
                  cache: true,
                  messageQueue: true,
                  authentication: true,
                  multiTenant: false,
                  rateLimit: false,
                  cors: false,
                  compression: false,
                  healthChecks: true,
                  jwt: false,
                },
              },
            ],
            observability: {
              logging: {
                provider: 'pino' as const,
                level: 'info' as const,
              },
              healthChecks: true,
              tracing: {
                provider: 'opentelemetry' as const,
                enabled: true,
              },
            },
            deployment: {
              target: 'docker-compose' as const,
            },
            useCases: ['api-first'] as const,
          };
          config = ConfigSchema.parse(partialConfig);
          spinner.succeed('Default configuration ready');
        } else {
          // Interactive prompts
          const partialConfig = await promptProjectConfig();

          // Override project name if provided as argument
          if (projectName) {
            if (partialConfig.project) {
              partialConfig.project.name = projectName;
            }
          }

          // Validate configuration
          config = ConfigSchema.parse(partialConfig);

          // Confirm configuration
          const confirmed = await confirmConfiguration(config);
          if (!confirmed) {
            console.log(chalk.yellow('\nProject generation cancelled.'));
            process.exit(0);
          }
        }

        // Step 2: Check for existing project
        const projectDir = path.join(process.cwd(), config.project.name);

        if (await fs.pathExists(projectDir)) {
          if (!options?.yes) {
            console.log(chalk.yellow(`\n⚠️  Directory ${config.project.name} already exists.`));
            const { overwrite } = await import('inquirer').then(m =>
              m.default.prompt([{
                type: 'confirm',
                name: 'overwrite',
                message: 'Overwrite existing directory?',
                default: false,
              }])
            );

            if (!overwrite) {
              console.log(chalk.yellow('\nProject generation cancelled.'));
              process.exit(0);
            }
          }

          spinner.start('Removing existing directory...');
          await fs.remove(projectDir);
          spinner.succeed('Existing directory removed');
        }

        // Step 3: Write configuration file
        if (!options?.dryRun) {
          spinner.start('Writing configuration...');
          await fs.ensureDir(projectDir);
          const configPath = path.join(projectDir, 'saasquatch.config.json');
          await fs.writeJSON(configPath, config, { spaces: 2 });
          spinner.succeed(`Configuration saved to ${chalk.green('saasquatch.config.json')}`);
        } else {
          console.log(chalk.cyan('\n[DRY RUN] Would save configuration to:'));
          console.log(path.join(projectDir, 'saasquatch.config.json'));
        }

        // Step 4: Generate project
        if (!options?.dryRun) {
          spinner.start('Generating project structure...');
          const generator = new ProjectGenerator(config);
          await generator.generate(projectDir);
          spinner.succeed('Project structure generated');
        } else {
          console.log(chalk.cyan('\n[DRY RUN] Would generate the following structure:'));
          console.log(chalk.gray('  ' + config.project.name + '/'));
          console.log(chalk.gray('  ├── saasquatch.config.json'));
          console.log(chalk.gray('  ├── package.json'));
          console.log(chalk.gray('  ├── pnpm-workspace.yaml'));
          console.log(chalk.gray('  ├── docker-compose.yml'));
          console.log(chalk.gray('  ├── .env.example'));
          console.log(chalk.gray('  ├── services/'));
          config.services.forEach(service => {
            console.log(chalk.gray(`  │   ├── ${service.name}/`));
          });
          console.log(chalk.gray('  ├── shared/'));
          console.log(chalk.gray('  ├── infrastructure/'));
          console.log(chalk.gray('  └── docs/'));
        }

        // Step 5: Success message and next steps
        console.log(chalk.bold.green('\n✨ Project created successfully!\n'));

        if (!options?.dryRun) {
          console.log(chalk.white('Next steps:'));
          console.log(chalk.gray(`  cd ${config.project.name}`));

          if (config.project.packageManager === 'pnpm') {
            console.log(chalk.gray('  pnpm install'));
          } else if (config.project.packageManager === 'yarn') {
            console.log(chalk.gray('  yarn install'));
          } else {
            console.log(chalk.gray('  npm install'));
          }

          console.log(chalk.gray('  docker-compose up -d  # Start infrastructure'));

          if (config.project.packageManager === 'pnpm') {
            console.log(chalk.gray('  pnpm dev              # Start all services'));
          } else if (config.project.packageManager === 'yarn') {
            console.log(chalk.gray('  yarn dev              # Start all services'));
          } else {
            console.log(chalk.gray('  npm run dev           # Start all services'));
          }

          console.log();
          console.log(chalk.cyan('📚 Documentation:'));
          console.log(chalk.gray('  README.md            - Getting started guide'));
          console.log(chalk.gray('  docs/architecture.md - Architecture overview'));
          console.log(chalk.gray('  docs/development.md  - Development guide'));

          console.log();
          console.log(chalk.cyan('🔗 Service URLs:'));
          config.services.forEach(service => {
            console.log(chalk.gray(`  ${service.name}: http://localhost:${service.port}`));
            if (service.features.healthChecks) {
              console.log(chalk.gray(`    └─ Health: http://localhost:${service.port}/health`));
            }
          });

          console.log();
          console.log(chalk.cyan('🎯 Available Commands:'));
          console.log(chalk.gray('  saasquatch add service   - Add a new service'));
          console.log(chalk.gray('  saasquatch add route     - Add a new route'));
          console.log(chalk.gray('  saasquatch test          - Run tests'));
          console.log(chalk.gray('  saasquatch deploy        - Deploy to production'));
        }

      } catch (error) {
        spinner.fail('Failed to create project');

        if (error instanceof Error) {
          console.error(chalk.red('\nError:'), error.message);

          if (error.name === 'ZodError') {
            console.error(chalk.red('\nValidation errors:'));
            const zodError = error as any;
            zodError.errors?.forEach((err: any) => {
              console.error(chalk.red(`  - ${err.path.join('.')}: ${err.message}`));
            });
          }
        } else {
          console.error(chalk.red('\nUnknown error:'), error);
        }

        process.exit(1);
      }
    });
}

// Helper function to display a summary of what will be generated
export function displayGenerationSummary(config: Config): void {
  console.log(chalk.cyan('\n📦 What will be generated:\n'));

  console.log(chalk.white('Project Structure:'));
  console.log(chalk.gray('  • Monorepo with pnpm workspaces'));
  console.log(chalk.gray('  • TypeScript configuration (strict mode)'));
  console.log(chalk.gray('  • ESLint and Prettier setup'));
  console.log(chalk.gray('  • Git hooks with Husky'));

  console.log(chalk.white('\nServices:'));
  config.services.forEach(service => {
    console.log(chalk.green(`  ${service.name} (port ${service.port})`));
    const features = [];
    if (service.features.database) features.push('Database');
    if (service.features.cache) features.push('Redis');
    if (service.features.messageQueue) features.push('NATS');
    if (service.features.authentication) features.push('Auth');
    if (service.features.multiTenant) features.push('Multi-tenant');
    if (features.length > 0) {
      console.log(chalk.gray(`    Features: ${features.join(', ')}`));
    }
  });

  console.log(chalk.white('\nInfrastructure:'));
  console.log(chalk.gray(`  • Database: ${config.infrastructure.database.type}`));
  console.log(chalk.gray(`  • Cache: ${config.infrastructure.cache.type}`));
  console.log(chalk.gray(`  • Message Queue: ${config.infrastructure.messageQueue.type}`));
  console.log(chalk.gray('  • Docker Compose configuration'));

  console.log(chalk.white('\nObservability:'));
  console.log(chalk.gray(`  • Logging: ${config.observability.logging.provider} (${config.observability.logging.level})`));
  console.log(chalk.gray(`  • Health checks: ${config.observability.healthChecks ? 'Enabled' : 'Disabled'}`));
  console.log(chalk.gray(`  • Tracing: ${config.observability.tracing.enabled ? 'OpenTelemetry' : 'Disabled'}`));

  console.log(chalk.white('\nDocumentation:'));
  console.log(chalk.gray('  • README with quickstart guide'));
  console.log(chalk.gray('  • OpenAPI/Swagger documentation'));
  console.log(chalk.gray('  • Architecture diagrams'));
  console.log(chalk.gray('  • Development guides'));

  console.log();
}