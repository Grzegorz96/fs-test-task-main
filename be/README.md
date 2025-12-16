# Backend API - Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Installation and Setup](#installation-and-setup)
4. [Application Architecture](#application-architecture)
5. [Project Structure](#project-structure)
6. [Security](#security)
7. [Logging](#logging)
8. [API Endpoints](#api-endpoints)

---

## Introduction

This is RESTful application built with TypeScript using Express.js and MongoDB. The application has been designed following **Clean Architecture** principles, which ensures separation of business layers from implementation details, ease of testing, and extensibility.

### Key Features:

- ✅ **Clean Architecture** - separation of domain, application, infrastructure, and interface layers
- ✅ **Dependency Injection** - manual dependency injection through constructors
- ✅ **Dependency Inversion Principle** - dependencies on abstractions (ports), not concrete implementations
- ✅ **Modularity** - division into independent modules (Product, Database, Logger)
- ✅ **Security** - rate limiting, throttling, security headers, CORS
- ✅ **Logging** - dedicated logger with console and file support
- ✅ **Containerization** - Docker Compose with MongoDB database

---

## Requirements

- **Docker** and **Docker Compose**

---

## Installation and Setup

1. **Clone the repository and navigate to the project directory:**

   ```bash
   cd fs-test-task-main
   ```

2. **Create `.env` file in the root directory:**

   ```env
   # MongoDB Configuration
   MONGODB_HOST=mongo
   MONGODB_PORT=27017
   MONGODB_DATABASE=products
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=password

   # Server Configuration
   PORT=3000

   # Logger Configuration (optional)
   LOG_LEVEL=info
   LOG_CONSOLE=true
   LOG_FILE=true
   ```

3. **Run the application with Docker Compose:**

   # Development (with hot-reload)

   ```bash
   docker compose -f docker-compose.dev.yml up
   or
   npm run dev:be
   ```

4. **Check status:**

   ```bash
   docker compose ps
   ```

5. **Check logs:**

   ```bash
   docker logs -f test-task-dev-backend-1
   ```

6. **Stop the application:**

   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

---

## Application Architecture

The application has been built following **Clean Architecture** principles, which ensures:

### 1. Layer Separation

```
┌─────────────────────────────────────────┐
│         Interface Layer                 │  ← Controllers, DTOs, Routes
├─────────────────────────────────────────┤
│         Application Layer               │  ← Use Cases, Ports, Mappers
├─────────────────────────────────────────┤
│         Domain Layer                    │  ← Entities, Business Logic
├─────────────────────────────────────────┤
│         Infrastructure Layer            │  ← MongoDB, External Services
└─────────────────────────────────────────┘
```

### 2. Dependency Inversion Principle (DIP)

**Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Implementation:**

- **Ports (Interfaces)** define contracts in the Application layer
- **Adapters** implement ports in the Infrastructure layer
- Use Cases depend on ports, not concrete implementations

**Example:**

```typescript
// Port (abstraction) - Application Layer
export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findByCode(code: string): Promise<Product | null>;
}

// Use Case depends on port, not implementation
export class GetProductByCodeUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort // ← Abstraction
  ) {}
}

// Implementation - Infrastructure Layer
export class ProductRepository implements ProductRepositoryPort {
  // Concrete MongoDB implementation
}
```

### 3. Dependency Injection

**Principle:** Dependencies are injected through constructors, not created inside classes.

**Implementation:**

```typescript
// ProductModule - manual dependency injection
export class ProductModule {
  constructor(logger: LoggerInterface) {
    // Creating dependencies
    const repository = new ProductRepository(ProductModel, mapper);

    // Injecting into use case
    const useCase = new GetProductByCodeUseCase(repository, outputMapper);

    // Injecting into controller
    this.controller = new ProductController(useCase, dtoMapper);
  }
}
```

### 4. Separation of Core from Implementation Details

**Application core (framework-independent):**

- `domain/` - domain entities (pure TypeScript)
- `application/` - use cases, ports (independent of Express/MongoDB)
- `application/ports/` - abstractions (interfaces)

**Implementation details (can be swapped):**

- `infrastructure/mongo/` - MongoDB implementation (can be swapped for PostgreSQL)
- `interface/` - Express controllers, routes (can be swapped for GraphQL)

**Benefits:**

- Easy database replacement (just new port implementation)
- Ability to test without database (port mocks)
- Framework independence

---

## Project Structure

```
be/src/
├── app.module.ts              # Main application module
├── index.ts                   # Entry point
│
├── database/                   # Database module
│   ├── database.config.ts     # MongoDB configuration
│   └── database.module.ts     # Connection management module
│
├── logger/                     # Logging module
│   ├── logger.interface.ts    # Logger port
│   ├── logger.ts              # Implementation (Winston)
│   └── index.ts
│
├── middleware/                 # Express middleware
│   ├── error-handler.middleware.ts
│   ├── not-found.middleware.ts
│   ├── rate-limiter.middleware.ts
│   ├── security.middleware.ts
│   └── throttler.middleware.ts
│
├── product/                    # Product module (Clean Architecture)
│   ├── domain/                # Domain layer
│   │   └── entities/
│   │       └── product.entity.ts
│   │
│   ├── application/           # Application layer
│   │   ├── ports/             # Ports (abstractions)
│   │   │   ├── product.repository.port.ts
│   │   │   ├── get-all-products.port.ts
│   │   │   └── get-product-by-code.port.ts
│   │   ├── use-cases/         # Use cases
│   │   │   ├── get-all-products.use-case.ts
│   │   │   └── get-product-by-code.use-case.ts
│   │   ├── models/            # Output models
│   │   ├── mappers/           # Domain ↔ Output models mapping
│   │   └── errors/            # Domain errors
│   │
│   ├── infrastructure/        # Infrastructure layer
│   │   └── mongo/
│   │       ├── models/        # Mongoose models
│   │       ├── repositories/  # Port implementations
│   │       └── mappers/       # MongoDB ↔ Domain mapping
│   │
│   ├── interface/             # Interface layer
│   │   ├── controllers/       # Express controllers
│   │   ├── routes/           # Route definitions
│   │   └── dto/              # Data Transfer Objects
│   │
│   └── product.module.ts      # Product module (composition)
│
└── utils/                     # Utility helpers
    ├── constants/            # Application constants
    └── response-helpers.ts   # Response helper functions
```

### Modules

The application is divided into independent modules:

1. **AppModule** - main application module

   - Initializes Express
   - Composes modules (Database, Product)
   - Configures middleware and routing

2. **DatabaseModule** - database module

   - Manages MongoDB connection
   - Validates environment variables
   - Handles disconnection

3. **ProductModule** - product module

   - Composes all product domain components
   - Manages dependencies (Repository → Use Cases → Controller)
   - Exposes Express router

4. **Logger** - logging module
   - Interface independent of implementation
   - Winston-based implementation
   - Console and file support

**Benefits of modularity:**

- Easy addition of new modules (e.g., UserModule, OrderModule)
- Independent module testing
- Ability to swap modules without affecting the rest of the application

---

## Security

The application implements the following security mechanisms:

### 1. Security Headers (Helmet)

- Content Security Policy (CSP)
- XSS Protection
- Frame Options
- HSTS

**Location:** `src/middleware/security.middleware.ts`

### 2. Rate Limiting

- **100 requests per 15 minutes** per IP
- Automatic 429 (Too Many Requests) response when exceeded
- Skips `/health` endpoint

**Location:** `src/middleware/rate-limiter.middleware.ts`

### 3. Throttling

- Delay after 50 requests in 15 minutes
- Increasing delay (500ms per additional request)
- Maximum delay: 2 seconds

**Location:** `src/middleware/throttler.middleware.ts`

### 4. CORS

- Configurable origins
- Allowed HTTP methods
- Allowed headers

**Location:** `src/middleware/cors.middleware.ts`

### 5. JSON Body Parser

- Parses incoming JSON request bodies
- Automatically handles Content-Type: application/json
- Validates JSON format and returns 400 error for invalid JSON

**Location:** `src/app.module.ts` (Express built-in middleware)

### 6. Not Found Handling

- Handles 404 errors for unmatched routes
- Returns standardized error response format
- Placed after all routes but before error handler

**Location:** `src/middleware/not-found.middleware.ts`

### 7. Error Handling

- Does not expose technical database details
- Generic error messages for clients
- Detailed logging for developers
- MongoDB error handling (ValidationError, CastError, DuplicateKey)

**Location:** `src/middleware/error-handler.middleware.ts`

---

## Logging

The application uses a dedicated logging system based on **Winston**.

### Features:

1. **Multi-channel logging:**

   - **Console** - colored, readable logs during development
   - **Files** - structured JSON logs to files

2. **Log levels:**

   - `error` - application errors
   - `warn` - warnings
   - `info` - information (default)
   - `debug` - debugging details

3. **Log files:**

   - `logs/combined.log` - all logs
   - `logs/error.log` - errors only

4. **Configuration:**

   ```env
   LOG_LEVEL=info          # Logging level
   LOG_CONSOLE=true        # Enable/disable console
   LOG_FILE=true           # Enable/disable files
   ```

## API Endpoints

### Health Check

```
GET /health
```

Returns application status.

**Response:**

```json
{
  "status": "ok"
}
```

### Get All Products

```
GET /api/products
```

**Response:**

```json
{
  "status": 200,
  "message": "Products retrieved successfully",
  "data": [
    {
      "image": "https://...",
      "code": "ABC123",
      "name": "Product Name",
      "color": "white",
      "capacity": 200,
      "dimensions": "60x60x200",
      "features": ["feature1", "feature2"],
      "energyClass": "A",
      "price": {
        "value": 1000,
        "currency": "zł",
        "installment": {
          "value": 100,
          "period": 10
        },
        "validFrom": "2024-01-01T00:00:00.000Z",
        "validTo": "2024-12-31T23:59:59.999Z"
      }
    }
  ],
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Get Product by Code

```
GET /api/products/:code
```

**Parameters:**

- `code` (path) - product code

**Response (200):**

```json
{
  "status": 200,
  "message": "Product retrieved successfully",
  "data": {
    "image": "https://...",
    "code": "ABC123",
    ...
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Response (404):**

```json
{
  "status": 404,
  "message": "Product not found: ABC123",
  "data": null,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Error Response Format

All errors return a consistent format:

```json
{
  "status": 400,
  "message": "Validation error",
  "data": null,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## npm Scripts

```bash
npm run dev      # Development with hot-reload
npm run build    # TypeScript compilation
npm start        # Production start
```

---

**Author:** Grzegorz Strzeszewski  
**Date:** 2025
