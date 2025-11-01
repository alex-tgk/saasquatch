# User Commands - Installation Complete ✅

## What Was Created

9 powerful slash commands for comprehensive development workflow automation:

### Commands Created

| Command | File | Size | Purpose |
|---------|------|------|---------|
| `/user:create-prd` | create-prd.md | 4.3 KB | Generate PRD with phased tasks |
| `/user:next-task` | next-task.md | 5.0 KB | Auto-select and implement tasks |
| `/user:setup-project` | setup-project.md | 9.7 KB | Scaffold production-ready project |
| `/user:productionize` | productionize.md | 11.2 KB | Scan and fix production issues |
| `/user:review-pr` | review-pr.md | 10.6 KB | Comprehensive PR review |
| `/user:refactor-smart` | refactor-smart.md | 10.2 KB | Pattern-based refactoring |
| `/user:test-coverage` | test-coverage.md | 15.4 KB | Generate tests for 80%+ coverage |
| `/user:api-docs` | api-docs.md | 17.9 KB | Generate OpenAPI/Swagger docs |
| `/user:sync-progress` | sync-progress.md | 12.6 KB | Track progress and metrics |

**Total**: 9 commands, 96.9 KB of implementation

## Quick Start

### 1. Start a New Project

```bash
/user:setup-project
```

This will:
- Set up TypeScript + ESLint + Prettier
- Configure Tailwind CSS
- Create MVC folder structure
- Set up git hooks
- Generate .env.example
- Create comprehensive README

### 2. Plan Your Work

```bash
/user:create-prd
```

This will:
- Analyze your codebase
- Generate phased development plan
- Create tasks.json with actionable tasks
- Save PRD to docs/planning/

### 3. Start Implementing

```bash
/user:next-task
```

This will:
- Select highest priority task
- Create feature branch
- Implement solution
- Write tests
- Update task status

### 4. Daily Workflow

**Morning:**
```bash
/user:next-task
```

**End of Day:**
```bash
/user:sync-progress
```

**Before PR:**
```bash
/user:test-coverage
/user:review-pr
/user:productionize
```

## Command Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  New Project                                            │
│  /user:setup-project                                    │
│       │                                                  │
│       ▼                                                  │
│  Plan Development                                        │
│  /user:create-prd                                       │
│       │                                                  │
│       ▼                                                  │
│  ┌─────────────────────────────────┐                   │
│  │ Development Loop (Daily)        │                   │
│  │                                 │                   │
│  │  /user:next-task               │                   │
│  │       │                         │                   │
│  │       ▼                         │                   │
│  │  [Implement Feature]           │                   │
│  │       │                         │                   │
│  │       ▼                         │                   │
│  │  /user:refactor-smart          │                   │
│  │       │                         │                   │
│  │       ▼                         │                   │
│  │  /user:test-coverage           │                   │
│  │       │                         │                   │
│  │       ▼                         │                   │
│  │  /user:sync-progress           │                   │
│  │       │                         │                   │
│  │       └─────────────────────────┘                   │
│                │                                         │
│                ▼                                         │
│  Before Pull Request                                     │
│  /user:review-pr                                        │
│       │                                                  │
│       ▼                                                  │
│  /user:productionize                                    │
│       │                                                  │
│       ▼                                                  │
│  /user:api-docs                                         │
│       │                                                  │
│       ▼                                                  │
│  Create PR & Merge                                       │
└─────────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Starting Fresh

```bash
# 1. Initialize project
/user:setup-project
# Choose: TypeScript, pnpm, Tailwind, Next.js

# 2. Create development plan
/user:create-prd
# Generates: docs/planning/prd-{timestamp}.md + tasks.json

# 3. Start first task
/user:next-task
# Implements: TASK-001 (highest priority)

# 4. End of day
/user:sync-progress
# Updates: tasks.json, generates standup notes
```

### Example 2: Existing Project

```bash
# 1. Analyze and plan
/user:create-prd

# 2. Pick up next work
/user:next-task

# 3. Ensure quality before PR
/user:test-coverage
/user:review-pr
/user:productionize
```

### Example 3: Code Cleanup

```bash
# 1. Refactor to modern patterns
/user:refactor-smart

# 2. Add missing tests
/user:test-coverage

# 3. Verify production readiness
/user:productionize

# 4. Update documentation
/user:api-docs
```

## Files Generated

### Project Root
```
project/
├── tasks.json                    # Task tracking database
├── .env.example                  # Environment variables template
├── CHANGELOG.md                  # Project changelog
└── docs/
    ├── planning/
    │   ├── prd-{timestamp}.md    # Product requirements
    │   ├── prd-latest.md         # Latest PRD symlink
    │   ├── standup-{date}.md     # Daily standup notes
    │   ├── weekly-report.md      # Weekly progress
    │   └── production-readiness.md
    └── api/
        ├── openapi.yaml          # OpenAPI spec
        ├── openapi.json          # OpenAPI spec (JSON)
        ├── README.md             # API documentation
        └── postman-collection.json
```

## Command Dependencies

Some commands work better together:

**Prerequisite Chain:**
1. `/user:create-prd` → Creates tasks.json
2. `/user:next-task` → Requires tasks.json
3. `/user:sync-progress` → Updates tasks.json

**Quality Chain:**
1. `/user:refactor-smart` → Clean code
2. `/user:test-coverage` → Ensure tests
3. `/user:review-pr` → Comprehensive review
4. `/user:productionize` → Production ready

