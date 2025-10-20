# Access Control API Documentation

## 📋 Overview

The Access Control module provides integration with external Access Control systems to retrieve attendance events and access control data. This module follows Clean Architecture principles with CQRS pattern and implements Digest Authentication for secure communication with external systems.

## 🏗️ Data Structure

### Attendance Event Response
```typescript
interface AttendanceEventResponse {
  searchID: string;                    // Search identifier
  totalMatches: number;                // Total number of matches found
  responseStatusStrg: string;          // Response status string (e.g., "OK")
  numOfMatches: number;                // Number of matches in current response
  InfoList: AttendanceEventInfo[];     // Array of attendance events
}

interface AttendanceEventInfo {
  major: number;                       // Major event type
  minor: number;                       // Minor event type
  time: string;                        // Event timestamp (ISO format)
  cardNo: string;                      // Card number
  cardType: number;                    // Card type
  name: string;                        // Employee name
  cardReaderNo: number;                // Card reader number
  doorNo: number;                      // Door number
  employeeNoString: string;            // Employee number string
  serialNo: number;                    // Serial number
  userType: string;                    // User type (e.g., "normal")
  currentVerifyMode: string;           // Verification mode
  mask: string;                        // Mask status
  pictureURL: string;                  // Picture URL
  FaceRect: FaceRect;                  // Face rectangle coordinates
  currentAuthenticationTimes: number;  // Current authentication times
  allowAuthenticationTimes: number;    // Allowed authentication times
}

interface FaceRect {
  height: number;                      // Face rectangle height
  width: number;                       // Face rectangle width
  x: number;                          // X coordinate
  y: number;                          // Y coordinate
}
```

## 🔐 Authentication

- **Type**: JWT Bearer Token
- **Required**: Yes (for all endpoints)
- **Header**: `Authorization: Bearer <token>`

## 📡 API Endpoints

### 1. Get Attendance Events

**Endpoint**: `GET /api/v1/access-control/attendance-events`

**Description**: Retrieve attendance/access control events for a specific employee within a time range. Each event includes both a proxy URL for the image and the base64-encoded image data for direct use.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `employeeNoString` | string | Yes | Employee number string | `1844` |
| `startTime` | string | Yes | Start time in ISO format | `2025-10-01T00:00:00+07:00` |
| `endTime` | string | Yes | End time in ISO format | `2025-10-15T23:59:59+07:00` |
| `maxResults` | number | No | Maximum number of results (1-100) | `30` (default) |
| `searchResultPosition` | number | No | Search result position for pagination | `0` (default) |

#### Example Request

```bash
curl -X GET "http://192.168.68.209:3333/api/v1/access-control/attendance-events?employeeNoString=1844&startTime=2025-10-01T00:00:00%2B07:00&endTime=2025-10-15T23:59:59%2B07:00" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "accept: application/json"
```

#### Example Response

```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "searchID": "1",
    "totalMatches": 22,
    "responseStatusStrg": "OK",
    "numOfMatches": 22,
    "InfoList": [
      {
        "major": 5,
        "minor": 75,
        "time": "2025-10-01T07:15:12+07:00",
        "cardNo": "1844",
        "cardType": 1,
        "name": "Vu Hoang Thao",
        "cardReaderNo": 1,
        "doorNo": 1,
        "employeeNoString": "1844",
        "serialNo": 339254,
        "userType": "normal",
        "currentVerifyMode": "faceOrFpOrCardOrPw",
        "mask": "no",
        "pictureURL": "/api/v1/access-control/images/pic%2FacsLinkCap%2F202510_00%2F01_071512_30075_0.jpeg",
        "image": "data:image/jpeg;base64,/9j/4AU+SlBFR+YHUwQAAAAASU5...",
        "FaceRect": {
          "height": 0.069,
          "width": 0.123,
          "x": 0.38,
          "y": 0.462
        },
        "currentAuthenticationTimes": 0,
        "allowAuthenticationTimes": 10
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-15T07:10:43.327Z"
  }
}
```

#### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `pictureURL` | string | Transformed proxy URL for the image | `/api/v1/access-control/images/pic%2FacsLinkCap%2F202510_00%2F01_071512_30075_0.jpeg` |
| `image` | string | Base64 encoded image data (optional) | `data:image/jpeg;base64,/9j/4AU+SlBFR+YHUwQAAAAASU5...` |

**Note**: The `image` field contains the complete base64-encoded image data that can be used directly in web applications without additional API calls. If image fetching fails, this field will be `null` but the `pictureURL` will still be available as a fallback.

## 🔧 Configuration

### Environment Variables

The Access Control module requires the following environment variables:

