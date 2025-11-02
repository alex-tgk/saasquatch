# @saasquatch/sdk

TypeScript SDK for interacting with SaaSQuatch-generated microservices.

## Installation

```bash
npm install @saasquatch/sdk
# or
pnpm add @saasquatch/sdk
# or
yarn add @saasquatch/sdk
```

## Quick Start

```typescript
import { SaaSQuatchClient } from '@saasquatch/sdk';

// Initialize the client
const client = new SaaSQuatchClient({
  authServiceUrl: 'http://localhost:3001',
  userServiceUrl: 'http://localhost:3002',
});

// Register a new user
const authResponse = await client.auth.register({
  email: 'user@example.com',
  password: 'SecureP@ssw0rd',
  name: 'John Doe'
});

console.log('Access token:', authResponse.accessToken);
console.log('User:', authResponse.user);
```

## Features

- ✅ **Type-Safe** - Full TypeScript support with detailed type definitions
- ✅ **Authentication** - Complete auth flow (register, login, logout, refresh)
- ✅ **Auto Token Refresh** - Automatically refreshes expired tokens
- ✅ **Error Handling** - Consistent error formatting across all services
- ✅ **Interceptors** - Request/response interceptors for auth and error handling
- ✅ **Modular** - Use individual service clients or the unified client

## Configuration

```typescript
const client = new SaaSQuatchClient({
  // Required: Auth service URL
  authServiceUrl: 'http://localhost:3001',

  // Optional: User service URL (if using microservices)
  userServiceUrl: 'http://localhost:3002',

  // Optional: API Gateway URL (if using gateway pattern)
  apiGatewayUrl: 'http://localhost:3000',

  // Optional: Request timeout (default: 30000ms)
  timeout: 30000,

  // Optional: Include credentials (default: true)
  withCredentials: true,

  // Optional: Custom headers
  headers: {
    'X-Custom-Header': 'value'
  },

  // Optional: Initial tokens
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',

  // Optional: Token refresh callback
  onTokenRefresh: (tokens) => {
    console.log('Tokens refreshed:', tokens);
    // Save tokens to localStorage, cookies, etc.
  },

  // Optional: Auth error callback
  onAuthError: (error) => {
    console.error('Authentication error:', error);
    // Redirect to login, show error, etc.
  }
});
```

## Authentication

### Register

```typescript
const response = await client.auth.register({
  email: 'user@example.com',
  password: 'SecureP@ssw0rd',
  name: 'John Doe'
});

// Tokens are automatically stored
console.log(response.accessToken);
console.log(response.refreshToken);
console.log(response.user);
```

### Login

```typescript
const response = await client.auth.login({
  email: 'user@example.com',
  password: 'SecureP@ssw0rd'
});

console.log(response.user);
```

### Get Current User

```typescript
const user = await client.auth.getMe();
console.log(user.email);
```

### Refresh Token

```typescript
// Automatic refresh (uses stored refresh token)
const tokens = await client.auth.refresh();

// Manual refresh
const tokens = await client.auth.refresh('your-refresh-token');
```

### Logout

```typescript
await client.auth.logout();
```

### Check Authentication

```typescript
if (client.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

## User Management

### List Users

```typescript
const response = await client.users.list(
  // Filters
  {
    role: 'admin',
    isActive: true
  },
  // Pagination
  {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
);

console.log(response.data); // Array of users
console.log(response.pagination); // Pagination info
```

### Get User by ID

```typescript
const user = await client.users.getById('user-id');
console.log(user.name);
```

### Create User

```typescript
const user = await client.users.create({
  email: 'newuser@example.com',
  name: 'New User',
  password: 'SecureP@ssw0rd',
  role: 'user'
});
```

### Update User

```typescript
const user = await client.users.update('user-id', {
  name: 'Updated Name',
  isActive: false
});
```

### Delete User

```typescript
await client.users.delete('user-id');
```

### Search Users

```typescript
const results = await client.users.search('john', { limit: 5 });
```

## Error Handling

All errors are formatted consistently:

```typescript
try {
  await client.auth.login({
    email: 'user@example.com',
    password: 'wrong-password'
  });
} catch (error) {
  console.error(error.statusCode); // 401
  console.error(error.error); // 'Unauthorized'
  console.error(error.message); // 'Invalid email or password'

  // Validation errors (if applicable)
  if (error.validation) {
    error.validation.forEach(v => {
      console.error(`${v.field}: ${v.message}`);
    });
  }
}
```

## Token Management

### Manual Token Management

```typescript
// Set tokens manually
client.setAccessToken('your-access-token');
client.setRefreshToken('your-refresh-token');

// Get tokens
const accessToken = client.auth.getAccessToken();
const refreshToken = client.auth.getRefreshToken();

// Clear all tokens
client.clearTokens();
```

### Automatic Token Refresh

The SDK automatically refreshes expired tokens when a 401 error is encountered:

```typescript
// This will automatically refresh the token if expired
const user = await client.auth.getMe();
```

### Token Storage

Store tokens in localStorage, cookies, or your preferred storage:

```typescript
const client = new SaaSQuatchClient({
  authServiceUrl: 'http://localhost:3001',
  onTokenRefresh: (tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
});

// Restore tokens on app startup
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

if (accessToken && refreshToken) {
  client.setAccessToken(accessToken);
  client.setRefreshToken(refreshToken);
}
```

## Using Individual Clients

You can use service clients independently:

```typescript
import { AuthClient, UserClient } from '@saasquatch/sdk';

const authClient = new AuthClient({
  authServiceUrl: 'http://localhost:3001'
});

const userClient = new UserClient({
  authServiceUrl: 'http://localhost:3001',
  userServiceUrl: 'http://localhost:3002'
});
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import type {
  SaaSQuatchConfig,
  AuthResponse,
  User,
  PaginatedResponse
} from '@saasquatch/sdk';

const config: SaaSQuatchConfig = {
  authServiceUrl: 'http://localhost:3001'
};

const response: AuthResponse = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

const users: PaginatedResponse<User> = await client.users.list();
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint
```

## License

MIT
