# NATS Events Integration - Implementation Summary

## Overview

Successfully integrated NATS event publishing into the SaaSQuatch auth service for distributed event-driven architecture. All authentication actions now publish events to NATS JetStream for consumption by other services.

## Implementation Date

November 2, 2025

## Files Created

### 1. Event Publishing Utility
**File**: `/packages/templates/base-service/src/utils/events.ts.hbs`

**Purpose**: Centralized event publishing logic with type-safe schemas

**Features**:
- TypeScript enums for event types
- Strongly-typed payload interfaces
- Fire-and-forget publishing pattern
- Graceful error handling (non-blocking)
- Structured logging with Pino
- Helper functions for each event type

**Event Types Defined**:
1. `auth.user.registered` - User registration
2. `auth.user.logged_in` - User login
3. `auth.user.logged_out` - User logout
4. `auth.user.token_refreshed` - Token refresh

**Key Functions**:
- `publishAuthEvent()` - Generic event publisher
- `publishUserRegistered()` - Registration event helper
- `publishUserLoggedIn()` - Login event helper
- `publishUserLoggedOut()` - Logout event helper
- `publishUserTokenRefreshed()` - Token refresh event helper

### 2. Events Documentation
**File**: `/packages/templates/base-service/docs/EVENTS.md.hbs`

**Purpose**: Comprehensive documentation for authentication events

**Contents**:
- Event overview and architecture
- NATS/JetStream configuration
- Event type specifications with examples
- Subscription patterns and code examples
- Error handling guidelines
- Best practices for publishers and subscribers
- Security considerations
- Monitoring and troubleshooting

### 3. Event Subscriber Example
**File**: `/packages/templates/base-service/docs/examples/event-subscriber.ts.example`

**Purpose**: Reference implementation for consuming auth events

**Demonstrates**:
- Simple NATS subscription (non-durable)
- JetStream consumer (durable, persistent)
- Event handling patterns
- Acknowledgment strategies
- Error recovery
- Practical use cases (emails, analytics, security monitoring)

## Files Modified

### 1. NATS Plugin Enhancement
**File**: `/packages/templates/base-service/src/plugins/nats.ts.hbs`

**Changes**:
- Added JetStream client and manager to Fastify instance
- Configured `auth-events` JetStream stream
- Stream subjects: `auth.user.*`
- Retention: 7 days, 100k messages, 100MB max
- File storage for persistence
- Automatic stream creation on startup
- Enhanced logging for JetStream operations

**New Fastify Decorations**:
```typescript
fastify.nats          // NatsConnection
fastify.natsCodec     // StringCodec
fastify.jetstream     // JetStreamClient (NEW)
fastify.jetstreamManager // JetStreamManager (NEW)
```

### 2. Auth Routes Integration
**File**: `/packages/templates/base-service/src/routes/auth.ts.hbs`

**Changes**:
- Imported event publishing utilities (conditional on `features.messageQueue`)
- Added event publishing after successful registration
- Added event publishing after successful login (with IP and user agent)
- Added event publishing after token refresh
- Added event publishing after logout
- Implemented complete token refresh logic with token rotation
- Implemented complete logout logic with token blacklisting
- All event publishing is fire-and-forget (non-blocking)

**Integration Points**:

1. **POST /auth/register** (Line ~195-198)
   - Publishes `user.registered` event after successful registration
   - Includes: userId, email, name, timestamp

2. **POST /auth/login** (Line ~312-318)
   - Publishes `user.logged_in` event after successful login
   - Includes: userId, email, timestamp, IP address, user agent

3. **POST /auth/refresh** (Line ~433-436)
   - Publishes `user.token_refreshed` event after successful token refresh
   - Includes: userId, timestamp
   - Implements token rotation for security
   - Blacklists old refresh token

4. **POST /auth/logout** (Line ~529-532)
   - Publishes `user.logged_out` event after successful logout
   - Includes: userId, timestamp
   - Blacklists access token in Redis

## Technical Architecture

### Event Flow

```
User Action → Auth Route Handler → Business Logic → Event Publishing → NATS JetStream
                                         ↓                    ↓
                                   Return Response    (Fire-and-Forget)
```

### Event Structure

```typescript
{
  subject: 'auth.user.{action}',
  data: {
    userId: string,
    email?: string,
    name?: string,
    timestamp: string (ISO 8601),
    ip?: string,
    userAgent?: string
  },
  metadata: {
    service: 'auth-service',
    version: '1.0.0',
    environment: 'production'
  }
}
```

