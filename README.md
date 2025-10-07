# Bach Mai LIS Management System

Laboratory Information System for Bach Mai Hospital - Built with NestJS, TypeScript, TypeORM, and CQRS.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with **CQRS** pattern:

- **Domain Layer**: Entities and business logic
- **Application Layer**: Use cases (Commands & Queries)
- **Infrastructure Layer**: Database, external services
- **Interface Adapters**: Controllers, DTOs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Oracle Database 12c
- Docker & Docker Compose
- Kong API Gateway

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd bach-mai-lis-management-system
npm install
```

2. **Environment setup:**
```bash
cp env.example .env
# Edit .env with your database credentials
```

3. **Database setup:**
```bash
# Ensure Oracle database is running on 192.168.7.248:1521
# Service: orclstb, Username: LIS_RS, Password: LIS_RS
```

4. **Run with Docker:**
```bash
docker-compose up -d
```

5. **Or run locally:**
```bash
npm run start:dev
```

## 📁 Project Structure

```
src/
├── app.module.ts                   # Root module
├── main.ts                         # Application entry point
├── common/                         # Shared utilities
│   ├── dtos/                       # Base DTOs and response structures
│   ├── filters/                    # Exception filters
│   ├── interceptors/               # Request/response interceptors
│   ├── guards/                     # Authentication guards
│   └── decorators/                 # Custom decorators
├── modules/                        # Feature modules
│   ├── user/                       # User management
│   │   ├── domain/                 # User entity and interfaces
│   │   ├── application/            # CQRS commands and queries
│   │   │   ├── commands/           # Write operations
│   │   │   └── queries/            # Read operations
│   │   ├── infrastructure/         # Database repositories
│   │   ├── user.controller.ts      # HTTP endpoints
│   │   └── user.module.ts          # Module configuration
│   └── auth/                       # Authentication
│       ├── application/            # Login/logout commands
│       ├── auth.controller.ts      # Auth endpoints
│       └── auth.module.ts          # Auth module
└── infrastructure/                 # Infrastructure layer
    ├── database/                   # Database configuration
    └── config/                     # Application configuration
```

## 🗄️ Database Schema

### BMM_USERS Table
- **ID**: UUID primary key
- **USERNAME**: Unique username
- **EMAIL**: Unique email address
- **PASSWORD_HASH**: Bcrypt hashed password
- **FIRST_NAME**: User's first name
- **LAST_NAME**: User's last name
- **PHONE_NUMBER**: Optional phone number
- **DATE_OF_BIRTH**: Optional date of birth
- **ADDRESS**: Optional address
- **ROLE**: User role (admin/user)
- **IS_ACTIVE**: Account status
- **LAST_LOGIN_AT**: Last login timestamp
- **CREATED_AT**: Creation timestamp
- **UPDATED_AT**: Last update timestamp
- **DELETED_AT**: Soft delete timestamp
- **CREATED_BY**: Creator user ID
- **UPDATED_BY**: Last updater user ID
- **VERSION**: Optimistic locking version

## 🔐 Authentication & Authorization

### Kong Gateway Integration
- **Public Endpoints**: `/KONGAPI/api/v1/auth/login`, `/KONGAPI/api/v1/health`
- **Protected Endpoints**: `/KONGAPI/api/v1/users/*` (JWT required)
- **Admin Endpoints**: `/KONGAPI/api/v1/admin/*` (Admin role required)

### JWT Configuration
- **Access Token**: 24 hours expiry
- **Refresh Token**: 7 days expiry
- **Algorithm**: HS256

## 📚 API Documentation

### Swagger UI
- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost/api/docs

### Key Endpoints

#### Authentication
```bash
# Login
POST /KONGAPI/api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Logout
POST /KONGAPI/api/v1/auth/logout
Authorization: Bearer <token>
```

#### User Management
```bash
# Create User
POST /KONGAPI/api/v1/users
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

# Get Users
GET /KONGAPI/api/v1/users?limit=10&offset=0&search=john

# Get User by ID
GET /KONGAPI/api/v1/users/{id}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Services
- **API**: http://localhost:3000
- **Kong Gateway**: http://localhost:8000
- **Kong Admin**: http://localhost:8001
- **Nginx**: http://localhost:80
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_HOST=192.168.7.248
DATABASE_PORT=1521
DATABASE_USERNAME=LIS_RS
DATABASE_PASSWORD=LIS_RS
DATABASE_SERVICE_NAME=orclstb

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Kong
KONG_GATEWAY_URL=http://localhost:8000
KONG_API_PREFIX=KONGAPI
```

## 📊 Monitoring

### Health Checks
- **Application**: `/api/v1/health`
- **Readiness**: `/api/v1/ready`
- **Liveness**: `/api/v1/live`

### Metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## 🚀 Development

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- src/migrations/CreateUserTable

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 📋 TODO

- [ ] Implement refresh token logic
- [ ] Add user profile management
- [ ] Implement role-based permissions
- [ ] Add audit logging
- [ ] Implement email notifications
- [ ] Add file upload functionality
- [ ] Implement caching with Redis
- [ ] Add comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🏥 Bach Mai Hospital

**Bach Mai LIS Management System** - Laboratory Information System for Bach Mai Hospital, Vietnam.

---

**Built with ❤️ for Bach Mai Hospital**
