# Next Task - Automated Task Selection and Implementation

Intelligently select and begin work on the next appropriate task based on project state.

## Initialization

**Checking project state...**

1. Looking for PRD in `docs/planning/`
   - If not found → Running `/user:create-prd` first

2. Looking for `tasks.json` in project root
   - If not found → Parsing PRD to generate tasks.json

3. Checking current git state
   - Branch: Detecting current branch
   - Status: Checking for uncommitted changes
   - Stash: Will stash if necessary

## Task Selection Logic

I'll prioritize tasks based on:

### Priority Order
1. **Phase** - Phase 1 → Phase 2 → Phase 3 (critical first)
2. **Dependencies** - Only tasks with met dependencies
3. **Complexity** - S → M → L → XL (small wins first)
4. **Status** - pending → blocked (skip in-progress)
5. **Priority** - critical → high → medium → low

### Exclusions
- Tasks with unmet dependencies
- Tasks already in-progress (unless continuing)
- Tasks marked as blocked

## Task Analysis

For the selected task, I will:

**Understand Requirements**
- Read task description and acceptance criteria
- Review implementation notes
- Check dependencies and related tasks
- Identify affected files and modules

**Plan Implementation**
- Determine files to create/modify
- Identify required patterns from existing code
- Plan test strategy
- Consider edge cases and error handling

## Execution

I will:

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/{task-id}-{slugified-title}
   ```

2. **Update Task Status**
   - Set status to "in-progress"
   - Add startedAt timestamp
   - Update tasks.json and commit

3. **Implement Solution**
   - Follow project's established patterns
   - Match existing code style and conventions
   - Use const-only, arrow functions, immutability
   - Apply TypeScript strict typing
   - Implement proper error handling
   - Add input validation

4. **Write Tests**
   - Unit tests for business logic
   - Integration tests for API endpoints
   - Edge case coverage
   - Error condition testing
   - Aim for 80%+ coverage

5. **Update Documentation**
   - Add/update inline code comments
   - Update API documentation if applicable
   - Update README if adding new features
   - Add usage examples

6. **Verify Implementation**
   - Run tests and ensure they pass
   - Run linter and fix issues
   - Check TypeScript compilation
   - Verify acceptance criteria met

7. **Complete Task**
   - Update task status to "completed"
   - Add completedAt timestamp
   - Update tasks.json
   - Commit changes with meaningful message

## Implementation Strategy

I will adapt to your project's tech stack:

**For TypeScript/Node.js Projects:**
- Use modern ES6+ syntax
- Apply functional programming patterns
- Implement dependency injection where appropriate
- Follow MVC or service-provider patterns
- Use appropriate ORMs (TypeORM, Prisma, etc.)

**For API Development:**
- Follow RESTful conventions
- Implement proper HTTP status codes
- Add request validation (Zod, Joi, etc.)
- Include error responses
- Add OpenAPI/Swagger annotations

**For Frontend (React/Next.js):**
- Use functional components with hooks
- Apply proper state management
- Implement loading/error states
- Add accessibility attributes
- Use Tailwind CSS for styling

## Task Format

```typescript
interface Task {
  id: string;              // TASK-001
  title: string;           // "Implement user authentication"
  description: string;     // Detailed requirements
  phase: 1 | 2 | 3;       // Development phase
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  complexity: 'S' | 'M' | 'L' | 'XL';
  dependencies: string[];  // Other task IDs
  branch: string;          // feature/task-001-user-auth
  estimatedHours: number;
  tags: string[];
  acceptanceCriteria: string[];
  implementationNotes?: string;
  startedAt: string | null;
  completedAt: string | null;
  assignedTo: string | null;
}
```

## Output

After completing the task, I will provide:

**Summary Report:**
- Task ID and title
- Files created/modified
- Tests added
- Documentation updated
- Acceptance criteria checklist
- Next recommended task

**Git Status:**
- Branch created
- Commits made
- Files changed summary

**Next Steps:**
- Suggested next task to work on
- Dependencies now unblocked
- Overall progress update

## Continue vs. New Task

If there's already a task in-progress:
- **Ask**: Continue existing task or start new one?
- **If continue**: Resume work on current task
- **If new**: Stash changes, start fresh task

## Error Handling

If issues arise:
- **Dependency not met**: Suggest working on dependency first
- **No tasks available**: All tasks complete or blocked
- **Git conflicts**: Help resolve before proceeding
- **Test failures**: Debug and fix before marking complete

Starting task selection now...
