#!/bin/bash
# Usage: ./scripts/worktree-switch.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\\//-}"

if [ -z "$BRANCH" ]; then
  echo "❌ Error: Branch name required"
  echo "Usage: ./scripts/worktree-switch.sh <branch-name>"
  exit 1
fi

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "❌ Worktree not found: $WORKTREE_DIR"
  echo "Create it with: ./scripts/worktree-create.sh $BRANCH"
  exit 1
fi

cd "$WORKTREE_DIR"
echo "✅ Switched to worktree: $WORKTREE_DIR"
echo "📋 Current branch: $(git branch --show-current)"
