# Development Commands

## CLI Development
```bash
# Install dependencies
pnpm install

# Run CLI in dev mode
cd packages/cli && pnpm dev

# Build CLI
cd packages/cli && npm run build

# Run tests
cd packages/cli && npm test

# Test project generation
cd packages/cli && pnpm dev init test-project
```

## Generated Project Commands
```bash
# Install dependencies
npm install

# Start infrastructure
docker-compose up -d

# Build services
npm run build

# Start services
npm run dev
```

## Git Commands
```bash
# Check status
git status

# Create commit
git add .
git commit -m "feat: description"

# Check branch
git branch --show-current
```

## System Commands (macOS/Darwin)
```bash
# List files
ls -la

# Find files
find . -name "*.ts"

# Search in files
grep -r "pattern" .

# Check process
ps aux | grep node
```