# Productionize - Production Readiness Analyzer and Fixer

Scan project for non-production code and either auto-fix or present options for resolution.

## Phase 1: Scanning

**Scanning project for production readiness issues...**

I'll identify:

### 1. Mock Data and Test Fixtures
- Hardcoded test data in source files
- Faker/casual library usage outside tests
- Fixture files in `src/` instead of `tests/`
- Static demo data in services/controllers

### 2. Development Artifacts
- `console.log()` statements
- `debugger` statements
- Verbose logging (LOG_LEVEL=debug in prod)
- Development-only middleware
- Source maps exposed
- Stack traces in error responses

### 3. TODOs and Incomplete Code
- `// TODO` comments in critical paths
- Stub functions returning mock data
- Unimplemented error handling
- Placeholder text in user-facing messages
- Commented-out code blocks

### 4. Configuration Issues
- Hardcoded values that should be environment variables
  - API keys and secrets
  - Database connection strings
  - Service URLs
  - Port numbers
  - Feature flags
- Missing .env.example entries
- Sensitive data in version control

### 5. Error Handling Gaps
- Unhandled promise rejections
- Missing try-catch blocks
- No global error handler
- Silent failures (empty catch blocks)
- Generic error messages
- Stack traces exposed to users

### 6. Type Safety Issues
- TypeScript `any` types
- `@ts-ignore` comments
- Non-null assertions (`!`) without justification
- Implicit any parameters
- Missing return types

### 7. Security Concerns
- SQL injection vulnerabilities
- XSS vulnerabilities
- CSRF protection missing
- No rate limiting
- Exposed secrets in code
- Weak password requirements
- Missing input sanitization
- No authentication on sensitive endpoints

### 8. Performance Issues
- N+1 query problems
- Missing database indexes
- No caching strategy
- Large file uploads without streaming
- Synchronous operations blocking event loop
- Memory leaks (event listeners not cleaned up)

## Scan Results Format

```typescript
interface ProductionIssue {
  id: string;
  category: 'mock-data' | 'dev-artifacts' | 'todos' | 'config' |
           'error-handling' | 'type-safety' | 'security' | 'performance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  description: string;
  currentCode: string;
  autoFixable: boolean;
  suggestedFix?: string;
  options?: Array<{
    label: string;
    description: string;
    implementation: string;
  }>;
}
```

## Phase 2: Resolution

### Auto-Fixable Issues

I'll automatically fix:

**1. Console Statements**
```typescript
// Before
console.log('User logged in:', user);

// After
logger.info('User logged in', { userId: user.id });
```

**2. Hardcoded Values to Environment Variables**
```typescript
// Before
const apiKey = 'sk-1234567890';

// After
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}

// Add to .env.example
API_KEY=your-api-key-here
```

**3. Basic Error Handling**
```typescript
// Before
async function getUser(id: string) {
  const user = await db.users.findOne(id);
  return user;
}

// After
async function getUser(id: string): Promise<User> {
  try {
    const user = await db.users.findOne(id);
    if (!user) {
      throw new NotFoundError(`User ${id} not found`);
    }
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    throw error;
  }
}
```

**4. TypeScript Any Replacements**
```typescript
// Before
function processData(data: any) {
  return data.results;
}

// After
interface ApiResponse {
  results: Result[];
}

function processData(data: ApiResponse): Result[] {
  return data.results;
}
```

**5. Remove Debugger Statements**
```typescript
// Before
function calculatePrice(items: Item[]) {
  debugger; // Remove this
  return items.reduce((sum, item) => sum + item.price, 0);
}

// After
function calculatePrice(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Issues Requiring Decisions

For complex issues, I'll present options:

**Example: Mock Data Replacement**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE #1: Mock user data in src/services/userService.ts:15
Severity: HIGH | Category: mock-data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Code:
```typescript
async getUsers() {
  return [
    { id: 1, name: 'Test User', email: 'test@example.com' },
    { id: 2, name: 'Demo User', email: 'demo@example.com' }
  ];
}
```

Context:
- Used in production endpoints
- No database connection
- Static demo data

Options:

A) Connect to PostgreSQL database
   - Setup Prisma ORM
   - Create users table
   - Implement repository pattern
   - Add database migrations
   ⚠️ Requires: DATABASE_URL env var

B) Integrate with external User API
   - Add API client configuration
   - Implement caching layer
   - Add error handling
   ⚠️ Requires: USER_API_URL, USER_API_KEY env vars

C) Use Redis cache with database fallback
   - Primary: Redis for fast reads
   - Fallback: PostgreSQL for consistency
   - Implement cache invalidation
   ⚠️ Requires: REDIS_URL, DATABASE_URL env vars

D) Move mock to test fixtures only
   - Create proper database entities
   - Use factories for test data
   - Implement repository with DB connection
   ⚠️ Requires: Setting up test database

E) Skip this issue (not recommended)
   ⚠️ Warning: Will leave mock data in production

Select option (A/B/C/D/E): _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 3: Implementation

For each selected option, I will:

1. **Generate code** - Complete implementation
2. **Install dependencies** - Required packages
3. **Update configuration** - Environment variables, configs
4. **Add error handling** - Proper error management
5. **Write tests** - Verify the implementation works
6. **Update documentation** - Document new setup required

## Phase 4: Reporting

I'll generate a comprehensive report saved to:
`docs/production-readiness-{YYYYMMDD-HHMMSS}.md`

### Report Contents

```markdown
# Production Readiness Report
Generated: 2025-10-31 12:34:56

