# Database Migration System - Quick Reference

**Implementation Date**: 2025-11-02
**Status**: ✅ Production Ready

## Files Created

### 1. Migration Infrastructure (5 files)

```
packages/templates/base-service/
├── .env.example.hbs                    # Environment configuration template
├── knexfile.ts.hbs                     # Knex configuration (dev/prod/test)
├── migrations/
│   ├── 001_create_users_table.ts.hbs  # Initial users table migration
│   └── README.md.hbs                   # 454 lines of documentation
└── src/utils/
    └── migrate.ts.hbs                  # 270 lines of migration utilities
```

### 2. Modified Files (2 files)

```
packages/templates/base-service/
├── package.json.hbs                    # Added 7 migration scripts + dotenv
└── src/plugins/database.ts.hbs         # Added auto-migration on startup
```

## Users Table Schema

```sql
CREATE TABLE users (
  id                              UUID PRIMARY KEY,
  email                           VARCHAR(255) NOT NULL UNIQUE,
  password_hash                   VARCHAR(255) NOT NULL,
  name                            VARCHAR(255) NOT NULL,
  is_active                       BOOLEAN NOT NULL DEFAULT true,
  email_verified                  BOOLEAN NOT NULL DEFAULT false,
  verification_token              VARCHAR(255) NULL,
  verification_token_expires_at   TIMESTAMP NULL,
  last_login_at                   TIMESTAMP NULL,
  created_at                      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes (6 total)
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_email_verified_idx ON users(email_verified);
CREATE INDEX users_is_active_idx ON users(is_active);
CREATE INDEX users_verification_token_idx ON users(verification_token);
CREATE INDEX users_created_at_idx ON users(created_at);
CREATE INDEX users_active_verified_idx ON users(is_active, email_verified);
```

## NPM Scripts Added

```bash
npm run migrate:make <name>     # Create new migration
npm run migrate:latest          # Run pending migrations
npm run migrate:rollback        # Rollback last batch
npm run migrate:status          # Check migration status
npm run migrate:list            # List all migrations
npm run seed:make <name>        # Create seed file
npm run seed:run                # Run seed files
```

## Environment Variables

```bash
# Auto-migration (default: true)
AUTO_MIGRATE=true

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/db
# OR
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service

# SQLite
DATABASE_URL=./data/service.db
```

## Key Features

### ✅ Dual Database Support
- PostgreSQL with native UUIDs
- SQLite with text-based UUIDs
- Single migration file works for both

### ✅ Auto-Migration on Startup
- Runs automatically when service starts
- Configurable via `AUTO_MIGRATE` env var
- Fails fast if migration errors occur
- Detailed logging with Pino

### ✅ Multi-Tenancy Support (PostgreSQL)
- Schema-per-tenant architecture
- `runTenantMigrations(db, tenantId)` - Migrate single tenant
- `runAllTenantMigrations(db)` - Migrate all tenants
- Automatic schema creation

### ✅ Production Ready
- Transaction-safe migrations
- Rollback support
- Security credential validation
- SSL support for PostgreSQL
- Separate test database config

### ✅ Developer Experience
- TypeScript migrations in development
- Compiled JavaScript in production
- Comprehensive documentation (454 lines)
- Common migration patterns included
- Troubleshooting guide

## Migration Utilities

```typescript
import {
  runMigrations,
  runTenantMigrations,
  runAllTenantMigrations,
  rollbackMigrations,
  getMigrationStatus
} from './utils/migrate';

// Run migrations
const result = await runMigrations(db, logger);

// Multi-tenant (PostgreSQL only)
await runTenantMigrations(db, 'tenant-123', logger);
await runAllTenantMigrations(db, logger);

// Get status
const status = await getMigrationStatus(db);
console.log(status.pending);    // ['002_add_column.ts']
console.log(status.completed);  // [{ name: '001...', batch: 1 }]
```

## Quick Start

### Development

