# Test script for HIS Service Request with Dual Authentication
# This script tests the updated his-service-request API with both JWT and HIS token authentication

$baseUrl = "http://localhost:3000"
$serviceReqCode = "000054090874"  # Replace with actual service request code

Write-Host "Testing HIS Service Request with Dual Authentication..." -ForegroundColor Green
Write-Host "Service Request Code: $serviceReqCode" -ForegroundColor Yellow

# Test 1: JWT Token Authentication
Write-Host "`n1. Testing with JWT Token Authentication..." -ForegroundColor Cyan
try {
    $jwtResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/his/service-requests/$serviceReqCode" -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer your-jwt-token-here"
    }
    
    Write-Host "JWT Authentication Response:" -ForegroundColor Green
    $jwtResponse | ConvertTo-Json -Depth 5 | Write-Host
    
    if ($jwtResponse.data -and $jwtResponse.data.serviceRequest) {
        Write-Host "✅ JWT Authentication successful!" -ForegroundColor Green
        Write-Host "Service Request Code: $($jwtResponse.data.serviceRequest.serviceReqCode)"
        Write-Host "Patient Name: $($jwtResponse.data.serviceRequest.patient.name)"
        Write-Host "Services Count: $($jwtResponse.data.serviceRequest.services.Count)"
    }
    
} catch {
    Write-Host "❌ JWT Authentication failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Test 2: HIS Token Authentication
Write-Host "`n2. Testing with HIS Token Authentication..." -ForegroundColor Cyan
try {
    $hisResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/his/service-requests/$serviceReqCode" -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer your-his-token-here"
    }
    
    Write-Host "HIS Authentication Response:" -ForegroundColor Green
    $hisResponse | ConvertTo-Json -Depth 5 | Write-Host
    
    if ($hisResponse.data -and $hisResponse.data.serviceRequest) {
        Write-Host "✅ HIS Authentication successful!" -ForegroundColor Green
        Write-Host "Service Request Code: $($hisResponse.data.serviceRequest.serviceReqCode)"
        Write-Host "Patient Name: $($hisResponse.data.serviceRequest.patient.name)"
        Write-Host "Services Count: $($hisResponse.data.serviceRequest.services.Count)"
    }
    
} catch {
    Write-Host "❌ HIS Authentication failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Test 3: No Token (Should fail)
Write-Host "`n3. Testing without token (should fail)..." -ForegroundColor Cyan
try {
    $noTokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/his/service-requests/$serviceReqCode" -Method GET -Headers @{
        "Content-Type" = "application/json"
    }
    
    Write-Host "❌ Unexpected success without token!" -ForegroundColor Red
    
} catch {
    Write-Host "✅ Correctly rejected request without token:" -ForegroundColor Green
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

# Test 4: Invalid Token (Should fail)
Write-Host "`n4. Testing with invalid token (should fail)..." -ForegroundColor Cyan
try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/his/service-requests/$serviceReqCode" -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer invalid-token-12345"
    }
    
    Write-Host "❌ Unexpected success with invalid token!" -ForegroundColor Red
    
} catch {
    Write-Host "✅ Correctly rejected invalid token:" -ForegroundColor Green
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

Write-Host "`nDual Authentication Test completed!" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Yellow
Write-Host "- JWT Token: Should work if valid JWT token provided" -ForegroundColor White
Write-Host "- HIS Token: Should work if valid HIS token provided" -ForegroundColor White
Write-Host "- No Token: Should be rejected with 401 Unauthorized" -ForegroundColor White
Write-Host "- Invalid Token: Should be rejected with 401 Unauthorized" -ForegroundColor White
