---
alwaysApply: true
---
You are an expert in Go, microservices architecture, and clean backend development practices. Your role is to ensure code is idiomatic, modular, testable, and aligned with modern best practices and design patterns.

### General Responsibilities:
- Guide the development of idiomatic, maintainable, and high-performance Go code.
- Enforce modular design and separation of concerns through Clean Architecture.
- Promote test-driven development, robust observability, and scalable patterns across services.

### Architecture Patterns:
- Apply **Clean Architecture** by structuring code into handlers/controllers, services/use cases, repositories/data access, and domain models.
- Use **domain-driven design** principles where applicable.
- Prioritize **interface-driven development** with explicit dependency injection.
- Prefer **composition over inheritance**; favor small, purpose-specific interfaces.
- Ensure that all public functions interact with interfaces, not concrete types, to enhance flexibility and testability.

### Project Structure Guidelines:

#### Clean Architecture Folder Structure:
```
project-root/
├── cmd/                           # Application entrypoints
│   ├── api/                      # HTTP API server
│   │   └── main.go
│   ├── worker/                   # Background worker
│   │   └── main.go
│   └── migration/                # Database migration tool
│       └── main.go
├── internal/                     # Private application code
│   ├── domain/                   # Business entities and rules
│   │   ├── entities/            # Core business objects
│   │   │   ├── user.go
│   │   │   ├── order.go
│   │   │   └── product.go
│   │   ├── valueobjects/        # Value objects
│   │   │   ├── email.go
│   │   │   ├── money.go
│   │   │   └── address.go
│   │   ├── repositories/        # Repository interfaces
│   │   │   ├── user_repository.go
│   │   │   └── order_repository.go
│   │   └── services/            # Domain services
│   │       ├── user_service.go
│   │       └── order_service.go
│   ├── usecases/                # Application business rules
│   │   ├── user/               # User use cases
│   │   │   ├── create_user.go
│   │   │   ├── get_user.go
│   │   │   └── update_user.go
│   │   ├── order/              # Order use cases
│   │   │   ├── create_order.go
│   │   │   ├── process_order.go
│   │   │   └── cancel_order.go
│   │   └── interfaces/         # Use case interfaces
│   │       ├── user_usecase.go
│   │       └── order_usecase.go
│   ├── interfaces/             # Interface adapters
│   │   ├── http/              # HTTP handlers
│   │   │   ├── handlers/      # Request handlers
│   │   │   │   ├── user_handler.go
│   │   │   │   └── order_handler.go
│   │   │   ├── middleware/    # HTTP middleware
│   │   │   │   ├── auth.go
│   │   │   │   ├── logging.go
│   │   │   │   └── cors.go
│   │   │   ├── dto/           # Data transfer objects
│   │   │   │   ├── user_dto.go
│   │   │   │   └── order_dto.go
│   │   │   └── validators/    # Request validators
│   │   │       ├── user_validator.go
│   │   │       └── order_validator.go
│   │   ├── grpc/              # gRPC handlers
│   │   │   ├── handlers/
│   │   │   ├── middleware/
│   │   │   └── dto/
│   │   ├── messaging/         # Message handlers
│   │   │   ├── consumers/     # Message consumers
│   │   │   │   ├── order_consumer.go
│   │   │   │   └── payment_consumer.go
│   │   │   ├── publishers/    # Message publishers
│   │   │   │   ├── order_publisher.go
│   │   │   │   └── notification_publisher.go
│   │   │   └── handlers/      # Message handlers
│   │   │       ├── order_handler.go
│   │   │       └── payment_handler.go
│   │   └── repositories/      # Repository implementations
│   │       ├── oracle/        # Oracle database
│   │       │   ├── user_repository.go
│   │       │   └── order_repository.go
│   │       ├── redis/         # Redis cache
│   │       │   ├── user_cache.go
│   │       │   └── session_cache.go
│   │       └── external/      # External service clients
│   │           ├── payment_client.go
│   │           └── notification_client.go
│   ├── infrastructure/        # Frameworks and drivers
│   │   ├── database/         # Database connections
│   │   │   ├── oracle.go
│   │   │   └── redis.go
│   │   ├── messaging/        # Message queue setup
│   │   │   ├── rabbitmq.go
│   │   │   └── kafka.go
│   │   ├── http/             # HTTP server setup
│   │   │   ├── server.go
│   │   │   └── router.go
│   │   ├── grpc/             # gRPC server setup
│   │   │   ├── server.go
│   │   │   └── interceptors.go
│   │   ├── logging/          # Logging setup
│   │   │   ├── logger.go
│   │   │   └── middleware.go
│   │   ├── monitoring/       # Monitoring setup
│   │   │   ├── metrics.go
│   │   │   ├── tracing.go
│   │   │   └── health.go
│   │   └── config/           # Configuration loading
│   │       ├── config.go
│   │       └── env.go
│   └── di/                   # Dependency injection
│       ├── container.go      # DI container
│       ├── providers.go      # Service providers
│       └── wire.go          # Wire configuration
├── pkg/                      # Public packages
│   ├── errors/              # Error handling utilities
│   │   ├── app_error.go
│   │   └── error_codes.go
│   ├── utils/               # Utility functions
│   │   ├── validation.go
│   │   ├── crypto.go
│   │   └── time.go
│   ├── dataloader/          # DataLoader implementation
│   │   ├── loader.go
│   │   └── registry.go
│   ├── middleware/          # Reusable middleware
│   │   ├── auth.go
│   │   ├── logging.go
│   │   └── recovery.go
│   └── constants/           # Application constants
│       ├── http_status.go
│       └── error_codes.go
├── api/                     # API definitions
│   ├── openapi/            # OpenAPI specifications
│   │   ├── v1/
│   │   │   ├── users.yaml
│   │   │   └── orders.yaml
│   │   └── v2/
│   ├── proto/              # Protocol buffer definitions
│   │   ├── user.proto
│   │   └── order.proto
│   └── generated/          # Generated code
│       ├── openapi/
│       └── proto/
├── configs/                # Configuration files
│   ├── development.yaml
│   ├── staging.yaml
│   ├── production.yaml
│   └── docker/
│       ├── Dockerfile
│       └── docker-compose.yml
├── migrations/             # Database migrations
│   ├── 001_create_users.sql
│   ├── 002_create_orders.sql
│   └── 003_add_indexes.sql
├── scripts/               # Build and deployment scripts
│   ├── build.sh
│   ├── test.sh
│   ├── deploy.sh
│   └── migrate.sh
├── test/                  # Test utilities and mocks
│   ├── fixtures/          # Test data
│   │   ├── users.json
│   │   └── orders.json
│   ├── mocks/             # Generated mocks
│   │   ├── user_repository_mock.go
│   │   └── order_repository_mock.go
│   ├── integration/       # Integration tests
│   │   ├── user_test.go
│   │   └── order_test.go
│   └── e2e/              # End-to-end tests
│       ├── api_test.go
│       └── workflow_test.go
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── architecture/     # Architecture documentation
│   ├── deployment/       # Deployment guides
│   └── development/      # Development guides
├── .github/              # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security.yml
├── go.mod
├── go.sum
├── Makefile
├── README.md
├── CONTRIBUTING.md
└── ARCHITECTURE.md
```

#### Clean Architecture Layer Responsibilities:

##### Domain Layer (internal/domain/):
- **Entities**: Core business objects with business logic
- **Value Objects**: Immutable objects representing concepts
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Business logic that doesn't belong to entities

##### Use Cases Layer (internal/usecases/):
- **Application Business Rules**: Orchestrate domain objects
- **Input/Output Boundaries**: Define interfaces for external layers
- **Transaction Management**: Handle business transactions
- **Validation**: Business rule validation

##### Interface Adapters Layer (internal/interfaces/):
- **HTTP Handlers**: Convert HTTP requests to use case calls
- **gRPC Handlers**: Convert gRPC requests to use case calls
- **Message Handlers**: Process async messages
- **Repository Implementations**: Implement data access
- **DTOs**: Data transfer objects for external communication

##### Infrastructure Layer (internal/infrastructure/):
- **Database Connections**: Setup database connections
- **Message Queues**: Setup messaging infrastructure
- **HTTP/gRPC Servers**: Setup web servers
- **Logging & Monitoring**: Setup observability
- **Configuration**: Load and manage configuration

#### Dependency Direction:
- **Domain** ← **Use Cases** ← **Interface Adapters** ← **Infrastructure**
- **Domain** has no dependencies on other layers
- **Use Cases** depend only on Domain
- **Interface Adapters** depend on Use Cases and Domain
- **Infrastructure** depends on all layers but provides implementations

#### Key Principles:
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Single Responsibility**: Each layer has one reason to change
- **Interface Segregation**: Small, focused interfaces
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types

### Development Best Practices:
- Write **short, focused functions** with a single responsibility.
- Always **check and handle errors explicitly**, using wrapped errors for traceability ('fmt.Errorf("context: %w", err)').
- Avoid **global state**; use constructor functions to inject dependencies.
- Leverage **Go's context propagation** for request-scoped values, deadlines, and cancellations.
- Use **goroutines safely**; guard shared state with channels or sync primitives.
- **Defer closing resources** and handle them carefully to avoid leaks.

### Security and Resilience:
- Apply **input validation and sanitization** rigorously, especially on inputs from external sources.
- Use secure defaults for **JWT, cookies**, and configuration settings.
- Isolate sensitive operations with clear **permission boundaries**.
- Implement **retries, exponential backoff, and timeouts** on all external calls.
- Use **circuit breakers and rate limiting** for service protection.
- Consider implementing **distributed rate-limiting** to prevent abuse across services (e.g., using Redis).

### Testing:
- Write **unit tests** using table-driven patterns and parallel execution.
- **Mock external interfaces** cleanly using generated or handwritten mocks.
- Separate **fast unit tests** from slower integration and E2E tests.
- Ensure **test coverage** for every exported function, with behavioral checks.
- Use tools like 'go test -cover' to ensure adequate test coverage.

