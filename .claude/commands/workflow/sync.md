---
description: Sync all worktrees with the latest main branch changes
---

## Workflow

1. Execute the sync script: `./scripts/worktree-sync.sh`
2. Update main branch from origin
3. For each worktree, fetch and rebase on origin/main
4. Report success or conflicts for each worktree
5. Provide guidance for resolving any conflicts

## Behavior

- Pulls latest changes to main branch
- Rebases each worktree branch on origin/main
- Aborts rebase on conflict (doesn't break worktree)
- Reports which worktrees need manual conflict resolution
- Skips main branch worktree

## Use When

- Main branch has new commits
- Want to keep feature branches up to date
- Before creating pull requests
- Regularly as part of development workflow

## If Conflicts

If conflicts occur:
1. Navigate to the conflicted worktree
2. Resolve conflicts manually
3. Complete the rebase with `git rebase --continue`
