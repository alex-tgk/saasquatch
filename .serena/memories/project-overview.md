# SaaSQuatch Project Overview

## Purpose
SaaSQuatch is a production-ready CLI tool that generates complete microservices architectures using Fastify, PostgreSQL/SQLite, Redis, and NATS. It's designed to scaffold production-ready microservices with best practices built-in.

## Tech Stack
- **Language**: TypeScript (strict mode)
- **CLI Framework**: Commander.js + Inquirer.js  
- **Generator**: Plop.js with Handlebars templates
- **Package Manager**: pnpm (workspaces)
- **Testing**: Jest
- **Generated Services**: Fastify 4.x, PostgreSQL/SQLite, Redis, NATS

## Project Status
- Phase 1 (Week 1) core objectives complete
- CLI generates projects successfully
- 10/10 tests passing
- Generated services have TypeScript compilation errors
- Missing some production-ready polish

## Key Files
- `packages/cli/` - Main CLI implementation
- `packages/templates/` - Service templates
- `test-project-output/` - Example generated project