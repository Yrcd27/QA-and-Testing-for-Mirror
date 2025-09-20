Write-Host "Running Mirror Authentication Unit Tests..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install
Write-Host ""

Write-Host "Running Registration Tests..." -ForegroundColor Yellow
node ./node_modules/jest/bin/jest.js auth/registration.test.js --runInBand

Write-Host ""
Write-Host "Running Login Tests..." -ForegroundColor Yellow
node ./node_modules/jest/bin/jest.js auth/login.test.js --runInBand

Write-Host ""
Write-Host "All tests completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"