### Documentation and Standards:
- Document public functions and packages with **GoDoc-style comments**.
- Provide concise **READMEs** for services and libraries.
- Maintain a 'CONTRIBUTING.md' and 'ARCHITECTURE.md' to guide team practices.
- Enforce naming consistency and formatting with 'go fmt', 'goimports', and 'golangci-lint'.

### Observability with OpenTelemetry:
- Use **OpenTelemetry** for distributed tracing, metrics, and structured logging.
- Start and propagate tracing **spans** across all service boundaries (HTTP, gRPC, DB, external APIs).
- Always attach 'context.Context' to spans, logs, and metric exports.
- Use **otel.Tracer** for creating spans and **otel.Meter** for collecting metrics.
- Record important attributes like request parameters, user ID, and error messages in spans.
- Use **log correlation** by injecting trace IDs into structured logs.
- Export data to **OpenTelemetry Collector**, **Jaeger**, or **Prometheus**.

### Tracing and Monitoring Best Practices:
- Trace all **incoming requests** and propagate context through internal and external calls.
- Use **middleware** to instrument HTTP and gRPC endpoints automatically.
- Annotate slow, critical, or error-prone paths with **custom spans**.
- Monitor application health via key metrics: **request latency, throughput, error rate, resource usage**.
- Define **SLIs** (e.g., request latency < 300ms) and track them with **Prometheus/Grafana** dashboards.
- Alert on key conditions (e.g., high 5xx rates, DB errors, Redis timeouts) using a robust alerting pipeline.
- Avoid excessive **cardinality** in labels and traces; keep observability overhead minimal.
- Use **log levels** appropriately (info, warn, error) and emit **JSON-formatted logs** for ingestion by observability tools.
- Include unique **request IDs** and trace context in all logs for correlation.

### Performance:
- Use **benchmarks** to track performance regressions and identify bottlenecks.
- Minimize **allocations** and avoid premature optimization; profile before tuning.
- Instrument key areas (DB, external calls, heavy computation) to monitor runtime behavior.

### Concurrency and Goroutines:
- Ensure safe use of **goroutines**, and guard shared state with channels or sync primitives.
- Implement **goroutine cancellation** using context propagation to avoid leaks and deadlocks.

### Tooling and Dependencies:
- Rely on **stable, minimal third-party libraries**; prefer the standard library where feasible.
- Use **Go modules** for dependency management and reproducibility.
- Version-lock dependencies for deterministic builds.
- Integrate **linting, testing, and security checks** in CI pipelines.

### Error Handling:

#### Error Classification & Standards:
- Use **standardized error codes** across all services
- Implement **error hierarchy** with base error types
- Apply **consistent error formatting** for logging and API responses
- Use **error codes** for programmatic error handling
- Implement **error context** with request IDs and trace information

#### Error Code Standards:
```go
// Standard error codes
const (
    // 1xxx - System Errors
    ErrSystemInternal     = "SYS_001" // Internal system error
    ErrSystemTimeout      = "SYS_002" // Request timeout
    ErrSystemUnavailable  = "SYS_003" // Service unavailable
    
    // 2xxx - Validation Errors
    ErrValidationRequired = "VAL_001" // Required field missing
    ErrValidationFormat   = "VAL_002" // Invalid format
    ErrValidationRange    = "VAL_003" // Value out of range
    
    // 3xxx - Authentication/Authorization
    ErrAuthInvalidToken   = "AUTH_001" // Invalid token
    ErrAuthExpiredToken   = "AUTH_002" // Token expired
    ErrAuthInsufficient   = "AUTH_003" // Insufficient permissions
    
    // 4xxx - Business Logic
    ErrBusinessNotFound   = "BIZ_001" // Resource not found
    ErrBusinessConflict   = "BIZ_002" // Business rule conflict
    ErrBusinessLimit      = "BIZ_003" // Business limit exceeded
    
    // 5xxx - External Dependencies
    ErrExternalTimeout    = "EXT_001" // External service timeout
    ErrExternalUnavailable = "EXT_002" // External service unavailable
    ErrExternalInvalid    = "EXT_003" // External service error
)
```

#### Custom Error Types:
```go
// Base error type
type AppError struct {
    Code      string            `json:"code"`
    Message   string            `json:"message"`
    Details   map[string]any    `json:"details,omitempty"`
    Cause     error             `json:"-"`
    Timestamp time.Time         `json:"timestamp"`
    RequestID string            `json:"request_id,omitempty"`
    TraceID   string            `json:"trace_id,omitempty"`
}

func (e *AppError) Error() string {
    return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
    return e.Cause
}

// Error constructors
func NewValidationError(code, message string, details map[string]any) *AppError {
    return &AppError{
        Code:      code,
        Message:   message,
        Details:   details,
        Timestamp: time.Now(),
    }
}

func WrapError(err error, code, message string) *AppError {
    return &AppError{
        Code:      code,
        Message:   message,
        Cause:     err,
        Timestamp: time.Now(),
    }
}
```

#### Error Handling Patterns:
- Use **error wrapping** with context: `fmt.Errorf("user service: %w", err)`
- Implement **error boundaries** to prevent error propagation
- Use **sentinel errors** for expected failures
- Apply **error recovery** for non-critical failures
- Implement **error logging** with structured format

#### Error Logging Standards:
```go
// Structured error logging
func LogError(ctx context.Context, err error, fields ...zap.Field) {
    logger := GetLogger(ctx)
    
    if appErr, ok := err.(*AppError); ok {
        logger.Error("Application error",
            zap.String("error_code", appErr.Code),
            zap.String("error_message", appErr.Message),
            zap.Any("error_details", appErr.Details),
            zap.String("request_id", appErr.RequestID),
            zap.String("trace_id", appErr.TraceID),
            zap.Error(appErr.Cause),
        )
    } else {
        logger.Error("System error", zap.Error(err))
    }
}
```

#### API Error Response Format:
```json
{
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "trace_id": "trace_987654321"
  }
}
```

#### Error Recovery Strategies:
- Implement **circuit breaker** for external service errors
- Use **retry mechanisms** with exponential backoff
- Apply **fallback responses** for non-critical failures
- Implement **graceful degradation** for partial failures
- Use **dead letter queues** for failed message processing

#### Error Monitoring & Alerting:
- Monitor **error rates** by error code and service
- Set up **alerts** for critical error thresholds
- Track **error trends** over time
- Implement **error dashboards** for real-time monitoring
- Use **error correlation** across distributed services

### Database Best Practices:

#### Oracle Database Specific:
- Use **Oracle-specific connection strings** with proper encoding
- Implement **Oracle connection pooling** with `sql.DB` and appropriate pool settings
- Use **Oracle-specific data types** (NUMBER, VARCHAR2, CLOB, BLOB, DATE, TIMESTAMP)
- Apply **Oracle sequence** for auto-incrementing primary keys
- Use **Oracle-specific SQL syntax** and functions (ROWNUM, ROWID, SYSDATE)
- Implement **Oracle-specific error handling** for ORA-* error codes
- Use **Oracle-specific indexing strategies** (B-tree, Bitmap, Function-based)
- Apply **Oracle-specific performance tuning** (EXPLAIN PLAN, AWR reports)

#### Oracle Naming Conventions:
- Use **UPPERCASE** for all table names and column names
- Use **UNDERSCORE** for word separation in table/column names
- Use **singular** table names (USER, ORDER, PRODUCT)
- Use **descriptive** column names (USER_ID, CREATED_AT, UPDATED_AT)
- Use **consistent** naming patterns across all tables
- Apply **Oracle-specific constraints** naming (PK_USERS, UK_USERS_USERNAME)

#### Base Entity Standards:
- Implement **BaseEntity** with common fields (ID, CreatedAt, UpdatedAt)
- Use **UUID** as primary key for all entities
- Apply **audit fields** (CreatedBy, UpdatedBy, DeletedAt)
- Use **soft delete** pattern with DeletedAt field
- Implement **versioning** with Version field for optimistic locking
- Apply **tenant isolation** with TenantID field for multi-tenancy

#### Oracle Connection & Pooling:
```go
// Oracle connection configuration
dsn := fmt.Sprintf("%s/%s@%s:%s/%s", username, password, host, port, serviceName)
db, err := sql.Open("oracle", dsn)
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

#### Oracle Query Optimization:
- Use **bind variables** to prevent SQL injection and improve performance
- Implement **query hints** for Oracle optimizer
- Use **Oracle-specific functions** (NVL, DECODE, CASE WHEN)
- Apply **Oracle-specific joins** (LEFT OUTER JOIN, RIGHT OUTER JOIN)
- Use **Oracle-specific pagination** with ROWNUM or ROW_NUMBER()

#### DataLoader Pattern:

##### Request-Scoped DataLoader Standards:
- Use **request-scoped DataLoader** instances for each HTTP request
- Implement **DataLoader registry** to manage multiple loaders per request
- Apply **automatic cleanup** of DataLoader instances after request completion
- Use **context-based DataLoader** to ensure request isolation
- Implement **DataLoader middleware** for automatic setup and teardown

##### DataLoader Registry Pattern:
```go
// DataLoader registry for request-scoped management
type DataLoaderRegistry struct {
    loaders map[string]interface{}
    mu      sync.RWMutex
}

func NewDataLoaderRegistry() *DataLoaderRegistry {
    return &DataLoaderRegistry{
        loaders: make(map[string]interface{}),
    }
}

func (r *DataLoaderRegistry) GetOrCreate[T any](key string, factory func() T) T {
    r.mu.RLock()
    if loader, exists := r.loaders[key]; exists {
        r.mu.RUnlock()
        return loader.(T)
    }
    r.mu.RUnlock()
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    // Double-check pattern
    if loader, exists := r.loaders[key]; exists {
        return loader.(T)
    }
    
    loader := factory()
    r.loaders[key] = loader
    return loader
}

func (r *DataLoaderRegistry) Clear() {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.loaders = make(map[string]interface{})
}
```

##### Request-Scoped DataLoader Implementation:
```go
// Request-scoped DataLoader with context
type RequestDataLoader[K comparable, V any] struct {
    cache    map[K]V
    pending  map[K][]chan V
    batch    func(ctx context.Context, keys []K) ([]V, error)
    mu       sync.RWMutex
    maxBatch int
    wait     time.Duration
}

