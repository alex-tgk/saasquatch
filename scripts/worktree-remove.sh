#!/bin/bash
# Usage: ./scripts/worktree-remove.sh <branch-name>

BRANCH=$1
WORKTREE_DIR="../saasquatch-worktrees/${BRANCH//\\//-}"

if [ -z "$BRANCH" ]; then
  echo "❌ Error: Branch name required"
  echo "Usage: ./scripts/worktree-remove.sh <branch-name>"
  exit 1
fi

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
