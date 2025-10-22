# Test ServiceRequest Save Functionality with Real Data
# This script tests the new save endpoints using real data from service-requests API

$baseUrl = "http://localhost:3000/api/v1/service-requests"
$hisToken = "your-his-token-here"  # Replace with actual HIS token

Write-Host "=== Testing ServiceRequest Save with Real Data ===" -ForegroundColor Green

# Real data from service-requests API response
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
    note = $null
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
    
    # Service Request Items Data (from real API - multiple services)
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
        },
        @{
            hisSereServId = 110006625
            hisServiceId = 5929
            hisServiceCode = "BM02129"
            hisServiceName = "Dinh luong Cortisol"
            hisPrice = 95300
            lisServiceId = "16fca2f6-5d49-4fbb-97ef-be50654b04b6"
            lisServiceCode = "LAB_002"
            lisServiceName = "Dinh luong Cortisol"
            lisShortName = "Cortisol"
            lisCurrentPrice = 100000
            serviceGroupId = "995eb5d3-6d8a-4c09-b1f3-25742854469b"
            serviceGroupName = "Laboratory Services"
            unitOfMeasureId = "2862cd01-5a13-4404-be5c-2b537c9d0e12"
            unitOfMeasureName = "Lan"
            quantity = 1
            unitPrice = 95300
            totalPrice = 95300
            status = "PENDING"
            itemOrder = 2
            serviceTests = @(
                @{
                    serviceTestId = "10f49beb-d1e1-4a08-8b56-62ce0c485e78"
                    testCode = "TEST_001"
                    testName = "Xet nghiem mau tong quat"
                    shortName = "XN Mau TQ"
                    testOrder = 1
                },
                @{
                    serviceTestId = "79d48bdf-cd34-41d1-a8a5-6dbf29b3944f"
                    testCode = "TEST_003"
                    testName = "Xet nghiem mau tong quat"
                    shortName = "XN Mau TQ"
                    testOrder = 2
                }
            )
        },
        @{
            hisSereServId = 110006626
            hisServiceId = 5891
            hisServiceCode = "BM00068"
            hisServiceName = "Dinh luong ACTH (Adrenocorticotropic hormone)"
            hisPrice = 84100
            lisServiceId = "ac28ea3e-7a0d-449e-81c1-3b3ee85bc387"
            lisServiceCode = "LAB_003"
            lisServiceName = "Dinh luong ACTH"
            lisShortName = "ACTH"
            lisCurrentPrice = 90000
            serviceGroupId = "995eb5d3-6d8a-4c09-b1f3-25742854469b"
            serviceGroupName = "Laboratory Services"
            unitOfMeasureId = "2862cd01-5a13-4404-be5c-2b537c9d0e12"
            unitOfMeasureName = "Lan"
            quantity = 1
            unitPrice = 84100
            totalPrice = 84100
            status = "PENDING"
            itemOrder = 3
            serviceTests = @()
        },
        @{
            hisSereServId = 110006627
            hisServiceId = 5996
            hisServiceCode = "BM13799"
            hisServiceName = "Dinh luong Aldosteron"
            hisPrice = 543000
            lisServiceId = "97c3ff82-9b5b-4774-b237-4ceaf8ee57df"
            lisServiceCode = "LAB_004"
            lisServiceName = "Dinh luong Aldosteron"
            lisShortName = "Aldosteron"
            lisCurrentPrice = 550000
            serviceGroupId = "995eb5d3-6d8a-4c09-b1f3-25742854469b"
            serviceGroupName = "Laboratory Services"
            unitOfMeasureId = "2862cd01-5a13-4404-be5c-2b537c9d0e12"
            unitOfMeasureName = "Lan"
            quantity = 1
            unitPrice = 543000
            totalPrice = 543000
            status = "PENDING"
            itemOrder = 4
            serviceTests = @()
        },
        @{
            hisSereServId = 110006628
            hisServiceId = 6003
            hisServiceCode = "BM13808"
            hisServiceName = "Dinh luong Renin activity"
            hisPrice = 543000
            lisServiceId = "bd0e5639-27be-4118-91dc-f51f6a6bfb0a"
            lisServiceCode = "LAB_005"
            lisServiceName = "Dinh luong Renin activity"
            lisShortName = "Renin activity"
            lisCurrentPrice = 550000
            serviceGroupId = "995eb5d3-6d8a-4c09-b1f3-25742854469b"
            serviceGroupName = "Laboratory Services"
            unitOfMeasureId = "2862cd01-5a13-4404-be5c-2b537c9d0e12"
            unitOfMeasureName = "Lan"
            quantity = 1
            unitPrice = 543000
            totalPrice = 543000
            status = "PENDING"
            itemOrder = 5
            serviceTests = @()
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "`n1. Testing Save ServiceRequest from Real HIS Data..." -ForegroundColor Yellow
Write-Host "Service Request Code: 000054090874" -ForegroundColor Cyan
Write-Host "Patient: NGUYEN THI QUY" -ForegroundColor Cyan
Write-Host "Total Services: 5" -ForegroundColor Cyan
Write-Host "Total Tests: 3" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/save-from-his" -Method POST -Body $realServiceRequestData -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $hisToken"
        "X-HIS-Token" = $hisToken
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
            "Authorization" = "Bearer $hisToken"
            "X-HIS-Token" = $hisToken
        }
        
        Write-Host "✅ Get ServiceRequest successful!" -ForegroundColor Green
        Write-Host "ServiceRequest Code: $($response.data.serviceReqCode)" -ForegroundColor Cyan
        Write-Host "Patient Name: $($response.data.patientName)" -ForegroundColor Cyan
        Write-Host "Total Amount: $($response.data.totalAmount)" -ForegroundColor Cyan
        Write-Host "Status: $($response.data.status)" -ForegroundColor Cyan
        Write-Host "Service Request Items: $($response.data.serviceRequestItems.Count)" -ForegroundColor Cyan
        
        # Show service request items details
        Write-Host "`nService Request Items:" -ForegroundColor Yellow
        foreach ($item in $response.data.serviceRequestItems) {
            Write-Host "  - $($item.hisServiceCode): $($item.hisServiceName) - Price: $($item.totalPrice)" -ForegroundColor White
        }
        
    } catch {
        Write-Host "❌ Get ServiceRequest failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Update ServiceRequest from HIS..." -ForegroundColor Yellow

if ($savedServiceRequestId) {
    $updateData = $realServiceRequestData | ConvertFrom-Json
    $updateData.note = "Updated note from HIS - Real data test"
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

Write-Host "`n4. Testing Bulk Save with Real Data..." -ForegroundColor Yellow

$bulkData = @{
    serviceRequests = @(
        $realServiceRequestData | ConvertFrom-Json
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
    
    if ($response.data.errors.Count -gt 0) {
        Write-Host "Errors:" -ForegroundColor Red
        foreach ($error in $response.data.errors) {
            Write-Host "  - $($error.serviceReqCode): $($error.error)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Bulk save failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ServiceRequest Save with Real Data Test Completed ===" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Tested with real data from service-requests API" -ForegroundColor White
Write-Host "- Service Request Code: 000054090874" -ForegroundColor White
Write-Host "- Patient: NGUYEN THI QUY" -ForegroundColor White
Write-Host "- 5 Services with 3 Service Tests" -ForegroundColor White
Write-Host "- Total HIS Price: $((30200 + 95300 + 84100 + 543000 + 543000))" -ForegroundColor White
