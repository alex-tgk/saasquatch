# Testing Guide for SaaSquatch CLI

## Quick Start

```bash
cd packages/cli

# Install test dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Git Initialization Debugging

If you experience hanging during `saasquatch init`, the verbose logging now shows:

```
✔ Checking for git...
  Found git version 2.39.0
✔ Running git init...
  Initialized empty Git repository
  Hooks disabled
✔ Staging files (git add .)...
  Staged in 125ms
✔ Creating initial commit...
  Committed in 450ms
  [main (root-commit) abc1234] Initial commit: Project scaffolded by SaaSquatch CLI
✔ Git repository initialized
```

### If Git Hangs:

The verbose output will show exactly where it stops:

```
⠹ Creating initial commit...
```

This indicates the commit step is hanging. The operation will timeout after 15 seconds and show:

```
✖ Failed to create initial commit
  Error: Command timed out after 15000 milliseconds: git commit...
  Timeout after 15234ms
```

## Test Structure

### Integration Tests (`test/integration/`)

**Purpose**: Test complete CLI workflows end-to-end

**What's tested**:
- Full project generation from config
- File system operations
- Git initialization with timeouts
- Service scaffolding
- Infrastructure file generation

**Example**:
```bash
npm test -- init.test.ts
```

### Unit Tests (`test/unit/`)

**Purpose**: Test individual components in isolation

**What's tested**:
- Configuration schema validation (Zod)
- Input validation (project names, ports)
- Type safety
- Edge cases

**Example**:
```bash
npm test -- config-validation.test.ts
```

## Debugging Hanging Issues

### 1. Run with Verbose Output

```bash
# Build CLI with latest changes
npm run build

# Test locally with verbose output
node dist/cli.js init test-project
```

### 2. Check Git Operations

The new logging shows:
- Git version check (5s timeout)
- Git init (5s timeout)
- Git add (10s timeout)
- Git commit (15s timeout)

Each step shows:
- What it's doing
- How long it took
- Any errors encountered

### 3. Run Integration Tests

```bash
# Test git initialization specifically
npm test -- -t "should handle git initialization gracefully"
```

This test:
- Generates a small project
- Measures total time
- Ensures completion < 30 seconds
- Verifies project exists regardless of git status

## Test Coverage

Current test coverage:

```
Statements   : XX% 
Branches     : XX%
Functions    : XX%
Lines        : XX%
```

Run `npm test -- --coverage` to see detailed report.

## Timeout Configuration

All git operations have timeouts to prevent hanging:

| Operation | Timeout | What it does |
|-----------|---------|--------------|
| `git --version` | 5s | Check git availability |
| `git init` | 5s | Initialize repository |
| `git config` | 5s | Disable hooks |
| `git add .` | 10s | Stage all files |
| `git commit` | 15s | Create initial commit |

Total maximum time for git: **40 seconds**

## Environment Variables

Set these to affect git behavior:

```bash
# Disable terminal prompts (already set in code)
export GIT_TERMINAL_PROMPT=0

# Skip git initialization entirely (future feature)
export SAASQUATCH_SKIP_GIT=1
```

## Common Issues

### Issue: Tests fail with "Command not found: git"

**Solution**: Install git or set `SAASQUATCH_SKIP_GIT=1`

### Issue: Tests timeout

**Solution**: 
1. Increase Jest timeout in test file: `jest.setTimeout(60000)`
2. Check if git has hooks that require input
3. Run: `git config --global core.hooksPath /dev/null`

### Issue: Permission denied on .test-output

**Solution**:
```bash
rm -rf packages/cli/.test-output
chmod -R 755 packages/cli/.test-output
```

## Writing New Tests

### Integration Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { ProjectGenerator } from '../../src/generators/project.generator.js';

describe('My Feature', () => {
  const testOutputDir = path.join(__dirname, '../../.test-output');
  const projectPath = path.join(testOutputDir, 'test-project');

  beforeEach(async () => {
    await fs.remove(testOutputDir);
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  it('should test something', async () => {
    const config = { /* your config */ };
    const generator = new ProjectGenerator(config);
    await generator.generate(projectPath);
    
    expect(await fs.pathExists(projectPath)).toBe(true);
  }, 60000);
});
```

## CI/CD Integration

Tests run in GitHub Actions:

```yaml
- name: Test CLI
  run: |
    cd packages/cli
    npm install
    npm test
```

## Performance Benchmarks

Target execution times:
- Unit tests: < 5 seconds
- Integration tests: < 60 seconds per test
- Full suite: < 90 seconds

Monitor with:
```bash
npm test -- --verbose
```

## Next Steps

To add more test coverage:

1. **CLI Argument Parsing**
   - Test `--help`, `--version` flags
   - Test invalid arguments

2. **Prompt Interactions**
   - Mock inquirer responses
   - Test question flow

3. **Service Variations**
   - Test PostgreSQL vs SQLite generation
   - Test with/without various features

4. **Error Handling**
   - Test invalid configurations
   - Test filesystem errors
   - Test git unavailable scenarios

5. **Template Rendering**
   - Test Handlebars template compilation
   - Test variable substitution

## Troubleshooting Test Failures

### Read the verbose output
```bash
npm test -- --verbose 2>&1 | tee test-output.log
```

### Check what files were created
```bash
ls -la packages/cli/.test-output/
```

### Run single failing test
```bash
npm test -- -t "exact test name"
```

### Debug with breakpoints
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Last Updated**: 2025-10-31
**Test Framework**: Jest 29.7.0
**Coverage Goal**: 80%+
