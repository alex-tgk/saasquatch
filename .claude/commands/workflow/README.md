# Workflow Slash Commands

Git worktree management commands for parallel feature development.

## Available Commands

| Command | Description | Arguments |
|---------|-------------|-----------|
| `/workflow:create` | Create new worktree for a branch | `<branch-name>` |
| `/workflow:switch` | Switch to an existing worktree | `<branch-name>` |
| `/workflow:list` | List all active worktrees | None |
| `/workflow:dashboard` | Show status dashboard of all worktrees | None |
| `/workflow:push-all` | Push all worktree branches to origin | None |
| `/workflow:sync` | Sync all worktrees with main branch | None |
| `/workflow:remove` | Remove a worktree after merge | `<branch-name>` |

## Usage Examples

### Creating a new feature worktree
```
/workflow:create feature/add-rate-limiting
```

### Viewing all worktrees
```
/workflow:list
```

### Checking status
```
/workflow:dashboard
```

### Syncing with main
```
/workflow:sync
```

### Pushing all branches
```
/workflow:push-all
```

### Cleaning up after merge
```
/workflow:remove feature/add-rate-limiting
```

## Documentation

See [`docs/WORKTREE-WORKFLOW.md`](../../../docs/WORKTREE-WORKFLOW.md) for complete workflow documentation.

## Scripts

These commands execute the corresponding bash scripts in [`scripts/`](../../../scripts/):
- `worktree-create.sh`
- `worktree-switch.sh`
- `worktree-list.sh`
- `worktree-dashboard.sh`
- `worktree-push-all.sh`
- `worktree-sync.sh`
- `worktree-remove.sh`

## Note

If commands are not recognized, try:
1. Reloading Claude Code window
2. Restarting Claude Code
3. Running the scripts directly: `./scripts/worktree-<command>.sh`
