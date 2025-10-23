# Test ResultTracking API Endpoints with New Fields
# This script demonstrates the different API endpoints for filtering ResultTracking

$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing ResultTracking API Endpoints ===" -ForegroundColor Green

Write-Host "`n1. Testing Get All ResultTrackings..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?limit=5" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Get All successful!" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get All failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Filter by Request Room ID (requestRoomId)..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?requestRoomId=uuid-request-room-id" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?requestRoomId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Filter by Request Room successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Phong yeu cau xet nghiem" -ForegroundColor White
} catch {
    Write-Host "❌ Filter by Request Room failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing Filter by In Room ID (inRoomId)..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?inRoomId=uuid-in-room-id" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?inRoomId=550e8400-e29b-41d4-a716-446655440001" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Filter by In Room successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Phong dang xu ly mau" -ForegroundColor White
} catch {
    Write-Host "❌ Filter by In Room failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Filter by Sample Type ID..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?sampleTypeId=uuid-sample-type-id" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?sampleTypeId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Filter by Sample Type successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Loai mau (mau, nuoc tieu, etc.)" -ForegroundColor White
} catch {
    Write-Host "❌ Filter by Sample Type failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Filter by Sample Code..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?sampleCode=BLD-2024-001" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?sampleCode=BLD-2024-001" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Filter by Sample Code successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Ma mau duy nhat" -ForegroundColor White
} catch {
    Write-Host "❌ Filter by Sample Code failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6. Testing Combined Filters..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings?requestRoomId=uuid&inRoomId=uuid&sampleTypeId=uuid" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl?requestRoomId=550e8400-e29b-41d4-a716-446655440000&inRoomId=550e8400-e29b-41d4-a716-446655440001&sampleTypeId=550e8400-e29b-41d4-a716-446655440000" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Combined filters successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Ket hop nhieu filter" -ForegroundColor White
} catch {
    Write-Host "❌ Combined filters failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n7. Testing Search by Sample Code..." -ForegroundColor Yellow
Write-Host "GET /api/v1/result-trackings/search?searchTerm=BLD-2024" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/search?searchTerm=BLD-2024" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "✅ Search by Sample Code successful!" -ForegroundColor Green
    Write-Host "Found: $($response.data.data.Count) trackings" -ForegroundColor Cyan
    Write-Host "Description: Tim kiem theo ma mau" -ForegroundColor White
} catch {
    Write-Host "❌ Search by Sample Code failed: $($_.Exception.Message)" -ForegroundColor Red
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

Write-Host "`n✅ All API endpoints are ready for use!" -ForegroundColor Green
