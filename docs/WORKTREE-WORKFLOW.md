# Git Worktree Workflow for Parallel Feature Development

> **Brand Compliance**: All documentation and CLI output must follow [SaaSQuatch Brand Guidelines](brand-theme.md)

## 🎯 Overview

This workflow enables working on multiple features simultaneously without switching branches, using git worktrees to maintain separate working directories for each feature.

## 📁 Repository Structure

```
saasquatch/                          # Main worktree (main branch)
├── .git/                            # Shared git repository
├── packages/
├── docs/
└── ...

saasquatch-worktrees/                # Worktrees directory
├── feature-auth-improvements/       # Worktree for feature/auth-improvements
├── feature-dashboard-metrics/       # Worktree for feature/dashboard-metrics
├── bugfix-cors-headers/            # Worktree for bugfix/cors-headers
└── docs-api-documentation/         # Worktree for docs/api-documentation
```

## 🚀 Quick Start

### 1. Create Your First Worktree

```bash
# From the main repository directory
./scripts/worktree-create.sh feature/auth-improvements

# This creates:
# - New branch: feature/auth-improvements
# - New worktree: ../saasquatch-worktrees/feature-auth-improvements
# - Task Master initialized in the worktree
```

### 2. Switch to Your Worktree

```bash
# Use the helper script
./scripts/worktree-switch.sh feature/auth-improvements

# Or manually
cd ../saasquatch-worktrees/feature-auth-improvements
```

### 3. Work on Your Feature

```bash
# Make changes, commit, push
pnpm install  # Dependencies are separate per worktree
pnpm test     # Run tests in isolation
git add .
git commit -m "feat: add JWT refresh optimization"
git push origin feature/auth-improvements
```

### 4. Switch to Another Feature

```bash
# No need to stash or commit incomplete work
./scripts/worktree-switch.sh feature/dashboard-metrics

# Your previous work remains in the other worktree
cd ../feature-auth-improvements  # Still has all your uncommitted changes
```

---

## 🤖 Claude Code Integration

### Slash Commands (Recommended)

When working with Claude Code, use these slash commands for streamlined workflow management:

```bash
# Create a new worktree
/workflow:create feature/auth-improvements

# Switch to an existing worktree
/workflow:switch feature/auth-improvements

# List all active worktrees
/workflow:list

# View status dashboard
/workflow:dashboard

# Push all worktree branches
/workflow:push-all

# Sync all worktrees with main
/workflow:sync

# Remove a worktree after merge
/workflow:remove feature/auth-improvements
```

**Benefits of slash commands:**
- Claude automatically executes the scripts and reports results
- No need to manually type script paths
- Integrated into Claude Code workflow
- Easier to remember and use
- Consistent with other Claude Code commands

**Examples:**

```
User: /workflow:create feature/add-rate-limiting
Claude: Creating new worktree for feature/add-rate-limiting...
        ✅ Worktree created at ../saasquatch-worktrees/feature-add-rate-limiting
        📋 Task Master initialized
        Next: cd ../saasquatch-worktrees/feature-add-rate-limiting && pnpm install

User: /workflow:dashboard
Claude: 📊 Worktree Dashboard
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        📂 feature-add-rate-limiting
           Branch: feature/add-rate-limiting
           Uncommitted changes: 3
           Commits ahead: 2
```

---

## 📋 Complete Workflow

### Phase 1: Planning

```bash
# List current tasks from Task Master
npx taskmaster status

# Identify tasks that can be worked on in parallel
# Example:
# - TASK-024: Generate per-service README files
# - TASK-025: Create architecture diagrams
# - TASK-026: Write root README
```

### Phase 2: Create Worktrees

```bash
# Create worktrees for each parallel task
./scripts/worktree-create.sh feature/service-readmes    # TASK-024
./scripts/worktree-create.sh feature/architecture-docs  # TASK-025
./scripts/worktree-create.sh feature/root-readme        # TASK-026

# List all worktrees
git worktree list
```

### Phase 3: Work in Parallel

**Terminal 1 - Service READMEs**
```bash
cd ../saasquatch-worktrees/feature-service-readmes
# Work on TASK-024
code .
pnpm test
git commit -m "docs: add auth service README"
```

