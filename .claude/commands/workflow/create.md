---
description: Create a new git worktree for parallel feature development
argument-hint: <branch-name>
---

## Variables

BRANCH_NAME: $1 (required - e.g., feature/my-feature)

## Workflow

1. Execute the worktree creation script: `./scripts/worktree-create.sh {BRANCH_NAME}`
2. Report the worktree location and current status
3. Inform user of next steps: navigate to worktree and run `pnpm install`

## Example

```bash
./scripts/worktree-create.sh feature/add-rate-limiting
```

Creates:
- New branch: feature/add-rate-limiting
- New worktree: ../saasquatch-worktrees/feature-add-rate-limiting
- Initializes Task Master in the worktree