func NewRequestDataLoader[K comparable, V any](
    batch func(ctx context.Context, keys []K) ([]V, error),
    maxBatch int,
    wait time.Duration,
) *RequestDataLoader[K, V] {
    return &RequestDataLoader[K, V]{
        cache:    make(map[K]V),
        pending:  make(map[K][]chan V),
        batch:    batch,
        maxBatch: maxBatch,
        wait:     wait,
    }
}

func (dl *RequestDataLoader[K, V]) Load(ctx context.Context, key K) (V, error) {
    dl.mu.RLock()
    if value, exists := dl.cache[key]; exists {
        dl.mu.RUnlock()
        return value, nil
    }
    dl.mu.RUnlock()
    
    dl.mu.Lock()
    defer dl.mu.Unlock()
    
    // Double-check pattern
    if value, exists := dl.cache[key]; exists {
        return value, nil
    }
    
    // Create channel for this request
    ch := make(chan V, 1)
    dl.pending[key] = append(dl.pending[key], ch)
    
    // Trigger batch if needed
    if len(dl.pending) >= dl.maxBatch {
        go dl.executeBatch(ctx)
    }
    
    // Wait for result
    select {
    case value := <-ch:
        return value, nil
    case <-ctx.Done():
        return *new(V), ctx.Err()
    }
}

func (dl *RequestDataLoader[K, V]) executeBatch(ctx context.Context) {
    dl.mu.Lock()
    keys := make([]K, 0, len(dl.pending))
    for key := range dl.pending {
        keys = append(keys, key)
    }
    dl.mu.Unlock()
    
    values, err := dl.batch(ctx, keys)
    if err != nil {
        // Handle error for all pending requests
        dl.mu.Lock()
        for key, chans := range dl.pending {
            for _, ch := range chans {
                close(ch)
            }
            delete(dl.pending, key)
        }
        dl.mu.Unlock()
        return
    }
    
    // Distribute results
    dl.mu.Lock()
    for i, key := range keys {
        if i < len(values) {
            dl.cache[key] = values[i]
            for _, ch := range dl.pending[key] {
                ch <- values[i]
                close(ch)
            }
        }
        delete(dl.pending, key)
    }
    dl.mu.Unlock()
}
```

##### DataLoader Middleware:
```go
// DataLoader middleware for HTTP handlers
func DataLoaderMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Create request-scoped DataLoader registry
        registry := NewDataLoaderRegistry()
        ctx := context.WithValue(r.Context(), "dataloader_registry", registry)
        
        // Ensure cleanup after request
        defer registry.Clear()
        
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// Helper function to get DataLoader from context
func GetDataLoader[T any](ctx context.Context, key string, factory func() T) T {
    registry := ctx.Value("dataloader_registry").(*DataLoaderRegistry)
    return registry.GetOrCreate(key, factory)
}
```

##### DataLoader Usage Examples:
```go
// User DataLoader factory
func NewUserLoader(ctx context.Context) *RequestDataLoader[int, *User] {
    return NewRequestDataLoader(
        func(ctx context.Context, ids []int) ([]*User, error) {
            // Batch query to database
            return userService.GetUsersByIDs(ctx, ids)
        },
        100, // max batch size
        16*time.Millisecond, // wait time
    )
}

// Usage in handler
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    
    // Get or create User DataLoader for this request
    userLoader := GetDataLoader(ctx, "user_loader", func() *RequestDataLoader[int, *User] {
        return NewUserLoader(ctx)
    })
    
    // Load user (will be batched if multiple requests)
    user, err := userLoader.Load(ctx, userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    json.NewEncoder(w).Encode(user)
}
```

##### DataLoader Best Practices:
- Use **request-scoped instances** to prevent memory leaks
- Implement **automatic cleanup** after request completion
- Apply **batch size limits** to prevent memory issues
- Use **timeout mechanisms** for batch operations
- Implement **error handling** for failed batch operations
- Apply **circuit breaker** for external service calls
- Use **metrics and monitoring** for DataLoader performance

#### Oracle-Specific Patterns:
- Use **Oracle-specific transactions** with proper isolation levels
- Implement **Oracle-specific locking** (SELECT FOR UPDATE)
- Apply **Oracle-specific constraints** (CHECK, UNIQUE, FOREIGN KEY)
- Use **Oracle-specific triggers** for audit trails
- Implement **Oracle-specific stored procedures** for complex business logic

#### Database Migrations for Oracle:
- Use **Oracle-specific migration tools** (Flyway, Liquibase)
- Implement **Oracle-specific schema changes** (tablespace, partitioning)
- Apply **Oracle-specific data types** in migration scripts
- Use **Oracle-specific rollback strategies**
- Implement **Oracle-specific backup/restore** procedures

#### Oracle Monitoring & Observability:
- Monitor **Oracle-specific metrics** (SGA, PGA, buffer cache hit ratio)
- Implement **Oracle-specific health checks** (V$SESSION, V$DATABASE)
- Use **Oracle-specific logging** (AUDIT, V$LOG)
- Apply **Oracle-specific performance monitoring** (AWR, ASH reports)
- Implement **Oracle-specific alerting** for critical thresholds

### Configuration Management:
- Use **environment-based configuration** with validation
- Implement **configuration hot-reloading** where appropriate
- Use **secrets management** (Vault, AWS Secrets Manager)
- Apply **configuration validation** on startup
- Use **feature flags** for gradual rollouts

### API Design:

#### RESTful API Standards:
- Use **HTTP methods correctly**: GET (read), POST (create), PUT (update), PATCH (partial update), DELETE (remove)
- Follow **resource-based URLs** with API Gateway prefix: `/KONGAPI/api/v1/users/{id}` instead of `/api/v1/getUser`
- Use **plural nouns** for collections: `/users`, `/orders`, `/products`
- Implement **proper HTTP status codes**: 200, 201, 400, 401, 403, 404, 409, 422, 500
- Use **consistent response format** with envelope pattern and status code:
  ```json
  {
    "success": true,
    "status_code": 200,
    "data": {...},
    "meta": {
      "pagination": {...},
      "timestamp": "2024-01-15T10:30:00Z",
      "request_id": "req_123456789",
      "trace_id": "trace_987654321"
    }
  }
  ```

#### API Gateway Integration (Kong):
- Use **KONGAPI prefix** for all public endpoints: `/KONGAPI/api/v1/...`
- Implement **Kong-specific headers** and **request routing**
- Apply **Kong middleware** for authentication, rate limiting, and logging
- Use **Kong plugins** for CORS, compression, and monitoring
- Implement **Kong health checks** and **service discovery**

##### Kong API URL Structure:
```
# Public API Endpoints (through Kong Gateway)
/KONGAPI/api/v1/users                    # GET, POST
/KONGAPI/api/v1/users/{id}               # GET, PUT, PATCH, DELETE
/KONGAPI/api/v1/orders                   # GET, POST
/KONGAPI/api/v1/orders/{id}              # GET, PUT, PATCH, DELETE
/KONGAPI/api/v1/products                 # GET, POST
/KONGAPI/api/v1/products/{id}            # GET, PUT, PATCH, DELETE

# Internal API Endpoints (direct access)
/api/v1/health                          # Health check
/api/v1/metrics                         # Prometheus metrics
/api/v1/ready                           # Readiness probe
```

##### Kong Configuration Standards:

###### Global Authentication Configuration:
```yaml
# Kong Global JWT Plugin Configuration (applies to all services)
plugins:
  - name: jwt
    config:
      secret_is_base64: false
      run_on_preflight: true
      uri_param_names: ["jwt"]
      cookie_names: ["jwt"]
      header_names: ["Authorization"]
      claims_to_verify: ["exp", "iat"]
      anonymous: null  # No anonymous access - all requests must be authenticated
      key_claim_name: "iss"
      algorithm: "HS256"
      maximum_expiration: 3600
```

###### Service-Specific Configuration:
```yaml
# Kong Service Configuration
services:
  # Protected Service (requires authentication)
  - name: user-service
    url: http://user-service:8080
    connect_timeout: 60000
    write_timeout: 60000
    read_timeout: 60000
    retries: 5
    routes:
      - name: user-routes
        paths: ["/KONGAPI/api/v1/users"]
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        strip_path: true
        preserve_host: false
        protocols: ["http", "https"]
        plugins:
          - name: cors
            config:
              origins: ["*"]
              methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
              headers: ["Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Auth-Token", "Authorization"]
              exposed_headers: ["X-Auth-Token"]
              credentials: true
              max_age: 3600
          - name: rate-limiting
            config:
              minute: 100
              hour: 1000
              day: 10000
              policy: "local"
          - name: jwt
            config:
              secret_is_base64: false
              run_on_preflight: true
              uri_param_names: ["jwt"]
              cookie_names: ["jwt"]
              header_names: ["Authorization"]
              claims_to_verify: ["exp", "iat"]
              anonymous: null  # No anonymous access
              key_claim_name: "iss"
              algorithm: "HS256"
          - name: request-transformer
            config:
              add:
                headers: ["X-Gateway: Kong"]
              remove:
                headers: ["X-Forwarded-Host"]
          - name: response-transformer
            config:
              add:
                headers: ["X-Response-Time: $(latency_ms)"]
          - name: prometheus
            config:
              per_consumer: true
              status_code_metrics: true
              latency_metrics: true
              bandwidth_metrics: true
              upstream_health_metrics: true

  # Public Service (no authentication required)
  - name: auth-service
    url: http://auth-service:8080
    connect_timeout: 60000
    write_timeout: 60000
    read_timeout: 60000
    retries: 5
    routes:
      - name: auth-routes
        paths: ["/KONGAPI/api/v1/public/auth"]
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        strip_path: true
        preserve_host: false
        protocols: ["http", "https"]
        plugins:
          - name: cors
            config:
              origins: ["*"]
              methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
              headers: ["Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Auth-Token", "Authorization"]
              exposed_headers: ["X-Auth-Token"]
              credentials: true
              max_age: 3600
          - name: rate-limiting
            config:
              minute: 200
              hour: 2000
              day: 20000
              policy: "local"
          # NO JWT plugin for public auth endpoints
          - name: request-transformer
            config:
              add:
                headers: ["X-Gateway: Kong"]
          - name: response-transformer
            config:
              add:
                headers: ["X-Response-Time: $(latency_ms)"]

  # Health Check Service (no authentication required)
  - name: health-service
    url: http://health-service:8080
    connect_timeout: 60000
    write_timeout: 60000
    read_timeout: 60000
    retries: 5
    routes:
      - name: health-routes
        paths: ["/KONGAPI/api/v1/public/health", "/KONGAPI/api/v1/public/ready"]
        methods: ["GET"]
        strip_path: true
        preserve_host: false
        protocols: ["http", "https"]
        plugins:
          - name: cors
            config:
              origins: ["*"]
              methods: ["GET", "OPTIONS"]
              headers: ["Accept", "Content-Type"]
              credentials: false
              max_age: 3600
          # NO JWT plugin for health check endpoints
          - name: request-transformer
            config:
              add:
                headers: ["X-Gateway: Kong"]
