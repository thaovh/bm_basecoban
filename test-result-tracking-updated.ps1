# Test Updated ResultTracking Module with New Fields
# This script tests the updated ResultTracking module with new fields: IN_ROOM_ID, SAMPLE_TYPE_ID, SAMPLE_CODE

$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing Updated ResultTracking Module ===" -ForegroundColor Green

# Test data with new fields
$testData = @{
    serviceRequestId = "550e8400-e29b-41d4-a716-446655440000"
    resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
    roomId = "550e8400-e29b-41d4-a716-446655440000"  # Request Room ID
    inRoomId = "550e8400-e29b-41d4-a716-446655440001"  # In Room ID
    sampleTypeId = "550e8400-e29b-41d4-a716-446655440000"  # Sample Type ID
    sampleCode = "BLD-2024-001"  # Sample Code
    note = "Testing with new fields: IN_ROOM_ID, SAMPLE_TYPE_ID, SAMPLE_CODE"
} | ConvertTo-Json

Write-Host "`n1. Testing Create ResultTracking with New Fields..." -ForegroundColor Yellow
Write-Host "Request Data:" -ForegroundColor Cyan
Write-Host $testData -ForegroundColor White

try {
    $response = Invoke-RestMethod -Uri "$baseUrl" -Method POST -Body $testData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Create ResultTracking successful!" -ForegroundColor Green
    Write-Host "`n=== Response Data ===" -ForegroundColor Yellow
    Write-Host "ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Status ID: $($response.data.resultStatusId)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
    Write-Host "Note: $($response.data.note)" -ForegroundColor Cyan
    
    $trackingId = $response.data.id
    
} catch {
    Write-Host "❌ Create ResultTracking failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing Get ResultTracking by ID..." -ForegroundColor Yellow

if ($trackingId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$trackingId" -Method GET -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Get ResultTracking successful!" -ForegroundColor Green
        Write-Host "`n=== Updated Fields ===" -ForegroundColor Yellow
        Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
        Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
        Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
        Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get ResultTracking failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Update ResultTracking with New Fields..." -ForegroundColor Yellow

if ($trackingId) {
    $updateData = @{
        inRoomId = "550e8400-e29b-41d4-a716-446655440002"  # Updated In Room ID
        sampleTypeId = "550e8400-e29b-41d4-a716-446655440001"  # Updated Sample Type ID
        sampleCode = "BLD-2024-002"  # Updated Sample Code
        note = "Updated with new room and sample information"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$trackingId" -Method PUT -Body $updateData -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Update ResultTracking successful!" -ForegroundColor Green
        Write-Host "`n=== Updated Fields ===" -ForegroundColor Yellow
        Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
        Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
        Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
        Write-Host "Note: $($response.data.note)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Update ResultTracking failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n4. Testing Check-in with New Fields..." -ForegroundColor Yellow

$checkInData = @{
    serviceRequestId = "550e8400-e29b-41d4-a716-446655440000"
    resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
    roomId = "550e8400-e29b-41d4-a716-446655440000"  # Request Room ID
    inRoomId = "550e8400-e29b-41d4-a716-446655440001"  # In Room ID
    sampleTypeId = "550e8400-e29b-41d4-a716-446655440000"  # Sample Type ID
    sampleCode = "BLD-2024-003"  # Sample Code
    note = "Check-in with new fields"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Body $checkInData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Check-in successful!" -ForegroundColor Green
    Write-Host "`n=== Check-in Data ===" -ForegroundColor Yellow
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
    Write-Host "In Tracking Time: $($response.data.inTrackingTime)" -ForegroundColor Cyan
    
    $checkInId = $response.data.id
    
} catch {
    Write-Host "❌ Check-in failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Get All ResultTrackings with Filters..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl?limit=5" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get All ResultTrackings successful!" -ForegroundColor Green
    Write-Host "Total Count: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "`n=== Sample Results ===" -ForegroundColor Yellow
    
    foreach ($tracking in $response.data.data[0..2]) {
        Write-Host "  - ID: $($tracking.id)" -ForegroundColor White
        Write-Host "    Request Room: $($tracking.roomId)" -ForegroundColor White
        Write-Host "    In Room: $($tracking.inRoomId)" -ForegroundColor White
        Write-Host "    Sample Type: $($tracking.sampleTypeId)" -ForegroundColor White
        Write-Host "    Sample Code: $($tracking.sampleCode)" -ForegroundColor White
        Write-Host "    Status: $($tracking.getStatus())" -ForegroundColor White
        Write-Host ""
    }
    
} catch {
    Write-Host "❌ Get All ResultTrackings failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6. Testing Search by Sample Code..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/search?searchTerm=BLD-2024" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Search by Sample Code successful!" -ForegroundColor Green
    Write-Host "Search Results Count: $($response.data.total)" -ForegroundColor Cyan
    
    foreach ($tracking in $response.data.data) {
        Write-Host "  - Sample Code: $($tracking.sampleCode)" -ForegroundColor White
        Write-Host "    In Room: $($tracking.inRoomId)" -ForegroundColor White
        Write-Host "    Sample Type: $($tracking.sampleTypeId)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Search by Sample Code failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Updated ResultTracking Module Test Completed ===" -ForegroundColor Green
Write-Host "Summary of New Fields:" -ForegroundColor Yellow
Write-Host "- ROOM_ID: Request Room ID (phòng yêu cầu)" -ForegroundColor White
Write-Host "- IN_ROOM_ID: In Room ID (phòng đang xử lý)" -ForegroundColor White
Write-Host "- SAMPLE_TYPE_ID: Sample Type ID (loại mẫu)" -ForegroundColor White
Write-Host "- SAMPLE_CODE: Sample Code (mã mẫu)" -ForegroundColor White
Write-Host "- Enhanced tracking capabilities" -ForegroundColor White
Write-Host "- Better sample management" -ForegroundColor White
