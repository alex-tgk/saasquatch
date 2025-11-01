# Swagger/OpenAPI Documentation

This service includes comprehensive API documentation using Swagger/OpenAPI 3.0.

## Accessing the Documentation

Once the service is running, you can access the interactive API documentation at:

```
http://localhost:{{service.port}}/docs
```

For example, if your auth-service runs on port 3001:
- **Swagger UI**: http://localhost:3001/docs

## Features

### Interactive API Testing
- **Try it out**: Test API endpoints directly from the Swagger UI
- **Authentication**: Easily test authenticated endpoints by adding your JWT token
- **Request/Response Examples**: See real examples for all endpoints

### Comprehensive Schema Documentation
- **Request Validation**: All request bodies are validated using JSON Schema
- **Response Types**: Clear documentation of all possible responses
- **Error Codes**: Detailed error response schemas for each endpoint

### Security Schemes
The API supports multiple authentication methods:

1. **Bearer Authentication (JWT)**
   - Used for user authentication
   - Header: `Authorization: Bearer <your-jwt-token>`
   - Most auth endpoints require this

2. **API Key**
   - Used for service-to-service authentication
   - Header: `X-API-Key: <your-api-key>`

## Using Swagger UI

### Testing Authenticated Endpoints

1. **Obtain a JWT Token**:
   - Use the `POST /auth/login` or `POST /auth/register` endpoint
   - Copy the `accessToken` from the response

2. **Authorize in Swagger**:
   - Click the **"Authorize"** button at the top of the Swagger UI
   - Paste your access token in the `bearerAuth` field
   - Click **"Authorize"** then **"Close"**

3. **Test Endpoints**:
   - Navigate to any protected endpoint (e.g., `GET /auth/me`)
   - Click **"Try it out"**
   - Click **"Execute"**
   - View the response below

### Example: Testing the Login Flow

1. **Register a User** (`POST /auth/register`):
```json
{
  "email": "test@example.com",
  "password": "SecureP@ssw0rd",
  "name": "Test User"
}
```

2. **Copy the Access Token** from the response

3. **Authorize** using the token (click "Authorize" button)

4. **Get Your Profile** (`GET /auth/me`) - now authorized

## API Tags

Endpoints are organized by tags for easy navigation:

{{#if service.features.healthChecks}}- **Health**: Service health and readiness checks
{{/if}}{{#if (or service.features.authentication service.features.jwt)}}- **Authentication**: User authentication and authorization
{{/if}}{{#if (eq service.name 'user-service')}}- **Users**: User management operations
{{/if}}- **General**: General service information

## Configuration

### Swagger Options

The Swagger configuration is located in `src/config/swagger.config.ts`:

```typescript
export const swaggerOptions: FastifySwaggerOptions = {
  openapi: {
    info: {
      title: '{{service.name}} API',
      version: '1.0.0',
      description: '{{service.description}}'
    },
    servers: [
      { url: 'http://localhost:{{service.port}}', description: 'Development' },
      { url: 'https://api.{{project.name}}.com', description: 'Production' }
    ]
  }
};
```

### UI Customization

Swagger UI options in `src/config/swagger.config.ts`:

```typescript
export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',      // Show all endpoints
    deepLinking: true,          // Enable deep linking
    displayRequestDuration: true, // Show request time
    filter: true,               // Enable search/filter
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
};
```

## Exporting OpenAPI Spec

To export the OpenAPI specification as JSON:

```bash
curl http://localhost:{{service.port}}/docs/json > openapi.json
```

To export as YAML:

```bash
curl http://localhost:{{service.port}}/docs/yaml > openapi.yaml
```

## Adding Documentation to New Routes

When creating new routes, always include a schema with proper documentation:

```typescript
fastify.post('/example', {
  schema: {
    description: 'Brief description of what this endpoint does',
    tags: ['YourTag'],
    summary: 'Short summary',
    body: {
      type: 'object',
      required: ['field1'],
      properties: {
        field1: {
          type: 'string',
          description: 'Description of field1',
          example: 'example value'
        }
      }
    },
    response: {
      200: {
        description: 'Success response',
        type: 'object',
        properties: {
          result: {
            type: 'string',
            example: 'success'
          }
        }
      },
      400: {
        description: 'Validation error',
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    },
    security: [{ bearerAuth: [] }] // If endpoint requires auth
  }
}, async (request, reply) => {
  // Handler implementation
});
```

## Using TypeBox for Type Safety

For better type safety, use TypeBox schemas (recommended):

```typescript
import { Type } from '@sinclair/typebox';

const ExampleSchema = Type.Object({
  field1: Type.String({ description: 'Field description' }),
  field2: Type.Integer({ minimum: 0, maximum: 100 })
});

fastify.post('/example', {
  schema: {
    description: 'Example endpoint',
    tags: ['Example'],
    body: ExampleSchema,
    response: {
      200: Type.Object({
        success: Type.Boolean()
      })
    }
  }
}, async (request, reply) => {
  const { field1, field2 } = request.body; // Fully typed!
  return { success: true };
});
```

## Best Practices

### 1. Always Add Examples
Include realistic examples for request bodies and responses:

```typescript
properties: {
  email: {
    type: 'string',
    format: 'email',
    example: 'user@example.com'  // ← Always include
  }
}
```

### 2. Document All Responses
Include all possible HTTP status codes:

```typescript
response: {
  200: { /* success */ },
  400: { /* validation error */ },
  401: { /* unauthorized */ },
  404: { /* not found */ },
  500: { /* server error */ }
}
```

### 3. Use Descriptive Tags
Organize endpoints with clear tags:

```typescript
tags: ['Authentication']  // Not just 'Auth'
```

### 4. Add Security to Protected Endpoints
Always specify security requirements:

```typescript
security: [{ bearerAuth: [] }]  // For JWT protected endpoints
```

### 5. Keep Descriptions Clear and Concise
```typescript
description: 'Retrieve user profile by ID'  // Good
// vs
description: 'Get user'  // Too vague
```

## Troubleshooting

### Swagger UI Not Loading
- Check that the service is running
- Verify the `/docs` route is accessible
- Check browser console for errors

### Schema Validation Errors
- Ensure all required fields are marked in the schema
- Check that examples match the schema
- Validate JSON Schema syntax

### Authentication Not Working in Swagger
1. Make sure you clicked "Authorize" after getting a token
2. Verify the token format: `Bearer <token>` (not just `<token>`)
3. Check token expiration (access tokens expire in 15 minutes)

## Additional Resources

- [Fastify Swagger Plugin Docs](https://github.com/fastify/fastify-swagger)
- [Fastify Swagger UI Plugin Docs](https://github.com/fastify/fastify-swagger-ui)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [JSON Schema Guide](https://json-schema.org/learn/getting-started-step-by-step)
- [TypeBox Documentation](https://github.com/sinclairzx81/typebox)

## Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
{{#if (or service.features.authentication service.features.jwt)}}| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | User login |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | User logout |
| `/auth/me` | GET | Get current user profile |
{{/if}}{{#if service.features.healthChecks}}| `/health` | GET | Service health check |
| `/ready` | GET | Service readiness check |
{{/if}}| `/` | GET | Service information |
| `/docs` | GET | Swagger UI |
| `/docs/json` | GET | OpenAPI spec (JSON) |
| `/docs/yaml` | GET | OpenAPI spec (YAML) |
