# Test script for enhanced patient info with CMND/CCCD fields
# This script tests the updated service-requests API with new patient fields

$baseUrl = "http://localhost:3000"
$serviceReqCode = "SR001"  # Replace with actual service request code

Write-Host "Testing Enhanced Patient Info API..." -ForegroundColor Green
Write-Host "Service Request Code: $serviceReqCode" -ForegroundColor Yellow

try {
    # Test the service-requests API
    Write-Host "`n1. Testing service-requests API..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "$baseUrl/his/service-requests/$serviceReqCode" -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer your-jwt-token-here"
    }
    
    Write-Host "API Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    # Check if patient info contains new CMND/CCCD fields
    if ($response.data -and $response.data.patient) {
        $patient = $response.data.patient
        Write-Host "`nPatient Information:" -ForegroundColor Yellow
        Write-Host "  ID: $($patient.id)"
        Write-Host "  Code: $($patient.code)"
        Write-Host "  Name: $($patient.name)"
        Write-Host "  DOB: $($patient.dob)"
        Write-Host "  CMND Number: $($patient.cmndNumber)"
        Write-Host "  CMND Date: $($patient.cmndDate)"
        Write-Host "  CMND Place: $($patient.cmndPlace)"
        Write-Host "  Province: $($patient.provinceName) ($($patient.provinceCode))"
        Write-Host "  Commune: $($patient.communeName) ($($patient.communeCode))"
        Write-Host "  Address: $($patient.address)"
        Write-Host "  Gender: $($patient.genderName)"
        Write-Host "  Career: $($patient.careerName)"
        
        # Check if new fields are present
        $newFieldsPresent = $patient.cmndNumber -or $patient.cmndDate -or $patient.cmndPlace
        if ($newFieldsPresent) {
            Write-Host "`n✅ New CMND/CCCD fields are present in response!" -ForegroundColor Green
        } else {
            Write-Host "`n⚠️  New CMND/CCCD fields are not present in response" -ForegroundColor Yellow
        }
    } else {
        Write-Host "`n❌ No patient information found in response" -ForegroundColor Red
    }
    
    # Check services
    if ($response.data -and $response.data.services) {
        Write-Host "`nServices Count: $($response.data.services.Count)" -ForegroundColor Yellow
        foreach ($service in $response.data.services) {
            Write-Host "  Service: $($service.serviceName) (Code: $($service.serviceCode))"
            if ($service.lisService) {
                Write-Host "    LIS Service: $($service.lisService.serviceName)"
                if ($service.lisService.serviceTests) {
                    Write-Host "    Service Tests: $($service.lisService.serviceTests.Count)"
                }
            }
        }
    }
    
    Write-Host "`n✅ API test completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green
