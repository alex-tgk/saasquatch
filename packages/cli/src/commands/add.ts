import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { ServiceGenerator } from '../generators/service.generator.js';
import { RouteGenerator } from '../generators/route.generator.js';
import { ModelGenerator } from '../generators/model.generator.js';

export function createAddCommand(): Command {
  const add = new Command('add');

  add
    .description('Add a new service, route, or model to an existing project')
    .argument('<type>', 'Type to add (service, route, model)')
    .argument('[name]', 'Name of the service/route/model')
    .option('-p, --path <path>', 'Project path', process.cwd())
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (type: string, name: string | undefined, options) => {
      try {
        // Validate we're in a SaaSQuatch project
        const configPath = path.join(options.path, 'saasquatch.config.json');
        if (!await fs.pathExists(configPath)) {
          console.error(chalk.red('\n❌ Error: Not a SaaSQuatch project'));
          console.log(chalk.gray('Run this command from a project root directory'));
          console.log(chalk.gray('or use --path to specify the project location'));
          process.exit(1);
        }

        // Load project config
        const config = await fs.readJSON(configPath);

        switch (type.toLowerCase()) {
          case 'service':
            await addService(name, config, options);
            break;

          case 'route':
            await addRoute(name, config, options);
            break;

          case 'model':
            await addModel(name, config, options);
            break;

          default:
            console.error(chalk.red(`\n❌ Unknown type: ${type}`));
            console.log(chalk.gray('Valid types: service, route, model'));
            process.exit(1);
        }
      } catch (error: any) {
        console.error(chalk.red('\n❌ Error:'), error.message);
        if (process.env.DEBUG) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });

  return add;
}

async function addService(
  name: string | undefined,
  config: any,
  options: any
): Promise<void> {
  console.log(chalk.cyan('\n📦 Adding new service...\n'));

  // Prompt for service details if not provided
  let serviceName = name;
  let serviceDetails: any = {};

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Service name:',
        default: serviceName || 'new-service',
        when: !serviceName,
        validate: (input) => {
          if (!input) return 'Service name is required';
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Service name must be lowercase with hyphens (e.g., user-service)';
          }
          // Check if service already exists
          if (config.services.some((s: any) => s.name === input)) {
            return `Service '${input}' already exists`;
          }
          return true;
        }
      },
      {
        type: 'number',
        name: 'port',
        message: 'Service port:',
        default: () => {
          // Auto-assign next available port
          const usedPorts = config.services.map((s: any) => s.port);
          const maxPort = Math.max(...usedPorts, 3000);
          return maxPort + 1;
        },
        validate: (input) => {
          if (input < 1024 || input > 65535) {
            return 'Port must be between 1024 and 65535';
          }
          if (config.services.some((s: any) => s.port === input)) {
            return `Port ${input} is already in use`;
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features:',
        choices: [
          { name: 'Database', value: 'database', checked: true },
          { name: 'Cache (Redis)', value: 'cache', checked: true },
          { name: 'Message Queue (NATS)', value: 'messageQueue', checked: true },
          { name: 'JWT Authentication', value: 'jwt', checked: false },
          { name: 'Health Checks', value: 'healthChecks', checked: true },
          { name: 'CORS', value: 'cors', checked: true },
          { name: 'Rate Limiting', value: 'rateLimit', checked: false },
          { name: 'Compression', value: 'compression', checked: true }
        ]
      }
    ]);

    serviceName = answers.name || serviceName;
    serviceDetails = {
      port: answers.port,
      features: Object.fromEntries(
        answers.features.map((f: string) => [f, true])
      )
    };
  } else {
    // Use defaults
    const usedPorts = config.services.map((s: any) => s.port);
    const maxPort = Math.max(...usedPorts, 3000);

    serviceDetails = {
      port: maxPort + 1,
      features: {
        database: true,
        cache: true,
        messageQueue: true,
        healthChecks: true,
        cors: true,
        compression: true
      }
    };
  }

  // Ensure serviceName is defined
  if (!serviceName) {
    console.error(chalk.red('\n❌ Service name is required'));
    process.exit(1);
  }

  // Add service to config
  const newService = {
    name: serviceName,
    port: serviceDetails.port,
    features: serviceDetails.features
  };

  config.services.push(newService);

  // Save updated config
  const configPath = path.join(options.path, 'saasquatch.config.json');
  await fs.writeJSON(configPath, config, { spaces: 2 });

  // Generate service files
  console.log(chalk.gray('\nGenerating service files...'));
  const generator = new ServiceGenerator(config, options.path);
  await generator.generateService(newService);

  console.log(chalk.green('\n✅ Service added successfully!'));
  console.log(chalk.gray('\nService details:'));
  console.log(chalk.gray(`  Name: ${serviceName}`));
  console.log(chalk.gray(`  Port: ${serviceDetails.port}`));
  console.log(chalk.gray(`  Location: services/${serviceName}/`));

  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.gray(`  cd services/${serviceName}`));
  console.log(chalk.gray('  pnpm install'));
  console.log(chalk.gray('  pnpm dev'));
}

