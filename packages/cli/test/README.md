# SaaSquatch CLI Tests

Comprehensive test suite for the SaaSquatch CLI tool.

## Test Structure

```
test/
├── integration/        # End-to-end tests
│   └── init.test.ts   # Tests for 'saasquatch init' command
├── unit/              # Unit tests
│   └── config-validation.test.ts  # Configuration schema tests
└── README.md          # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm test -- --watch
```

### Specific Test File
```bash
npm test -- init.test.ts
```

### With Coverage
```bash
npm test -- --coverage
```

## Test Categories

### Integration Tests (`test/integration/`)

Tests the entire CLI flow programmatically:

- **Project Generation**: Tests complete project scaffolding
- **File Structure**: Verifies all expected files and directories are created
- **Configuration**: Validates generated package.json and config files
- **Git Initialization**: Ensures git init completes or fails gracefully
- **Timeout Handling**: Verifies no operations hang indefinitely

**Key Tests:**
- `should generate a basic project structure` - Core functionality
- `should create service directories` - Service scaffolding
- `should generate valid package.json` - Configuration correctness
- `should handle git initialization gracefully` - Timeout prevention

### Unit Tests (`test/unit/`)

Tests individual components in isolation:

- **Configuration Validation**: Zod schema validation tests
- **Input Validation**: Project names, ports, package managers
- **Type Safety**: TypeScript type checking

**Key Tests:**
- `should validate a complete valid configuration` - Happy path
- `should reject invalid project names` - Input validation
- `should reject invalid port numbers` - Range validation

## Writing New Tests

### Integration Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';

describe('My Feature', () => {
  const testOutputDir = path.join(__dirname, '../../.test-output');
  
  beforeEach(async () => {
    await fs.remove(testOutputDir);
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  it('should do something', async () => {
    // Your test here
    expect(true).toBe(true);
  }, 60000); // Timeout
});
```

### Unit Test Template

```typescript
import { describe, it, expect } from '@jest/globals';

describe('My Module', () => {
  it('should handle input correctly', () => {
    // Your test here
    expect(true).toBe(true);
  });
});
```

## Test Configuration

Tests are configured in `jest.config.js`:

- **Test Environment**: Node.js
- **TypeScript Support**: ts-jest with ESM
- **Timeout**: 30 seconds default
- **Coverage**: Collects from `src/**/*.ts`

## Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Run Single Test
```bash
npm test -- -t "should generate a basic project structure"
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## CI/CD Integration

Tests run automatically in CI:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    cd packages/cli
    npm test
```

## Troubleshooting

### Tests Hang

If tests hang on git operations:
1. Check timeout values in test files
2. Verify git is configured correctly
3. Look for verbose output in failing tests

### File Permission Errors

```bash
# Clean test output
rm -rf packages/cli/.test-output
```

### Module Resolution Errors

```bash
# Rebuild TypeScript
npm run build
```

## Coverage Reports

After running `npm test -- --coverage`:

```
coverage/
├── lcov-report/    # HTML report (open index.html)
├── lcov.info       # LCOV format
└── coverage-final.json
```

View HTML report:
```bash
open coverage/lcov-report/index.html
```

## Best Practices

1. **Always clean up** - Use beforeEach/afterEach to clean test directories
2. **Set timeouts** - Long-running tests should specify timeout
3. **Test failures** - Test both success and failure scenarios
4. **Isolation** - Tests should not depend on each other
5. **Descriptive names** - Use clear "should..." naming
6. **Fast tests** - Keep tests fast, mock external services

## Performance

Target test suite execution time:
- Unit tests: < 5 seconds
- Integration tests: < 60 seconds
- Full suite: < 90 seconds

## Future Tests

Planned test additions:
- [ ] Prompt interaction tests (inquirer mocking)
- [ ] Service generation variations (PostgreSQL vs SQLite)
- [ ] Docker Compose validation
- [ ] Multi-service generation
- [ ] CLI argument parsing
- [ ] Error handling scenarios
- [ ] Template rendering tests
