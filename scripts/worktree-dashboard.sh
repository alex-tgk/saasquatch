#!/bin/bash
# Usage: ./scripts/worktree-dashboard.sh

echo "📊 Worktree Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git worktree list --porcelain | awk '/^worktree/ {print $2}' | while read worktree; do
  cd "$worktree"
  BRANCH=$(git branch --show-current)
  CHANGES=$(git status --porcelain | wc -l | tr -d ' ')
  COMMITS=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')

  echo "📂 $(basename $worktree)"
  echo "   Branch: $BRANCH"
  echo "   Uncommitted changes: $CHANGES"
  echo "   Commits ahead: $COMMITS"
  echo ""
done