async function addRoute(
  name: string | undefined,
  config: any,
  options: any
): Promise<void> {
  console.log(chalk.cyan('\n🛣️  Adding new route...\n'));

  // Get list of services
  const services = config.services.map((s: any) => s.name);

  if (services.length === 0) {
    console.error(chalk.red('❌ No services found in project'));
    console.log(chalk.gray('Add a service first using: saasquatch add service'));
    process.exit(1);
  }

  let routeDetails: any = {};

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'service',
        message: 'Select service:',
        choices: services
      },
      {
        type: 'input',
        name: 'name',
        message: 'Route name (e.g., users, posts):',
        default: name || 'items',
        validate: (input) => {
          if (!input) return 'Route name is required';
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Route name must be lowercase with hyphens';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'path',
        message: 'Route path:',
        default: (answers: any) => `/${answers.name}`,
        validate: (input) => {
          if (!input) return 'Route path is required';
          if (!input.startsWith('/')) {
            return 'Route path must start with /';
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        name: 'methods',
        message: 'HTTP methods:',
        choices: [
          { name: 'GET (list)', value: 'get-list', checked: true },
          { name: 'GET (by ID)', value: 'get-one', checked: true },
          { name: 'POST (create)', value: 'post', checked: true },
          { name: 'PUT (update)', value: 'put', checked: true },
          { name: 'DELETE', value: 'delete', checked: true }
        ],
        validate: (input) => {
          if (input.length === 0) return 'Select at least one method';
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'authentication',
        message: 'Require authentication?',
        default: true
      },
      {
        type: 'confirm',
        name: 'validation',
        message: 'Add JSON Schema validation?',
        default: true
      }
    ]);

    routeDetails = answers;
  } else {
    // Use defaults
    routeDetails = {
      service: services[0],
      name: name || 'items',
      path: `/${name || 'items'}`,
      methods: ['get-list', 'get-one', 'post', 'put', 'delete'],
      authentication: true,
      validation: true
    };
  }

  // Generate route file
  const generator = new RouteGenerator(config, options.path);
  await generator.generateRoute(routeDetails);

  console.log(chalk.green('\n✅ Route added successfully!'));
  console.log(chalk.gray('\nRoute details:'));
  console.log(chalk.gray(`  Service: ${routeDetails.service}`));
  console.log(chalk.gray(`  Name: ${routeDetails.name}`));
  console.log(chalk.gray(`  Path: ${routeDetails.path}`));
  console.log(chalk.gray(`  Methods: ${routeDetails.methods.join(', ')}`));
  console.log(chalk.gray(`  Location: services/${routeDetails.service}/src/routes/${routeDetails.name}.ts`));

  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.gray(`  cd services/${routeDetails.service}`));
  console.log(chalk.gray('  pnpm dev'));
}

async function addModel(
  name: string | undefined,
  config: any,
  options: any
): Promise<void> {
  console.log(chalk.cyan('\n📋 Adding new model...\n'));

  // Get list of services
  const services = config.services.map((s: any) => s.name);

  if (services.length === 0) {
    console.error(chalk.red('❌ No services found in project'));
    console.log(chalk.gray('Add a service first using: saasquatch add service'));
    process.exit(1);
  }

  let modelDetails: any = {};

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'service',
        message: 'Select service:',
        choices: services
      },
      {
        type: 'input',
        name: 'name',
        message: 'Model name (e.g., User, Post):',
        default: name || 'Item',
        validate: (input) => {
          if (!input) return 'Model name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Model name must be PascalCase (e.g., User, BlogPost)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'tableName',
        message: 'Table name:',
        default: (answers: any) => answers.name.toLowerCase() + 's',
        validate: (input) => {
          if (!input) return 'Table name is required';
          if (!/^[a-z][a-z0-9_]*$/.test(input)) {
            return 'Table name must be snake_case';
          }
          return true;
        }
      },
      {
        type: 'editor',
        name: 'fields',
        message: 'Define fields (one per line: name:type):',
        default: 'id:uuid\nname:string\nemail:string\ncreated_at:timestamp\nupdated_at:timestamp'
      },
      {
        type: 'confirm',
        name: 'timestamps',
        message: 'Add timestamps (created_at, updated_at)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'softDelete',
        message: 'Enable soft deletes?',
        default: false
      }
    ]);

    modelDetails = {
      ...answers,
      fields: answers.fields
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => {
          const [name, type] = line.split(':').map(s => s.trim());
          return { name, type };
        })
    };
  } else {
    // Use defaults
    modelDetails = {
      service: services[0],
      name: name || 'Item',
      tableName: (name || 'item').toLowerCase() + 's',
      fields: [
        { name: 'id', type: 'uuid' },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'timestamp' },
        { name: 'updated_at', type: 'timestamp' }
      ],
      timestamps: true,
      softDelete: false
    };
  }

  // Generate model file
  const generator = new ModelGenerator(config, options.path);
  await generator.generateModel(modelDetails);

  console.log(chalk.green('\n✅ Model added successfully!'));
  console.log(chalk.gray('\nModel details:'));
  console.log(chalk.gray(`  Service: ${modelDetails.service}`));
  console.log(chalk.gray(`  Name: ${modelDetails.name}`));
  console.log(chalk.gray(`  Table: ${modelDetails.tableName}`));
  console.log(chalk.gray(`  Fields: ${modelDetails.fields.length}`));
  console.log(chalk.gray(`  Location: services/${modelDetails.service}/src/models/${modelDetails.name.toLowerCase()}.model.ts`));

  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.gray(`  cd services/${modelDetails.service}`));
  console.log(chalk.gray('  npx knex migrate:make create_' + modelDetails.tableName));
}
