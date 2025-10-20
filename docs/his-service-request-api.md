# HIS Service Request API Documentation

## 📋 Overview

The HIS Service Request API provides access to service request information from the HIS (Hospital Information System) database. This module allows retrieving detailed service request information including patient details, treatment information, and associated services.

## 🔐 Authentication

- **Required**: Yes (for all endpoints)
- **Header**: `Authorization: Bearer <token>`

## 📡 API Endpoints

### 1. Get Service Request by Code

**Endpoint**: `GET /api/v1/his/service-requests/:serviceReqCode`

**Description**: Retrieve service request information from HIS database including patient details and services.

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `serviceReqCode` | string | Yes | Service request code | `000054090874` |

#### Example Request

```bash
curl -X GET "http://192.168.68.209:3333/api/v1/his/service-requests/000054090874" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "accept: application/json"
```

#### Example Response

**Success Response (200)**:
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "serviceRequest": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "serviceReqCode": "000054090874",
      "serviceReqSttId": "1",
      "serviceReqSttCode": "APPROVED",
      "serviceReqTypeId": "2",
      "serviceReqTypeCode": "LAB",
      "instructionTime": "2025-10-15T08:30:00+07:00",
      "instructionDate": "2025-10-15",
      "icdCode": "Z00.00",
      "icdName": "General adult medical examination without abnormal findings",
      "icdSubCode": "Z00",
      "icdText": "Routine medical examination",
      "treatmentId": "456e7890-e89b-12d3-a456-426614174002",
      "treatmentCode": "TREAT001",
      "patient": {
        "id": "789e0123-e89b-12d3-a456-426614174003",
        "code": "P001234",
        "name": "Nguyen Van A",
        "dob": "1985-05-15",
        "address": "123 Le Loi, Ho Chi Minh City",
        "genderId": "1",
        "genderName": "Male",
        "careerName": "Engineer"
      },
      "services": [
        {
          "hisSereServId": "abc12345-e89b-12d3-a456-426614174004",
          "serviceId": "def67890-e89b-12d3-a456-426614174005",
          "serviceCode": "LAB001",
          "serviceName": "Complete Blood Count",
          "price": 150000
        },
        {
          "hisSereServId": "ghi90123-e89b-12d3-a456-426614174006",
          "serviceId": "jkl45678-e89b-12d3-a456-426614174007",
          "serviceCode": "LAB002",
          "serviceName": "Blood Glucose Test",
          "price": 80000
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2025-10-15T10:30:00.000Z"
  }
}
```

#### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `serviceRequest.id` | string | Service request ID | `123e4567-e89b-12d3-a456-426614174001` |
| `serviceRequest.serviceReqCode` | string | Service request code | `000054090874` |
| `serviceRequest.serviceReqSttCode` | string | Service request status code | `APPROVED` |
| `serviceRequest.serviceReqTypeCode` | string | Service request type code | `LAB` |
| `serviceRequest.instructionTime` | string | Instruction time (ISO format) | `2025-10-15T08:30:00+07:00` |
| `serviceRequest.instructionDate` | string | Instruction date | `2025-10-15` |
| `serviceRequest.icdCode` | string | ICD code | `Z00.00` |
| `serviceRequest.icdName` | string | ICD name | `General adult medical examination` |
| `serviceRequest.treatmentCode` | string | Treatment code | `TREAT001` |
| `serviceRequest.patient` | object | Patient information | See Patient Object below |
| `serviceRequest.services` | array | List of services | See Service Object below |

#### Patient Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Patient ID | `789e0123-e89b-12d3-a456-426614174003` |
| `code` | string | Patient code | `P001234` |
| `name` | string | Patient name | `Nguyen Van A` |
| `dob` | string | Date of birth | `1985-05-15` |
| `address` | string | Patient address | `123 Le Loi, Ho Chi Minh City` |
| `genderId` | string | Gender ID | `1` |
| `genderName` | string | Gender name | `Male` |
| `careerName` | string | Career name | `Engineer` |

#### Service Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `hisSereServId` | string | HIS service ID | `abc12345-e89b-12d3-a456-426614174004` |
| `serviceId` | string | Service ID | `def67890-e89b-12d3-a456-426614174005` |
| `serviceCode` | string | Service code | `LAB001` |
| `serviceName` | string | Service name | `Complete Blood Count` |
| `price` | number | Service price | `150000` |

**Error Response (404)**:
```json
{
  "success": false,
  "status_code": 404,
  "error": {
    "code": "SERVICE_REQUEST_NOT_FOUND",
    "message": "Service request not found",
    "name": "AppError"
  },
  "meta": {
    "timestamp": "2025-10-15T10:30:00.000Z"
  }
}
```

**Error Response (500)**:
```json
{
  "success": false,
  "status_code": 500,
  "error": {
    "code": "SERVICE_REQUEST_RETRIEVAL_ERROR",
    "message": "Failed to retrieve service request",
    "name": "AppError"
  },
  "meta": {
    "timestamp": "2025-10-15T10:30:00.000Z"
  }
}
```

## 🔧 Configuration

### Environment Variables

The HIS Service Request module requires the following environment variables:

```bash
# HIS Database Configuration (Oracle 12c)
HIS_DATABASE_HOST=192.168.7.248
HIS_DATABASE_PORT=1521
HIS_DATABASE_USERNAME=HIS_USER
HIS_DATABASE_PASSWORD=HIS_PASSWORD
HIS_DATABASE_SERVICE_NAME=orclstb
HIS_DATABASE_SID=orclstb
```

### Database Connection

- **Database Type**: Oracle 12c
- **Connection**: Direct connection to HIS database
- **Read-Only**: Yes (only SELECT operations)
- **Timeout**: 30 seconds (configurable)

## 🛡️ Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Read-Only Access**: Only SELECT operations on HIS database
3. **Input Validation**: All parameters are validated using class-validator
4. **Error Handling**: Comprehensive error handling with structured responses
5. **Database Isolation**: Separate connection to HIS database

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "serviceRequest": {
      // Service request data
    }
  },
  "meta": {
    "timestamp": "2025-10-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "status_code": 404,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "name": "AppError"
  },
  "meta": {
    "timestamp": "2025-10-15T10:30:00.000Z"
  }
}
```

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

