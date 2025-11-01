# Product Requirements Document Generator

Analyze the entire project to create a comprehensive PRD with actionable development phases.

## Discovery Phase

First, I'll scan your project structure to understand the architecture and technology stack.

**Scanning project...**

- Identifying technology stack from package files
- Parsing existing documentation
- Analyzing code patterns and conventions
- Reviewing test coverage and feature completeness
- Mapping project structure and dependencies

## Analysis Phase

**Analyzing codebase...**

- Mapping existing functionality (routes, controllers, models)
- Identifying incomplete features (TODOs, stubs, mocks)
- Detecting technical debt and refactoring opportunities
- Assessing security, performance, and scalability
- Evaluating test coverage and quality metrics

## Document Generation

I'll create a comprehensive PRD with:

### Structure
1. **Executive Summary**
   - Project overview and current state
   - Technology stack assessment
   - Key findings and recommendations

2. **Current State Analysis**
   - Feature inventory (complete vs incomplete)
   - Code quality metrics
   - Technical debt assessment
   - Security and performance considerations

3. **Development Roadmap**
   - **Phase 1: Critical/MVP Tasks**
     - Essential features for launch
     - Bug fixes and stability improvements
     - Security vulnerabilities to address

   - **Phase 2: Enhancement Tasks**
     - Performance optimizations
     - User experience improvements
     - Feature enhancements

   - **Phase 3: Nice-to-Have Features**
     - Future expansion opportunities
     - Advanced features
     - Optimization opportunities

### Task Format
Each task includes:
- **Unique ID**: TASK-XXX
- **Title**: Clear, actionable description
- **Description**: Detailed requirements
- **Acceptance Criteria**: Testable success conditions
- **Complexity**: S (Small), M (Medium), L (Large), XL (Extra Large)
- **Dependencies**: Other tasks that must complete first
- **Implementation Approach**: Suggested technical solution
- **Estimated Effort**: Time/complexity estimate
- **Priority**: Critical, High, Medium, Low

## Output Location

The PRD will be saved to:
- `docs/planning/prd-{YYYYMMDD-HHMMSS}.md`
- `docs/planning/prd-latest.md` (symlink to latest)

## Tasks.json Generation

I'll also create/update `tasks.json` in your project root with schema:

```json
{
  "project": {
    "name": "Project Name",
    "version": "0.1.0",
    "generatedAt": "2025-10-31T...",
    "prdSource": "docs/planning/prd-20251031-123456.md"
  },
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Implement user authentication",
      "description": "Add JWT-based authentication system",
      "phase": 1,
      "status": "pending",
      "priority": "critical",
      "complexity": "L",
      "dependencies": [],
      "branch": "feature/task-001-user-authentication",
      "estimatedHours": 16,
      "tags": ["security", "backend", "authentication"],
      "acceptanceCriteria": [
        "Users can register with email/password",
        "Users can login and receive JWT token",
        "Protected routes require valid JWT",
        "Token refresh mechanism works",
        "Tests cover authentication flows"
      ],
      "implementationNotes": "Use bcrypt for password hashing, jsonwebtoken for JWT generation",
      "startedAt": null,
      "completedAt": null,
      "assignedTo": null
    }
  ],
  "metadata": {
    "totalTasks": 0,
    "byStatus": {
      "pending": 0,
      "in_progress": 0,
      "review": 0,
      "completed": 0,
      "blocked": 0
    },
    "byPhase": {
      "1": 0,
      "2": 0,
      "3": 0
    },
    "byComplexity": {
      "S": 0,
      "M": 0,
      "L": 0,
      "XL": 0
    }
  }
}
```

## Process

I will now:

1. **Scan project structure** - Analyze files, dependencies, patterns
2. **Parse documentation** - Read README, docs/, existing specs
3. **Analyze code** - Examine routes, services, models, tests
4. **Identify gaps** - Find TODOs, incomplete features, technical debt
5. **Assess quality** - Review test coverage, code patterns, security
6. **Generate PRD** - Create comprehensive requirements document
7. **Create tasks.json** - Extract actionable tasks with metadata
8. **Generate report** - Summary of findings and recommendations

Starting analysis now...
