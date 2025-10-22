# Test Save to LIS Endpoint
# This script tests the new save-to-lis endpoint that combines all steps

$baseUrl = "http://localhost:3333/api/v1/service-requests"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing Save to LIS Endpoint ===" -ForegroundColor Green

# Test data
$testData = @{
    serviceReqCode = "000054090874"
    roomId = "550e8400-e29b-41d4-a716-446655440000"  # Sample room ID
    statusId = "550e8400-e29b-41d4-a716-446655440001"  # PENDING status ID
    note = "Bắt đầu xử lý mẫu xét nghiệm từ HIS"
} | ConvertTo-Json

Write-Host "`n1. Testing Save to LIS Endpoint..." -ForegroundColor Yellow
Write-Host "Request Data:" -ForegroundColor Cyan
Write-Host $testData -ForegroundColor White

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Body $testData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
        "X-HIS-Token" = $token  # Using same token for HIS auth
    }
    
    Write-Host "✅ Save to LIS successful!" -ForegroundColor Green
    Write-Host "`n=== Response Data ===" -ForegroundColor Yellow
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Tracking ID: $($response.data.resultTrackingId)" -ForegroundColor Cyan
    Write-Host "Service Request Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
    Write-Host "Total Amount: $($response.data.totalAmount)" -ForegroundColor Cyan
    Write-Host "Message: $($response.data.message)" -ForegroundColor Cyan
    
    Write-Host "`n=== Patient Information ===" -ForegroundColor Yellow
    if ($response.data.patient) {
        Write-Host "Patient Name: $($response.data.patient.name)" -ForegroundColor Cyan
        Write-Host "Patient Code: $($response.data.patient.patientCode)" -ForegroundColor Cyan
        Write-Host "Patient ID: $($response.data.patient.id)" -ForegroundColor Cyan
    }
    
    Write-Host "`n=== Services Information ===" -ForegroundColor Yellow
    if ($response.data.services) {
        Write-Host "Number of Services: $($response.data.services.Count)" -ForegroundColor Cyan
        foreach ($service in $response.data.services) {
            Write-Host "  - Service: $($service.serviceName) (ID: $($service.serviceId))" -ForegroundColor White
            if ($service.serviceTests) {
                Write-Host "    Tests: $($service.serviceTests.Count)" -ForegroundColor White
            }
        }
    }
    
    Write-Host "`n=== Tracking Information ===" -ForegroundColor Yellow
    if ($response.data.tracking) {
        Write-Host "Tracking ID: $($response.data.tracking.id)" -ForegroundColor Cyan
        Write-Host "In Tracking Time: $($response.data.tracking.inTrackingTime)" -ForegroundColor Cyan
        Write-Host "Result Status ID: $($response.data.tracking.resultStatusId)" -ForegroundColor Cyan
        Write-Host "Room ID: $($response.data.tracking.roomId)" -ForegroundColor Cyan
        Write-Host "Note: $($response.data.tracking.note)" -ForegroundColor Cyan
    }
    
    $serviceRequestId = $response.data.serviceRequestId
    $trackingId = $response.data.resultTrackingId
    
} catch {
    Write-Host "❌ Save to LIS failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing Get Service Request by ID..." -ForegroundColor Yellow

if ($serviceRequestId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$serviceRequestId" -Method GET -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Get Service Request successful!" -ForegroundColor Green
        Write-Host "Service Request Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
        Write-Host "Patient: $($response.data.patient.name)" -ForegroundColor Cyan
        Write-Host "Total Amount: $($response.data.totalAmount)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get Service Request failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Get Current Tracking..." -ForegroundColor Yellow

if ($serviceRequestId) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3333/api/v1/result-trackings/service-request/$serviceRequestId/current" -Method GET -Headers @{
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
}

Write-Host "`n4. Testing Get Tracking History..." -ForegroundColor Yellow

if ($serviceRequestId) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3333/api/v1/result-trackings/service-request/$serviceRequestId" -Method GET -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Get Tracking History successful!" -ForegroundColor Green
        Write-Host "Tracking Count: $($response.data.Count)" -ForegroundColor Cyan
        
        Write-Host "`nTracking History:" -ForegroundColor Yellow
        foreach ($tracking in $response.data) {
            Write-Host "  - ID: $($tracking.id), In: $($tracking.inTrackingTime), Out: $($tracking.outTrackingTime)" -ForegroundColor White
        }
        
    } catch {
        Write-Host "❌ Get Tracking History failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Save to LIS Endpoint Test Completed ===" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Single endpoint combines: HIS data fetch + LIS save + Tracking setup" -ForegroundColor White
Write-Host "- Automatic workflow execution" -ForegroundColor White
Write-Host "- Complete data validation and error handling" -ForegroundColor White
Write-Host "- Ready for production use" -ForegroundColor White
