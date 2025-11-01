# User Commands - Comprehensive Development Workflow System

A suite of intelligent slash commands for streamlined project development.

## Available Commands

### 📋 `/user:create-prd`
**Product Requirements Document Generator**

Analyzes your entire project to create a comprehensive PRD with actionable development phases.

**What it does:**
- Scans project structure and technology stack
- Identifies complete and incomplete features
- Detects technical debt and gaps
- Generates phased development roadmap
- Creates tasks.json with actionable tasks
- Saves to `docs/planning/prd-{timestamp}.md`

**When to use:**
- Starting a new project
- After major scope changes
- When planning needs updating
- Before sprint planning

**Example usage:**
```
/user:create-prd
```

---

### ✅ `/user:next-task`
**Automated Task Selection and Implementation**

Intelligently selects and implements the next appropriate task based on dependencies and priority.

**What it does:**
- Checks for PRD (creates if missing)
- Reads tasks.json or Task Master
- Selects task based on priority/dependencies/complexity
- Creates feature branch
- Implements solution following project patterns
- Writes tests
- Updates task status

**When to use:**
- Starting work session
- After completing previous task
- When unsure what to work on next

**Example usage:**
```
/user:next-task
```

**Task selection criteria:**
1. Phase (1 > 2 > 3)
2. Dependencies met
3. Complexity (S > M > L > XL)
4. Status (pending > blocked)

---

### 🏗️ `/user:setup-project`
**Production-Ready Project Scaffolding**

Initializes a new project with opinionated, production-ready configuration.

**What it does:**
- Detects or asks for project type
- Sets up package manager (Bun/pnpm/npm)
- Configures TypeScript with strict mode
- Sets up ESLint + Prettier with auto-fix
- Installs Tailwind CSS
- Creates MVC folder structure
- Sets up git hooks (Husky)
- Generates .env.example
- Creates comprehensive README

**When to use:**
- Starting new project
- Converting unstructured codebase
- Standardizing project setup

**Example usage:**
```
/user:setup-project
```

**Supported project types:**
- TypeScript/Node.js (Backend/Frontend)
- Python (FastAPI, Django, Flask)
- Full-stack (Next.js, Remix)
- Monorepo (pnpm workspaces, Turborepo)

---

### 🚀 `/user:productionize`
**Production Readiness Analyzer and Fixer**

Scans project for non-production code and auto-fixes or presents resolution options.

**What it does:**
- Scans for mock data, TODOs, console.logs
- Identifies hardcoded values
- Detects missing error handling
- Finds TypeScript `any` types
- Checks for security issues
- Auto-fixes safe issues
- Presents options for complex issues
- Generates production readiness report

**When to use:**
- Before production deployment
- During code cleanup
- For security audits
- When removing development artifacts

**Example usage:**
```
/user:productionize
```

**Categories scanned:**
- Mock data and test fixtures
- Development artifacts
- TODOs and incomplete code
- Configuration issues
- Error handling gaps
- Type safety issues
- Security concerns
- Performance issues

---

### 👀 `/user:review-pr`
**Intelligent Pull Request Review**

Performs comprehensive code review on current branch changes.

**What it does:**
- Analyzes all changed files
- Checks code style compliance
- Validates pattern consistency
- Ensures type safety
- Reviews error handling
- Identifies security vulnerabilities
- Assesses performance implications
- Checks test coverage
- Generates structured review report

**When to use:**
- Before creating pull request
- After implementing feature
- For self-review
- Before requesting team review

**Example usage:**
```
/user:review-pr
```

**Review criteria:**
- const-only, arrow functions, destructuring
- Pattern consistency
- TypeScript strict types
- Error handling
- Security (SQL injection, XSS, etc.)
- Performance
- Test coverage
- Documentation

---

### ♻️ `/user:refactor-smart`
**Pattern-Based Code Refactoring**

Transforms code to match modern patterns and project conventions.

**What it does:**
- Converts var/let to const
- Transforms functions to arrow functions
- Applies destructuring
- Fixes spacing and formatting
- Implements immutability patterns
- Extracts to services
- Improves error handling
- Adds TypeScript types
- Uses template literals

**When to use:**
- Cleaning up legacy code
- Standardizing code style
- Modernizing codebase
- Before major refactoring

**Example usage:**
```
/user:refactor-smart
```

**Transformations:**
- Variable declarations (var/let → const)
- Function style (function → arrow)
- Object/array destructuring
- Immutability patterns
- Service provider patterns
- Template literals
- TypeScript improvements

---

### 🧪 `/user:test-coverage`
**Automated Test Generation**

Analyzes test coverage and generates missing tests to achieve 80% minimum.

**What it does:**
- Runs coverage analysis
- Identifies untested code paths
- Generates comprehensive tests
- Covers happy path, errors, edge cases
- Follows project test patterns
- Achieves 80%+ coverage target

**When to use:**
- Before deployment
- During feature development
- For coverage improvements
- When adding critical features

**Example usage:**
```
/user:test-coverage
```

**Test types generated:**
- Happy path tests
- Error condition tests
- Edge case tests
- Integration tests
- Mock/stub tests

---

### 📚 `/user:api-docs`
**Comprehensive API Documentation Generator**

Generates complete API documentation in multiple formats.

**What it does:**
- Scans all API routes
- Extracts request/response schemas
- Generates OpenAPI/Swagger spec
- Creates Markdown documentation
- Builds Postman collection
- Generates TypeScript types
- Includes examples

**When to use:**
- After adding API endpoints
- Before API release
- For API documentation updates
- When onboarding developers

