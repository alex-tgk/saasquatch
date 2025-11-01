# User Service Events

This document describes the NATS event publishing system in the user service.

## Overview

The user service publishes events to NATS JetStream for all user lifecycle operations:
- User creation
- User updates
- User deletion (soft delete)

Events are published asynchronously (non-blocking) to ensure fast API response times.

## Event Subjects

All events use the pattern `user.*`:

- `user.created` - Published when a new user is created
- `user.updated` - Published when a user is updated
- `user.deleted` - Published when a user is soft-deleted

## Event Schemas

### user.created

```typescript
{
  userId: string;       // UUID of the created user
  email: string;        // User's email address
  tenantId: string;     // Tenant ID (for multi-tenancy)
  timestamp: number;    // Unix timestamp in milliseconds
}
```

### user.updated

```typescript
{
  userId: string;       // UUID of the updated user
  changes: {            // Object tracking what changed
    [field: string]: {
      from: any;
      to: any;
    }
  };
  tenantId: string;     // Tenant ID (for multi-tenancy)
  timestamp: number;    // Unix timestamp in milliseconds
}
```

Example changes object:
```typescript
{
  email: { from: "old@example.com", to: "new@example.com" },
  name: { from: "Old Name", to: "New Name" }
}
```

### user.deleted

```typescript
{
  userId: string;       // UUID of the deleted user
  tenantId: string;     // Tenant ID (for multi-tenancy)
  timestamp: number;    // Unix timestamp in milliseconds
}
```

## JetStream Configuration

The user service creates a JetStream stream named `USER_EVENTS` with the following configuration:

```typescript
{
  name: 'USER_EVENTS',
  subjects: ['user.*'],
  retention: 'limits',
  max_age: 7 days,
  max_msgs: 1,000,000,
  storage: 'file',
  discard: 'old'
}
```

### Configuration Details

- **Retention**: `limits` - Stream is bounded by limits (max_age, max_msgs)
- **Max Age**: 7 days - Messages older than 7 days are automatically discarded
- **Max Messages**: 1,000,000 - Maximum number of messages retained
- **Storage**: `file` - Messages are persisted to disk (survives restarts)
- **Discard**: `old` - When limits are reached, oldest messages are discarded first

## Usage in Code

### Publishing Events

Events are published automatically from the user routes:

```typescript
// After creating a user
const event: UserCreatedEvent = {
  userId: user.id,
  email: user.email,
  tenantId,
  timestamp: Date.now(),
};

publishUserCreated(fastify, event).catch((error) => {
  fastify.log.error({ error, userId: user.id }, 'Failed to publish user.created event');
});
```

### Subscribing to Events (Other Services)

Other services can subscribe to user events:

```typescript
import { StringCodec } from 'nats';

const js = await fastify.nats.jetstream();
const sc = StringCodec();

// Create a consumer
const consumer = await js.consumers.get('USER_EVENTS', 'my-consumer');

// Process messages
const messages = await consumer.consume();

for await (const msg of messages) {
  const data = JSON.parse(sc.decode(msg.data));

  switch (msg.subject) {
    case 'user.created':
      await handleUserCreated(data);
      break;
    case 'user.updated':
      await handleUserUpdated(data);
      break;
    case 'user.deleted':
      await handleUserDeleted(data);
      break;
  }

  msg.ack();
}
```

## Error Handling

Event publishing failures are logged but do not block the API response:

```typescript
publishUserCreated(fastify, event).catch((error) => {
  fastify.log.error({ error, userId: user.id }, 'Failed to publish user.created event');
});
```

This ensures that:
1. API responses remain fast
2. Database operations complete successfully
3. Event failures are logged for monitoring

## Monitoring

Monitor event publishing with structured logs:

```json
{
  "level": "info",
  "event": "user.created",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "tenantId": "tenant_abc",
  "msg": "Published user.created event"
}
```

## Best Practices

1. **Always publish events asynchronously** - Don't block API responses
2. **Include tenant context** - For proper multi-tenancy isolation
3. **Log failures** - Monitor event publishing health
4. **Use structured logging** - Include event type, userId, tenantId
5. **Set up consumers** - Create dedicated consumers for each subscribing service
6. **Monitor stream health** - Check JetStream metrics regularly

## Environment Variables

```bash
NATS_URL=nats://localhost:4222  # NATS server URL
```

## Testing Events

### Manual Testing with NATS CLI

```bash
# Subscribe to all user events
nats sub "user.*"

# Create a user via API (will trigger user.created event)
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Check JetStream stream info
nats stream info USER_EVENTS

# View stream messages
nats stream view USER_EVENTS
```

### Integration Testing

```typescript
import { describe, it, expect } from '@jest/globals';
import { buildApp } from '../src/app.js';

describe('User Events', () => {
  it('should publish user.created event', async () => {
    const app = await buildApp();

    // Subscribe to events
    const js = await app.nats.jetstream();
    const consumer = await js.consumers.get('USER_EVENTS', 'test-consumer');
    const messages = await consumer.fetch({ max_messages: 1 });

    // Create user
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { email: 'test@example.com', name: 'Test' },
      headers: { authorization: 'Bearer TEST_JWT' }
    });

    expect(response.statusCode).toBe(201);

    // Verify event was published
    const msg = await messages.next();
    expect(msg.subject).toBe('user.created');

    await app.close();
  });
});
```

## Troubleshooting

### Events Not Publishing

1. Check NATS connection:
```bash
nats account info
```

2. Verify stream exists:
```bash
nats stream ls
```

3. Check application logs for errors:
```bash
grep "user.created" logs/app.log
```

### Stream Full

If the stream reaches max_msgs (1,000,000), oldest messages are automatically discarded.

To increase capacity:
```bash
nats stream edit USER_EVENTS --max-msgs=10000000
```

### Messages Expiring Too Fast

Increase retention period:
```bash
nats stream edit USER_EVENTS --max-age=30d
```
