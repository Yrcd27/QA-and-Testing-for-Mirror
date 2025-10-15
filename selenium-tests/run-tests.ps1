# PowerShell script to run all Selenium tests

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Running Automated Test Suite for Mirror Application" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Running Login Test" -ForegroundColor Yellow
node login-test.js
Write-Host ""
Write-Host ""

Write-Host "2. Running Journal Creation Test" -ForegroundColor Yellow
node journal-creation-test.js
Write-Host ""
Write-Host ""

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit"