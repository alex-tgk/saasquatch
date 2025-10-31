#!/bin/bash

#
# Claude Code Agents Initialization Script
#
# This script sets up the Claude Code agents collection in a new project.
# It clones the agents from GitHub into the project's .claude/agents directory.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/alex-tgk/claude-agents/main/init-agents.sh | bash
#
# Or download and run locally:
#   chmod +x init-agents.sh
#   ./init-agents.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# GitHub repository URL
REPO_URL="https://github.com/alex-tgk/claude-agents.git"
AGENTS_DIR=".claude/agents"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Claude Code Agents Initialization${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed.${NC}"
    echo "Please install git and try again."
    exit 1
fi

# Check if we're in a project directory (look for common indicators)
if [ ! -f "package.json" ] && [ ! -f "pnpm-workspace.yaml" ] && [ ! -f "composer.json" ] && [ ! -f "Cargo.toml" ] && [ ! -f "go.mod" ]; then
    echo -e "${YELLOW}Warning: This doesn't appear to be a project directory.${NC}"
    echo "Common project files (package.json, etc.) were not found."
    echo ""
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted.${NC}"
        exit 1
    fi
fi

# Check if .claude/agents already exists
if [ -d "$AGENTS_DIR" ]; then
    echo -e "${YELLOW}Warning: $AGENTS_DIR directory already exists.${NC}"
    echo ""
    read -p "Do you want to remove it and install fresh agents? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Removing existing agents...${NC}"
        rm -rf "$AGENTS_DIR"
    else
        echo -e "${RED}Aborted.${NC}"
        exit 1
    fi
fi

# Create .claude directory if it doesn't exist
if [ ! -d ".claude" ]; then
    echo -e "${BLUE}Creating .claude directory...${NC}"
    mkdir -p .claude
fi

# Clone the agents repository
echo -e "${BLUE}Cloning agents from GitHub...${NC}"
echo -e "${BLUE}Repository: ${REPO_URL}${NC}"
echo ""

if git clone "$REPO_URL" "$AGENTS_DIR"; then
    echo ""
    echo -e "${GREEN}✓ Successfully cloned agents repository${NC}"
else
    echo ""
    echo -e "${RED}✗ Failed to clone agents repository${NC}"
    exit 1
fi

# Remove .git directory to avoid nested git repos
if [ -d "$AGENTS_DIR/.git" ]; then
    echo -e "${BLUE}Cleaning up git metadata...${NC}"
    rm -rf "$AGENTS_DIR/.git"
fi

# Count the number of agent files
AGENT_COUNT=$(find "$AGENTS_DIR" -name "*.md" -not -name "README.md" | wc -l | tr -d ' ')

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✓ Installed ${AGENT_COUNT} specialized agents${NC}"
echo ""
echo -e "${BLUE}Available Agents:${NC}"
echo ""
echo -e "  📝 Documentation & Maintenance"
echo -e "     • docs-sync-maintainer"
echo -e "     • theme-consistency-validator"
echo ""
echo -e "  ⚡ Performance & Optimization"
echo -e "     • performance-optimizer"
echo -e "     • monorepo-optimizer"
echo ""
echo -e "  🚀 Development Experience"
echo -e "     • dx-orchestrator"
echo -e "     • rapid-prototyping"
echo ""
echo -e "  🔮 Advanced Coordination"
echo -e "     • neural-mesh-orchestrator"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo -e "  1. The agents are now available in Claude Code"
echo -e "  2. They will be invoked automatically based on their trigger conditions"
echo -e "  3. You can also invoke them manually using the Task tool"
echo ""
echo -e "  📚 Read the documentation: ${BLUE}cat .claude/agents/README.md${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
