# HIS Direct Login Guide

## 🎯 Tổng Quan

Endpoint này cho phép **login trực tiếp vào HIS system** bằng username/password HIS, sau đó sử dụng HIS token để authenticate cho các API của hệ thống.

## 🚀 Cách Sử Dụng

### 1. Direct Login vào HIS

```bash
curl -X POST "http://localhost:3333/api/v1/his-direct-login/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "vht2",
       "password": "t123456"
     }'
```

**Response:**
```json
{
  "success": true,
  "status_code": 201,
  "data": {
    "message": "Successfully logged in to HIS system",
    "hisToken": {
      "tokenCode": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd...",
      "userLoginName": "vht2",
      "userName": "VŨ HOÀNG THAO",
      "userEmail": "vht2@bachmai.edu.vn",
      "userMobile": "0936226839",
      "userGCode": "0000000001",
      "applicationCode": "HIS",
      "loginTime": "2025-10-08T19:39:20.8494426+07:00",
      "expireTime": "2025-11-07T19:39:20.8494426+07:00",
      "minutesUntilExpire": 43200,
      "roles": [
        {
          "RoleCode": "ADMIN",
          "RoleName": "Administrator"
        }
      ]
    },
    "accessToken": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd...",
    "tokenType": "Bearer",
    "expiresIn": 1555200
  }
}
```

### 2. Sử dụng HIS Token để Call APIs

Sau khi có HIS token, bạn có thể sử dụng nó để call các API của hệ thống:

```bash
# Sử dụng HIS token làm Bearer token
curl -H "Authorization: Bearer <HIS_TOKEN>" \
     http://localhost:3333/api/v1/his-protected/profile
```

**Response:**
```json
{
  "success": true,
  "status_code": 200,
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

### 3. Validate HIS Token

```bash
curl -X POST "http://localhost:3333/api/v1/his-direct-login/validate-token" \
     -H "Content-Type: application/json" \
     -d '{
       "token": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd..."
     }'
```

**Response:**
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "message": "HIS token is valid",
    "user": {
      "loginName": "vht2",
      "userName": "VŨ HOÀNG THAO",
      "email": "vht2@bachmai.edu.vn",
      "mobile": "0936226839",
      "gCode": "0000000001",
      "applicationCode": "HIS",
      "roles": [...]
    },
    "token": {
      "tokenCode": "13a0de0825386d3d228b2fd4e6177bf4f5969f150bcd...",
      "loginTime": "2025-10-08T19:39:20.8494426+07:00",
      "expireTime": "2025-11-07T19:39:20.8494426+07:00",
      "minutesUntilExpire": 43200,
      "isExpired": false,
      "isExpiringSoon": false
    }
  }
}
```

## 📋 API Endpoints

### HIS Direct Login APIs
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/v1/his-direct-login/login` | POST | ❌ No | Direct login với HIS credentials |
| `/api/v1/his-direct-login/validate-token` | POST | ❌ No | Validate HIS token |

### HIS Protected APIs (sử dụng HIS token)
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/v1/his-protected/profile` | GET | ✅ HIS Token | Profile với HIS token |
| `/api/v1/his-protected/data` | GET | ✅ HIS Token | Data với HIS token |
| `/api/v1/his-protected/action` | POST | ✅ HIS Token | Action với HIS token |

## 🔄 Workflow Hoàn Chỉnh

### Bước 1: Direct Login vào HIS
```bash
# Login trực tiếp với HIS credentials
curl -X POST "http://localhost:3333/api/v1/his-direct-login/login" \
     -H "Content-Type: application/json" \
     -d '{"username": "vht2", "password": "t123456"}'
```

### Bước 2: Lưu HIS Token
```javascript
// Lưu token từ response
const hisToken = response.data.accessToken;
```

### Bước 3: Sử dụng HIS Token cho APIs
```bash
# Call các API của hệ thống với HIS token
curl -H "Authorization: Bearer <HIS_TOKEN>" \
     http://localhost:3333/api/v1/his-protected/profile
```

## 🎯 Use Cases

### 1. External System Integration
- External system có HIS credentials
- Muốn integrate với hệ thống mà không cần JWT
- Sử dụng HIS token để authenticate

