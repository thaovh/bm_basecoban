# Test ServiceRequest Module
# This script tests the ServiceRequest module functionality

$baseUrl = "http://localhost:3333"
$jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTAzNTUzNywiZXhwIjoxNzYxMTIxOTM3fQ.K0faAQxn9BLtpg-zEnglbs5R-J6t2ajemdCTe9dsREE"

$headers = @{
    "Authorization" = "Bearer $jwtToken"
    "Content-Type" = "application/json"
    "accept" = "application/json"
}

Write-Host "=== Testing ServiceRequest Module ===" -ForegroundColor Green

# Test 1: Create Service Request
Write-Host "`n1. Testing Create Service Request..." -ForegroundColor Yellow

$createServiceRequestData = @{
    serviceReqCode = "TEST_SR_001"
    serviceReqSttId = 3
    serviceReqSttCode = "03"
    serviceReqTypeId = 2
    serviceReqTypeCode = "XN"
    instructionTime = "2025-01-15T08:00:00Z"
    instructionDate = "2025-01-15"
    icdCode = "D44.1"
    icdName = "Test ICD Name"
    treatmentId = 1234567
    treatmentCode = "TREAT_001"
    patientId = 3110600
    patientCode = "0003110473"
    patientName = "NGUYEN VAN TEST"
    patientDob = 19890104000000
    patientCmndNumber = "025189009861"
    patientCmndDate = 20210625000000
    patientCmndPlace = "CA HCM"
    patientMobile = "0902267672"
    patientPhone = "0281234567"
    patientProvinceCode = "25"
    patientProvinceName = "Phu Tho"
    patientCommuneCode = "08203"
    patientCommuneName = "Xa Hoang Cuong"
    patientAddress = "KHU 1 Ninh Dan, Xa Hoang Cuong, Phu Tho"
    patientGenderId = 1
    patientGenderName = "Nu"
    patientCareerName = "Ky su"
    lisPatientId = $null
    requestRoomId = 4828
    requestRoomCode = "NPKNTBB0623"
    requestRoomName = "Phong 623"
    requestDepartmentId = 38
    requestDepartmentCode = "30"
    requestDepartmentName = "Khoa Noi tiet - Dai thao duong"
    executeRoomId = 410
    executeRoomCode = "P168"
    executeRoomName = "Phong Xet Nghiem Sinh Hoa"
    executeDepartmentId = 58
    executeDepartmentCode = "37"
    executeDepartmentName = "Khoa Hoa Sinh"
    note = "Test service request"
    totalAmount = 50000
    status = "PENDING"
    isActive = $true
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests" -Method POST -Headers $headers -Body $createServiceRequestData
    Write-Host "✅ Create Service Request Success" -ForegroundColor Green
    Write-Host "Service Request ID: $($createResponse.id)" -ForegroundColor Cyan
    $serviceRequestId = $createResponse.id
} catch {
    Write-Host "❌ Create Service Request Failed: $($_.Exception.Message)" -ForegroundColor Red
    $serviceRequestId = $null
}

# Test 2: Get Service Request by ID
if ($serviceRequestId) {
    Write-Host "`n2. Testing Get Service Request by ID..." -ForegroundColor Yellow
    
    try {
        $getResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/$serviceRequestId" -Method GET -Headers $headers
        Write-Host "✅ Get Service Request by ID Success" -ForegroundColor Green
        Write-Host "Service Request Code: $($getResponse.serviceReqCode)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Get Service Request by ID Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Get Service Request by Code
Write-Host "`n3. Testing Get Service Request by Code..." -ForegroundColor Yellow

try {
    $getByCodeResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/code/TEST_SR_001" -Method GET -Headers $headers
    Write-Host "✅ Get Service Request by Code Success" -ForegroundColor Green
    Write-Host "Service Request Code: $($getByCodeResponse.serviceReqCode)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get Service Request by Code Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Service Requests List
Write-Host "`n4. Testing Get Service Requests List..." -ForegroundColor Yellow

try {
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests?limit=10&offset=0" -Method GET -Headers $headers
    Write-Host "✅ Get Service Requests List Success" -ForegroundColor Green
    Write-Host "Total Service Requests: $($listResponse.total)" -ForegroundColor Cyan
    Write-Host "Service Requests Count: $($listResponse.serviceRequests.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get Service Requests List Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Search Service Requests
Write-Host "`n5. Testing Search Service Requests..." -ForegroundColor Yellow

try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/search?searchTerm=TEST&limit=10&offset=0" -Method GET -Headers $headers
    Write-Host "✅ Search Service Requests Success" -ForegroundColor Green
    Write-Host "Search Results Count: $($searchResponse.serviceRequests.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Search Service Requests Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Service Requests by Patient ID
Write-Host "`n6. Testing Get Service Requests by Patient ID..." -ForegroundColor Yellow

try {
    $patientResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/patient/3110600?limit=10&offset=0" -Method GET -Headers $headers
    Write-Host "✅ Get Service Requests by Patient ID Success" -ForegroundColor Green
    Write-Host "Patient Service Requests Count: $($patientResponse.serviceRequests.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get Service Requests by Patient ID Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get Service Requests by Treatment ID
Write-Host "`n7. Testing Get Service Requests by Treatment ID..." -ForegroundColor Yellow

try {
    $treatmentResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/treatment/1234567?limit=10&offset=0" -Method GET -Headers $headers
    Write-Host "✅ Get Service Requests by Treatment ID Success" -ForegroundColor Green
    Write-Host "Treatment Service Requests Count: $($treatmentResponse.serviceRequests.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get Service Requests by Treatment ID Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Update Service Request
if ($serviceRequestId) {
    Write-Host "`n8. Testing Update Service Request..." -ForegroundColor Yellow
    
    $updateData = @{
        status = "IN_PROGRESS"
        note = "Updated test service request"
        totalAmount = 75000
    } | ConvertTo-Json -Depth 3
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/$serviceRequestId" -Method PUT -Headers $headers -Body $updateData
        Write-Host "✅ Update Service Request Success" -ForegroundColor Green
        Write-Host "Updated Status: $($updateResponse.status)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Update Service Request Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 9: Delete Service Request
if ($serviceRequestId) {
    Write-Host "`n9. Testing Delete Service Request..." -ForegroundColor Yellow
    
    try {
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/service-requests/$serviceRequestId" -Method DELETE -Headers $headers
        Write-Host "✅ Delete Service Request Success" -ForegroundColor Green
    } catch {
        Write-Host "❌ Delete Service Request Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== ServiceRequest Module Testing Completed ===" -ForegroundColor Green
