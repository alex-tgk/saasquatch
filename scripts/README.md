# SaaSQuatch Scripts

Helper scripts for development and workflow automation.

## Git Worktree Scripts

These scripts enable parallel feature development using git worktrees. See [`docs/WORKTREE-WORKFLOW.md`](../docs/WORKTREE-WORKFLOW.md) for complete documentation.

### Claude Code Slash Commands (Recommended)

When using Claude Code, use these slash commands for easier workflow management:

```bash
# Create a new worktree for a feature branch
/workflow:create feature/my-feature

# Switch to an existing worktree
/workflow:switch feature/my-feature

# List all active worktrees
/workflow:list

# Push all worktree branches to origin
/workflow:push-all

# Remove a worktree after merging
/workflow:remove feature/my-feature

# Sync all worktrees with main branch
/workflow:sync

# View dashboard of all worktrees
/workflow:dashboard
```

### Direct Script Usage

Alternatively, run the scripts directly:

```bash
# Create a new worktree for a feature branch
./scripts/worktree-create.sh feature/my-feature

# Switch to an existing worktree
./scripts/worktree-switch.sh feature/my-feature

# List all active worktrees
./scripts/worktree-list.sh

# Push all worktree branches to origin
./scripts/worktree-push-all.sh

# Remove a worktree after merging
./scripts/worktree-remove.sh feature/my-feature

# Sync all worktrees with main branch
./scripts/worktree-sync.sh

# View dashboard of all worktrees
./scripts/worktree-dashboard.sh
```

### Aliases (Optional)

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias wtcreate='./scripts/worktree-create.sh'
alias wtswitch='./scripts/worktree-switch.sh'
alias wtlist='./scripts/worktree-list.sh'
alias wtpush='./scripts/worktree-push-all.sh'
alias wtremove='./scripts/worktree-remove.sh'
alias wtsync='./scripts/worktree-sync.sh'
alias wtdash='./scripts/worktree-dashboard.sh'
```

## Development Scripts

### `dev-cli.sh`
Run the CLI locally during development without installing globally.

```bash
./scripts/dev-cli.sh init my-test-project
```

### `setup-global-cli.sh`
Install the CLI globally for system-wide access.

```bash
./scripts/setup-global-cli.sh
```

## Documentation

- **Complete Worktree Workflow**: [`docs/WORKTREE-WORKFLOW.md`](../docs/WORKTREE-WORKFLOW.md)
- **Project Overview**: [`README.md`](../README.md)
- **MVP Status**: [`MVP-READINESS-REPORT.md`](../MVP-READINESS-REPORT.md)