# Get service request
$serviceRequestResponse = Invoke-WebRequest -Uri "http://192.168.68.209:3333/api/v1/his/service-requests/000054090874" -Method GET -Headers @{"Authorization"="Bearer $token"}
$serviceRequestData = $serviceRequestResponse.Content | ConvertFrom-Json

# Display service request information
$serviceRequest = $serviceRequestData.data.serviceRequest
Write-Host "Service Request Code: $($serviceRequest.serviceReqCode)"
Write-Host "Patient Name: $($serviceRequest.patient.name)"
Write-Host "Total Services: $($serviceRequest.services.Count)"
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

// Get service request
const serviceRequestResponse = await fetch('http://192.168.68.209:3333/api/v1/his/service-requests/000054090874', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'accept': 'application/json'
  }
});

const serviceRequestData = await serviceRequestResponse.json();

// Display service request information
const serviceRequest = serviceRequestData.data.serviceRequest;
console.log('Service Request Code:', serviceRequest.serviceReqCode);
console.log('Patient Name:', serviceRequest.patient.name);
console.log('Total Services:', serviceRequest.services.length);
```

## 🏗️ Architecture

The HIS Service Request module follows Clean Architecture principles:

### Domain Layer
- **Interfaces**: Define contracts for data access and business logic
- **Entities**: Core business objects (ServiceRequest, Patient, Service)

### Application Layer
- **Queries**: CQRS query objects for data retrieval
- **Handlers**: Business logic for processing queries
- **DTOs**: Data transfer objects for API communication

### Infrastructure Layer
- **Repository**: Database access implementation
- **Database**: Oracle database connection and queries

### Presentation Layer
- **Controller**: HTTP endpoint handlers
- **Swagger**: API documentation

## 🔍 Database Schema

The module queries the following HIS database tables:

### V_HIS_SERVICE_REQ (View)
- Service request information
- Patient information (denormalized)
- Treatment information

### HIS_SERE_SERV (Table)
- Service details for each service request
- Service pricing information

## ⚠️ Important Notes

1. **Database Access**: This module provides read-only access to HIS database
2. **Performance**: Queries are optimized for single service request retrieval
3. **Data Freshness**: Data is retrieved in real-time from HIS database
4. **Error Handling**: Database connection errors are properly handled
5. **Security**: All database queries use parameterized statements to prevent SQL injection

## 🚀 Future Enhancements

1. **Caching**: Implement Redis caching for frequently accessed service requests
2. **Pagination**: Add pagination support for service lists
3. **Filtering**: Add filtering options for services by type or status
4. **Bulk Operations**: Support for retrieving multiple service requests
5. **Real-time Updates**: WebSocket support for real-time service request updates
