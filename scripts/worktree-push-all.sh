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