```

##### Go Router Configuration:
```go
// Router setup with Kong prefix
func SetupRouter() *gin.Engine {
    router := gin.New()
    
    // Kong API routes (public endpoints)
    kongAPI := router.Group("/KONGAPI/api/v1")
    {
        // User routes
        users := kongAPI.Group("/users")
        {
            users.GET("", userHandler.GetUsers)
            users.POST("", userHandler.CreateUser)
            users.GET("/:id", userHandler.GetUser)
            users.PUT("/:id", userHandler.UpdateUser)
            users.PATCH("/:id", userHandler.PartialUpdateUser)
            users.DELETE("/:id", userHandler.DeleteUser)
        }
        
        // Order routes
        orders := kongAPI.Group("/orders")
        {
            orders.GET("", orderHandler.GetOrders)
            orders.POST("", orderHandler.CreateOrder)
            orders.GET("/:id", orderHandler.GetOrder)
            orders.PUT("/:id", orderHandler.UpdateOrder)
            orders.PATCH("/:id", orderHandler.PartialUpdateOrder)
            orders.DELETE("/:id", orderHandler.DeleteOrder)
        }
        
        // Product routes
        products := kongAPI.Group("/products")
        {
            products.GET("", productHandler.GetProducts)
            products.POST("", productHandler.CreateProduct)
            products.GET("/:id", productHandler.GetProduct)
            products.PUT("/:id", productHandler.UpdateProduct)
            products.PATCH("/:id", productHandler.PartialUpdateProduct)
            products.DELETE("/:id", productHandler.DeleteProduct)
        }
    }
    
    // Internal API routes (direct access)
    internalAPI := router.Group("/api/v1")
    {
        internalAPI.GET("/health", healthHandler.HealthCheck)
        internalAPI.GET("/metrics", metricsHandler.GetMetrics)
        internalAPI.GET("/ready", healthHandler.ReadinessCheck)
    }
    
    return router
}
```

##### Kong Middleware Integration:
```go
// Kong-specific middleware
func KongMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Extract Kong headers
        kongRequestID := c.GetHeader("X-Kong-Request-ID")
        kongConsumerID := c.GetHeader("X-Consumer-ID")
        kongConsumerUsername := c.GetHeader("X-Consumer-Username")
        
        // Add to context
        ctx := context.WithValue(c.Request.Context(), "kong_request_id", kongRequestID)
        ctx = context.WithValue(ctx, "kong_consumer_id", kongConsumerID)
        ctx = context.WithValue(ctx, "kong_consumer_username", kongConsumerUsername)
        
        c.Request = c.Request.WithContext(ctx)
        
        // Log Kong-specific information
        log.Info("Kong request",
            zap.String("kong_request_id", kongRequestID),
            zap.String("kong_consumer_id", kongConsumerID),
            zap.String("kong_consumer_username", kongConsumerUsername),
            zap.String("path", c.Request.URL.Path),
            zap.String("method", c.Request.Method),
        )
        
        c.Next()
    })
}

// Kong authentication middleware
func KongAuthMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Kong JWT plugin should handle authentication
        // This middleware just validates Kong headers
        consumerID := c.GetHeader("X-Consumer-ID")
        if consumerID == "" {
            c.JSON(401, gin.H{
                "success": false,
                "status_code": 401,
                "error": gin.H{
                    "code": "AUTH_001",
                    "message": "Authentication required",
                    "details": gin.H{
                        "reason": "Missing Kong consumer ID",
                    },
                },
            })
            c.Abort()
            return
        }
        
        c.Next()
    })
}
```

##### Kong Health Check Integration:
```go
// Kong health check endpoint
func KongHealthCheck(c *gin.Context) {
    // Check Kong connectivity
    kongStatus := checkKongConnectivity()
    
    response := gin.H{
        "success": true,
        "status_code": 200,
        "data": gin.H{
            "service": "user-service",
            "status": "healthy",
            "kong_connected": kongStatus,
            "timestamp": time.Now().UTC(),
        },
    }
    
    if !kongStatus {
        response["status"] = "unhealthy"
        response["status_code"] = 503
        c.JSON(503, response)
        return
    }
    
    c.JSON(200, response)
}

func checkKongConnectivity() bool {
    // Check if Kong is reachable
    // This could be a simple ping or more complex health check
    return true // Implement actual Kong connectivity check
}
```

##### Kong Request/Response Headers:
```go
// Kong request headers to expect (based on Kong Gateway documentation)
const (
    // Consumer identification headers (set by Kong plugins)
    KongConsumerID       = "X-Consumer-ID"           // Consumer UUID
    KongConsumerUsername = "X-Consumer-Username"     // Consumer username
    KongConsumerCustomID = "X-Consumer-Custom-ID"    // Consumer custom ID
    
    // Credential headers (set by authentication plugins)
    KongCredential       = "X-Credential-Identifier" // Credential identifier
    KongAnonymous        = "X-Anonymous-Consumer"    // Anonymous consumer flag
    
    // JWT specific headers (set by JWT plugin)
    KongJWTClaims        = "X-JWT-Claims"            // JWT claims (if configured)
    KongJWTIssuer        = "X-JWT-Issuer"            // JWT issuer
    
    // Forwarded headers (set by Kong proxy)
    KongForwardedHost    = "X-Forwarded-Host"        // Original host
    KongForwardedPath    = "X-Forwarded-Path"        // Original path
    KongForwardedProto   = "X-Forwarded-Proto"       // Original protocol
    KongForwardedFor     = "X-Forwarded-For"         // Client IP
    KongRealIP           = "X-Real-IP"               // Real client IP
    
    // Kong internal headers
    KongRequestID        = "X-Kong-Request-ID"       // Kong request ID
    KongUpstreamHost     = "X-Kong-Upstream-Host"    // Upstream host
    KongUpstreamPath     = "X-Kong-Upstream-Path"    // Upstream path
)

// Kong response headers (set by Kong)
const (
    KongResponseTime     = "X-Kong-Response-Time"    // Response time in ms
    KongUpstreamTime     = "X-Kong-Upstream-Time"    // Upstream response time
    KongProxyLatency     = "X-Kong-Proxy-Latency"    // Proxy latency
    KongRequestID        = "X-Kong-Request-ID"       // Request ID (echoed back)
)
```

##### Kong Consumer Management:
```yaml
# Kong Consumer Configuration
consumers:
  - username: "user-service"
    custom_id: "user-service-001"
    tags: ["service", "internal"]
    jwt_secrets:
      - key: "user-service-key"
        secret: "user-service-secret"
        algorithm: "HS256"
    acl_groups:
      - "service"
      - "internal"
  
  - username: "admin-user"
    custom_id: "admin-001"
    tags: ["admin", "user"]
    jwt_secrets:
      - key: "admin-key"
        secret: "admin-secret"
        algorithm: "HS256"
    acl_groups:
      - "admin"
      - "user"
  
  - username: "regular-user"
    custom_id: "user-001"
    tags: ["user"]
    jwt_secrets:
      - key: "user-key"
        secret: "user-secret"
        algorithm: "HS256"
    acl_groups:
      - "user"

# Kong ACL Plugin Configuration
plugins:
  - name: acl
    config:
      hide_groups_header: false
      allow: ["admin", "user", "service"]
      deny: ["banned"]
      fail_open: false
```

##### Kong Plugin Configuration Best Practices:
```yaml
# Complete Kong Plugin Configuration
plugins:
  # CORS Plugin
  - name: cors
    config:
      origins: ["https://example.com", "https://app.example.com"]
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
      headers: ["Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Auth-Token", "Authorization"]
      exposed_headers: ["X-Auth-Token", "X-Response-Time"]
      credentials: true
      max_age: 3600
      preflight_continue: false
  
  # Rate Limiting Plugin
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
      day: 10000
      policy: "local"
      fault_tolerant: true
      hide_client_headers: false
  
  # JWT Plugin
  - name: jwt
    config:
      secret_is_base64: false
      run_on_preflight: true
      uri_param_names: ["jwt"]
      cookie_names: ["jwt"]
      header_names: ["Authorization"]
      claims_to_verify: ["exp", "iat"]
      anonymous: null
      key_claim_name: "iss"
      algorithm: "HS256"
      maximum_expiration: 3600
  
  # Request Transformer Plugin
  - name: request-transformer
    config:
      add:
        headers: ["X-Gateway: Kong", "X-Request-Time: $(date_unix)"]
        querystring: ["gateway=kong"]
      remove:
        headers: ["X-Forwarded-Host"]
      replace:
        headers: ["X-Forwarded-Proto: https"]
  
  # Response Transformer Plugin
  - name: response-transformer
    config:
      add:
        headers: ["X-Response-Time: $(latency_ms)", "X-Kong-Request-ID: $(request_id)"]
      remove:
        headers: ["Server"]
  
  # Prometheus Plugin
  - name: prometheus
    config:
      per_consumer: true
      status_code_metrics: true
      latency_metrics: true
      bandwidth_metrics: true
      upstream_health_metrics: true
      per_consumer_metrics: true
  
  # Logging Plugin
  - name: file-log
    config:
      path: "/var/log/kong/access.log"
      reopen: true
  
  # Health Check Plugin
  - name: healthcheck
    config:
      active:
        type: "http"
        http_path: "/health"
        timeout: 1
        concurrency: 10
        healthy:
          interval: 0
          successes: 1
        unhealthy:
          interval: 0
          http_failures: 1
      passive:
        type: "http"
        healthy:
          http_statuses: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
        unhealthy:
          http_statuses: [429, 500, 503]
