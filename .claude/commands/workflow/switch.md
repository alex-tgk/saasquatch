---
description: Switch to an existing git worktree
argument-hint: <branch-name>
---

## Variables

BRANCH_NAME: $1 (required - name of existing worktree branch)

## Workflow

1. Execute the worktree switch script: `./scripts/worktree-switch.sh {BRANCH_NAME}`
2. Report the switched worktree location and current branch
3. Note: This changes the working directory context for subsequent commands

## Example

```bash
./scripts/worktree-switch.sh feature/dashboard-metrics
```
