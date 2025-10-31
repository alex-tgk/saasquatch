#!/bin/bash

# SaaSquatch CLI Development Mode
# Runs the CLI in development mode (with auto-reload)
# Use this during development to test changes in real-time

set -e

echo "🚀 SaaSquatch CLI - Development Mode"
echo "===================================="
echo ""

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

cd packages/cli

echo "📝 Starting CLI in development mode with auto-reload..."
echo "Press Ctrl+C to stop"
echo ""

pnpm dev