**Terminal 2 - Architecture Diagrams**
```bash
cd ../saasquatch-worktrees/feature-architecture-docs
# Work on TASK-025
code .
# Create mermaid diagrams
git commit -m "docs: add system architecture diagram"
```

**Terminal 3 - Root README**
```bash
cd ../saasquatch-worktrees/feature-root-readme
# Work on TASK-026
code .
git commit -m "docs: update root README with quickstart"
```

### Phase 4: Integration & Testing

```bash
# Test each feature independently
cd feature-service-readmes && pnpm test && cd ..
cd feature-architecture-docs && pnpm test && cd ..
cd feature-root-readme && pnpm test && cd ..

# Push all branches
./scripts/worktree-push-all.sh
```

### Phase 5: Create Pull Requests

```bash
# Create PRs from each worktree
cd feature-service-readmes && gh pr create --title "docs: add per-service README files" --body "Implements TASK-024" && cd ..
cd feature-architecture-docs && gh pr create --title "docs: add architecture diagrams" --body "Implements TASK-025" && cd ..
cd feature-root-readme && gh pr create --title "docs: update root README" --body "Implements TASK-026" && cd ..
```

### Phase 6: Cleanup After Merge

```bash
# Remove worktrees once PRs are merged
./scripts/worktree-remove.sh feature-service-readmes
./scripts/worktree-remove.sh feature-architecture-docs
./scripts/worktree-remove.sh feature-root-readme
```

---

## 🛠️ Helper Scripts

### worktree-create.sh

Creates a new worktree with Task Master integration:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-create.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\//-}"

# Create worktree
git worktree add -b "$BRANCH" "$WORKTREE_DIR"

# Initialize Task Master in worktree
cd "$WORKTREE_DIR"
npx taskmaster init

echo "✅ Worktree created: $WORKTREE_DIR"
echo "📋 Task Master initialized"
echo ""
echo "Next steps:"
echo "  cd $WORKTREE_DIR"
echo "  pnpm install"
echo "  code ."
```

### worktree-switch.sh

Quick switch between worktrees:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-switch.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\//-}"

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "❌ Worktree not found: $WORKTREE_DIR"
  echo "Create it with: ./scripts/worktree-create.sh $BRANCH"
  exit 1
fi

cd "$WORKTREE_DIR"
echo "✅ Switched to worktree: $WORKTREE_DIR"
echo "📋 Current branch: $(git branch --show-current)"
```

### worktree-list.sh

List all worktrees with status:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-list.sh

echo "📂 Active Worktrees:"
echo ""

