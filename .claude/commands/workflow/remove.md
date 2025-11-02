---
description: Safely remove a git worktree after feature is merged
argument-hint: <branch-name>
---

## Variables

BRANCH_NAME: $1 (required - name of worktree branch to remove)

## Workflow

1. Execute the worktree removal script: `./scripts/worktree-remove.sh {BRANCH_NAME}`
2. Check for uncommitted changes and prompt for confirmation if needed
3. Remove the worktree and delete the branch
4. Report completion status

## Safety

- Checks for uncommitted changes before removal
- Prompts for confirmation if worktree has uncommitted changes
- Removes both worktree directory and git branch
- Reports if branch still exists on remote

## Use When

- Feature branch has been merged to main
- Work on the feature is complete
- Ready to clean up worktree
