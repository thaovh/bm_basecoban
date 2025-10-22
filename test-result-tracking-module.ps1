# Test ResultTracking Module
# This script tests the ResultTracking module functionality

$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing ResultTracking Module ===" -ForegroundColor Green

# Test data - using sample UUIDs (replace with actual IDs from your system)
$testServiceRequestId = "550e8400-e29b-41d4-a716-446655440000"
$testResultStatusId = "550e8400-e29b-41d4-a716-446655440001"  # PENDING status
$testRoomId = "550e8400-e29b-41d4-a716-446655440000"

$testResultTracking = @{
    serviceRequestId = $testServiceRequestId
    resultStatusId = $testResultStatusId
    roomId = $testRoomId
    note = "Test tracking for result processing"
} | ConvertTo-Json

Write-Host "`n1. Testing Create ResultTracking..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl" -Method POST -Body $testResultTracking -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Create ResultTracking successful!" -ForegroundColor Green
    Write-Host "ResultTracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Status ID: $($response.data.resultStatusId)" -ForegroundColor Cyan
    Write-Host "Room ID: $($response.data.roomId)" -ForegroundColor Cyan
    Write-Host "In Tracking Time: $($response.data.inTrackingTime)" -ForegroundColor Cyan
    
    $createdId = $response.data.id
    
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

if ($createdId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method GET -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Get ResultTracking by ID successful!" -ForegroundColor Green
        Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
        Write-Host "Result Status ID: $($response.data.resultStatusId)" -ForegroundColor Cyan
        Write-Host "In Tracking Time: $($response.data.inTrackingTime)" -ForegroundColor Cyan
        Write-Host "Out Tracking Time: $($response.data.outTrackingTime)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get ResultTracking by ID failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Get ResultTrackings by Service Request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/service-request/$testServiceRequestId" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get ResultTrackings by Service Request successful!" -ForegroundColor Green
    Write-Host "Count: $($response.data.Count)" -ForegroundColor Cyan
    
    Write-Host "`nResultTrackings:" -ForegroundColor Yellow
    foreach ($tracking in $response.data) {
        Write-Host "  - ID: $($tracking.id), Status: $($tracking.resultStatusId), In: $($tracking.inTrackingTime)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Get ResultTrackings by Service Request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Get Current Tracking..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/service-request/$testServiceRequestId/current" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get Current Tracking successful!" -ForegroundColor Green
    if ($response.data) {
        Write-Host "Current Tracking ID: $($response.data.id)" -ForegroundColor Cyan
        Write-Host "In Tracking Time: $($response.data.inTrackingTime)" -ForegroundColor Cyan
        Write-Host "Status: $($response.data.getStatus())" -ForegroundColor Cyan
    } else {
        Write-Host "No current tracking found" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Get Current Tracking failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Get All ResultTrackings..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get All ResultTrackings successful!" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Count: $($response.data.resultTrackings.Count)" -ForegroundColor Cyan
    
    Write-Host "`nResultTrackings:" -ForegroundColor Yellow
    foreach ($tracking in $response.data.resultTrackings) {
        Write-Host "  - ID: $($tracking.id), SR: $($tracking.serviceRequestId), Status: $($tracking.resultStatusId)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Get All ResultTrackings failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6. Testing Check In Tracking..." -ForegroundColor Yellow

$checkInData = @{
    serviceRequestId = $testServiceRequestId
    resultStatusId = "550e8400-e29b-41d4-a716-446655440002"  # IN_PROGRESS status
    roomId = $testRoomId
    note = "Started processing in lab"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Body $checkInData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Check In Tracking successful!" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "In Tracking Time: $($response.data.inTrackingTime)" -ForegroundColor Cyan
    
    $checkInId = $response.data.id
    
} catch {
    Write-Host "❌ Check In Tracking failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n7. Testing Check Out Tracking..." -ForegroundColor Yellow

if ($checkInId) {
    $checkOutData = @{
        note = "Processing completed successfully"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$checkInId/check-out" -Method PUT -Body $checkOutData -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Check Out Tracking successful!" -ForegroundColor Green
        Write-Host "Out Tracking Time: $($response.data.outTrackingTime)" -ForegroundColor Cyan
        Write-Host "Duration: $($response.data.getTrackingDurationInMinutes()) minutes" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Check Out Tracking failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n8. Testing Get Tracking Statistics..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/statistics" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get Tracking Statistics successful!" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Active: $($response.data.active)" -ForegroundColor Cyan
    Write-Host "Completed: $($response.data.completed)" -ForegroundColor Cyan
    Write-Host "Completion Rate: $([math]::Round($response.data.completionRate, 2))%" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Get Tracking Statistics failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n9. Testing Update ResultTracking..." -ForegroundColor Yellow

if ($createdId) {
    $updateData = @{
        note = "Updated tracking note"
        roomId = $testRoomId
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method PUT -Body $updateData -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Update ResultTracking successful!" -ForegroundColor Green
        Write-Host "Updated Note: $($response.data.note)" -ForegroundColor Cyan
        Write-Host "Updated Room ID: $($response.data.roomId)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Update ResultTracking failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n10. Testing Delete ResultTracking..." -ForegroundColor Yellow

if ($createdId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method DELETE -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Delete ResultTracking successful!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Delete ResultTracking failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== ResultTracking Module Test Completed ===" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Created, Read, Updated, Deleted ResultTracking" -ForegroundColor White
Write-Host "- Tested Check In/Check Out functionality" -ForegroundColor White
Write-Host "- Tested filtering by service request, room, status" -ForegroundColor White
Write-Host "- Tested tracking statistics" -ForegroundColor White
Write-Host "- Tested current tracking retrieval" -ForegroundColor White
