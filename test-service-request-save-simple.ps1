# Test ServiceRequest Save Functionality with Real Data (Simple Version)
# This script tests the new save endpoints using real data from service-requests API

$baseUrl = "http://localhost:3333/api/v1/service-requests"
$realToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing ServiceRequest Save with Real Data (Simple) ===" -ForegroundColor Green

# Real data from service-requests API response (simplified)
$realServiceRequestData = @{
    hisServiceReqId = 54091049
    serviceReqCode = "000054090874"
    serviceReqSttId = 3
    serviceReqSttCode = "03"
    serviceReqTypeId = 2
    serviceReqTypeCode = "XN"
    instructionTime = "2025-09-27T08:00:00Z"
    instructionDate = "2025-09-27"
    icdCode = "D44.1"
    icdName = "U vi tri duoi tuy - ho thuong than trai chua loai tru u thuong than trai - Dai thao duong tip 2 - Tang huyet ap"
    icdSubCode = ";E11;I10"
    icdText = $null
    treatmentId = 5139025
    treatmentCode = "000005138950"
    note = "Test save from real HIS data"
    totalAmount = 0
    status = "PENDING"
    
    # Patient Data (from real API)
    patientId = 3110600
    patientCode = "0003110473"
    patientName = "NGUYEN THI QUY"
    patientDob = 19890104000000
    patientCmndNumber = "025189009861"
    patientCmndDate = 20210625000000
    patientCmndPlace = $null
    patientMobile = "0902267672"
    patientPhone = $null
    patientProvinceCode = "25"
    patientProvinceName = "Phu Tho"
    patientCommuneCode = "08203"
    patientCommuneName = "Xa Hoang Cuong"
    patientAddress = "KHU 1 Ninh Dan, Xa Hoang Cuong, Phu Tho"
    patientGenderId = 1
    patientGenderName = "Nu"
    patientCareerName = "Khong xac dinh"
    lisPatientId = "4fc2771a-a285-4dfd-9308-6a21d702dbdc"
    
    # Room & Department Data (from real API)
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
    
    # Service Request Items Data (simplified - just first service)
    lisServices = @(
        @{
            hisSereServId = 110006624
            hisServiceId = 5853
            hisServiceCode = "BM00132"
            hisServiceName = "Dien giai do (Na, K, Cl)"
            hisPrice = 30200
            lisServiceId = "d2a10060-3d11-403e-aba9-6a982c9f103e"
            lisServiceCode = "LAB_001"
            lisServiceName = "Dien giai do (Na, K, Cl)"
            lisShortName = "Dien giai do"
            lisCurrentPrice = 35000
            serviceGroupId = "995eb5d3-6d8a-4c09-b1f3-25742854469b"
            serviceGroupName = "Laboratory Services"
            unitOfMeasureId = "2862cd01-5a13-4404-be5c-2b537c9d0e12"
            unitOfMeasureName = "Lan"
            quantity = 1
            unitPrice = 30200
            totalPrice = 30200
            status = "PENDING"
            itemOrder = 1
            serviceTests = @(
                @{
                    serviceTestId = "c82442d8-161f-4ce4-a3f6-ce5f6d65d681"
                    testCode = "TEST_002"
                    testName = "Xet nghiem dien giai do"
                    shortName = "XN Dien giai do"
                    testOrder = 1
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "`n1. Testing Save ServiceRequest from Real HIS Data..." -ForegroundColor Yellow
Write-Host "Service Request Code: 000054090874" -ForegroundColor Cyan
Write-Host "Patient: NGUYEN THI QUY" -ForegroundColor Cyan
Write-Host "Services: 1 (simplified)" -ForegroundColor Cyan
Write-Host "Tests: 1" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/save-from-his" -Method POST -Body $realServiceRequestData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $realToken"
        "X-HIS-Token" = $realToken
    }
    
    Write-Host "✅ Save from HIS successful!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
    $savedServiceRequestId = $response.data.serviceRequest.id
    Write-Host "`nSaved ServiceRequest ID: $savedServiceRequestId" -ForegroundColor Magenta
    Write-Host "Is New: $($response.data.isNew)" -ForegroundColor Magenta
    Write-Host "Service Request Items: $($response.data.serviceRequestItems.Count)" -ForegroundColor Magenta
    Write-Host "Service Request Item Tests: $($response.data.serviceRequestItemTests.Count)" -ForegroundColor Magenta
    
} catch {
    Write-Host "❌ Save from HIS failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing Get Saved ServiceRequest..." -ForegroundColor Yellow

if ($savedServiceRequestId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$savedServiceRequestId" -Method GET -Headers @{
            "Authorization" = "Bearer $realToken"
            "X-HIS-Token" = $realToken
        }
        
        Write-Host "✅ Get ServiceRequest successful!" -ForegroundColor Green
        Write-Host "ServiceRequest Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
        Write-Host "Patient Name: $($response.data.patientName)" -ForegroundColor Cyan
        Write-Host "Total Amount: $($response.data.totalAmount)" -ForegroundColor Cyan
        Write-Host "Status: $($response.data.status)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get ServiceRequest failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Save ServiceRequest from LIS Form..." -ForegroundColor Yellow

$lisFormData = @{
    serviceReqCode = "LIS-TEST-001"
    patientName = "Test Patient LIS"
    patientCode = "LIS-PATIENT-001"
    patientId = 999999
    patientDob = 19900101000000
    patientAddress = "Test Address"
    patientGenderId = 1
    patientGenderName = "Nam"
    instructionTime = "2025-01-15T10:00:00Z"
    instructionDate = "2025-01-15"
    serviceReqSttId = 1
    serviceReqSttCode = "01"
    serviceReqTypeId = 1
    serviceReqTypeCode = "XN"
    totalAmount = 100000
    status = "PENDING"
    note = "Test from LIS form"
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/save-from-lis" -Method POST -Body $lisFormData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $realToken"
    }
    
    Write-Host "✅ Save from LIS successful!" -ForegroundColor Green
    Write-Host "LIS ServiceRequest ID: $($response.data.serviceRequest.id)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Save from LIS failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ServiceRequest Save Test Completed ===" -ForegroundColor Green
Write-Host "Note: Using fake token for testing - authentication may fail" -ForegroundColor Yellow
