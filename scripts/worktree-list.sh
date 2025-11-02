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