## Executive Summary
- Total Issues Found: 47
- Auto-Fixed: 32
- Requiring Manual Decision: 10
- Skipped: 2
- Remaining Critical Issues: 3

## Critical Issues ⚠️
Must be addressed before production deployment.

### 1. Exposed API keys in source code
- File: src/config/api.ts:7
- Risk: Credential exposure
- Action: Moved to environment variables
- Status: ✅ Fixed

### 2. No rate limiting on auth endpoints
- Files: src/controllers/authController.ts
- Risk: Brute force attacks
- Action: Added express-rate-limit middleware
- Status: ✅ Fixed

## Issues by Category

### Mock Data (5 issues)
- ✅ UserService mock data → PostgreSQL
- ✅ OrderService demo data → Database
- ⏭️ PaymentService test cards → Stripe test mode
- 🔴 EmailService using console → SendGrid integration needed
- 🔴 NotificationService stubs → Redis + WebSocket needed

### Development Artifacts (15 issues)
- ✅ Removed 12 console.log statements
- ✅ Removed 2 debugger statements
- ✅ Replaced with proper logging (Pino)

### TODOs (8 issues)
- ✅ Implemented error handling for file uploads
- ✅ Added input validation to user registration
- 🔴 OAuth integration still TODO
- 🔴 Email verification flow incomplete

### Configuration (12 issues)
- ✅ Moved all hardcoded values to .env
- ✅ Updated .env.example
- ✅ Added config validation on startup

### Error Handling (7 issues)
- ✅ Added global error handler
- ✅ Wrapped async routes in try-catch
- ✅ Added custom error classes
- ✅ Implemented error logging

### Type Safety (10 issues)
- ✅ Replaced 8 'any' types with proper types
- ✅ Removed 2 @ts-ignore comments
- ⏭️ 2 complex types need refinement (non-blocking)

### Security (15 issues)
- ✅ Added input sanitization
- ✅ Implemented rate limiting
- ✅ Added CSRF protection
- ✅ Enabled helmet middleware
- ✅ Added SQL injection prevention
- 🔴 Password strength requirements need update
- 🔴 Session management needs improvement

### Performance (3 issues)
- ✅ Fixed N+1 queries in user relationships
- ✅ Added database indexes
- ⏭️ Caching strategy recommended (non-critical)

## Changes Made

### Files Modified: 23
- src/services/userService.ts
- src/services/orderService.ts
- src/controllers/authController.ts
- src/middleware/errorHandler.ts
- [... see full list in appendix]

### Dependencies Added:
```json
{
  "pino": "^8.16.0",
  "express-rate-limit": "^7.1.0",
  "helmet": "^7.1.0",
  "@prisma/client": "^5.6.0",
  "zod": "^3.22.4"
}
```

### Environment Variables Added:
```env
DATABASE_URL=
REDIS_URL=
API_KEY=
JWT_SECRET=
LOG_LEVEL=info
NODE_ENV=production
```

## Manual Actions Required

### 1. Database Setup
- Create PostgreSQL database
- Run migrations: `npx prisma migrate deploy`
- Seed initial data if needed

### 2. Redis Setup
- Install Redis server
- Configure connection
- Test cache functionality

### 3. API Keys
- Obtain production API keys
- Add to environment variables
- Test integrations

### 4. Security Review
- Update password requirements
- Implement session management
- Review CORS configuration
- Schedule security audit

## Recommendations

### Immediate (Before Deployment)
1. Address all CRITICAL issues
2. Setup production database
3. Configure environment variables
4. Run full test suite
5. Perform security audit

### Short-term (Next Sprint)
1. Complete OAuth integration
2. Implement email verification
3. Add comprehensive logging
4. Setup monitoring/alerting

### Long-term (Future Iterations)
1. Implement caching strategy
2. Add performance monitoring
3. Setup CI/CD pipeline
4. Implement blue-green deployment

## Testing Checklist

- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ⏭️ Load testing needed
- ⏭️ Security testing needed
- ⏭️ End-to-end testing needed

## Deployment Readiness: 70%

### Blockers:
- Email service integration
- Password strength update
- Session management improvement

### Estimated Time to Production-Ready: 2-3 days

---

Report generated by /user:productionize
```

## Execution Process

I will:

1. **Deep scan** - Analyze all source files
2. **Categorize issues** - Group by type and severity
3. **Auto-fix safe changes** - Console logs, hardcoded values, etc.
4. **Present decisions** - For complex issues requiring choice
5. **Implement selections** - Based on your choices
6. **Run tests** - Verify nothing broke
7. **Generate report** - Comprehensive documentation
8. **Commit changes** - With detailed commit message

Starting production readiness scan now...
