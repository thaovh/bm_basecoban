# Test check-in with new fields
$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Test Check-In with New Fields ===" -ForegroundColor Green

# Test 1: With roomId (request room)
Write-Host "`n1. Testing with roomId (request room)..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440998"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        roomId = "550e8400-e29b-41d4-a716-446655440002"
        note = "Check-in with request room"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with roomId" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: With inRoomId
Write-Host "`n2. Testing with inRoomId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440997"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        inRoomId = "550e8400-e29b-41d4-a716-446655440003"
        note = "Check-in with in room"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with inRoomId" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: With sampleTypeId
Write-Host "`n3. Testing with sampleTypeId..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440996"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        sampleTypeId = "550e8400-e29b-41d4-a716-446655440004"
        note = "Check-in with sample type"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with sampleTypeId" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: With sampleCode
Write-Host "`n4. Testing with sampleCode..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440995"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        sampleCode = "BLD-2024-TEST-001"
        note = "Check-in with sample code"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with sampleCode" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: With all new fields
Write-Host "`n5. Testing with all new fields..." -ForegroundColor Yellow
try {
    $data = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440994"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        roomId = "550e8400-e29b-41d4-a716-446655440002"
        inRoomId = "550e8400-e29b-41d4-a716-446655440003"
        sampleTypeId = "550e8400-e29b-41d4-a716-446655440004"
        sampleCode = "BLD-2024-FULL-001"
        note = "Check-in with all new fields"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Check-in with all fields" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "Check-in endpoint supports all new fields:" -ForegroundColor Yellow
Write-Host "• roomId - Request Room ID" -ForegroundColor White
Write-Host "• inRoomId - In Room ID" -ForegroundColor White
Write-Host "• sampleTypeId - Sample Type ID" -ForegroundColor White
Write-Host "• sampleCode - Sample Code" -ForegroundColor White
Write-Host "• note - Note" -ForegroundColor White

Write-Host "`nTest completed!" -ForegroundColor Green