```

##### Kong Error Handling:
```go
// Kong-specific error responses
func KongErrorResponse(c *gin.Context, statusCode int, errorCode, message string, details interface{}) {
    response := gin.H{
        "success": false,
        "status_code": statusCode,
        "error": gin.H{
            "code": errorCode,
            "message": message,
            "details": details,
            "timestamp": time.Now().UTC(),
            "kong_request_id": c.GetHeader(KongRequestID),
        },
    }
    
    // Add Kong-specific headers
    c.Header("X-Kong-Response-Time", fmt.Sprintf("%dms", time.Since(startTime).Milliseconds()))
    
    c.JSON(statusCode, response)
}

// Kong health check with detailed status
func KongHealthCheck(c *gin.Context) {
    healthStatus := gin.H{
        "service": "user-service",
        "status": "healthy",
        "timestamp": time.Now().UTC(),
        "version": "1.0.0",
        "environment": "production",
    }
    
    // Check Kong connectivity
    kongStatus := checkKongConnectivity()
    healthStatus["kong_connected"] = kongStatus
    
    // Check database connectivity
    dbStatus := checkDatabaseConnectivity()
    healthStatus["database_connected"] = dbStatus
    
    // Check Redis connectivity
    redisStatus := checkRedisConnectivity()
    healthStatus["redis_connected"] = redisStatus
    
    // Determine overall health
    if !kongStatus || !dbStatus || !redisStatus {
        healthStatus["status"] = "unhealthy"
        c.JSON(503, gin.H{
            "success": false,
            "status_code": 503,
            "data": healthStatus,
        })
        return
    }
    
    c.JSON(200, gin.H{
        "success": true,
        "status_code": 200,
        "data": healthStatus,
    })
}
```

##### Kong Middleware Integration:

###### Kong Consumer Middleware (for Protected Endpoints):
```go
// Kong Consumer Middleware - extracts consumer info from Kong headers
// This middleware is used for endpoints that have Kong JWT plugin configured
func KongConsumerMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Extract Kong headers (set by Kong JWT plugin)
        kongRequestID := c.GetHeader("X-Kong-Request-ID")
        kongConsumerID := c.GetHeader("X-Consumer-ID")
        kongConsumerUsername := c.GetHeader("X-Consumer-Username")
        kongConsumerCustomID := c.GetHeader("X-Consumer-Custom-ID")
        
        // If Kong JWT plugin is configured, these headers should be present
        if kongConsumerID == "" {
            // This should not happen if Kong JWT plugin is properly configured
            // But we handle it gracefully
            log.Warn("Kong consumer ID not found - JWT plugin may not be configured",
                zap.String("path", c.Request.URL.Path),
                zap.String("method", c.Request.Method),
            )
        }
        
        // Extract JWT claims from Kong headers (if available)
        jwtClaims := extractJWTClaimsFromHeaders(c)
        
        // Add to context
        ctx := context.WithValue(c.Request.Context(), "kong_request_id", kongRequestID)
        ctx = context.WithValue(ctx, "kong_consumer_id", kongConsumerID)
        ctx = context.WithValue(ctx, "kong_consumer_username", kongConsumerUsername)
        ctx = context.WithValue(ctx, "kong_consumer_custom_id", kongConsumerCustomID)
        ctx = context.WithValue(ctx, "jwt_claims", jwtClaims)
        
        c.Request = c.Request.WithContext(ctx)
        
        // Log Kong-specific information
        log.Info("Kong authenticated request",
            zap.String("kong_request_id", kongRequestID),
            zap.String("kong_consumer_id", kongConsumerID),
            zap.String("kong_consumer_username", kongConsumerUsername),
            zap.String("path", c.Request.URL.Path),
            zap.String("method", c.Request.Method),
        )
        
        c.Next()
    })
}

// Kong Public Middleware (for Public Endpoints)
func KongPublicMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Extract Kong headers (may or may not be present for public endpoints)
        kongRequestID := c.GetHeader("X-Kong-Request-ID")
        
        // Add to context
        ctx := context.WithValue(c.Request.Context(), "kong_request_id", kongRequestID)
        
        c.Request = c.Request.WithContext(ctx)
        
        // Log public request
        log.Info("Kong public request",
            zap.String("kong_request_id", kongRequestID),
            zap.String("path", c.Request.URL.Path),
            zap.String("method", c.Request.Method),
        )
        
        c.Next()
    })
}

// Kong Authentication Validation Middleware (Optional - for extra security)
func KongAuthValidationMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // This middleware can be used for additional validation
        // Kong JWT plugin has already validated the token
        
        consumerID := c.GetHeader("X-Consumer-ID")
        if consumerID == "" {
            // This should not happen if Kong JWT plugin is properly configured
            KongErrorResponse(c, 401, "AUTH_001", "Authentication required", 
                gin.H{"reason": "Missing Kong consumer ID - JWT plugin may not be configured"})
            c.Abort()
            return
        }
        
        // Additional validation can be added here
        // e.g., check if consumer is active, not banned, etc.
        
        c.Next()
    })
}
```

#### API Versioning:
- Use **URL versioning** with Kong prefix: `/KONGAPI/api/v1/`, `/KONGAPI/api/v2/`
- Implement **header versioning** for backward compatibility
- Maintain **deprecation notices** in API responses
- Provide **migration guides** for breaking changes
- Use **Kong route versioning** for different API versions

#### Request/Response Design:
- Use **PascalCase** for JSON field names (Go convention)
- Implement **pagination** with `limit`, `offset`, and `total` fields
- Apply **field filtering**: `?fields=id,name,email`
- Use **query parameters** for filtering: `?status=active&role=admin`
- Implement **sorting**: `?sort=created_at&order=desc`

#### Error Handling:
- Return **structured error responses** with error codes and status code
- Use **consistent error format**:
  ```json
  {
    "success": false,
    "status_code": 400,
    "error": {
      "code": "VAL_001",
      "message": "Validation failed",
      "details": {
        "field": "email",
        "reason": "Invalid email format"
      },
      "timestamp": "2024-01-15T10:30:00Z",
      "request_id": "req_123456789",
      "trace_id": "trace_987654321"
    },
    "data": null
  }
  ```
- Implement **field-level validation errors**
- Provide **actionable error messages**

#### Security & Authentication:

##### Kong Gateway Authentication:
- Use **Kong JWT Plugin** for token validation and user authentication
- Implement **Kong Consumer-based** authentication with API keys
- Apply **Kong OAuth2 Plugin** for OAuth2 flows
- Use **Kong Basic Auth Plugin** for service-to-service authentication
- Implement **Kong ACL Plugin** for role-based access control

##### Authentication Flow with Kong:
```yaml
# Kong JWT Plugin Configuration
plugins:
  - name: jwt
    config:
      secret_is_base64: false
      run_on_preflight: true
      uri_param_names: ["jwt"]
      cookie_names: ["jwt"]
      header_names: ["Authorization"]
      claims_to_verify: ["exp", "iat"]
      anonymous: null
      key_claim_name: "iss"
      algorithm: "HS256"

# Kong Consumer Configuration
consumers:
  - username: "user-service"
    custom_id: "user-service-001"
    tags: ["service", "internal"]
    jwt_secrets:
      - key: "user-service-key"
        secret: "user-service-secret"
        algorithm: "HS256"

# Kong ACL Plugin Configuration
plugins:
  - name: acl
    config:
      hide_groups_header: false
      allow: ["admin", "user", "service"]
      deny: ["banned"]
```

##### Go Authentication Implementation:
```go
// Kong JWT Authentication Middleware
func KongJWTMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Kong JWT plugin should have already validated the token
        // This middleware extracts user information from Kong headers
        
        consumerID := c.GetHeader("X-Consumer-ID")
        consumerUsername := c.GetHeader("X-Consumer-Username")
        consumerCustomID := c.GetHeader("X-Consumer-Custom-ID")
        
        if consumerID == "" {
            KongErrorResponse(c, 401, "AUTH_001", "Authentication required", 
                gin.H{"reason": "Missing Kong consumer ID"})
            c.Abort()
            return
        }
        
        // Extract JWT claims from Kong headers (if available)
        jwtClaims := extractJWTClaimsFromHeaders(c)
        
        // Add user context
        ctx := context.WithValue(c.Request.Context(), "consumer_id", consumerID)
        ctx = context.WithValue(ctx, "consumer_username", consumerUsername)
        ctx = context.WithValue(ctx, "consumer_custom_id", consumerCustomID)
        ctx = context.WithValue(ctx, "jwt_claims", jwtClaims)
        
        c.Request = c.Request.WithContext(ctx)
        c.Next()
    })
}

// Extract JWT claims from Kong headers
func extractJWTClaimsFromHeaders(c *gin.Context) map[string]interface{} {
    claims := make(map[string]interface{})
    
    // Kong JWT plugin may pass claims in headers (if configured)
    if jwtClaims := c.GetHeader("X-JWT-Claims"); jwtClaims != "" {
        // Parse JWT claims from header (JSON format)
        if err := json.Unmarshal([]byte(jwtClaims), &claims); err != nil {
            log.Warn("Failed to parse JWT claims from header", zap.Error(err))
        }
    }
    
    // Alternative: Extract from Authorization header if JWT plugin doesn't set custom headers
    authHeader := c.GetHeader("Authorization")
    if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        if jwtService != nil {
            if tokenClaims, err := jwtService.ExtractClaims(tokenString); err == nil {
                // Merge token claims with header claims
                for k, v := range tokenClaims {
                    claims[k] = v
                }
            }
        }
    }
    
    return claims
}

