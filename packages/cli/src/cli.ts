#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createInitCommand } from './commands/init.js';
import { createAddCommand } from './commands/add.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs-extra';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Read package.json for version
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = await fs.readJSON(packageJsonPath);

  const program = new Command();

  program
    .name('saasquatch')
    .description('CLI for generating production-ready Fastify microservices')
    .version(packageJson.version)
    .usage('<command> [options]')
    .addHelpText('after', `
${chalk.gray('Examples:')}
  ${chalk.cyan('saasquatch init my-project')}        Create a new project
  ${chalk.cyan('saasquatch init my-project -y')}     Create with default configuration
  ${chalk.cyan('saasquatch init -c config.json')}    Create from configuration file
  
${chalk.gray('For more information, visit:')} ${chalk.blue('https://github.com/saasquatch/cli')}
`);

  // Add commands
  program.addCommand(createInitCommand());
  program.addCommand(createAddCommand());

  program
    .command('test')
    .description('Run tests for services')
    .option('-s, --service <name>', 'Test specific service')
    .option('--coverage', 'Generate coverage report')
    .action(async (options) => {
      console.log(chalk.yellow(`\n⚠️  The 'test' command is not yet implemented.`));
      console.log(chalk.gray('This feature will be available in a future release.'));
    });

  program
    .command('deploy')
    .description('Deploy services to production')
    .option('-t, --target <environment>', 'Deployment target', 'production')
    .action(async (options) => {
      console.log(chalk.yellow(`\n⚠️  The 'deploy' command is not yet implemented.`));
      console.log(chalk.gray('This feature will be available in a future release.'));
    });

  // Global error handling
  program.exitOverride();

  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    if (error.code === 'commander.unknownCommand') {
      console.error(chalk.red(`\n❌ Unknown command: ${error.command}`));
      console.log(chalk.gray('\nRun'), chalk.cyan('saasquatch --help'), chalk.gray('to see available commands'));
    } else if (error.code === 'commander.help') {
      // Help was displayed, exit normally
      process.exit(0);
    } else if (error.code === 'commander.version') {
      // Version was displayed, exit normally
      process.exit(0);
    } else {
      console.error(chalk.red('\n❌ An error occurred:'), error.message);
    }
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error: Error) => {
  console.error(chalk.red('\n❌ Unhandled error:'), error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});

// Run the CLI
main().catch((error) => {
  console.error(chalk.red('\n❌ Fatal error:'), error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});