### 2. Mobile App Integration
- Mobile app login trực tiếp với HIS
- Sử dụng HIS token để call APIs
- Không cần maintain JWT session

### 3. Third-party Integration
- Third-party system có HIS access
- Muốn call APIs của hệ thống
- Sử dụng HIS token làm authentication

## 🔒 Security Features

### HIS Token Authentication
- ✅ HIS token validation
- ✅ Token expiration checking
- ✅ User mapping (HIS user → App user)
- ✅ Role-based access control
- ✅ Automatic token refresh (nếu cần)

### Error Handling
- ✅ Clear error messages
- ✅ Proper HTTP status codes
- ✅ Token validation errors
- ✅ HIS login failures

## 🛠️ Configuration

### Environment Variables
```env
# HIS Integration
HIS_BASE_URL=http://192.168.7.200:1401
HIS_APP_CODE=HIS
HIS_TOKEN_REFRESH_THRESHOLD=5
```

### HIS Credentials
```json
{
  "username": "vht2",
  "password": "t123456"
}
```

## 📝 Examples

### JavaScript/Node.js
```javascript
// 1. Login vào HIS
const loginResponse = await fetch('http://localhost:3333/api/v1/his-direct-login/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'vht2',
    password: 't123456'
  })
});

const loginData = await loginResponse.json();
const hisToken = loginData.data.accessToken;

// 2. Sử dụng HIS token để call APIs
const profileResponse = await fetch('http://localhost:3333/api/v1/his-protected/profile', {
  headers: {
    'Authorization': `Bearer ${hisToken}`
  }
});

const profileData = await profileResponse.json();
console.log(profileData);
```

### Python
```python
import requests

# 1. Login vào HIS
login_response = requests.post(
    'http://localhost:3333/api/v1/his-direct-login/login',
    json={
        'username': 'vht2',
        'password': 't123456'
    }
)

login_data = login_response.json()
his_token = login_data['data']['accessToken']

# 2. Sử dụng HIS token để call APIs
profile_response = requests.get(
    'http://localhost:3333/api/v1/his-protected/profile',
    headers={
        'Authorization': f'Bearer {his_token}'
    }
)

profile_data = profile_response.json()
print(profile_data)
```

### cURL
```bash
# 1. Login vào HIS
HIS_TOKEN=$(curl -s -X POST "http://localhost:3333/api/v1/his-direct-login/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "vht2", "password": "t123456"}' | \
  jq -r '.data.accessToken')

# 2. Sử dụng HIS token để call APIs
curl -H "Authorization: Bearer $HIS_TOKEN" \
     http://localhost:3333/api/v1/his-protected/profile
```

## 🚨 Error Handling

### Login Errors
```json
{
  "success": false,
  "status_code": 401,
  "error": {
    "code": "HTTP_401",
    "message": "HIS login failed: Invalid credentials"
  }
}
```

### Token Validation Errors
```json
{
  "success": false,
  "status_code": 401,
  "error": {
    "code": "HTTP_401",
    "message": "Token validation failed: Invalid HIS token"
  }
}
```

### API Access Errors
```json
{
  "success": false,
  "status_code": 401,
  "error": {
    "code": "HTTP_401",
    "message": "HIS authentication failed: HIS token has expired"
  }
}
```

## 📋 Notes

1. **Token Format**: HIS token sử dụng `Bearer` format giống JWT
2. **Token Expiration**: HIS token có thời hạn (thường 30 ngày)
3. **User Mapping**: HIS user được map với app user thông qua `hisUsername` field
4. **Public Endpoints**: Login và validate endpoints không cần authentication
5. **Security**: HIS token chỉ có thể access các endpoint được mark với `@HisAuth()`
6. **Backward Compatibility**: Existing JWT endpoints vẫn hoạt động bình thường

## 🎉 Kết Luận

Với HIS Direct Login, bạn có thể:
- ✅ Login trực tiếp vào HIS system với credentials
- ✅ Sử dụng HIS token để authenticate cho các API của hệ thống
- ✅ Integrate external systems mà không cần JWT
- ✅ Maintain security với HIS token validation
- ✅ Seamless integration với existing HIS system