```bash
# Access Control Configuration
ACCESS_CONTROL_BASE_URL=http://192.168.68.2/ISAPI/AccessControl/AcsEvent
ACCESS_CONTROL_USERNAME=admin
ACCESS_CONTROL_PASSWORD=!Qazxsw2
ACCESS_CONTROL_TIMEOUT=30000
```

### External System Integration

- **Authentication**: Digest Authentication
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Timeout**: 30 seconds (configurable)

## 🛡️ Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Digest Authentication**: Secure communication with external Access Control system
3. **Input Validation**: All parameters are validated using class-validator
4. **Error Handling**: Comprehensive error handling with structured responses
5. **Base64 Image Encoding**: Images are automatically fetched and encoded as base64 for direct use
6. **Fallback Support**: If image fetching fails, proxy URLs are still available as fallback

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "status_code": 200,
  "data": { /* AttendanceEventResponse */ },
  "meta": {
    "timestamp": "2025-10-15T07:10:43.327Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "status_code": 400,
  "error": {
    "code": "HTTP_400",
    "message": "Validation failed",
    "name": "AppError"
  },
  "meta": {
    "timestamp": "2025-10-15T07:10:43.327Z"
  }
}
```

## 🚨 Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `HTTP_400` | Bad request - Invalid parameters |
| 401 | `HTTP_401` | Unauthorized - Invalid JWT token |
| 500 | `HTTP_500` | Access Control system error |

## 🔍 Validation Rules

### Query Parameters
- `employeeNoString`: Required, non-empty string
- `startTime`: Required, valid ISO date string
- `endTime`: Required, valid ISO date string
- `maxResults`: Optional, integer between 1-100 (default: 30)
- `searchResultPosition`: Optional, non-negative integer (default: 0)

## 📝 Usage Examples

### PowerShell Example
```powershell
# Login to get token
$loginBody = @{
    usernameOrEmail = "admin"
    password = "Admin123!"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://192.168.68.209:3333/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.accessToken

# Get attendance events with base64 images
$accessControlResponse = Invoke-WebRequest -Uri "http://192.168.68.209:3333/api/v1/access-control/attendance-events?employeeNoString=1844&startTime=2025-10-01T00:00:00%2B07:00&endTime=2025-10-15T23:59:59%2B07:00" -Method GET -Headers @{"Authorization"="Bearer $token"}
$accessControlData = $accessControlResponse.Content | ConvertFrom-Json

# Use base64 image directly
$firstEvent = $accessControlData.data.InfoList[0]
if ($firstEvent.image) {
    $base64Data = $firstEvent.image.Split(',')[1]
    $imageBytes = [System.Convert]::FromBase64String($base64Data)
    [System.IO.File]::WriteAllBytes("attendance-image.jpg", $imageBytes)
    Write-Host "Image saved from base64 data"
}
```

### JavaScript Example
```javascript
// Login to get token
const loginResponse = await fetch('http://192.168.68.209:3333/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usernameOrEmail: 'admin',
    password: 'Admin123!'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.accessToken;

// Get attendance events
const accessControlResponse = await fetch('http://192.168.68.209:3333/api/v1/access-control/attendance-events?employeeNoString=1844&startTime=2025-10-01T00:00:00%2B07:00&endTime=2025-10-15T23:59:59%2B07:00', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'accept': 'application/json'
  }
});

const accessControlData = await accessControlResponse.json();

// Use base64 image directly
const firstEvent = accessControlData.data.InfoList[0];
if (firstEvent.image) {
    // Display image in HTML img tag
    const imgElement = document.createElement('img');
    imgElement.src = firstEvent.image;
    document.body.appendChild(imgElement);
    
    // Or save to file (Node.js)
    const fs = require('fs');
    const base64Data = firstEvent.image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync('attendance-image.jpg', imageBuffer);
}
```

## 🏗️ Architecture

The Access Control module follows Clean Architecture principles:

- **Domain Layer**: Interfaces and business logic
- **Application Layer**: CQRS commands/queries, DTOs, and handlers
- **Infrastructure Layer**: HTTP client with Digest Authentication
- **Presentation Layer**: REST controller with Swagger documentation

## 🔄 CQRS Implementation

- **Query**: `GetAttendanceEventsQuery`
- **Handler**: `GetAttendanceEventsHandler`
- **Service**: `AccessControlService` (implements `IAccessControlService`)
- **HTTP Client**: `AccessControlHttpClient` (handles Digest Authentication)

## 📚 Related Documentation

- [Authentication API](./auth-api.md)
- [User Management API](./users-api.md)
- [Project Architecture Rules](../rule.md)