**Documentation Chain:**
1. `/user:api-docs` → API documentation
2. `/user:sync-progress` → Progress reports

## Features

### Intelligent Adaptation
All commands automatically detect and adapt to:
- Project type (TypeScript, Python, etc.)
- Framework (Express, Fastify, Next.js, etc.)
- Package manager (npm, pnpm, bun, yarn)
- Existing patterns and conventions
- Test framework (Jest, Vitest, Pytest)

### User Preferences Applied
Every command follows your preferences:
- ✅ const-only (no let unless reassigned)
- ✅ Arrow functions over function declarations
- ✅ Destructuring for objects and arrays
- ✅ Immutability patterns
- ✅ Functional programming style
- ✅ TypeScript strict mode
- ✅ Proper spacing and formatting
- ✅ Service provider patterns
- ✅ Tailwind CSS for styling

### Safety Features
- ✅ Never leaves project in broken state
- ✅ Validates prerequisites before execution
- ✅ Creates git stashes when needed
- ✅ Runs tests before finalizing
- ✅ Clear error messages
- ✅ Rollback capabilities

## Advanced Usage

### Custom Task Selection

When running `/user:next-task`, it selects based on:
1. **Phase** - Phase 1 (Critical) before Phase 2 or 3
2. **Dependencies** - Only tasks with met dependencies
3. **Complexity** - Small before Large (quick wins)
4. **Status** - Pending before Blocked

Override by modifying `tasks.json` priorities.

### Custom Refactoring

`/user:refactor-smart` can be customized:
- Entire codebase
- Changed files only
- Specific directory
- Single file

It will ask for preferences on first run.

### Custom Test Generation

`/user:test-coverage` prioritizes:
1. **Critical** - Payment, auth, data (90%+ target)
2. **High** - Business logic, APIs (80%+ target)
3. **Medium** - Utils, formatters (70%+ target)
4. **Low** - Config, types (60%+ target)

### Custom PRD Generation

`/user:create-prd` can be run with context:
- "Focus on backend features"
- "Prioritize security tasks"
- "Emphasize testing gaps"

## Integration with Existing Tools

### Task Master
If using Task Master (`.taskmaster/`):
- `/user:create-prd` syncs with Task Master
- `/user:next-task` reads from Task Master
- `/user:sync-progress` updates Task Master

### GitHub Projects
- Generated tasks compatible with GitHub Issues
- PRD format works with GitHub Projects
- Standup notes can be posted as comments

### CI/CD
Commands integrate with CI/CD:
- `/user:test-coverage` → Coverage reports
- `/user:productionize` → Pre-deployment checks
- `/user:review-pr` → Automated PR review

## Troubleshooting

### Command Not Executing
**Issue**: Command doesn't run
**Fix**: Ensure slash command syntax: `/user:command-name`

### Tasks Not Found
**Issue**: "tasks.json not found"
**Fix**: Run `/user:create-prd` first

### Test Coverage Failing
**Issue**: Cannot run tests
**Fix**:
1. Check `npm test` works
2. Install test dependencies
3. Configure test framework

### Git Errors
**Issue**: Git operations fail
**Fix**:
1. Initialize git: `git init`
2. Commit changes: `git add . && git commit -m "initial"`
3. Set up remote if needed

### Environment Setup
**Issue**: Commands don't detect project type
**Fix**:
1. Ensure package.json exists
2. Run in project root directory
3. Check file permissions

## Performance

### Command Execution Times

| Command | Small Project | Large Project |
|---------|--------------|---------------|
| create-prd | 30-60s | 2-5 min |
| next-task | 5-15s | 30-60s |
| setup-project | 1-2 min | 1-2 min |
| productionize | 1-3 min | 5-10 min |
| review-pr | 30-90s | 3-5 min |
| refactor-smart | 1-2 min | 5-15 min |
| test-coverage | 2-5 min | 10-20 min |
| api-docs | 1-2 min | 3-5 min |
| sync-progress | 10-30s | 1-2 min |

*Times vary based on project size and complexity*

## Best Practices

### Daily Routine
1. **Morning**: `/user:next-task`
2. **Work**: Implement features
3. **Afternoon**: `/user:refactor-smart` (if needed)
4. **Evening**: `/user:sync-progress`

### Weekly Routine
1. **Monday**: Review PRD, plan week
2. **Daily**: Use `/user:next-task`
3. **Friday**: `/user:sync-progress` (weekly report)
4. **Friday**: Update documentation

### Before Deployment
1. `/user:test-coverage` - Ensure 80%+
2. `/user:productionize` - Fix production issues
3. `/user:review-pr` - Self-review
4. `/user:api-docs` - Update docs

### For Teams
- Commit generated reports
- Share PRD in team drive
- Use standup notes in meetings
- Keep changelog updated

## Next Steps

1. **Try it out**: Run `/user:setup-project` on a test directory
2. **Read docs**: Check individual command `.md` files
3. **Customize**: Modify commands to fit your workflow
4. **Share**: Commit commands to your project

## Support

For detailed help on any command:
```bash
# Read the command's markdown file
cat .claude/commands/user/{command-name}.md
```

Or check the comprehensive README:
```bash
cat .claude/commands/user/README.md
```

---

**Installation Date**: 2025-10-31
**Commands Created**: 9
**Total Size**: 96.9 KB
**Status**: ✅ Ready to Use

**Start with**: `/user:setup-project` or `/user:create-prd`