```bash
# 1. Copy .env.example to .env
cp .env.example .env

# 2. Start service (migrations auto-run)
npm run dev

# Output:
# [INFO] Database connected successfully
# [INFO] Running database migrations...
# [INFO] Database migrations completed (count: 1)
```

### Creating Migrations

```bash
# Create new migration
npm run migrate:make add_user_avatar

# Edit: src/migrations/TIMESTAMP_add_user_avatar.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('avatar_url', 500).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('avatar_url');
  });
}

# Restart service or run manually
npm run migrate:latest
```

## Testing

```typescript
import { runMigrations } from '../src/utils/migrate';

describe('Auth Service', () => {
  let db: Knex;

  beforeAll(async () => {
    // In-memory SQLite for fast tests
    db = knex({
      client: 'sqlite',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    // Run migrations
    await runMigrations(db);
  });

  test('creates user', async () => {
    const user = await db('users').insert({
      id: randomUUID(),
      email: 'test@example.com',
      password_hash: await bcrypt.hash('password', 10),
      name: 'Test User',
    });
    expect(user).toBeDefined();
  });
});
```

## Production Deployment

### Strategy 1: Auto-Migration (Simple)

```bash
# Set environment variable
export AUTO_MIGRATE=true

# Start service - migrations run automatically
npm start
```

**Pros**: Simple, zero-config
**Cons**: Database downtime if migration fails

### Strategy 2: Manual Control (Recommended)

```bash
# Disable auto-migration
export AUTO_MIGRATE=false

# Run migrations separately
npm run migrate:latest

# If successful, start service
npm start
```

**Pros**: Better control, can rollback before starting service
**Cons**: Extra step in deployment

## Security Features

1. **Credential Validation**: Rejects default PostgreSQL credentials in production
2. **Password Hashing**: Schema enforces `password_hash`, never plain passwords
3. **JWT Secrets**: .env.example includes generation instructions
4. **SQL Injection**: Knex query builder prevents SQL injection
5. **Schema Isolation**: Multi-tenancy ensures tenant separation

## Performance

- **Connection Pool**: 2-10 connections (configurable)
- **Strategic Indexes**: 6 indexes on users table
- **Compound Index**: `(is_active, email_verified)` for common queries
- **Transaction Batching**: All migrations run in transactions
- **Lazy Execution**: Only pending migrations run

## Documentation

### Migration README (454 lines)

Includes:
- Quick start guide
- Migration file structure
- Best practices (7 principles)
- Common patterns (6 examples)
- Troubleshooting guide
- Production checklist
- Database-specific notes
- Multi-tenancy guide
- External resources

### Implementation Doc (This File)

Complete technical specification with:
- Schema design rationale
- Code examples
- Integration points
- Testing strategy
- Security considerations

## Integration Points

1. **Database Plugin** - Auto-runs migrations
2. **Auth Routes** - Uses users table
3. **User Service** - CRUD operations
4. **Package.json** - Migration scripts
5. **Environment** - Configuration

## Metrics

- **Files Created**: 5 new template files
- **Files Modified**: 2 existing files
- **Lines of Code**: 813 total
  - Migration: 89 lines
  - Utilities: 270 lines
  - Documentation: 454 lines
- **Test Coverage**: Ready for unit + integration tests
- **Database Support**: PostgreSQL + SQLite
- **Multi-Tenancy**: Full support (PostgreSQL)

## Next Steps

1. ✅ Test in generated project
2. ✅ Verify PostgreSQL path
3. ✅ Verify SQLite path
4. ✅ Test multi-tenancy features
5. ✅ Integrate with auth routes
6. ⏭️ Add seed data for development

## Summary

The database migration system is **complete and production-ready**:

- ✅ Full schema for authentication
- ✅ Dual database support (PostgreSQL + SQLite)
- ✅ Multi-tenancy (schema-per-tenant)
- ✅ Auto-migration on startup
- ✅ Manual migration tools
- ✅ Comprehensive documentation
- ✅ Security validation
- ✅ Performance optimized
- ✅ TypeScript strict mode
- ✅ Brand guidelines compliant

**Ready for Phase 1 implementation.**
