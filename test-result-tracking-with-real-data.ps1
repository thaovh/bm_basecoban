# Test ResultTracking API with Real Data
# This script tests the API after ALTER TABLE is completed

$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing ResultTracking API with Real Data ===" -ForegroundColor Green

# Test 1: Get all result trackings
Write-Host "`n1. Testing GET all result trackings..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?limit=10" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Get all trackings" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Returned: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    
    if ($response.data.data.Count -gt 0) {
        $firstTracking = $response.data.data[0]
        Write-Host "`nFirst tracking details:" -ForegroundColor White
        Write-Host "  - ID: $($firstTracking.id)" -ForegroundColor Gray
        Write-Host "  - Service Request ID: $($firstTracking.serviceRequestId)" -ForegroundColor Gray
        Write-Host "  - Request Room ID: $($firstTracking.requestRoomId)" -ForegroundColor Gray
        Write-Host "  - In Room ID: $($firstTracking.inRoomId)" -ForegroundColor Gray
        Write-Host "  - Sample Type ID: $($firstTracking.sampleTypeId)" -ForegroundColor Gray
        Write-Host "  - Sample Code: $($firstTracking.sampleCode)" -ForegroundColor Gray
        if ($firstTracking.resultStatus) {
            Write-Host "  - Status: $($firstTracking.resultStatus.statusName)" -ForegroundColor Gray
        } else {
            Write-Host "  - Status: N/A" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Filter by requestRoomId
Write-Host "`n2. Testing filter by requestRoomId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?requestRoomId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Filter by requestRoomId" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Filter by inRoomId
Write-Host "`n3. Testing filter by inRoomId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?inRoomId=550e8400-e29b-41d4-a716-446655440001" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Filter by inRoomId" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Filter by sampleTypeId
Write-Host "`n4. Testing filter by sampleTypeId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?sampleTypeId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Filter by sampleTypeId" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Filter by sampleCode
Write-Host "`n5. Testing filter by sampleCode..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?sampleCode=BLD-2024-001" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Filter by sampleCode" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Combined filters
Write-Host "`n6. Testing combined filters..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?requestRoomId=550e8400-e29b-41d4-a716-446655440000&inRoomId=550e8400-e29b-41d4-a716-446655440001&sampleTypeId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Combined filters" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Search functionality
Write-Host "`n7. Testing search functionality..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/search?searchTerm=BLD-2024" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ SUCCESS: Search functionality" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Create a new result tracking
Write-Host "`n8. Testing CREATE new result tracking..." -ForegroundColor Yellow
try {
    $newTracking = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440000"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440000"
        requestRoomId = "550e8400-e29b-41d4-a716-446655440000"
        inRoomId = "550e8400-e29b-41d4-a716-446655440001"
        sampleTypeId = "550e8400-e29b-41d4-a716-446655440000"
        sampleCode = "BLD-2024-TEST-001"
        inTrackingTime = "2024-01-15T10:30:00Z"
        note = "Test tracking with new fields"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $newTracking

    Write-Host "✅ SUCCESS: Created new tracking" -ForegroundColor Green
    Write-Host "New tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.requestRoomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== API Endpoints Summary ===" -ForegroundColor Green
Write-Host "`n📋 Available Filter Parameters:" -ForegroundColor Yellow
Write-Host "• requestRoomId - Request Room ID (phong yeu cau)" -ForegroundColor White
Write-Host "• inRoomId - In Room ID (phong dang xu ly)" -ForegroundColor White
Write-Host "• sampleTypeId - Sample Type ID (loai mau)" -ForegroundColor White
Write-Host "• sampleCode - Sample Code (ma mau)" -ForegroundColor White
Write-Host "• serviceRequestId - Service Request ID" -ForegroundColor White
Write-Host "• resultStatusId - Result Status ID" -ForegroundColor White

Write-Host "`n🔍 Example API Calls:" -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?requestRoomId=uuid-request-room-id" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?inRoomId=uuid-in-room-id" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?sampleTypeId=uuid-sample-type-id" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings?sampleCode=BLD-2024-001" -ForegroundColor Cyan
Write-Host "GET /api/v1/result-trackings/search?searchTerm=BLD-2024" -ForegroundColor Cyan

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
