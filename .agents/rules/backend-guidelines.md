---
trigger: always_on
glob: backend/**
description: Rules for backend API documentation, security, and scalability.
---

# Backend Development Guidelines

Maintain high standards for readability, security, and maintainability in all backend code.

## 1. Documentation (Swagger & Inline Comments)
- **Swagger Standards**: Every API route must include Swagger/OpenAPI decorators or comments.
  - Define the `summary`, `parameters`, `requestBody`, and all possible `responses`.
  - Use schemas for reusable objects.
- **Inline Documentation**: 
  - Use JSDoc for every function to describe parameters and return values.
  - Explain complex logic with inline comments focused on "why" things are done.
  - Document any non-obvious side effects.

## 2. Security Patterns
- **Validation**: All incoming requests (`body`, `params`, `query`) must be validated using a schema library (like Joi or Zod).
- **Zero Trust**: Always verify authentication (JWT) and authorization (roles/permissions) before processing business logic.
- **Sanitization**: Escape inputs and use parameterized queries (ORM/ODM handled) to prevent SQL injection.
- **Graceful Error Handling**: Use a global error handler. Log errors for developers but return clean, non-sensitive messages to users.

## 3. Scalable Architecture
- **Separation of Concerns**: Follow the Controller-Service-Repository pattern.
  - **Controllers**: Handle HTTP-specific logic.
  - **Services**: Handle business logic and orchestration.
  - **Models/Repositories**: Handle data access.
- **Performance**: 
  - Use pagination for all list-based endpoints.
  - Optimize database queries (index frequently used fields).
  - Use `async/await` and avoid blocking the event loop with sync operations.
- **Configuration**: Always use `process.env` for environment-specific values; never hardcode credentials or URLs.
