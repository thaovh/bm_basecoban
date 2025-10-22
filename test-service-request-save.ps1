# Test ServiceRequest Save Functionality
# This script tests the new save endpoints for ServiceRequest module

$baseUrl = "http://localhost:3000/api/v1/service-requests"
$hisToken = "your-his-token-here"  # Replace with actual HIS token

Write-Host "=== Testing ServiceRequest Save Functionality ===" -ForegroundColor Green

# Test data based on the service-requests API response
$testServiceRequestData = @{
    hisServiceReqId = 54091049
    serviceReqCode = "000054090874"
    serviceReqSttId = 3
    serviceReqSttCode = "03"
    serviceReqTypeId = 2
    serviceReqTypeCode = "XN"
    instructionTime = "2025-09-27T08:00:00Z"
    instructionDate = "2025-09-27"
    icdCode = "D44.1"
    icdName = "U vị trí đuôi tụy"
    icdSubCode = ";E11;I10"
    icdText = "U vị trí đuôi tụy;Đái tháo đường type 2;Tăng huyết áp"
    treatmentId = 5139025
    treatmentCode = "000005138950"
    note = "Test save from HIS data"
    totalAmount = 0
    status = "PENDING"
    
    # Patient Data
    patientId = 3110600
    patientCode = "0003110473"
    patientName = "NGUYEN THI QUY"
    patientDob = 19890104000000
    patientCmndNumber = "025189009861"
    patientCmndDate = 20210625000000
    patientCmndPlace = "CA HCM"
    patientMobile = "0902267672"
    patientPhone = ""
    patientProvinceCode = "25"
    patientProvinceName = "Phu Tho"
    patientCommuneCode = "08203"
    patientCommuneName = "Xã Hoàng Cương"
    patientAddress = "KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ"
    patientGenderId = 1
    patientGenderName = "Nữ"
    patientCareerName = "Không xác định"
    lisPatientId = $null
    
    # Room & Department Data
    requestRoomId = 4828
    requestRoomCode = "NPKNTBB0623"
    requestRoomName = "Phòng 623"
    requestDepartmentId = 38
    requestDepartmentCode = "30"
    requestDepartmentName = "Khoa Nội tiết - Đái tháo đường"
    executeRoomId = 410
    executeRoomCode = "P168"
    executeRoomName = "Phòng Xét Nghiệm Sinh Hóa"
    executeDepartmentId = 58
    executeDepartmentCode = "37"
    executeDepartmentName = "Khoa Hóa Sinh"
    
    # Service Request Items Data
    lisServices = @(
        @{
            hisSereServId = 110006624
            hisServiceId = 5853
            hisServiceCode = "BM00132"
            hisServiceName = "Điện giải đồ (Na, K, Cl)"
            hisPrice = 30200
            lisServiceId = $null
            lisServiceCode = $null
            lisServiceName = $null
            lisShortName = $null
            lisCurrentPrice = $null
            serviceGroupId = $null
            serviceGroupName = $null
            unitOfMeasureId = $null
            unitOfMeasureName = $null
            quantity = 1
            unitPrice = 30200
            totalPrice = 30200
            status = "PENDING"
            itemOrder = 1
            serviceTests = @(
                @{
                    serviceTestId = $null
                    testCode = "TEST_001"
                    testName = "Xet nghiem dien giai do"
                    shortName = "XN Dien giai do"
                    testOrder = 1
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "`n1. Testing Save ServiceRequest from HIS Data..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/save-from-his" -Method POST -Body $testServiceRequestData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $hisToken"
        "X-HIS-Token" = $hisToken
    }
    
    Write-Host "✅ Save from HIS successful!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    $savedServiceRequestId = $response.data.serviceRequest.id
    Write-Host "`nSaved ServiceRequest ID: $savedServiceRequestId" -ForegroundColor Magenta
    
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
            "Authorization" = "Bearer $hisToken"
            "X-HIS-Token" = $hisToken
        }
        
        Write-Host "✅ Get ServiceRequest successful!" -ForegroundColor Green
        Write-Host "ServiceRequest Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
        Write-Host "Patient Name: $($response.data.patientName)" -ForegroundColor Cyan
        Write-Host "Total Amount: $($response.data.totalAmount)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get ServiceRequest failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Bulk Save ServiceRequests..." -ForegroundColor Yellow

$bulkData = @{
    serviceRequests = @(
        $testServiceRequestData | ConvertFrom-Json
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/bulk-save-from-his" -Method POST -Body $bulkData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $hisToken"
        "X-HIS-Token" = $hisToken
    }
    
    Write-Host "✅ Bulk save successful!" -ForegroundColor Green
    Write-Host "Total Processed: $($response.data.totalProcessed)" -ForegroundColor Cyan
    Write-Host "Successful: $($response.data.successful)" -ForegroundColor Cyan
    Write-Host "Failed: $($response.data.failed)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Bulk save failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Update ServiceRequest from HIS..." -ForegroundColor Yellow

if ($savedServiceRequestId) {
    $updateData = $testServiceRequestData | ConvertFrom-Json
    $updateData.note = "Updated note from HIS"
    $updateData.status = "IN_PROGRESS"
    $updateData = $updateData | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/update-from-his/$savedServiceRequestId" -Method PUT -Body $updateData -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $hisToken"
            "X-HIS-Token" = $hisToken
        }
        
        Write-Host "✅ Update from HIS successful!" -ForegroundColor Green
        Write-Host "Updated Note: $($response.data.serviceRequest.note)" -ForegroundColor Cyan
        Write-Host "Updated Status: $($response.data.serviceRequest.status)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Update from HIS failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n5. Testing Save ServiceRequest from LIS Form..." -ForegroundColor Yellow

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
        "Authorization" = "Bearer $hisToken"
    }
    
    Write-Host "✅ Save from LIS successful!" -ForegroundColor Green
    Write-Host "LIS ServiceRequest ID: $($response.data.serviceRequest.id)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Save from LIS failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ServiceRequest Save Functionality Test Completed ===" -ForegroundColor Green
