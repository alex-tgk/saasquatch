---
description: Push all worktree branches to origin
---

## Workflow

1. Execute the push-all script: `./scripts/worktree-push-all.sh`
2. Report the push status for each branch
3. Show any errors or warnings

## Behavior

- Iterates through all active worktrees
- Pushes each non-main branch to origin
- Skips the main branch
- Reports success or failure for each push
- Continues even if individual pushes fail
