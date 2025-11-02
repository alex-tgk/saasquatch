# Task Keeper

Task Keeper helps you structure and execute development work with an AI assistant.

## Workflow Overview

1. Draft or collect a product requirements document (PRD) in `scripts/prd.md`
2. Convert the PRD into actionable tasks with `task-keeper parse-prd scripts/prd.md`
3. Review the generated tasks with `task-keeper list` and `task-keeper show <id>`
4. Work through tasks in order using `task-keeper next`
5. Keep task statuses up to date via `task-keeper status <id> <status>`
6. Generate per-task notebooks with `task-keeper generate`

### Status Values

- `pending`: Not started
- `in-progress`: Currently being worked on
- `blocked`: Waiting on dependencies or decisions
- `done`: Completed
- `deferred`: Skipped or postponed

### Suggested Prompts for Your AI Pair

- “Use `task-keeper list --status pending` to find outstanding work.”
- “Run `task-keeper show 3` and summarise the steps.”
- “Mark task 4 as in progress: `task-keeper status 4 in-progress`.”
