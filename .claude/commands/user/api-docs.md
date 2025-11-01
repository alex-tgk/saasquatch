# API Docs - Comprehensive API Documentation Generator

Generate and maintain comprehensive API documentation in multiple formats.

## Documentation Formats

I'll generate:

1. **OpenAPI/Swagger Specification** (JSON/YAML)
2. **Markdown Documentation** (Human-readable)
3. **Postman Collection** (For testing)
4. **TypeScript Type Definitions** (For clients)

## Phase 1: Route Discovery

**Scanning for API endpoints...**

I'll detect routes from:

### Express.js
```typescript
// Detect from router definitions
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
```

### Fastify
```typescript
// Detect from fastify routes
fastify.get('/users', { schema }, getUsers);
fastify.post('/users', { schema }, createUser);
```

### Next.js API Routes
```typescript
// Detect from pages/api/**/*.ts files
// pages/api/users/index.ts → GET /api/users
// pages/api/users/[id].ts → GET /api/users/:id
```

### NestJS
```typescript
// Detect from controllers
@Controller('users')
@Get()
@Post()
@Get(':id')
```

## Phase 2: Schema Extraction

For each route, I'll extract:

### Request Schema
- **Path Parameters**: `/users/:id` → `{ id: string }`
- **Query Parameters**: `?page=1&limit=10`
- **Request Body**: JSON schema
- **Headers**: Required/optional headers

### Response Schema
- **Success Responses**: 200, 201, 204
- **Error Responses**: 400, 401, 403, 404, 500
- **Response Body**: JSON schema
- **Headers**: Returned headers

### Example Extraction

```typescript
// From this route handler:
export const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  // Implementation
};

// I'll generate:
{
  "requestBody": {
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["email", "password"],
          "properties": {
            "email": { "type": "string", "format": "email" },
            "password": { "type": "string", "minLength": 8 },
            "name": { "type": "string" }
          }
        }
      }
    }
  }
}
```

## Phase 3: OpenAPI Generation

### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: My API
  description: Comprehensive API for MyApp
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: Users
    description: User management operations
  - name: Authentication
    description: Authentication and authorization

paths:
  /users:
    get:
      summary: List all users
      description: Retrieve a paginated list of all users
      tags:
        - Users
      parameters:
        - name: page
          in: query
          description: Page number for pagination
          required: false
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            default: 10
            minimum: 1
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
              examples:
                success:
                  value:
                    data:
                      - id: "1"
                        email: "user@example.com"
                        name: "John Doe"
                        createdAt: "2025-01-01T00:00:00Z"
                    pagination:
                      page: 1
                      limit: 10
                      total: 100
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'

    post:
      summary: Create a new user
      description: Create a new user account
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            examples:
              example1:
                value:
                  email: "newuser@example.com"
                  password: "SecurePass123"
                  name: "Jane Doe"
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/{id}:
    get:
      summary: Get user by ID
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          description: User ID
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      summary: Update user
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: User updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      summary: Delete user
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: User deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - createdAt
      properties:
        id:
          type: string
          description: Unique user identifier
        email:
          type: string
          format: email
          description: User's email address
        name:
          type: string
          description: User's full name
        createdAt:
          type: string
          format: date-time
          description: Account creation timestamp
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp

    CreateUserRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
          pattern: '^(?=.*[A-Z])(?=.*[0-9])'
        name:
          type: string

    UpdateUserRequest:
      type: object
      properties:
        email:
          type: string
          format: email
        name:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

    Error:
      type: object
      required:
        - error
        - message
      properties:
        error:
          type: string
        message:
          type: string
        details:
          type: object

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

## Phase 4: Markdown Documentation

### Comprehensive Markdown Guide

```markdown
# API Documentation

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Users](#users)
  - [Authentication](#auth)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## Authentication

This API uses JWT (JSON Web Token) for authentication.

### Obtaining a Token

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

### Using the Token

Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Users

#### List Users

Get a paginated list of all users.

**Endpoint:** `GET /users`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max 100) |
| search | string | No | - | Search by name or email |

**Example Request:**
```bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `500 Internal Server Error`: Server error occurred

---

#### Create User

Create a new user account.

**Endpoint:** `POST /users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "name": "Jane Doe"
}
```

**Field Validation:**
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, must contain uppercase and number
- `name`: 2-100 characters (optional)

**Example Request:**
```bash
curl -X POST "https://api.example.com/v1/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "name": "Jane Doe"
  }'
```

**Example Response (201 Created):**
```json
{
  "id": "123",
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "createdAt": "2025-01-31T12:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
  ```json
  {
    "error": "ValidationError",
    "message": "Invalid input",
    "details": {
      "email": "Email already exists",
      "password": "Password must contain uppercase and number"
    }
  }
  ```
- `409 Conflict`: User already exists

---

#### Get User by ID

Retrieve a specific user by their ID.

**Endpoint:** `GET /users/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | User ID |

**Example Request:**
```bash
curl -X GET "https://api.example.com/v1/users/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (200 OK):**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: User does not exist

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": {
    // Optional additional context
  }
}
```

### Common Error Types

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | ValidationError | Invalid request parameters |
| 401 | UnauthorizedError | Authentication required |
| 403 | ForbiddenError | Insufficient permissions |
| 404 | NotFoundError | Resource not found |
| 409 | ConflictError | Resource already exists |
| 429 | RateLimitError | Too many requests |
| 500 | InternalError | Server error |

## Rate Limiting

API requests are rate limited to:
- **100 requests per minute** for authenticated users
- **10 requests per minute** for unauthenticated users

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Examples

### Complete User Registration Flow

```javascript
// 1. Register new user
const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe'
  })
});

const user = await response.json();

// 2. Login to get token
const loginResponse = await fetch('https://api.example.com/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});

const { token } = await loginResponse.json();

// 3. Use token for authenticated requests
const usersResponse = await fetch('https://api.example.com/v1/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data } = await usersResponse.json();
```
```

## Phase 5: Postman Collection

```json
{
  "info": {
    "name": "My API",
    "description": "Complete API collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "List Users",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/users?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["users"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/users",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"SecurePass123\",\n  \"name\": \"John Doe\"\n}",
              "options": {
                "raw": { "language": "json" }
              }
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.example.com/v1"
    },
    {
      "key": "jwt_token",
      "value": ""
    }
  ]
}
```

## Phase 6: TypeScript Types

```typescript
// api-types.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, any>;
}

// API Client
export class ApiClient {
  constructor(private baseUrl: string, private token?: string) {}

  async getUsers(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> {
    // Implementation
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    // Implementation
  }

  async getUser(id: string): Promise<User> {
    // Implementation
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    // Implementation
  }

  async deleteUser(id: string): Promise<void> {
    // Implementation
  }
}
```

## Output Files

I'll generate and save:

1. `docs/api/openapi.yaml` - OpenAPI 3.0 specification
2. `docs/api/openapi.json` - JSON version
3. `docs/api/README.md` - Markdown documentation
4. `docs/api/postman-collection.json` - Postman collection
5. `src/types/api-types.ts` - TypeScript definitions

## Execution Process

I will:

1. **Scan codebase** - Find all API routes
2. **Extract schemas** - Parse request/response types
3. **Generate OpenAPI** - Create spec in YAML/JSON
4. **Generate Markdown** - Human-readable docs
5. **Generate Postman** - Collection for testing
6. **Generate Types** - TypeScript definitions
7. **Add examples** - Real request/response examples
8. **Validate specs** - Ensure OpenAPI validity

Starting API documentation generation now...
