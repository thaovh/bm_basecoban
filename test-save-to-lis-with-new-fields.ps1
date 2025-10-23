# Test Save-to-LIS Endpoint with New Fields
$baseUrl = "http://localhost:3333/api/v1/service-requests"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Test Save-to-LIS with New Fields ===" -ForegroundColor Green

# Real UUIDs from database
$realRoomId = "550e8400-e29b-41d4-a716-446655440002"  # From BMM_ROOMS
$realSampleTypeId = "c71aaddd-3766-426e-961b-cafdaf5b00b7"  # From BMM_SAMPLE_TYPES
$realResultStatusId = "d31cb0e9-15ae-4f1a-accf-e57a3cf58ff7"  # From BMM_RESULT_STATUSES

# Test 1: Basic save-to-lis (minimal fields)
Write-Host "`n1. Testing basic save-to-lis..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000054090874"
        roomId = $realRoomId
        statusId = $realResultStatusId
        note = "Basic save to LIS test"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Basic save-to-lis" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Tracking ID: $($response.data.resultTrackingId)" -ForegroundColor Cyan
    Write-Host "Service Req Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Save-to-lis with inRoomId
Write-Host "`n2. Testing save-to-lis with inRoomId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000054090875"
        roomId = $realRoomId
        statusId = $realResultStatusId
        inRoomId = $realRoomId  # Using same room for simplicity
        note = "Save to LIS with in room"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Save-to-lis with inRoomId" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.tracking.inRoomId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Save-to-lis with sampleTypeId
Write-Host "`n3. Testing save-to-lis with sampleTypeId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000054090876"
        roomId = $realRoomId
        statusId = $realResultStatusId
        sampleTypeId = $realSampleTypeId
        note = "Save to LIS with sample type"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Save-to-lis with sampleTypeId" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.tracking.sampleTypeId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Save-to-lis with sampleCode
Write-Host "`n4. Testing save-to-lis with sampleCode..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000054090877"
        roomId = $realRoomId
        statusId = $realResultStatusId
        sampleCode = "BLD-2024-SAVE-001"
        note = "Save to LIS with sample code"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Save-to-lis with sampleCode" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.tracking.sampleCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Save-to-lis with all new fields
Write-Host "`n5. Testing save-to-lis with all new fields..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000054090878"
        roomId = $realRoomId
        statusId = $realResultStatusId
        inRoomId = $realRoomId
        sampleTypeId = $realSampleTypeId
        sampleCode = "BLD-2024-FULL-001"
        note = "Save to LIS with all new fields"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Save-to-lis with all fields" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Tracking ID: $($response.data.resultTrackingId)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.tracking.roomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.tracking.inRoomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.tracking.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.tracking.sampleCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Save-to-LIS Summary ===" -ForegroundColor Green
Write-Host "`n📋 Required Fields:" -ForegroundColor Yellow
Write-Host "• serviceReqCode - Service Request Code from HIS" -ForegroundColor White
Write-Host "• roomId - Request Room ID" -ForegroundColor White
Write-Host "• statusId - Result Status ID" -ForegroundColor White

Write-Host "`n📋 New Optional Fields:" -ForegroundColor Yellow
Write-Host "• inRoomId - In Room ID (phong dang xu ly)" -ForegroundColor White
Write-Host "• sampleTypeId - Sample Type ID (loai mau)" -ForegroundColor White
Write-Host "• sampleCode - Sample Code (ma mau)" -ForegroundColor White
Write-Host "• note - Note (ghi chu)" -ForegroundColor White

Write-Host "`n🔍 Example API Call:" -ForegroundColor Yellow
Write-Host "POST /api/v1/service-requests/save-to-lis" -ForegroundColor Cyan
Write-Host "Content-Type: application/json" -ForegroundColor Cyan
Write-Host "Authorization: Bearer {token}" -ForegroundColor Cyan

Write-Host "`n📝 Request Body Example:" -ForegroundColor Yellow
Write-Host '{"serviceReqCode": "000054090874", "roomId": "uuid", "statusId": "uuid", "inRoomId": "uuid", "sampleTypeId": "uuid", "sampleCode": "BLD-2024-001", "note": "Start processing"}' -ForegroundColor Gray

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
