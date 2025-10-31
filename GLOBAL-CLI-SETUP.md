# SaaSquatch Global CLI Setup

This guide explains how to set up the SaaSquatch CLI to be globally available on your system.

## Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# From project root
./scripts/setup-global-cli.sh
```

This script will:
1. Check Node version (must be 20+)
2. Install pnpm dependencies
3. Build the CLI
4. Link the CLI globally via npm
5. Verify the setup

### Option 2: Manual Setup

```bash
cd packages/cli

# Build the CLI
pnpm build

# Link globally
npm link

# Test it
cd ~
saasquatch --version
```

## Usage

Once installed globally, use the CLI from anywhere:

```bash
# Create a new project
saasquatch init my-awesome-project

# Show help
saasquatch --help

# Show version
saasquatch --version
```

## Development Workflow

### Using Development Scripts

**Start CLI in development mode:**
```bash
# From project root
./scripts/dev-cli.sh init my-test-project
```

This runs with live reload - any changes to `src/cli.ts` will be automatically picked up.

### Manual Development Mode

```bash
cd packages/cli
pnpm dev init my-test-project
```

## Verification

Verify your CLI is properly installed:

```bash
# Check if saasquatch is in PATH
which saasquatch

# Show version
saasquatch --version

# Show help
saasquatch --help

# Test generation
saasquatch init test-project --verbose
```

## Troubleshooting

### CLI not found after setup

```bash
# Check if it's actually linked
ls -la ~/.npm/_cacache

# Try reinstalling the link
cd packages/cli
npm link
```

### Permission denied

If you get permission errors:

```bash
# Check Node/npm permissions
npm config get prefix

# You may need to use sudo
sudo npm link
```

### Terminal needs restart

Some shells cache the PATH. Try:

```bash
# Restart your terminal, or
source ~/.bashrc        # For bash
source ~/.zshrc         # For zsh
exec $SHELL             # For current session
```

## Uninstalling

To remove the global link:

```bash
cd packages/cli
npm unlink -g
```

## Output Directory

Generated projects are stored in `.output/` which is gitignored:

```bash
# Generate test projects here
saasquatch init ./.output/my-test-project
```

## Next Steps

After setup, try:

```bash
# Generate a new project
saasquatch init my-first-project

# Explore the generated structure
cd my-first-project
ls -la
cat saasquatch.config.json

# View the configuration
cd services/auth-service
cat package.json
```

---

For more information, see:
- [README.md](./README.md) - Main documentation
- [CLAUDE.md](./CLAUDE.md) - Project architecture
- [START-HERE.md](./START-HERE.md) - Development roadmap
