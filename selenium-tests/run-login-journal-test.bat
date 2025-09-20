@echo off
echo ===============================================
echo     Login and Journal Creation Test Runner
echo ===============================================
echo.
echo This script will run an automated test that:
echo  1. Logs in to your application
echo  2. Creates a new journal entry
echo  3. Saves screenshots of the process
echo.
echo Ensure your backend and frontend servers are running!
echo.
echo Press any key to start the test...
pause > nul

cd /d "%~dp0"
echo Running test...
echo.
node login-journal-test.js
echo.
echo Press any key to exit...
pause > nul