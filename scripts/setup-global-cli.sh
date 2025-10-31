#!/bin/bash

# SaaSquatch CLI Global Setup Script
# This script makes the saasquatch CLI available globally on your system

set -e

# Add nvm node/bin to PATH if using nvm
if [ -d "$HOME/.nvm" ]; then
    NVM_DIR="$HOME/.nvm"
    NODE_VERSION=$(node -v 2>/dev/null || echo "")
    if [ -n "$NODE_VERSION" ]; then
        NODE_PATH="$NVM_DIR/versions/node/$NODE_VERSION/bin"
        export PATH="$NODE_PATH:$PATH"
    fi
fi

# Also add PNPM_HOME if it exists
if [ -d "$HOME/Library/pnpm" ]; then
    export PNPM_HOME="$HOME/Library/pnpm"
    export PATH="$PNPM_HOME:$PATH"
fi

echo "🚀 SaaSquatch Global CLI Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node 20+ required (you have v$NODE_VERSION)"
    exit 1
fi

echo "✅ Node version check passed"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm not found"
    echo "Please install pnpm: npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm found: $(pnpm --version)"
echo ""

# Install dependencies if not already done
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Build the CLI
echo "🔨 Building CLI..."
cd packages/cli
pnpm build
cd ../..
echo "✅ CLI built successfully"
echo ""

# Link CLI globally
echo "🔗 Linking CLI globally..."
cd packages/cli

# Use pnpm link for global installation
pnpm link --global

cd ../..
echo "✅ CLI linked globally"
echo ""

# Test the CLI
echo "🧪 Testing CLI..."
if command -v saasquatch &> /dev/null; then
    VERSION=$(saasquatch --version 2>/dev/null || echo "unknown")
    echo "✅ CLI is ready!"
    echo ""
    echo "📝 You can now use saasquatch from anywhere:"
    echo ""
    echo "   saasquatch init my-project"
    echo "   saasquatch --help"
    echo "   saasquatch --version"
    echo ""
else
    echo "⚠️  CLI not found in PATH"
    echo "You may need to restart your terminal or add it to your PATH"
    exit 1
fi
