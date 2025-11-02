#!/bin/bash
# Usage: ./scripts/worktree-sync.sh

echo "🔄 Syncing all worktrees with main..."
echo ""

# Get the main repository path
MAIN_REPO=$(git worktree list --porcelain | awk '/^worktree/ && NR==1 {print $2}')

# Update main branch
cd "$MAIN_REPO"
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  git pull origin main
else
  git fetch origin main:main
fi

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
