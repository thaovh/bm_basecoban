# HIS Authentication Integration Guide

## 🎯 Tổng Quan

Hệ thống hiện tại hỗ trợ **2 loại authentication**:

1. **JWT Authentication** (mặc định) - Sử dụng JWT token của project
2. **HIS Authentication** - Sử dụng HIS token để authenticate

## 🔧 Cách Sử Dụng

### 1. JWT Authentication (Mặc định)

```typescript
@Controller('api/v1/users')
@UseGuards(DualAuthGuard) // Sử dụng DualAuthGuard
export class UserController {
    @Get('profile')
    // Không cần decorator - mặc định dùng JWT
    async getProfile(@Request() req: any) {
        const user = req.user; // JWT user info
        return user;
    }
}
```

**Request:**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:3333/api/v1/users/profile
```

### 2. HIS Authentication

```typescript
@Controller('api/v1/his-protected')
@UseGuards(DualAuthGuard)
export class HisProtectedController {
    @Get('profile')
    @HisAuth() // Decorator này báo hiệu cần HIS authentication
    async getProfile(@Request() req: any) {
        const user = req.user; // User info + HIS token info
        return {
            user: user.username,
            hisUser: user.hisUsername,
            hisToken: user.hisToken
        };
    }
}
```

**Request:**
```bash
curl -H "Authorization: Bearer <HIS_TOKEN>" \
     http://localhost:3333/api/v1/his-protected/profile
```

## 🚀 Workflow Hoàn Chỉnh

### Bước 1: Login vào hệ thống (JWT)
```bash
curl -X POST "http://localhost:3333/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"usernameOrEmail": "admin", "password": "Admin123!"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### Bước 2: Login vào HIS (sử dụng JWT token)
```bash
curl -X POST "http://localhost:3333/api/v1/his-integration/login" \
     -H "Authorization: Bearer <JWT_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenCode": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd...",
    "userLoginName": "vht2",
    "userName": "VŨ HOÀNG THAO",
    "expireTime": "2025-11-07T19:39:20.8494426+07:00"
  }
}
```

### Bước 3: Sử dụng HIS token để access protected endpoints
```bash
curl -H "Authorization: Bearer <HIS_TOKEN>" \
     http://localhost:3333/api/v1/his-protected/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile accessed using HIS token authentication",
    "user": {
      "id": "45e63f09-6a0d-4a42-b42c-64b096810d92",
      "username": "admin",
      "email": "admin@bachmai.com",
      "role": "admin",
      "hisUsername": "vht2"
    },
    "hisToken": {
      "tokenCode": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd...",
      "userLoginName": "vht2",
      "userName": "VŨ HOÀNG THAO",
      "expireTime": "2025-11-07T19:39:20.8494426+07:00",
      "minutesUntilExpire": 43200
    }
  }
}
```

## 📋 API Endpoints

### HIS Integration APIs
| Endpoint | Method | Auth Type | Description |
|----------|--------|-----------|-------------|
| `/api/v1/his-integration/login` | POST | JWT | Login vào HIS system |
| `/api/v1/his-integration/token` | GET | JWT | Lấy HIS token |
| `/api/v1/his-integration/call-api` | POST | JWT | Gọi HIS APIs |

### HIS Protected APIs
| Endpoint | Method | Auth Type | Description |
|----------|--------|-----------|-------------|
| `/api/v1/his-protected/profile` | GET | HIS | Lấy profile dùng HIS token |
| `/api/v1/his-protected/data` | GET | HIS | Lấy data dùng HIS token |
| `/api/v1/his-protected/action` | POST | HIS | Thực hiện action dùng HIS token |
| `/api/v1/his-protected/jwt-only` | GET | JWT | Endpoint chỉ dùng JWT |

### Regular APIs (JWT)
| Endpoint | Method | Auth Type | Description |
|----------|--------|-----------|-------------|
| `/api/v1/users/*` | * | JWT | User management |
| `/api/v1/provinces/*` | * | JWT | Province management |
| `/api/v1/wards/*` | * | JWT | Ward management |
| `/api/v1/branches/*` | * | JWT | Branch management |

## 🔒 Security Features

### JWT Authentication
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Token expiration handling
- ✅ User session management

### HIS Authentication
- ✅ HIS token validation
- ✅ Automatic token refresh
- ✅ User mapping (HIS user → App user)
- ✅ Token expiration checking
- ✅ Role-based access control

## 🛠️ Configuration

### Environment Variables
```env
# HIS Integration
HIS_BASE_URL=http://192.168.7.200:1401
HIS_APP_CODE=HIS
HIS_TOKEN_REFRESH_THRESHOLD=5

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### User Entity Requirements
Để sử dụng HIS authentication, user cần có:
```typescript
{
  "hisUsername": "vht2",     // HIS username
  "hisPassword": "t123456"   // HIS password
}
```

## 🎯 Use Cases

### 1. Single Sign-On với HIS
- User login vào app → Nhận JWT token
- App tự động login vào HIS → Nhận HIS token
- User có thể dùng HIS token để access các endpoint protected

### 2. HIS API Integration
- Sử dụng HIS token để gọi các HIS APIs
- Automatic token refresh khi cần
- Seamless integration với existing HIS system

### 3. Dual Authentication
- Một số endpoint dùng JWT (internal operations)
- Một số endpoint dùng HIS token (HIS-related operations)
- Flexible authentication strategy

## 🔧 Development

### Thêm HIS Protected Endpoint
```typescript
@Controller('api/v1/my-feature')
@UseGuards(DualAuthGuard)
export class MyFeatureController {
    @Get('his-data')
    @HisAuth() // Sử dụng HIS authentication
    async getHisData(@Request() req: any) {
        const user = req.user;
        // user.hisToken chứa HIS token info
        // user.username chứa app user info
        return { data: 'HIS protected data' };
    }

    @Get('app-data')
    // Không có @HisAuth() - sử dụng JWT authentication
    async getAppData(@Request() req: any) {
        const user = req.user;
        // user chứa JWT user info
        return { data: 'App data' };
    }
}
```

### Testing
```bash
# Test JWT authentication
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:3333/api/v1/users

# Test HIS authentication  
curl -H "Authorization: Bearer <HIS_TOKEN>" \
     http://localhost:3333/api/v1/his-protected/profile
```

## 🚨 Error Handling

### JWT Authentication Errors
- `401 Unauthorized`: Invalid or expired JWT token
- `403 Forbidden`: Insufficient permissions

### HIS Authentication Errors
- `401 Unauthorized`: Invalid or expired HIS token
- `400 Bad Request`: HIS credentials not configured
- `404 Not Found`: User not found for HIS username

## 📝 Notes

1. **Token Format**: Cả JWT và HIS token đều sử dụng `Bearer` format
2. **User Mapping**: HIS user được map với app user thông qua `hisUsername` field
3. **Automatic Refresh**: HIS token được tự động refresh khi sắp hết hạn
4. **Backward Compatibility**: Existing JWT endpoints vẫn hoạt động bình thường
5. **Security**: HIS token chỉ có thể access các endpoint được mark với `@HisAuth()`