**Example usage:**
```
/user:api-docs
```

**Output formats:**
- OpenAPI 3.0 (YAML/JSON)
- Markdown documentation
- Postman collection
- TypeScript type definitions

---

### 📊 `/user:sync-progress`
**Project Progress Tracker**

Updates task tracking, calculates metrics, and generates progress reports.

**What it does:**
- Updates tasks.json from git activity
- Calculates velocity metrics
- Generates burndown charts
- Creates daily standup notes
- Updates PRD with completions
- Updates CHANGELOG
- Commits documentation
- Generates weekly reports

**When to use:**
- End of day
- During standup meetings
- End of sprint
- For progress tracking

**Example usage:**
```
/user:sync-progress
```

**Metrics calculated:**
- Sprint velocity
- Completion rates
- Burndown progress
- Time tracking
- Category breakdown

---

## Command Workflow

### Typical Development Flow

```
1. Start New Project
   /user:setup-project

2. Plan Development
   /user:create-prd

3. Implement Features (Repeat)
   /user:next-task
   [Work on implementation]
   /user:test-coverage
   /user:refactor-smart
   /user:sync-progress

4. Before PR
   /user:review-pr
   /user:productionize

5. Generate Documentation
   /user:api-docs
   /user:sync-progress
```

### Sprint Workflow

```
Monday:
- /user:create-prd (if needed)
- /user:next-task

Daily:
- /user:next-task
- /user:sync-progress (end of day)

Before Merge:
- /user:test-coverage
- /user:review-pr
- /user:productionize

Weekly:
- /user:sync-progress (weekly report)
- /user:api-docs (update docs)
```

## File Structure

All commands follow this file structure:

```
project/
├── tasks.json                          # Task tracking
├── docs/
│   ├── planning/
│   │   ├── prd-{timestamp}.md          # PRD documents
│   │   ├── prd-latest.md               # Latest PRD
│   │   ├── standup-{date}.md           # Daily standups
│   │   ├── weekly-report-{date}.md     # Weekly reports
│   │   └── production-readiness.md     # Prod readiness
│   └── api/
│       ├── openapi.yaml                # API spec
│       ├── openapi.json                # API spec (JSON)
│       ├── README.md                   # API docs
│       └── postman-collection.json     # Postman
├── .env.example                        # Environment template
└── CHANGELOG.md                        # Project changelog
```

## Global Behaviors

All commands follow these principles:

### 1. Project Awareness
- Detect and respect existing structure
- Follow established code patterns
- Use project's package manager
- Respect .gitignore

### 2. User Preferences
- TypeScript with const-only, arrow functions
- Functional style with immutability
- Clean code with proper spacing
- Service provider patterns
- Tailwind CSS for styling
- ESLint + Prettier with auto-fix

### 3. Error Handling
- Validate prerequisites
- Provide clear error messages
- Offer rollback when appropriate
- Never leave project broken

### 4. Documentation
- Update docs automatically
- Include inline comments
- Maintain changelog
- Generate reports

### 5. Git Integration
- Meaningful commit messages
- Follow conventional commits
- Never commit to main/master
- Stash changes if needed

## Configuration

### tasks.json Schema

```json
{
  "project": {
    "name": "string",
    "version": "string",
    "generatedAt": "ISO date",
    "prdSource": "path to PRD"
  },
  "tasks": [
    {
      "id": "TASK-XXX",
      "title": "string",
      "description": "string",
      "phase": 1 | 2 | 3,
      "status": "pending" | "in_progress" | "review" | "completed" | "blocked",
      "priority": "critical" | "high" | "medium" | "low",
      "complexity": "S" | "M" | "L" | "XL",
      "dependencies": ["TASK-XXX"],
      "branch": "feature/task-xxx-name",
      "estimatedHours": number,
      "tags": ["string"],
      "acceptanceCriteria": ["string"],
      "implementationNotes": "string",
      "startedAt": "ISO date" | null,
      "completedAt": "ISO date" | null,
      "assignedTo": "string" | null
    }
  ],
  "metadata": {
    "totalTasks": number,
    "byStatus": { "pending": 0, ... },
    "byPhase": { "1": 0, ... },
    "byComplexity": { "S": 0, ... }
  }
}
```

## Tips and Best Practices

### Getting Started
1. Start with `/user:setup-project` for new projects
2. Use `/user:create-prd` to plan development
3. Use `/user:next-task` to begin implementation

### During Development
- Run `/user:sync-progress` daily
- Use `/user:test-coverage` for critical features
- Use `/user:refactor-smart` for code cleanup

### Before Deployment
- Run `/user:productionize` first
- Run `/user:review-pr` for self-review
- Run `/user:test-coverage` to ensure 80%+
- Run `/user:api-docs` for documentation

### For Team Collaboration
- Commit generated reports
- Share PRD and task breakdowns
- Use standup notes for updates
- Keep changelog updated

## Troubleshooting

### Command Not Found
- Ensure you're in `.claude/commands/user/` directory
- Check file has `.md` extension
- Verify command syntax: `/user:command-name`

### Tasks.json Not Found
- Run `/user:create-prd` first
- Check project root for `tasks.json`
- Verify file permissions

### Tests Not Running
- Check test framework installed
- Verify `npm test` or equivalent works
- Check for test configuration

### Git Issues
- Ensure git repository initialized
- Check for uncommitted changes
- Verify remote repository configured

## Support

For issues or questions:
1. Check command's README section
2. Review output logs
3. Verify prerequisites met
4. Check project configuration

---

**Created**: 2025-10-31
**Commands**: 9
**Author**: Claude Code Development System
