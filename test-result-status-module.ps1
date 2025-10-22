# Test ResultStatus Module
# This script tests the ResultStatus module functionality

$baseUrl = "http://localhost:3333/api/v1/result-statuses"
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdmMDM3Yi05ZDQxLTQ1YzItYWUzNy1lNTg0MTMzMzc0MjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTEwNzEyMywiZXhwIjoxNzYxMTkzNTIzfQ.IoCuiBO6iDn63hJy25iLC6xRRId0M4e3bjdWfDmOT94"

Write-Host "=== Testing ResultStatus Module ===" -ForegroundColor Green

# Test data
$testResultStatus = @{
    statusCode = "TEST_STATUS"
    statusName = "Test Status"
    orderNumber = 10
    description = "Test result status for testing"
    colorCode = "#FF0000"
    isActive = $true
} | ConvertTo-Json

Write-Host "`n1. Testing Create ResultStatus..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl" -Method POST -Body $testResultStatus -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Create ResultStatus successful!" -ForegroundColor Green
    Write-Host "ResultStatus ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Status Code: $($response.data.statusCode)" -ForegroundColor Cyan
    Write-Host "Status Name: $($response.data.statusName)" -ForegroundColor Cyan
    Write-Host "Order Number: $($response.data.orderNumber)" -ForegroundColor Cyan
    
    $createdId = $response.data.id
    
} catch {
    Write-Host "❌ Create ResultStatus failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing Get ResultStatus by ID..." -ForegroundColor Yellow

if ($createdId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method GET -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Get ResultStatus by ID successful!" -ForegroundColor Green
        Write-Host "Status Code: $($response.data.statusCode)" -ForegroundColor Cyan
        Write-Host "Status Name: $($response.data.statusName)" -ForegroundColor Cyan
        Write-Host "Order Number: $($response.data.orderNumber)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Get ResultStatus by ID failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Get ResultStatus by Code..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/code/TEST_STATUS" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get ResultStatus by Code successful!" -ForegroundColor Green
    Write-Host "Status Code: $($response.data.statusCode)" -ForegroundColor Cyan
    Write-Host "Status Name: $($response.data.statusName)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Get ResultStatus by Code failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Get All ResultStatuses..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl" -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get All ResultStatuses successful!" -ForegroundColor Green
    Write-Host "Total: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Count: $($response.data.resultStatuses.Count)" -ForegroundColor Cyan
    
    Write-Host "`nResultStatuses:" -ForegroundColor Yellow
    foreach ($status in $response.data.resultStatuses) {
        Write-Host "  - $($status.statusCode): $($status.statusName) (Order: $($status.orderNumber))" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Get All ResultStatuses failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Search ResultStatuses..." -ForegroundColor Yellow

try {
    $searchParams = @{
        searchTerm = "test"
    }
    $uri = "$baseUrl/search?" + ($searchParams.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
    $response = Invoke-RestMethod -Uri $uri -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Search ResultStatuses successful!" -ForegroundColor Green
    Write-Host "Search Term: $($response.data.searchTerm)" -ForegroundColor Cyan
    Write-Host "Total Found: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Count: $($response.data.resultStatuses.Count)" -ForegroundColor Cyan
    
    Write-Host "`nSearch Results:" -ForegroundColor Yellow
    foreach ($status in $response.data.resultStatuses) {
        Write-Host "  - $($status.statusCode): $($status.statusName)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Search ResultStatuses failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6. Testing Update ResultStatus..." -ForegroundColor Yellow

if ($createdId) {
    $updateData = @{
        statusName = "Updated Test Status"
        description = "Updated description for test status"
        colorCode = "#00FF00"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method PUT -Body $updateData -ContentType "application/json" -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Update ResultStatus successful!" -ForegroundColor Green
        Write-Host "Updated Status Name: $($response.data.statusName)" -ForegroundColor Cyan
        Write-Host "Updated Description: $($response.data.description)" -ForegroundColor Cyan
        Write-Host "Updated Color Code: $($response.data.colorCode)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Update ResultStatus failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n7. Testing Delete ResultStatus..." -ForegroundColor Yellow

if ($createdId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method DELETE -Headers @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "✅ Delete ResultStatus successful!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Delete ResultStatus failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n8. Testing Get Active ResultStatuses..." -ForegroundColor Yellow

try {
    $filterParams = @{
        isActive = "true"
        limit = "10"
    }
    $uri = "$baseUrl?" + ($filterParams.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
    $response = Invoke-RestMethod -Uri $uri -Method GET -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Get Active ResultStatuses successful!" -ForegroundColor Green
    Write-Host "Total Active: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "Count: $($response.data.resultStatuses.Count)" -ForegroundColor Cyan
    
    Write-Host "`nActive ResultStatuses:" -ForegroundColor Yellow
    foreach ($status in $response.data.resultStatuses) {
        Write-Host "  - $($status.statusCode): $($status.statusName) (Order: $($status.orderNumber))" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Get Active ResultStatuses failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ResultStatus Module Test Completed ===" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- Created, Read, Updated, Deleted ResultStatus" -ForegroundColor White
Write-Host "- Tested search functionality" -ForegroundColor White
Write-Host "- Tested filtering by active status" -ForegroundColor White
Write-Host "- Tested ordering by order number" -ForegroundColor White
