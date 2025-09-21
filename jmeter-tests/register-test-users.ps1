# User Registration Script for Load Testing

# Configuration
$apiBaseUrl = "http://localhost:5000/api" # Change this to match your backend URL
$usersFilePath = ".\test-data\users.csv"
$registerEndpoint = "$apiBaseUrl/auth/signup"

# Import the CSV file
$users = Import-Csv -Path $usersFilePath

# Function to register a user
function Register-User {
    param (
        [string]$name,
        [string]$email,
        [string]$password
    )
    
    $body = @{
        "Name" = $name
        "email" = $email
        "password" = $password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $registerEndpoint -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "Successfully registered user: $email" -ForegroundColor Green
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        # If user already exists (400 status code), that's okay for our purposes
        if ($statusCode -eq 400) {
            Write-Host "User $email already exists. Skipping." -ForegroundColor Yellow
            return $true
        }
        else {
            Write-Host "Failed to register user $email. Status code: $statusCode" -ForegroundColor Red
            Write-Host "Error details: $_" -ForegroundColor Red
            return $false
        }
    }
}

# Register all users from the CSV
$totalUsers = $users.Count
$successfulRegistrations = 0

Write-Host "Starting registration of $totalUsers test users..." -ForegroundColor Cyan

foreach ($user in $users) {
    $result = Register-User -name $user.name -email $user.email -password $user.password
    if ($result) {
        $successfulRegistrations++
    }
    
    # Add a small delay to prevent overwhelming the server
    Start-Sleep -Milliseconds 100
}

Write-Host "Registration complete. Successfully registered or confirmed $successfulRegistrations out of $totalUsers users." -ForegroundColor Cyan