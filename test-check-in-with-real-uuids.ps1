# Test Check-In with Real UUIDs from Database
$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Test Check-In with Real UUIDs ===" -ForegroundColor Green

# Real UUIDs from database
$realRoomId = "550e8400-e29b-41d4-a716-446655440002"  # From BMM_ROOMS
$realSampleTypeId = "c71aaddd-3766-426e-961b-cafdaf5b00b7"  # From BMM_SAMPLE_TYPES
$realResultStatusId = "d31cb0e9-15ae-4f1a-accf-e57a3cf58ff7"  # From BMM_RESULT_STATUSES
$realServiceRequestId = "8ecf120a-fc1c-410c-a00c-826d6754092e"  # From BMM_SERVICE_REQUESTS

# Test 1: With real roomId
Write-Host "`n1. Testing with real roomId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = $realServiceRequestId
        resultStatusId = $realResultStatusId
        roomId = $realRoomId
        note = "Check-in with real room ID"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with real roomId" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: With real sampleTypeId
Write-Host "`n2. Testing with real sampleTypeId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = $realServiceRequestId
        resultStatusId = $realResultStatusId
        sampleTypeId = $realSampleTypeId
        note = "Check-in with real sample type ID"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with real sampleTypeId" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: With both real UUIDs
Write-Host "`n3. Testing with both real UUIDs..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = $realServiceRequestId
        resultStatusId = $realResultStatusId
        roomId = $realRoomId
        sampleTypeId = $realSampleTypeId
        sampleCode = "BLD-2024-REAL-001"
        note = "Check-in with real UUIDs"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with real UUIDs" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Summary ===" -ForegroundColor Green
Write-Host "Real Service Request ID: $realServiceRequestId" -ForegroundColor Cyan
Write-Host "Real Result Status ID: $realResultStatusId" -ForegroundColor Cyan
Write-Host "Real Room ID: $realRoomId" -ForegroundColor Cyan
Write-Host "Real Sample Type ID: $realSampleTypeId" -ForegroundColor Cyan
Write-Host "`nTest completed!" -ForegroundColor Green