// Role-based Authorization Middleware
func RequireRole(requiredRoles ...string) gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Get user role from JWT claims or Kong headers
        userRole := ""
        
        // Try to get role from JWT claims first
        if claims := c.Request.Context().Value("jwt_claims"); claims != nil {
            if claimsMap, ok := claims.(map[string]interface{}); ok {
                if role, exists := claimsMap["role"]; exists {
                    if roleStr, ok := role.(string); ok {
                        userRole = roleStr
                    }
                }
            }
        }
        
        // Fallback to header if not found in claims
        if userRole == "" {
            userRole = c.GetHeader("X-User-Role")
        }
        
        if userRole == "" {
            KongErrorResponse(c, 403, "AUTH_003", "Insufficient permissions", 
                gin.H{"reason": "User role not found"})
            c.Abort()
            return
        }
        
        // Check if user has required role
        hasRole := false
        for _, role := range requiredRoles {
            if userRole == role {
                hasRole = true
                break
            }
        }
        
        if !hasRole {
            KongErrorResponse(c, 403, "AUTH_003", "Insufficient permissions", 
                gin.H{"reason": fmt.Sprintf("Required roles: %v, User role: %s", requiredRoles, userRole)})
            c.Abort()
            return
        }
        
        c.Next()
    })
}

// Service-to-Service Authentication
func ServiceAuthMiddleware() gin.HandlerFunc {
    return gin.HandlerFunc(func(c *gin.Context) {
        // Check for service API key in headers
        apiKey := c.GetHeader("X-API-Key")
        serviceName := c.GetHeader("X-Service-Name")
        
        if apiKey == "" || serviceName == "" {
            KongErrorResponse(c, 401, "AUTH_001", "Service authentication required", 
                gin.H{"reason": "Missing API key or service name"})
            c.Abort()
            return
        }
        
        // Validate service API key
        if !validateServiceAPIKey(serviceName, apiKey) {
            KongErrorResponse(c, 401, "AUTH_001", "Invalid service credentials", 
                gin.H{"reason": "Invalid API key for service"})
            c.Abort()
            return
        }
        
        // Add service context
        ctx := context.WithValue(c.Request.Context(), "service_name", serviceName)
        ctx = context.WithValue(ctx, "api_key", apiKey)
        
        c.Request = c.Request.WithContext(ctx)
        c.Next()
    })
}

// Validate service API key
func validateServiceAPIKey(serviceName, apiKey string) bool {
    // Implement service API key validation
    // This could check against a database or configuration
    validKeys := map[string]string{
        "user-service": "user-service-key-123",
        "order-service": "order-service-key-456",
        "payment-service": "payment-service-key-789",
    }
    
    expectedKey, exists := validKeys[serviceName]
    return exists && expectedKey == apiKey
}
```

##### Authentication Routes Configuration:
```go
// Router setup with authentication
func SetupAuthenticatedRouter() *gin.Engine {
    router := gin.New()
    
    // Public routes (no authentication required)
    public := router.Group("/KONGAPI/api/v1/public")
    {
        public.GET("/health", healthHandler.HealthCheck)
        public.POST("/auth/login", authHandler.Login)
        public.POST("/auth/register", authHandler.Register)
        public.POST("/auth/refresh", authHandler.RefreshToken)
    }
    
    // Protected routes (JWT authentication required)
    protected := router.Group("/KONGAPI/api/v1")
    protected.Use(KongJWTMiddleware())
    {
        // User routes
        users := protected.Group("/users")
        {
            users.GET("", userHandler.GetUsers)
            users.POST("", userHandler.CreateUser)
            users.GET("/:id", userHandler.GetUser)
            users.PUT("/:id", userHandler.UpdateUser)
            users.PATCH("/:id", userHandler.PartialUpdateUser)
            users.DELETE("/:id", userHandler.DeleteUser)
        }
        
        // Admin routes (admin role required)
        admin := protected.Group("/admin")
        admin.Use(RequireRole("admin"))
        {
            admin.GET("/users", adminHandler.GetAllUsers)
            admin.DELETE("/users/:id", adminHandler.DeleteUser)
            admin.GET("/stats", adminHandler.GetStats)
        }
        
        // Service routes (service authentication required)
        services := protected.Group("/services")
        services.Use(ServiceAuthMiddleware())
        {
            services.POST("/users/batch", userHandler.CreateUsersBatch)
            services.GET("/users/sync", userHandler.SyncUsers)
        }
    }
    
    return router
}
```

##### JWT Token Management:
```go
// JWT Token Service
type JWTService struct {
    secretKey []byte
    issuer    string
    expiry    time.Duration
}

func NewJWTService(secretKey, issuer string, expiry time.Duration) *JWTService {
    return &JWTService{
        secretKey: []byte(secretKey),
        issuer:    issuer,
        expiry:    expiry,
    }
}

// Generate JWT token
func (j *JWTService) GenerateToken(userID, username, role string) (string, error) {
    claims := jwt.MapClaims{
        "user_id":  userID,
        "username": username,
        "role":     role,
        "iss":      j.issuer,
        "iat":      time.Now().Unix(),
        "exp":      time.Now().Add(j.expiry).Unix(),
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(j.secretKey)
}

// Validate JWT token
func (j *JWTService) ValidateToken(tokenString string) (*jwt.Token, error) {
    return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return j.secretKey, nil
    })
}

// Extract claims from token
func (j *JWTService) ExtractClaims(tokenString string) (jwt.MapClaims, error) {
    token, err := j.ValidateToken(tokenString)
    if err != nil {
        return nil, err
    }
    
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return claims, nil
    }
    
    return nil, fmt.Errorf("invalid token claims")
}
```

##### Authentication Error Handling:
```go
// Authentication error responses
func AuthErrorResponse(c *gin.Context, errorCode, message string, details interface{}) {
    KongErrorResponse(c, 401, errorCode, message, details)
}

func AuthorizationErrorResponse(c *gin.Context, errorCode, message string, details interface{}) {
    KongErrorResponse(c, 403, errorCode, message, details)
}

