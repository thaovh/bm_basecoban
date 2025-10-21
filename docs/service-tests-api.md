# Service Test API

## 📝 Overview
The Service Test module provides endpoints to manage service tests in the Laboratory Information System (LIS). Service tests are specific laboratory tests that belong to a service and have defined ranges, units of measure, and mapping information.

## 🔐 Authentication
All endpoints in this module require JWT authentication.
- **Required**: Yes (for all endpoints)
- **Header**: `Authorization: Bearer <token>`

## 📡 API Endpoints

### 1. Create Service Test

**Endpoint**: `POST /api/v1/service-tests`

**Description**: Create a new service test with the provided information.

#### Request Body

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `testCode` | string | Yes | Mã xét nghiệm | `TEST_001` |
| `testName` | string | Yes | Tên xét nghiệm | `Xét nghiệm máu tổng quát` |
| `shortName` | string | Yes | Tên viết tắt | `XN Máu TQ` |
| `serviceId` | string | Yes | ID dịch vụ | `uuid-service-id` |
| `unitOfMeasureId` | string | Yes | ID đơn vị tính | `uuid-unit-of-measure-id` |
| `rangeText` | string | No | Mô tả khoảng giá trị | `Bình thường: 3.5-5.5 g/dL` |
| `rangeLow` | number | No | Giá trị thấp nhất | `3.5` |
| `rangeHigh` | number | No | Giá trị cao nhất | `5.5` |
| `mapping` | string | No | Thông tin mapping (JSON) | `{"hisCode": "TEST001"}` |
| `testOrder` | number | No | Thứ tự sắp xếp | `1` |
| `isActiveFlag` | number | No | Trạng thái hoạt động | `1` |

#### Example Request

```bash
curl -X POST "http://192.168.68.209:3333/api/v1/service-tests" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "testCode": "TEST_001",
    "testName": "Xét nghiệm máu tổng quát",
    "shortName": "XN Máu TQ",
    "serviceId": "123e4567-e89b-12d3-a456-426614174001",
    "unitOfMeasureId": "123e4567-e89b-12d3-a456-426614174002",
    "rangeText": "Bình thường: 3.5-5.5 g/dL",
    "rangeLow": 3.5,
    "rangeHigh": 5.5,
    "mapping": "{\"hisCode\": \"TEST001\", \"externalSystem\": \"LIS\"}",
    "testOrder": 1,
    "isActiveFlag": 1
  }'
```

#### Example Response

```json
{
  "success": true,
  "status_code": 201,
  "data": {
    "id": "uuid-service-test-id",
    "testCode": "TEST_001",
    "testName": "Xét nghiệm máu tổng quát",
    "shortName": "XN Máu TQ",
    "serviceId": "123e4567-e89b-12d3-a456-426614174001",
    "unitOfMeasureId": "123e4567-e89b-12d3-a456-426614174002",
    "rangeText": "Bình thường: 3.5-5.5 g/dL",
    "rangeLow": 3.5,
    "rangeHigh": 5.5,
    "mapping": "{\"hisCode\": \"TEST001\", \"externalSystem\": \"LIS\"}",
    "testOrder": 1,
    "isActiveFlag": 1,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Service Tests

**Endpoint**: `GET /api/v1/service-tests`

**Description**: Retrieve a list of service tests with pagination and filtering options.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `limit` | number | No | Số lượng bản ghi trả về | `10` |
| `offset` | number | No | Vị trí bắt đầu | `0` |
| `search` | string | No | Tìm kiếm theo tên xét nghiệm | `máu` |
| `serviceId` | string | No | Lọc theo ID dịch vụ | `uuid-service-id` |
| `unitOfMeasureId` | string | No | Lọc theo ID đơn vị tính | `uuid-unit-of-measure-id` |
| `isActiveFlag` | number | No | Lọc theo trạng thái hoạt động | `1` |

#### Example Request

```bash
curl -X GET "http://192.168.68.209:3333/api/v1/service-tests?limit=10&offset=0&serviceId=123e4567-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response

```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "serviceTests": [
      {
        "id": "uuid-service-test-id",
        "testCode": "TEST_001",
        "testName": "Xét nghiệm máu tổng quát",
        "shortName": "XN Máu TQ",
        "serviceId": "123e4567-e89b-12d3-a456-426614174001",
        "serviceName": "Dien giai do (Na, K, Cl)",
        "serviceCode": "LAB_001",
        "unitOfMeasureId": "123e4567-e89b-12d3-a456-426614174002",
        "unitOfMeasureName": "Lan",
        "rangeText": "Bình thường: 3.5-5.5 g/dL",
        "rangeLow": 3.5,
        "rangeHigh": 5.5,
        "mapping": "{\"hisCode\": \"TEST001\", \"externalSystem\": \"LIS\"}",
        "testOrder": 1,
        "isActiveFlag": 1,
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### 3. Get Service Test by ID

**Endpoint**: `GET /api/v1/service-tests/:id`

**Description**: Retrieve a specific service test by its ID.

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes | Service test ID | `uuid-service-test-id` |

#### Example Request

```bash
curl -X GET "http://192.168.68.209:3333/api/v1/service-tests/uuid-service-test-id" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response