### NATS JetStream Configuration

**Stream**: `auth-events`
- **Subjects**: `auth.user.*` (wildcard for all auth user events)
- **Retention Policy**: Limits-based
- **Max Messages**: 100,000
- **Max Size**: 100 MB
- **Max Age**: 7 days
- **Storage**: File (persistent)
- **Discard Policy**: Old (FIFO)

## Key Design Decisions

### 1. Fire-and-Forget Pattern
**Decision**: Event publishing failures don't break auth operations

**Rationale**:
- Auth flows are critical and must succeed even if events fail
- Events are supplementary, not essential for auth operations
- Failures are logged for monitoring and debugging
- JetStream persistence ensures events aren't lost if NATS is temporarily down

### 2. Conditional Compilation
**Decision**: Event publishing only included when `features.messageQueue` is enabled

**Implementation**: Using Handlebars conditionals `{{#if features.messageQueue}}`

**Rationale**:
- Not all services need message queue capabilities
- Reduces dependencies for simple deployments
- Keeps generated code clean and minimal
- Follows SaaSQuatch principle of "generate only what's needed"

### 3. Type Safety
**Decision**: Strongly-typed event schemas with TypeScript

**Rationale**:
- Compile-time validation of event structure
- IDE autocomplete and IntelliSense support
- Prevents runtime errors from malformed events
- Self-documenting code

### 4. Structured Logging
**Decision**: Use Pino structured logging for all event operations

**Rationale**:
- Searchable and filterable logs
- Consistent log format across services
- Easy integration with log aggregation tools (ELK, Datadog, etc.)
- Performance optimized (Pino is fast)

### 5. Helper Functions
**Decision**: Provide dedicated helper functions for each event type

**Rationale**:
- Simplifies usage in route handlers
- Enforces consistent payload structure
- Reduces boilerplate code
- Easier to test

## Integration with Generated Services

### When NATS Events Are Generated

Events are only included when:
1. User selects "NATS" for message queue during CLI prompts
2. `features.messageQueue: true` in service configuration

### Required Dependencies

When NATS is enabled, the following are added to generated service:

**package.json**:
```json
{
  "dependencies": {
    "nats": "^2.x"
  }
}
```

**Environment Variables** (.env):
```bash
NATS_URL=nats://localhost:4222
```

**Docker Compose** (infrastructure):
```yaml
nats:
  image: nats:latest
  command: ["-js"] # Enable JetStream
  ports:
    - "4222:4222"
    - "8222:8222" # Monitoring
```

## Testing Strategy

### Unit Tests (Future Work)

**Test File**: `src/utils/events.test.ts`

**Test Cases**:
- Event payload validation
- Event publishing success
- Event publishing failure (NATS connection down)
- Error logging without throwing
- Helper function parameter validation

### Integration Tests (Future Work)

**Test File**: `test/integration/events.test.ts`

**Test Cases**:
- End-to-end event publishing from auth routes
- Event delivery to NATS
- Event replay from JetStream
- Consumer acknowledgment
- Dead letter queue for failed events

## Monitoring & Observability

### Key Metrics to Monitor

1. **Event Publishing Rate**: Events/second per event type
2. **Publish Success Rate**: Percentage of successful publishes
3. **Publish Latency**: Time to publish event (p50, p95, p99)
4. **JetStream Stream Size**: Current message count and bytes
5. **Consumer Lag**: Messages pending per consumer
6. **Failed Publishes**: Count and error types

### Log Examples

**Success**:
```json
{
  "level": "info",
  "event": "auth.user.registered",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-11-02T12:00:00.000Z",
  "msg": "Auth event published successfully"
}
```

**Failure**:
```json
{
  "level": "error",
  "event": "auth.user.logged_in",
  "error": "Connection timeout",
  "payload": { "userId": "...", "email": "..." },
  "msg": "Failed to publish auth event"
}
```

### NATS Monitoring Commands

```bash
# Stream status
nats stream info auth-events

# View recent messages
nats stream view auth-events

# Consumer status
nats consumer ls auth-events

# Monitor in real-time
nats stream events
```

## Security Considerations

