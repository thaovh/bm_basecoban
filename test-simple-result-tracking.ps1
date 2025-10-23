# Simple test for ResultTracking API
$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Simple ResultTracking API Test ===" -ForegroundColor Green

# Test 1: Basic GET request
Write-Host "`n1. Testing basic GET request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?limit=5" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "SUCCESS: Get all trackings" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Filter by requestRoomId
Write-Host "`n2. Testing filter by requestRoomId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?requestRoomId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "SUCCESS: Filter by requestRoomId" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Filter by inRoomId
Write-Host "`n3. Testing filter by inRoomId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?inRoomId=550e8400-e29b-41d4-a716-446655440001" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "SUCCESS: Filter by inRoomId" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== API Endpoints ===" -ForegroundColor Green
Write-Host "GET /api/v1/result-trackings?requestRoomId=uuid" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?inRoomId=uuid" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?sampleTypeId=uuid" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?sampleCode=BLD-2024-001" -ForegroundColor Cyan

Write-Host "`nTest completed!" -ForegroundColor Green