```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "id": "uuid-service-test-id",
    "testCode": "TEST_001",
    "testName": "Xét nghiệm máu tổng quát",
    "shortName": "XN Máu TQ",
    "serviceId": "123e4567-e89b-12d3-a456-426614174001",
    "serviceName": "Dien giai do (Na, K, Cl)",
    "serviceCode": "LAB_001",
    "unitOfMeasureId": "123e4567-e89b-12d3-a456-426614174002",
    "unitOfMeasureName": "Lan",
    "rangeText": "Bình thường: 3.5-5.5 g/dL",
    "rangeLow": 3.5,
    "rangeHigh": 5.5,
    "mapping": "{\"hisCode\": \"TEST001\", \"externalSystem\": \"LIS\"}",
    "testOrder": 1,
    "isActiveFlag": 1,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Service Test

**Endpoint**: `PUT /api/v1/service-tests/:id`

**Description**: Update an existing service test with the provided information.

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes | Service test ID | `uuid-service-test-id` |

#### Request Body

All fields are optional for update operations.

#### Example Request

```bash
curl -X PUT "http://192.168.68.209:3333/api/v1/service-tests/uuid-service-test-id" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "testName": "Xét nghiệm máu tổng quát (Updated)",
    "rangeText": "Bình thường: 3.0-6.0 g/dL",
    "rangeLow": 3.0,
    "rangeHigh": 6.0,
    "testOrder": 2
  }'
```

#### Example Response

```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "id": "uuid-service-test-id",
    "testCode": "TEST_001",
    "testName": "Xét nghiệm máu tổng quát (Updated)",
    "shortName": "XN Máu TQ",
    "serviceId": "123e4567-e89b-12d3-a456-426614174001",
    "unitOfMeasureId": "123e4567-e89b-12d3-a456-426614174002",
    "rangeText": "Bình thường: 3.0-6.0 g/dL",
    "rangeLow": 3.0,
    "rangeHigh": 6.0,
    "mapping": "{\"hisCode\": \"TEST001\", \"externalSystem\": \"LIS\"}",
    "testOrder": 2,
    "isActiveFlag": 1,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:35:00.000Z"
  }
}
```

### 5. Delete Service Test

**Endpoint**: `DELETE /api/v1/service-tests/:id`

**Description**: Soft delete a service test by its ID.

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes | Service test ID | `uuid-service-test-id` |

#### Example Request

```bash
curl -X DELETE "http://192.168.68.209:3333/api/v1/service-tests/uuid-service-test-id" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Example Response

```json
{
  "success": true,
  "status_code": 200,
  "data": "Service test deleted successfully"
}
```

## 🛡️ Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Input Validation**: All parameters are validated using class-validator
3. **Error Handling**: Comprehensive error handling with structured responses
4. **Soft Delete**: Service tests are soft deleted, not permanently removed
5. **Foreign Key Constraints**: Proper relationships with Services and Unit of Measures

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "status_code": 200,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "status_code": 400,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## 🔗 Relationships

### Service Test → Service
- **Relationship**: Many-to-One
- **Foreign Key**: `serviceId`
- **Description**: Each service test belongs to one service
- **Business Rule**: One service can have multiple service tests

### Service Test → Unit of Measure
- **Relationship**: Many-to-One
- **Foreign Key**: `unitOfMeasureId`
- **Description**: Each service test has one unit of measure
- **Business Rule**: Multiple service tests can share the same unit of measure

## 📋 Business Rules

1. **Unique Test Code**: Each service test must have a unique test code
2. **Required Fields**: `testCode`, `testName`, `shortName`, `serviceId`, and `unitOfMeasureId` are required
3. **Range Validation**: If `rangeLow` and `rangeHigh` are provided, `rangeLow` should be less than `rangeHigh`
4. **Active Status**: Service tests can be activated/deactivated using `isActiveFlag`
5. **Ordering**: Service tests can be ordered using `testOrder` field
6. **Mapping**: Service tests can be mapped to external systems using the `mapping` field

## 🚀 Usage Examples

### Create a Complete Service Test
```bash
curl -X POST "http://192.168.68.209:3333/api/v1/service-tests" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "testCode": "GLUCOSE_001",
    "testName": "Xét nghiệm đường huyết",
    "shortName": "XN Đường huyết",
    "serviceId": "service-id",
    "unitOfMeasureId": "uom-id",
    "rangeText": "Bình thường: 70-100 mg/dL",
    "rangeLow": 70,
    "rangeHigh": 100,
    "mapping": "{\"hisCode\": \"GLUCOSE\", \"externalSystem\": \"HIS\"}",
    "testOrder": 1,
    "isActiveFlag": 1
  }'
```

### Get Service Tests for a Specific Service
```bash
curl -X GET "http://192.168.68.209:3333/api/v1/service-tests?serviceId=service-id&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Search Service Tests by Name
```bash
curl -X GET "http://192.168.68.209:3333/api/v1/service-tests?search=máu&limit=10" \
  -H "Authorization: Bearer <token>"
```

## 📝 Notes

- Service tests are designed to be specific laboratory tests within a service
- The `mapping` field allows integration with external systems like HIS
- Range values (`rangeLow`, `rangeHigh`) are used for result interpretation
- The `testOrder` field helps in organizing tests within a service
- All timestamps are in ISO 8601 format with UTC timezone