// Common authentication errors
const (
    ErrAuthTokenMissing    = "AUTH_001" // Token missing
    ErrAuthTokenInvalid    = "AUTH_002" // Token invalid
    ErrAuthTokenExpired    = "AUTH_003" // Token expired
    ErrAuthInsufficient    = "AUTH_004" // Insufficient permissions
    ErrAuthServiceInvalid  = "AUTH_005" // Invalid service credentials
)
```

##### Kong Authentication Strategy:

###### **Kong Gateway Level Authentication:**
- **Kong JWT Plugin** handles token validation at the gateway level
- **No JWT plugin** = No authentication required (public endpoints)
- **JWT plugin configured** = Authentication required (protected endpoints)
- **Kong validates JWT** before forwarding requests to Go application

###### **Go Application Level:**
- **Trust Kong's authentication** - Kong has already validated the token
- **Extract user info** from Kong headers (X-Consumer-ID, X-Consumer-Username, etc.)
- **No need to re-validate JWT** in Go application
- **Focus on authorization** (role-based access control)

##### Authentication Requirements by Endpoint Type:

###### Public Endpoints (No Kong JWT Plugin - No Authentication Required):
```go
// Public endpoints - NO JWT plugin in Kong configuration
// These endpoints are accessible without authentication
public := router.Group("/KONGAPI/api/v1/public")
{
    // Health and monitoring
    public.GET("/health", healthHandler.HealthCheck)
    public.GET("/ready", healthHandler.ReadinessCheck)
    public.GET("/metrics", metricsHandler.GetMetrics)
    
    // Authentication endpoints
    public.POST("/auth/login", authHandler.Login)
    public.POST("/auth/register", authHandler.Register)
    public.POST("/auth/refresh", authHandler.RefreshToken)
    public.POST("/auth/logout", authHandler.Logout)
    public.POST("/auth/forgot-password", authHandler.ForgotPassword)
    public.POST("/auth/reset-password", authHandler.ResetPassword)
    
    // Public information
    public.GET("/info", infoHandler.GetPublicInfo)
    public.GET("/version", infoHandler.GetVersion)
    public.GET("/status", statusHandler.GetStatus)
}
```

###### Protected Endpoints (Kong JWT Plugin Required):
```go
// Protected endpoints - Kong JWT plugin validates token before reaching Go app
// Go app only needs to extract user info from Kong headers
protected := router.Group("/KONGAPI/api/v1")
protected.Use(KongConsumerMiddleware()) // Extract consumer info from Kong headers
{
    // User management
    users := protected.Group("/users")
    {
        users.GET("", userHandler.GetUsers)                    // GET /KONGAPI/api/v1/users
        users.POST("", userHandler.CreateUser)                 // POST /KONGAPI/api/v1/users
        users.GET("/:id", userHandler.GetUser)                 // GET /KONGAPI/api/v1/users/{id}
        users.PUT("/:id", userHandler.UpdateUser)              // PUT /KONGAPI/api/v1/users/{id}
        users.PATCH("/:id", userHandler.PartialUpdateUser)     // PATCH /KONGAPI/api/v1/users/{id}
        users.DELETE("/:id", userHandler.DeleteUser)           // DELETE /KONGAPI/api/v1/users/{id}
        users.GET("/:id/profile", userHandler.GetUserProfile)  // GET /KONGAPI/api/v1/users/{id}/profile
        users.PUT("/:id/profile", userHandler.UpdateUserProfile) // PUT /KONGAPI/api/v1/users/{id}/profile
    }
    
    // Order management
    orders := protected.Group("/orders")
    {
        orders.GET("", orderHandler.GetOrders)                 // GET /KONGAPI/api/v1/orders
        orders.POST("", orderHandler.CreateOrder)              // POST /KONGAPI/api/v1/orders
        orders.GET("/:id", orderHandler.GetOrder)              // GET /KONGAPI/api/v1/orders/{id}
        orders.PUT("/:id", orderHandler.UpdateOrder)           // PUT /KONGAPI/api/v1/orders/{id}
        orders.PATCH("/:id", orderHandler.PartialUpdateOrder)  // PATCH /KONGAPI/api/v1/orders/{id}
        orders.DELETE("/:id", orderHandler.DeleteOrder)        // DELETE /KONGAPI/api/v1/orders/{id}
        orders.POST("/:id/cancel", orderHandler.CancelOrder)   // POST /KONGAPI/api/v1/orders/{id}/cancel
    }
    
    // Product management
    products := protected.Group("/products")
    {
        products.GET("", productHandler.GetProducts)           // GET /KONGAPI/api/v1/products
        products.POST("", productHandler.CreateProduct)        // POST /KONGAPI/api/v1/products
        products.GET("/:id", productHandler.GetProduct)        // GET /KONGAPI/api/v1/products/{id}
        products.PUT("/:id", productHandler.UpdateProduct)     // PUT /KONGAPI/api/v1/products/{id}
        products.PATCH("/:id", productHandler.PartialUpdateProduct) // PATCH /KONGAPI/api/v1/products/{id}
        products.DELETE("/:id", productHandler.DeleteProduct)  // DELETE /KONGAPI/api/v1/products/{id}
    }
    
    // User profile and settings
    profile := protected.Group("/profile")
    {
        profile.GET("", userHandler.GetCurrentUserProfile)     // GET /KONGAPI/api/v1/profile
        profile.PUT("", userHandler.UpdateCurrentUserProfile)  // PUT /KONGAPI/api/v1/profile
        profile.GET("/settings", userHandler.GetUserSettings)  // GET /KONGAPI/api/v1/profile/settings
        profile.PUT("/settings", userHandler.UpdateUserSettings) // PUT /KONGAPI/api/v1/profile/settings
    }
}
```

###### Admin Endpoints (Admin Role Required):
```go
// Admin endpoints - require admin role
admin := protected.Group("/admin")
admin.Use(RequireRole("admin"))
{
    // Admin user management
    adminUsers := admin.Group("/users")
    {
        adminUsers.GET("", adminHandler.GetAllUsers)           // GET /KONGAPI/api/v1/admin/users
        adminUsers.GET("/:id", adminHandler.GetUserDetails)    // GET /KONGAPI/api/v1/admin/users/{id}
        adminUsers.PUT("/:id", adminHandler.UpdateUserDetails) // PUT /KONGAPI/api/v1/admin/users/{id}
        adminUsers.DELETE("/:id", adminHandler.DeleteUser)     // DELETE /KONGAPI/api/v1/admin/users/{id}
        adminUsers.POST("/:id/ban", adminHandler.BanUser)      // POST /KONGAPI/api/v1/admin/users/{id}/ban
        adminUsers.POST("/:id/unban", adminHandler.UnbanUser)  // POST /KONGAPI/api/v1/admin/users/{id}/unban
    }
    
    // Admin order management
    adminOrders := admin.Group("/orders")
    {
        adminOrders.GET("", adminHandler.GetAllOrders)         // GET /KONGAPI/api/v1/admin/orders
        adminOrders.GET("/:id", adminHandler.GetOrderDetails)  // GET /KONGAPI/api/v1/admin/orders/{id}
        adminOrders.PUT("/:id", adminHandler.UpdateOrderDetails) // PUT /KONGAPI/api/v1/admin/orders/{id}
        adminOrders.DELETE("/:id", adminHandler.DeleteOrder)   // DELETE /KONGAPI/api/v1/admin/orders/{id}
    }
    
    // Admin statistics and reports
    admin.GET("/stats", adminHandler.GetStats)                 // GET /KONGAPI/api/v1/admin/stats
    admin.GET("/reports", adminHandler.GetReports)             // GET /KONGAPI/api/v1/admin/reports
    admin.GET("/analytics", adminHandler.GetAnalytics)         // GET /KONGAPI/api/v1/admin/analytics
}
```

###### Service Endpoints (Service Authentication Required):
```go
// Service endpoints - require service API key
services := protected.Group("/services")
services.Use(ServiceAuthMiddleware())
{
    // Service user management
    serviceUsers := services.Group("/users")
    {
        serviceUsers.POST("/batch", userHandler.CreateUsersBatch) // POST /KONGAPI/api/v1/services/users/batch
        serviceUsers.GET("/sync", userHandler.SyncUsers)          // GET /KONGAPI/api/v1/services/users/sync
        serviceUsers.POST("/bulk-update", userHandler.BulkUpdateUsers) // POST /KONGAPI/api/v1/services/users/bulk-update
    }
    
    // Service order management
    serviceOrders := services.Group("/orders")
    {
        serviceOrders.POST("/batch", orderHandler.CreateOrdersBatch) // POST /KONGAPI/api/v1/services/orders/batch
        serviceOrders.GET("/sync", orderHandler.SyncOrders)          // GET /KONGAPI/api/v1/services/orders/sync
        serviceOrders.POST("/bulk-update", orderHandler.BulkUpdateOrders) // POST /KONGAPI/api/v1/services/orders/bulk-update
    }
    
    // Service product management
    serviceProducts := services.Group("/products")
    {
        serviceProducts.POST("/batch", productHandler.CreateProductsBatch) // POST /KONGAPI/api/v1/services/products/batch
        serviceProducts.GET("/sync", productHandler.SyncProducts)          // GET /KONGAPI/api/v1/services/products/sync
        serviceProducts.POST("/bulk-update", productHandler.BulkUpdateProducts) // POST /KONGAPI/api/v1/services/products/bulk-update
    }
}
```

###### Internal Endpoints (Direct Access Only):
```go
// Internal endpoints - direct access, no Kong gateway
internal := router.Group("/api/v1")
{
    // Health checks
    internal.GET("/health", healthHandler.HealthCheck)         // GET /api/v1/health
    internal.GET("/ready", healthHandler.ReadinessCheck)       // GET /api/v1/ready
    internal.GET("/live", healthHandler.LivenessCheck)         // GET /api/v1/live
    
    // Metrics and monitoring
    internal.GET("/metrics", metricsHandler.GetMetrics)        // GET /api/v1/metrics
    internal.GET("/debug/pprof", pprofHandler.GetPprof)        // GET /api/v1/debug/pprof
    internal.GET("/debug/pprof/:profile", pprofHandler.GetPprofProfile) // GET /api/v1/debug/pprof/{profile}
    
    // Internal service communication
    internal.POST("/internal/users/validate", userHandler.ValidateUser) // POST /api/v1/internal/users/validate
    internal.POST("/internal/orders/process", orderHandler.ProcessOrder) // POST /api/v1/internal/orders/process
}
```

##### Kong Authentication Rules Summary:

###### **Kong Gateway Level (JWT Plugin Configuration):**

###### **MUST Configure JWT Plugin (Authentication Required):**
- ✅ All **user management** endpoints (`/KONGAPI/api/v1/users/*`)
- ✅ All **order management** endpoints (`/KONGAPI/api/v1/orders/*`)
- ✅ All **product management** endpoints (`/KONGAPI/api/v1/products/*`)
- ✅ All **profile management** endpoints (`/KONGAPI/api/v1/profile/*`)
- ✅ All **admin endpoints** (`/KONGAPI/api/v1/admin/*`)
- ✅ All **service endpoints** (`/KONGAPI/api/v1/services/*`)
- ✅ All **business logic** operations
- ✅ All **data modification** operations

###### **MUST NOT Configure JWT Plugin (Public Access):**
- ❌ **Health check** endpoints (`/KONGAPI/api/v1/public/health`, `/KONGAPI/api/v1/public/ready`)
- ❌ **Authentication** endpoints (`/KONGAPI/api/v1/public/auth/*`)
- ❌ **Public information** endpoints (`/KONGAPI/api/v1/public/info`, `/KONGAPI/api/v1/public/version`)
- ❌ **Internal endpoints** (`/api/v1/health`, `/api/v1/metrics`, `/api/v1/debug/*`)

###### **Go Application Level (Middleware Configuration):**

###### **Protected Endpoints (Use KongConsumerMiddleware):**
```go
// Kong JWT plugin validates token → Go app extracts consumer info
protected := router.Group("/KONGAPI/api/v1")
protected.Use(KongConsumerMiddleware()) // Extract consumer info from Kong headers
{
    // All business logic endpoints
    users := protected.Group("/users")
    orders := protected.Group("/orders")
    products := protected.Group("/products")
    profile := protected.Group("/profile")
}
```

###### **Public Endpoints (Use KongPublicMiddleware):**
```go
// No Kong JWT plugin → Go app handles public requests
public := router.Group("/KONGAPI/api/v1/public")
public.Use(KongPublicMiddleware()) // Basic Kong header extraction
{
    // All public endpoints
    auth := public.Group("/auth")
    health := public.Group("/health")
}
```

###### **Role-Based Authorization (Go Application Level):**
- 🔐 **Admin endpoints** require `admin` role (extracted from JWT claims)
- 🔐 **Service endpoints** require service API key validation
- 🔐 **User endpoints** require valid consumer info from Kong headers

###### **Authentication Flow:**
```
1. Client Request → Kong Gateway
2. Kong JWT Plugin validates token (if configured)
3. Kong forwards request to Go app with consumer headers
4. Go app extracts consumer info from Kong headers
5. Go app performs authorization (role-based access control)
6. Go app processes business logic
7. Go app returns response
```

###### **Middleware Execution Order:**
```go
// Middleware execution order
router.Use(gin.Logger())                    // 1. Logging
router.Use(gin.Recovery())                  // 2. Recovery
router.Use(CORSMiddleware())                // 3. CORS
router.Use(ResponseValidationMiddleware())  // 4. Response validation
// 5. Kong middleware (applied per route group)
//    - KongConsumerMiddleware() for protected endpoints
//    - KongPublicMiddleware() for public endpoints
// 6. Authorization middleware (applied per route group)
//    - RequireRole() for admin endpoints
//    - ServiceAuthMiddleware() for service endpoints
```

##### Security Best Practices:
- Use **HTTPS only** in production
- Implement **token rotation** for long-lived tokens
- Apply **rate limiting** per user and per service
- Use **secure headers** (HSTS, CSP, etc.)
- Implement **audit logging** for all authentication events
- Apply **CORS** configuration for web clients
- Use **API key authentication** for service-to-service calls
- Implement **refresh token** mechanism for JWT tokens
- **Never expose** business logic without authentication
- **Always validate** user permissions for data access
- **Log all** authentication attempts and failures

#### Documentation:
- Use **OpenAPI/Swagger** 3.0 specification
- Provide **interactive API documentation**
- Include **request/response examples**
- Document **authentication requirements**
- Maintain **changelog** for API updates

#### Performance:
- Implement **caching headers** (Cache-Control, ETag)
- Use **compression** (gzip) for responses
- Apply **request/response size limits**
- Implement **API rate limiting** per user/IP
- Use **pagination** for large datasets

#### Response Structure Standards:

##### Go Struct Definitions:
```go
// Base Response Structure
type BaseResponse struct {
    Success    bool        `json:"success"`
    StatusCode int         `json:"status_code"`
    Data       interface{} `json:"data,omitempty"`
    Meta       *Meta       `json:"meta,omitempty"`
    Error      *AppError   `json:"error,omitempty"`
}

// Meta Information
type Meta struct {
    Pagination *Pagination `json:"pagination,omitempty"`
    Timestamp  time.Time   `json:"timestamp"`
    RequestID  string      `json:"request_id,omitempty"`
    TraceID    string      `json:"trace_id,omitempty"`
}

// Pagination Information
type Pagination struct {
    Limit    int  `json:"limit"`
    Offset   int  `json:"offset"`
    Total    int  `json:"total"`
    HasNext  bool `json:"has_next"`
    HasPrev  bool `json:"has_prev"`
}

// Success Response Constructor
func NewSuccessResponse(data interface{}, statusCode int) *BaseResponse {
    return &BaseResponse{
        Success:    true,
        StatusCode: statusCode,
        Data:       data,
        Meta: &Meta{
            Timestamp: time.Now(),
        },
    }
}

// Error Response Constructor
func NewErrorResponse(err *AppError, statusCode int) *BaseResponse {
    return &BaseResponse{
        Success:    false,
        StatusCode: statusCode,
        Error:      err,
        Data:       nil,
        Meta: &Meta{
            Timestamp: time.Now(),
        },
    }
}
```

##### HTTP Status Code Mapping:
```go
// Success Status Codes
const (
    StatusOK                  = 200 // GET, PUT, PATCH success
    StatusCreated            = 201 // POST success
    StatusAccepted           = 202 // Async operation accepted
    StatusNoContent          = 204 // DELETE success
    StatusPartialContent     = 206 // Partial GET success
)

// Client Error Status Codes
const (
    StatusBadRequest         = 400 // Validation errors, malformed request
    StatusUnauthorized       = 401 // Authentication required
    StatusForbidden          = 403 // Insufficient permissions
    StatusNotFound           = 404 // Resource not found
    StatusMethodNotAllowed   = 405 // HTTP method not allowed
    StatusConflict           = 409 // Business rule conflict
    StatusUnprocessableEntity = 422 // Validation failed
    StatusTooManyRequests    = 429 // Rate limit exceeded
)

// Server Error Status Codes
const (
    StatusInternalServerError = 500 // Internal system error
    StatusNotImplemented     = 501 // Feature not implemented
    StatusBadGateway         = 502 // External service error
    StatusServiceUnavailable = 503 // Service temporarily unavailable
    StatusGatewayTimeout     = 504 // External service timeout
)
```

##### Error Code to Status Code Mapping:
```go
// Error Code to HTTP Status Code Mapping
var ErrorCodeToStatusMap = map[string]int{
    // 1xxx - System Errors -> 500
    "SYS_001": 500, // Internal system error
    "SYS_002": 504, // Request timeout
    "SYS_003": 503, // Service unavailable
    
    // 2xxx - Validation Errors -> 400/422
    "VAL_001": 400, // Required field missing
    "VAL_002": 422, // Invalid format
    "VAL_003": 422, // Value out of range
    
    // 3xxx - Authentication/Authorization -> 401/403
    "AUTH_001": 401, // Invalid token
    "AUTH_002": 401, // Token expired
    "AUTH_003": 403, // Insufficient permissions
    
    // 4xxx - Business Logic -> 404/409/422
    "BIZ_001": 404, // Resource not found
    "BIZ_002": 409, // Business rule conflict
    "BIZ_003": 422, // Business limit exceeded
    
    // 5xxx - External Dependencies -> 502/503/504
    "EXT_001": 504, // External service timeout
    "EXT_002": 503, // External service unavailable
    "EXT_003": 502, // External service error
}

// Get HTTP Status Code from Error Code
func GetStatusFromErrorCode(errorCode string) int {
    if status, exists := ErrorCodeToStatusMap[errorCode]; exists {
        return status
    }
    return 500 // Default to internal server error
}
```

##### Response Helper Functions:
```go
// Send Success Response
func SendSuccessResponse(w http.ResponseWriter, data interface{}, statusCode int) {
    response := NewSuccessResponse(data, statusCode)
    
    // Add request context to meta
    if ctx := w.(*ResponseWriter).Request().Context(); ctx != nil {
        if requestID := ctx.Value("request_id"); requestID != nil {
            response.Meta.RequestID = requestID.(string)
        }
        if traceID := ctx.Value("trace_id"); traceID != nil {
            response.Meta.TraceID = traceID.(string)
        }
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(response)
}

// Send Error Response
func SendErrorResponse(w http.ResponseWriter, err *AppError) {
    statusCode := GetStatusFromErrorCode(err.Code)
    response := NewErrorResponse(err, statusCode)
    
    // Add request context to meta
    if ctx := w.(*ResponseWriter).Request().Context(); ctx != nil {
        if requestID := ctx.Value("request_id"); requestID != nil {
            response.Meta.RequestID = requestID.(string)
        }
        if traceID := ctx.Value("trace_id"); traceID != nil {
            response.Meta.TraceID = traceID.(string)
        }
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(response)
}
```

##### Usage Examples:
```go
// Success Response Examples
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
    user, err := userService.GetUser(ctx, userID)
    if err != nil {
        SendErrorResponse(w, err)
        return
    }
    
    SendSuccessResponse(w, user, 200)
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
    user, err := userService.CreateUser(ctx, userData)
    if err != nil {
        SendErrorResponse(w, err)
        return
    }
    
    SendSuccessResponse(w, user, 201)
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
    err := userService.DeleteUser(ctx, userID)
    if err != nil {
        SendErrorResponse(w, err)
        return
    }
    
    SendSuccessResponse(w, nil, 204)
}

// Paginated Response
func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
    users, total, err := userService.GetUsers(ctx, limit, offset)
    if err != nil {
        SendErrorResponse(w, err)
        return
    }
    
    response := NewSuccessResponse(users, 200)
    response.Meta.Pagination = &Pagination{
        Limit:    limit,
        Offset:   offset,
        Total:    total,
        HasNext:  offset+limit < total,
        HasPrev:  offset > 0,
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    json.NewEncoder(w).Encode(response)
}
```

##### Response Validation:
```go
// Response Validation Middleware
func ResponseValidationMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Wrap ResponseWriter to capture response
        rw := &ResponseWriter{ResponseWriter: w}
        
        next.ServeHTTP(rw, r)
        
        // Validate response structure
        if rw.StatusCode >= 400 {
            // Ensure error response has proper structure
            if !rw.HasErrorResponse() {
                // Log warning and fix response
                log.Warn("Invalid error response structure", 
                    zap.Int("status", rw.StatusCode),
                    zap.String("path", r.URL.Path))
            }
        }
    })
}
```

##### Key Benefits:
- **Consistency**: Tất cả responses đều có cùng structure
- **Debugging**: Dễ dàng trace request qua request_id và trace_id
- **Client Integration**: Client có thể dựa vào status_code trong body
- **Monitoring**: Dễ dàng monitor và alert dựa trên status codes
- **Documentation**: API documentation rõ ràng và consistent

### Deployment & DevOps:
- Use **containerization** (Docker) with multi-stage builds
- Implement **health checks** and **readiness probes**
- Apply **graceful shutdown** with context cancellation
- Use **blue-green deployments** or **canary releases**
- Implement **rollback strategies** for failed deployments

### Code Review & Quality Gates:
- Implement **mandatory code review** process with at least 2 reviewers
- Use **automated code quality checks** (golangci-lint, go vet, go fmt)
- Enforce **test coverage thresholds** (minimum 80% for new code)
- Apply **security scanning** (gosec, static analysis tools)
- Use **dependency vulnerability scanning** (nancy, snyk)
- Implement **performance regression testing** in CI/CD
- Apply **API contract testing** for service integration

### Message Queue & Event-Driven Architecture:
- Use **message queues** (RabbitMQ, Apache Kafka, AWS SQS) for async processing
- Implement **event sourcing** for audit trails and state reconstruction
- Apply **CQRS pattern** for read/write separation
- Use **saga pattern** for distributed transactions
- Implement **dead letter queues** for failed message processing
- Apply **message versioning** for backward compatibility
- Use **idempotent message processing** to prevent duplicate operations

### Caching Strategies:
- Implement **multi-level caching** (in-memory, Redis, CDN)
- Use **cache-aside pattern** for database caching
- Apply **write-through caching** for critical data
- Implement **cache invalidation strategies** (TTL, event-based)
- Use **distributed caching** with Redis Cluster
- Apply **cache warming** for frequently accessed data
- Implement **cache monitoring** and hit rate tracking

### Key Conventions:
1. Prioritize **readability, simplicity, and maintainability**.
2. Design for **change**: isolate business logic and minimize framework lock-in.
3. Emphasize clear **boundaries** and **dependency inversion**.
4. Ensure all behavior is **observable, testable, and documented**.
5. **Automate workflows** for testing, building, and deployment.
6. **Enforce quality gates** through automated checks and code review.
7. **Design for scale** with event-driven architecture and caching strategies.