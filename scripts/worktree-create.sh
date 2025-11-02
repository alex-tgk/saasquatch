#!/bin/bash
# Usage: ./scripts/worktree-create.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\\//-}"

if [ -z "$BRANCH" ]; then
  echo "❌ Error: Branch name required"
  echo "Usage: ./scripts/worktree-create.sh <branch-name>"
  exit 1
fi

# Create worktree
echo "📂 Creating worktree: $WORKTREE_DIR"
git worktree add -b "$BRANCH" "$WORKTREE_DIR"

if [ $? -ne 0 ]; then
  echo "❌ Failed to create worktree"
  exit 1
fi

# Initialize Task Master in worktree
cd "$WORKTREE_DIR"
npx taskmaster init 2>/dev/null || echo "⚠️  Task Master initialization skipped (not available)"

echo ""
echo "✅ Worktree created: $WORKTREE_DIR"
echo "📋 Task Master initialized"
echo ""
echo "Next steps:"
echo "  cd $WORKTREE_DIR"
echo "  pnpm install"
echo "  code ."
