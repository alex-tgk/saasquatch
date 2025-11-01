# Setup Project - Production-Ready Project Scaffolding

Initialize a new project with opinionated, production-ready configuration based on your preferences.

## Project Type Detection

**Detecting project type...**

I'll identify the project type from:
- Existing package.json, requirements.txt, Gemfile, etc.
- Current directory structure
- Your preferences (I'll ask if unclear)

Supported project types:
- TypeScript/Node.js (Backend/Frontend)
- Python (FastAPI, Django, Flask)
- Full-stack (Next.js, Remix, etc.)
- Monorepo (pnpm workspaces, Turborepo)

## TypeScript Project Setup

For TypeScript projects, I'll configure:

### 1. Package Manager Selection
**Detecting/asking for preference...**

Options:
- **Bun** - Fastest, modern, built-in TypeScript
- **pnpm** - Fast, disk efficient, good for monorepos
- **npm** - Standard, widely compatible
- **yarn** - Good workspaces support

### 2. TypeScript Configuration

Creating `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. ESLint Configuration

Creating `.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "prefer-const": "error",
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    "object-shorthand": "error",
    "prefer-destructuring": ["error", { "object": true, "array": true }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-else-return": "error"
  }
}
```

### 4. Prettier Configuration

Creating `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false
}
```

### 5. Tailwind CSS Setup

Installing and configuring Tailwind:

```bash
# Install dependencies
{package-manager} add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 6. Folder Structure

Creating opinionated MVC structure:

```
project/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── entities/         # Data models/types
│   ├── repositories/     # Data access layer
│   ├── middleware/       # Express/Fastify middleware
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript type definitions
│   ├── config/           # Configuration files
│   ├── validators/       # Input validation schemas
│   └── index.ts          # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── api/              # API documentation
│   ├── architecture/     # System design docs
│   └── planning/         # PRDs, roadmaps
├── scripts/              # Build/deploy scripts
├── .env.example          # Environment variables template
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

### 7. Git Hooks (Husky)

Setting up pre-commit hooks:

```bash
npx husky-init
```

`.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linter with auto-fix
npm run lint:fix

# Run type check
npm run type-check

# Run tests
npm run test

# Add fixed files
git add -u
```

### 8. Package.json Scripts

Adding useful scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist",
    "prepare": "husky install"
  }
}
```

### 9. Environment Variables

Creating `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=my-app

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# External APIs
API_KEY=
API_SECRET=

# Logging
LOG_LEVEL=debug
```

### 10. README Template

Creating comprehensive README:

```markdown
# Project Name

Brief description of what this project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- TypeScript
- Node.js / Bun
- Framework (Express/Fastify/Next.js)
- Database (PostgreSQL/MongoDB)
- Redis
- Tailwind CSS

## Prerequisites

- Node.js 20+
- {Package Manager} (pnpm/bun/npm)
- PostgreSQL 16+
- Redis 7+

## Getting Started

1. Clone repository
\`\`\`bash
git clone <repo-url>
cd project-name
\`\`\`

2. Install dependencies
\`\`\`bash
{package-manager} install
\`\`\`

3. Setup environment
\`\`\`bash
cp .env.example .env
# Edit .env with your values
\`\`\`

4. Run development server
\`\`\`bash
{package-manager} dev
\`\`\`

## Scripts

- \`dev\` - Start development server
- \`build\` - Build for production
- \`start\` - Run production build
- \`test\` - Run tests
- \`lint\` - Check code quality
- \`format\` - Format code

## Project Structure

See [docs/architecture/structure.md](docs/architecture/structure.md)

## API Documentation

See [docs/api/README.md](docs/api/README.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

## Python Project Setup

For Python projects (FastAPI/Django/Flask):

### Structure
```
project/
├── app/
│   ├── api/              # API routes
│   ├── core/             # Config, security
│   ├── models/           # Data models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   └── utils/            # Helpers
├── tests/
├── alembic/              # Migrations
├── requirements.txt
├── pyproject.toml
└── .env.example
```

### Tools Setup
- Poetry or pip-tools for dependency management
- Black for formatting
- Ruff for linting
- MyPy for type checking
- Pytest for testing

## Installation Process

I will:

1. **Detect existing setup** - Check what's already configured
2. **Ask for preferences** - Package manager, framework choices
3. **Install dependencies** - All required packages
4. **Create configuration files** - ESLint, Prettier, TypeScript, etc.
5. **Setup folder structure** - MVC pattern with best practices
6. **Configure git hooks** - Pre-commit linting and testing
7. **Generate .env.example** - Common environment variables
8. **Create README** - Comprehensive documentation
9. **Initialize git** - If not already initialized
10. **Make initial commit** - "chore: initial project setup"

## Customization Options

I'll ask about:

- **Framework**: Express, Fastify, Next.js, Remix, etc.
- **Database**: PostgreSQL, MySQL, MongoDB, SQLite
- **ORM**: Prisma, TypeORM, Drizzle, Mongoose
- **Testing**: Jest, Vitest, Playwright
- **Styling**: Tailwind, CSS Modules, Styled Components
- **State Management**: Redux, Zustand, Jotai (for frontend)
- **API Type**: REST, GraphQL, tRPC
- **Monorepo**: Single package vs. workspace

## Post-Setup Checklist

After setup, I'll verify:

- ✅ All dependencies installed
- ✅ TypeScript compiles without errors
- ✅ Linter runs without errors
- ✅ Tests can run (even if empty)
- ✅ Git hooks work
- ✅ Development server starts
- ✅ .env.example exists
- ✅ README is comprehensive

## Next Steps

After setup completes:

1. Review generated configuration
2. Update .env with your values
3. Run `{package-manager} dev` to start
4. Begin development with `/user:next-task`

Starting project setup now...
