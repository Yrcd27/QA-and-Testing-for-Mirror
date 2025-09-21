@echo off
REM JMeter Load Test Runner
REM This script will run the JMeter load test for the Mirror API Login endpoint

echo ====================================================
echo JMeter Load Test Runner for Mirror Login API
echo ====================================================

REM Check if JMETER_HOME environment variable is set
if "%JMETER_HOME%" == "" (
    REM No environment variable, check if path is passed as parameter
    if "%~1" == "" (
        REM No parameter, use default path
        set "JMETER_HOME=D:\Setups\apache-jmeter-5.6.3\apache-jmeter-5.6.3"
        echo Using default JMeter installation path: "%JMETER_HOME%"
        echo If this is incorrect, please run with your JMeter path as parameter:
        echo run-load-test.bat "C:\path\to\your\apache-jmeter"
    ) else (
        REM Use parameter as JMeter path
        set "JMETER_HOME=%~1"
        echo Using provided JMeter installation path: "%JMETER_HOME%"
    )
) else (
    echo Using JMeter installation from environment variable: "%JMETER_HOME%"
)

REM Get current directory (with proper handling of spaces)
set "CURRENT_DIR=%~dp0"

REM Set paths (with proper handling of spaces)
set "TEST_PLAN=%CURRENT_DIR%scripts\login-api-load-test.jmx"
set "RESULTS_DIR=%CURRENT_DIR%results"

REM Create timestamp with proper formatting
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIMESTAMP=%dt:~0,8%-%dt:~8,6%"
set "RESULTS_FILE=%RESULTS_DIR%\results-%TIMESTAMP%.csv"
set "DASHBOARD_DIR=%RESULTS_DIR%\dashboard-%TIMESTAMP%"

echo JMeter Home: "%JMETER_HOME%"
echo Test Plan: "%TEST_PLAN%"
echo Results will be saved to: "%RESULTS_FILE%"
echo Dashboard will be generated at: "%DASHBOARD_DIR%"

REM Create results directory if it doesn't exist
if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"

echo.
echo Running JMeter load test...
echo This may take a while depending on your test configuration.
echo.

REM Run JMeter in non-GUI mode
"%JMETER_HOME%\bin\jmeter.bat" -n -t "%TEST_PLAN%" -l "%RESULTS_FILE%" -e -o "%DASHBOARD_DIR%"

REM Check if the test completed successfully
if %ERRORLEVEL% == 0 (
    echo.
    echo Load test completed successfully!
    echo.
    echo Results saved to: %RESULTS_FILE%
    echo Dashboard report generated at: %DASHBOARD_DIR%
    echo Open %DASHBOARD_DIR%\index.html in a browser to view the detailed report.
    echo.
    
    REM Try to open the dashboard report automatically
    start "" "%DASHBOARD_DIR%\index.html"
) else (
    echo.
    echo Load test failed with error code %ERRORLEVEL%
    echo Please check the output above for errors.
    echo.
)

pause