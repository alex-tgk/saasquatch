# Code Style and Conventions

## TypeScript
- Strict mode enabled
- ESM modules (type: "module")
- Target: ES2022
- Explicit typing for all parameters and returns
- Interfaces over types when possible

## Naming Conventions
- Files: kebab-case (e.g., project-generator.ts)
- Classes: PascalCase
- Functions/Methods: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: IPrefixed or suffix with Interface

## Project Structure
- Monorepo using pnpm workspaces
- Each package in packages/ directory
- Templates use Handlebars (.hbs extension)
- Shared utilities in packages/core

## Fastify Patterns
- Plugin-based architecture
- JSON Schema validation for all routes
- Dependency injection pattern
- Centralized error handling

## Testing
- Jest for unit tests
- Test files next to source with .test.ts suffix
- Coverage target: 80%+
- Integration tests in test/integration/

## Documentation
- JSDoc for public APIs
- README in each package
- Architecture docs in docs/