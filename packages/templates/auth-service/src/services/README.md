# Auth Service - Services

This directory contains business logic services for the authentication system.

## TokenService

The `TokenService` handles all JWT token operations including generation, verification, refresh, and revocation.

### Features

- **Access Token Generation**: Creates JWT tokens with 15-minute expiry for API access
- **Refresh Token Generation**: Creates long-lived tokens (7 days) for refreshing access tokens
- **Token Verification**: Validates JWT signatures, expiry, and blacklist status
- **Token Revocation**: Adds tokens to Redis blacklist for immediate invalidation
- **Token Refresh**: Exchanges valid refresh tokens for new access tokens
- **Multi-tenancy Support**: Optional tenant ID in token payload

### Usage

#### Initialize Service

The `TokenService` is automatically initialized in the auth plugin and decorated on the Fastify instance:

```typescript
// Available as fastify.tokenService
const tokenService = fastify.tokenService;
```

#### Generate Tokens for Login

```typescript
// Generate both access and refresh tokens
const { accessToken, refreshToken } = await fastify.tokenService.generateTokenPair(
  user.id,
  user.email,
  user.tenantId // Optional
);

// Return to client
return {
  accessToken,
  refreshToken,
  expiresIn: 900, // 15 minutes in seconds
};
```

#### Verify Access Token

```typescript
// In route handler
try {
  const decoded = await fastify.tokenService.verifyToken(token);
  
  // Token is valid, proceed with request
  const userId = decoded.userId;
  const email = decoded.email;
  const tenantId = (decoded as any).tenantId;
} catch (error) {
  // Token is invalid, expired, or revoked
  reply.status(401).send({ error: 'Unauthorized' });
}
```

#### Refresh Access Token

```typescript
// POST /auth/refresh handler
const { refreshToken } = request.body;

try {
  // Get user info from database
  const user = await fastify.databaseService.getUserById(userId);
  
  // Generate new access token
  const accessToken = await fastify.tokenService.refreshAccessToken(
    refreshToken,
    user.email,
    user.tenantId
  );
  
  return { accessToken, expiresIn: 900 };
} catch (error) {
  reply.status(401).send({ error: 'Invalid refresh token' });
}
```

#### Revoke Token (Logout)

```typescript
// POST /auth/logout handler
const token = request.headers.authorization?.substring(7); // Remove 'Bearer '

if (token) {
  await fastify.tokenService.revokeToken(token);
}

return { message: 'Logged out successfully' };
```

### Token Payload Structure

#### Access Token

```typescript
{
  userId: string;      // User's unique ID
  email: string;       // User's email
  type: 'access';      // Token type
  tenantId?: string;   // Optional tenant ID
  iat: number;         // Issued at timestamp
  exp: number;         // Expiry timestamp (15 min)
}
```

#### Refresh Token

```typescript
{
  userId: string;      // User's unique ID
  type: 'refresh';     // Token type
  iat: number;         // Issued at timestamp
  exp: number;         // Expiry timestamp (7 days)
}
```

### Security Features

#### Token Blacklisting

Revoked tokens are stored in Redis with a TTL matching the token's expiry time. This ensures:

- Immediate token invalidation on logout
- Automatic cleanup when tokens expire
- No indefinite growth of the blacklist

#### Fail-Open Redis

If Redis is unavailable during token verification:

- The blacklist check fails open (returns `false`)
- Tokens are still validated via JWT signature
- This prevents complete service outage due to Redis issues

**Note**: For high-security environments, consider changing to fail-closed behavior.

#### Token Type Validation

The service validates token types to prevent:

- Using refresh tokens as access tokens
- Using access tokens to refresh

### Error Handling

The service throws descriptive errors for:

- **Expired tokens**: `"Token has expired"`
- **Invalid tokens**: `"Invalid token"`
- **Revoked tokens**: `"Token has been revoked"`
- **Wrong token type**: `"Invalid token type"`
- **Generation failures**: `"Failed to generate access token"`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing tokens | `your-secret-key-change-in-production` |

**⚠️ Important**: Always use a strong, random secret in production!

### Testing

Comprehensive unit tests are available in `test/unit/services/token.service.test.ts`:

```bash
npm test -- token.service.test.ts
```

Tests cover:
- ✅ Access token generation with expiry
- ✅ Refresh token generation with expiry
- ✅ Token verification and validation
- ✅ Token revocation and blacklisting
- ✅ Refresh token flow
- ✅ Multi-tenancy support
- ✅ Error handling and edge cases
- ✅ Redis integration

### Dependencies

- **@fastify/jwt**: JWT signing and verification
- **ioredis**: Redis client for token blacklisting
- **Fastify**: Instance for decorators and logging

### Architecture Notes

The `TokenService` follows these patterns:

1. **Constructor Injection**: Dependencies (Fastify, Redis) injected via constructor
2. **Single Responsibility**: Only handles token operations
3. **Stateless**: No internal state, all data in JWT or Redis
4. **Structured Logging**: Uses Fastify's Pino logger for observability
5. **Error Handling**: Descriptive errors for debugging and security

### Related Files

- `../plugins/auth.plugin.ts` - Fastify plugin that initializes TokenService
- `../plugins/redis.plugin.ts` - Redis connection for blacklist
- `../routes/auth.routes.ts` - Routes that use TokenService
- `../../test/unit/services/token.service.test.ts` - Comprehensive tests