git worktree list --porcelain | awk '
  /^worktree/ { path=$2 }
  /^branch/ { branch=$2; gsub(/refs\/heads\//, "", branch) }
  /^$/ {
    if (path && branch) {
      printf "  • %s\n    Branch: %s\n\n", path, branch
      path=""
      branch=""
    }
  }
'
```

### worktree-push-all.sh

Push all worktree branches:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-push-all.sh

echo "🚀 Pushing all worktree branches..."
echo ""

git worktree list --porcelain | awk '/^worktree/ {print $2}' | while read worktree; do
  cd "$worktree"
  BRANCH=$(git branch --show-current)

  if [ "$BRANCH" != "main" ]; then
    echo "📤 Pushing $BRANCH from $worktree"
    git push origin "$BRANCH" || echo "⚠️  Failed to push $BRANCH"
  fi
done

echo ""
echo "✅ All branches pushed"
```

### worktree-remove.sh

Safely remove a worktree:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-remove.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\//-}"

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "❌ Worktree not found: $WORKTREE_DIR"
  exit 1
fi

cd "$WORKTREE_DIR"
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Worktree has uncommitted changes!"
  git status
  read -p "Continue removal? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

cd ..
git worktree remove "$WORKTREE_DIR"
git branch -d "$BRANCH" 2>/dev/null || echo "Branch may still be on remote"

echo "✅ Worktree removed: $WORKTREE_DIR"
```

### worktree-sync.sh

Sync all worktrees with main branch changes:

```bash
#!/bin/bash
# Usage: ./scripts/worktree-sync.sh

echo "🔄 Syncing all worktrees with main..."
echo ""

# Update main branch
cd saasquatch
git checkout main
git pull origin main

# Update each worktree
git worktree list --porcelain | awk '/^worktree/ {print $2}' | while read worktree; do
  cd "$worktree"
  BRANCH=$(git branch --show-current)

  if [ "$BRANCH" != "main" ]; then
    echo "🔄 Syncing $BRANCH"
    git fetch origin main
    git rebase origin/main || {
      echo "⚠️  Rebase conflict in $BRANCH - resolve manually"
      git rebase --abort
    }
  fi
done

echo ""
echo "✅ All worktrees synced"
```

---

## 🎨 Workflow Patterns

### Pattern 1: Feature Development Sprint

```bash
# Morning: Create worktrees for sprint tasks
./scripts/worktree-create.sh feature/add-rate-limiting
./scripts/worktree-create.sh feature/improve-logging
./scripts/worktree-create.sh feature/add-tracing

# During day: Switch contexts as needed
# - Blocked on review? Switch to another feature
# - Waiting for CI? Start another task
# - Need fresh perspective? Work on different feature

# Evening: Push progress
./scripts/worktree-push-all.sh
```

### Pattern 2: Bug Fix + Feature Development

```bash
# Main worktree: Stable work on features
cd saasquatch
# Work on planned features

# Urgent bug reported: Create worktree
./scripts/worktree-create.sh hotfix/cors-headers

cd ../saasquatch-worktrees/hotfix-cors-headers
# Fix bug, test, push
git push origin hotfix/cors-headers
gh pr create --title "hotfix: fix CORS headers" --base main

# Return to feature work
cd ../../saasquatch
# Continue where you left off - no stashing needed
```

### Pattern 3: Documentation + Code in Parallel

```bash
# Worktree 1: Write code
cd feature-add-auth-service

# Worktree 2: Write documentation
cd ../docs-auth-service-guide

# Both can be worked on simultaneously
# Commit docs even if code isn't ready
# Docs PR can be reviewed independently
```

### Pattern 4: Long-Running Feature Branches

```bash
# Main feature branch
./scripts/worktree-create.sh feature/microservices-orchestration

# Sub-tasks in separate worktrees
./scripts/worktree-create.sh feature/orchestration-health-checks
./scripts/worktree-create.sh feature/orchestration-load-balancing
./scripts/worktree-create.sh feature/orchestration-failover

# Merge sub-tasks into main feature branch
cd feature-orchestration-health-checks
git checkout feature/microservices-orchestration
git merge feature/orchestration-health-checks

# Eventually merge main feature to main
```

---

## 📊 Task Master Integration

### Track Tasks Per Worktree

Each worktree has its own Task Master instance:

```bash
# In feature-service-readmes worktree
npx taskmaster add "Write auth service README" --priority high
npx taskmaster add "Write user service README" --priority high
npx taskmaster status

# In feature-architecture-docs worktree
npx taskmaster add "Create system architecture diagram" --priority critical
npx taskmaster add "Document service interactions" --priority high
npx taskmaster status
```

### Sync Task Master Across Worktrees

```bash
# Export tasks from main repo
cd saasquatch
npx taskmaster export tasks.json

# Import into worktree
cd ../saasquatch-worktrees/feature-service-readmes
npx taskmaster import ../../../saasquatch/tasks.json
```

---

## ⚡ VS Code Integration

### Multi-Root Workspace

Create `.code-workspace` file:

```json
{
  "folders": [
    {
      "name": "Main - saasquatch",
      "path": "."
    },
    {
      "name": "Feature - Service READMEs",
      "path": "../saasquatch-worktrees/feature-service-readmes"
    },
    {
      "name": "Feature - Architecture Docs",
      "path": "../saasquatch-worktrees/feature-architecture-docs"
    }
  ],
  "settings": {
    "git.enableSmartCommit": true,
    "git.postCommitCommand": "none"
  }
}
```

Open with: `code saasquatch.code-workspace`

### Terminal Management

```bash
# In VS Code, create terminal layouts:
# Terminal 1: Main worktree
# Terminal 2: Feature worktree 1
# Terminal 3: Feature worktree 2
# Terminal 4: Test runner
```

---

## 🚦 CI/CD Considerations

### GitHub Actions

Each worktree branch triggers CI independently:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches:
      - main
      - 'feature/**'
      - 'bugfix/**'
      - 'hotfix/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test
```

### Parallel CI Runs

- Each worktree branch has independent CI
- Can merge PRs in any order
- Main branch stays stable

---

## 🎯 Best Practices

### ✅ Do's

1. **Keep worktrees focused**: One feature per worktree
2. **Use descriptive branch names**: `feature/add-jwt-auth` not `feature1`
3. **Install dependencies per worktree**: `pnpm install` in each
4. **Push regularly**: Easy to track progress across worktrees
5. **Clean up merged worktrees**: Use `worktree-remove.sh`
6. **Sync with main regularly**: Use `worktree-sync.sh`
7. **Use Task Master per worktree**: Track feature-specific tasks

### ❌ Don'ts

1. **Don't share node_modules**: Each worktree should have its own
2. **Don't create too many worktrees**: 3-5 active is reasonable
3. **Don't forget to clean up**: Remove merged worktrees
4. **Don't mix concerns**: Keep features separate
5. **Don't skip testing**: Test each worktree independently

---

## 🔧 Advanced Techniques

### Shared Configuration

Use symlinks for shared config:

```bash
# In each worktree
ln -s ../../../saasquatch/.prettierrc .prettierrc
ln -s ../../../saasquatch/.eslintrc.json .eslintrc.json
```

### Worktree Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias wtcreate='./scripts/worktree-create.sh'
alias wtswitch='./scripts/worktree-switch.sh'
alias wtlist='./scripts/worktree-list.sh'
alias wtpush='./scripts/worktree-push-all.sh'
alias wtremove='./scripts/worktree-remove.sh'
alias wtsync='./scripts/worktree-sync.sh'
```

### Worktree Status Dashboard

```bash
#!/bin/bash
# scripts/worktree-dashboard.sh

echo "📊 Worktree Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git worktree list --porcelain | awk '/^worktree/ {print $2}' | while read worktree; do
  cd "$worktree"
  BRANCH=$(git branch --show-current)
  CHANGES=$(git status --porcelain | wc -l | tr -d ' ')
  COMMITS=$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')

  echo "📂 $(basename $worktree)"
  echo "   Branch: $BRANCH"
  echo "   Uncommitted changes: $CHANGES"
  echo "   Commits ahead: $COMMITS"
  echo ""
done
```

---

## 📚 Reference

### Git Worktree Commands

```bash
# Create worktree
git worktree add <path> <branch>

# Create new branch in worktree
git worktree add -b <new-branch> <path>

# List worktrees
git worktree list

# Remove worktree
git worktree remove <path>

# Prune deleted worktrees
git worktree prune

# Move worktree
git worktree move <old-path> <new-path>

# Lock worktree (prevent removal)
git worktree lock <path>

# Unlock worktree
git worktree unlock <path>
```

### Troubleshooting

**Problem**: Can't create worktree - branch already exists
```bash
# Solution: Use existing branch
git worktree add <path> <existing-branch>
```

**Problem**: Worktree has uncommitted changes
```bash
# Solution: Commit or stash in that worktree
cd <worktree-path>
git stash
# or
git commit -m "WIP: save progress"
```

**Problem**: Can't remove worktree - locked
```bash
# Solution: Unlock first
git worktree unlock <path>
git worktree remove <path>
```

---

## 🎓 Learning Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Atlassian Git Worktree Guide](https://www.atlassian.com/git/tutorials/git-worktree)
- [GitHub Blog on Worktrees](https://github.blog/2015-07-29-git-2-5-including-multiple-worktrees-and-triangular-workflows/)

---

## 🚀 Next Steps

1. **Install helper scripts**: Copy all scripts to `scripts/` directory
2. **Test workflow**: Create a worktree for your next feature
3. **Set up VS Code workspace**: Use multi-root workspace for parallel work
4. **Configure aliases**: Add worktree aliases to your shell
5. **Document team workflow**: Share this with your team

---

**Remember**: Git worktrees enable true parallel development. No more context switching, no more stashing, just pure productivity! 🚀
