# Test Check-In Endpoint with Updated Fields
$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing Check-In Endpoint with Updated Fields ===" -ForegroundColor Green

# Test 1: Check-in with all new fields
Write-Host "`n1. Testing check-in with all new fields..." -ForegroundColor Yellow
try {
    $checkInData = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440000"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        roomId = "550e8400-e29b-41d4-a716-446655440002"
        inRoomId = "550e8400-e29b-41d4-a716-446655440003"
        sampleTypeId = "550e8400-e29b-41d4-a716-446655440004"
        sampleCode = "BLD-2024-001"
        note = "Started processing with new fields"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $checkInData

    Write-Host "✅ SUCCESS: Check-in with all fields" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
    Write-Host "Sample Type ID: $($response.data.sampleTypeId)" -ForegroundColor Cyan
    Write-Host "Sample Code: $($response.data.sampleCode)" -ForegroundColor Cyan
    Write-Host "Note: $($response.data.note)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check-in with minimal required fields
Write-Host "`n2. Testing check-in with minimal required fields..." -ForegroundColor Yellow
try {
    $minimalData = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440005"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $minimalData

    Write-Host "✅ SUCCESS: Check-in with minimal fields" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check-in with request room only
Write-Host "`n3. Testing check-in with request room only..." -ForegroundColor Yellow
try {
    $requestRoomData = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440006"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        roomId = "550e8400-e29b-41d4-a716-446655440002"
        note = "Check-in with request room only"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $requestRoomData

    Write-Host "✅ SUCCESS: Check-in with request room" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Request Room ID: $($response.data.roomId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check-in with in room only
Write-Host "`n4. Testing check-in with in room only..." -ForegroundColor Yellow
try {
    $inRoomData = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440007"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
        inRoomId = "550e8400-e29b-41d4-a716-446655440003"
        note = "Check-in with in room only"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $inRoomData

    Write-Host "✅ SUCCESS: Check-in with in room" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "In Room ID: $($response.data.inRoomId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Check-In Endpoint Summary ===" -ForegroundColor Green
Write-Host "`n📋 Required Fields:" -ForegroundColor Yellow
Write-Host "• serviceRequestId - Service Request ID (required)" -ForegroundColor White
Write-Host "• resultStatusId - Result Status ID (required)" -ForegroundColor White

Write-Host "`n📋 Optional Fields:" -ForegroundColor Yellow
Write-Host "• roomId - Request Room ID (phong yeu cau)" -ForegroundColor White
Write-Host "• inRoomId - In Room ID (phong dang xu ly)" -ForegroundColor White
Write-Host "• sampleTypeId - Sample Type ID (loai mau)" -ForegroundColor White
Write-Host "• sampleCode - Sample Code (ma mau)" -ForegroundColor White
Write-Host "• note - Note (ghi chu)" -ForegroundColor White

Write-Host "`n🔍 Example API Calls:" -ForegroundColor Yellow
Write-Host "POST /api/v1/result-trackings/check-in" -ForegroundColor Cyan
Write-Host "Content-Type: application/json" -ForegroundColor Cyan
Write-Host "Authorization: Bearer {token}" -ForegroundColor Cyan

Write-Host "`n📝 Request Body Examples:" -ForegroundColor Yellow
Write-Host "Minimal:" -ForegroundColor Cyan
Write-Host '{"serviceRequestId": "uuid", "resultStatusId": "uuid"}' -ForegroundColor Gray

Write-Host "`nFull:" -ForegroundColor Cyan
Write-Host '{"serviceRequestId": "uuid", "resultStatusId": "uuid", "roomId": "uuid", "inRoomId": "uuid", "sampleTypeId": "uuid", "sampleCode": "BLD-2024-001", "note": "Started processing"}' -ForegroundColor Gray

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
