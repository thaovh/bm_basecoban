# Simple test for check-in endpoint
$baseUrl = "http://localhost:3333/api/v1/result-trackings"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Simple Check-In Test ===" -ForegroundColor Green

# Test with minimal data
Write-Host "`nTesting check-in with minimal data..." -ForegroundColor Yellow
try {
    $minimalData = @{
        serviceRequestId = "550e8400-e29b-41d4-a716-446655440999"
        resultStatusId = "550e8400-e29b-41d4-a716-446655440001"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/check-in" -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } -Body $minimalData

    Write-Host "SUCCESS: Check-in completed" -ForegroundColor Green
    Write-Host "Tracking ID: $($response.data.id)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green
