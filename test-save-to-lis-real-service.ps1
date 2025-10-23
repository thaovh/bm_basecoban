# Test Save-to-LIS with Real Service Request Code
$baseUrl = "http://localhost:3333/api/v1/service-requests"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Test Save-to-LIS with Real Service Request ===" -ForegroundColor Green

# Real UUIDs from database
$realRoomId = "550e8400-e29b-41d4-a716-446655440002"  # From BMM_ROOMS
$realSampleTypeId = "c71aaddd-3766-426e-961b-cafdaf5b00b7"  # From BMM_SAMPLE_TYPES
$realResultStatusId = "d31cb0e9-15ae-4f1a-accf-e57a3cf58ff7"  # From BMM_RESULT_STATUSES

# Test 1: Basic save-to-lis with real service request code
Write-Host "`n1. Testing save-to-lis with service request 000055537395..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000055537395"
        roomId = $realRoomId
        statusId = $realResultStatusId
        note = "Test with real service request 000055537395"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/save-to-lis" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $data

    Write-Host "SUCCESS: Save-to-lis with real service request" -ForegroundColor Green
    Write-Host "Service Request ID: $($response.data.serviceRequestId)" -ForegroundColor Cyan
    Write-Host "Result Tracking ID: $($response.data.resultTrackingId)" -ForegroundColor Cyan
    Write-Host "Service Req Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
    Write-Host "Message: $($response.data.message)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

# Test 2: Save-to-lis with all fields
Write-Host "`n2. Testing save-to-lis with all fields..." -ForegroundColor Yellow
try {
    $data = @{
        serviceReqCode = "000055537395"
        roomId = $realRoomId
        statusId = $realResultStatusId
        inRoomId = $realRoomId
        sampleTypeId = $realSampleTypeId
        sampleCode = "BLD-2024-REAL-001"
        note = "Full test with service request 000055537395"
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
    Write-Host "Note: $($response.data.tracking.note)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

# Test 3: Check if service request exists in HIS
Write-Host "`n3. Testing HIS service request endpoint..." -ForegroundColor Yellow
try {
    $hisResponse = Invoke-RestMethod -Uri "http://localhost:3333/api/v1/his/service-requests/000055537395" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }

    Write-Host "SUCCESS: HIS service request found" -ForegroundColor Green
    Write-Host "HIS Service Request Code: $($hisResponse.data.serviceReqCode)" -ForegroundColor Cyan
    if ($hisResponse.data.patient) {
        Write-Host "Patient Name: $($hisResponse.data.patient.patientName)" -ForegroundColor Cyan
    } else {
        Write-Host "Patient Name: N/A" -ForegroundColor Cyan
    }
    Write-Host "Total Amount: $($hisResponse.data.totalAmount)" -ForegroundColor Cyan
    Write-Host "Services Count: $($hisResponse.data.lisServices.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Note: HIS service request might not exist or endpoint not available" -ForegroundColor Yellow
}

Write-Host "`n=== Test Summary ===" -ForegroundColor Green
Write-Host "Service Request Code: 000055537395" -ForegroundColor Cyan
Write-Host "Request Room ID: $realRoomId" -ForegroundColor Cyan
Write-Host "Result Status ID: $realResultStatusId" -ForegroundColor Cyan
Write-Host "Sample Type ID: $realSampleTypeId" -ForegroundColor Cyan

Write-Host "`nTest completed!" -ForegroundColor Green