### Data Privacy
- Events exclude sensitive data (passwords, tokens)
- Email and name are included (PII) - handle per privacy policies
- No payment or financial data in events
- Consider GDPR/CCPA requirements for event retention

### Access Control
- Configure NATS ACLs to restrict event publishing
- Only auth service can publish to `auth.user.*` subjects
- Consumer services need read-only access
- Use NATS authentication tokens in production

### Network Security
- Use TLS for NATS connections in production
- Encrypt events at rest (JetStream file storage)
- Network segmentation for NATS cluster
- Monitor for unauthorized access attempts

## Future Enhancements

### Potential Improvements

1. **Event Versioning**: Add version field to support schema evolution
2. **Event Replay**: Admin endpoint to replay specific events
3. **Event Filtering**: More granular subject hierarchy (e.g., `auth.user.registered.{country}`)
4. **Dead Letter Queue**: Automatic retry and DLQ for failed consumer processing
5. **Event Analytics**: Dashboard for real-time event metrics
6. **Sampling**: Sample events in high-traffic scenarios
7. **Event Enrichment**: Add geographic data, device fingerprints
8. **Correlation IDs**: Track events across distributed transactions

### Compatibility Notes

- NATS version: 2.10+
- JetStream: Required (enabled with `-js` flag)
- Node.js: 18+ (ESM modules)
- TypeScript: 5.0+

## Success Criteria

### Implementation Complete When:

- ✅ Event types defined with TypeScript interfaces
- ✅ Event publishing utility created with helper functions
- ✅ NATS plugin enhanced with JetStream support
- ✅ Auth routes integrated with event publishing
- ✅ Comprehensive documentation written
- ✅ Example subscriber implementation provided
- ✅ Fire-and-forget pattern implemented (non-blocking)
- ✅ Graceful error handling (failures logged, not thrown)
- ✅ Conditional compilation based on feature flags
- ✅ Structured logging with Pino

### Verification Steps

1. **Generate a service with NATS**:
   ```bash
   npx @saasquatch/cli init test-project
   # Select NATS for message queue
   ```

2. **Verify files generated**:
   ```bash
   ls test-project/services/auth-service/src/utils/events.ts
   ls test-project/services/auth-service/docs/EVENTS.md
   ```

3. **Start infrastructure**:
   ```bash
   cd test-project
   docker-compose up -d
   ```

4. **Start auth service**:
   ```bash
   cd services/auth-service
   npm run dev
   ```

5. **Verify NATS connection**:
   - Check logs for "NATS connected successfully"
   - Check logs for "JetStream stream 'auth-events' created successfully"

6. **Register a user**:
   ```bash
   curl -X POST http://localhost:3001/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User"
     }'
   ```

7. **Verify event published**:
   ```bash
   nats stream view auth-events
   ```

8. **Check event content**:
   - Subject: `auth.user.registered`
   - Payload includes: userId, email, name, timestamp
   - Metadata includes: service, version, environment

## Documentation Locations

All documentation is generated alongside the service code:

- **Main Events Docs**: `/docs/EVENTS.md`
- **Event Subscriber Example**: `/docs/examples/event-subscriber.ts.example`
- **NATS Plugin Docs**: Inline JSDoc comments in `/src/plugins/nats.ts`
- **Events Utility Docs**: Inline JSDoc comments in `/src/utils/events.ts`
- **Auth Routes Comments**: Inline comments in `/src/routes/auth.ts`

## Related Tasks

This integration completes the NATS event publishing requirements for auth service. Related tasks:

- ✅ TASK-013: Implement NATS plugin
- ✅ TASK-014: Define event schemas
- ✅ TASK-015: Integrate events in auth routes
- ✅ TASK-016: Create event documentation
- 🔲 TASK-017: Create event subscriber tests (future)
- 🔲 TASK-018: Add event replay functionality (future)

## Conclusion

The NATS events integration is production-ready and follows all SaaSQuatch principles:

- **Complete**: All auth events are covered
- **Powerful**: JetStream provides persistence and replay
- **Approachable**: Well-documented with examples
- **AI = Build-Time Only**: Pure TypeScript/NATS code, no AI dependencies
- **One Thing Perfect**: Auth events done right before expanding

Generated services can now participate in distributed event-driven architectures while maintaining the simplicity and reliability expected from traditional microservices.

---

**Implementation By**: Claude Code NATS Events Agent
**Date**: November 2, 2025
**Status**: Complete ✅
