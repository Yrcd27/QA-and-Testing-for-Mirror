@echo off
echo ===============================================
echo Running Automated Test Suite for Mirror Application
echo ===============================================

echo.
echo 1. Running Login Test
node login-test.js
echo.
echo.

echo 2. Running Journal Creation Test
node journal-creation-test.js
echo.
echo.

echo ===============================================
echo All tests completed!
echo ===============================================
pause