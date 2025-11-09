@echo off
setlocal enabledelayedexpansion

:: Configuration
set SCRIPT_NAME=coopcam.py
set RESTART_DELAY=5
set MAX_RESTARTS=10
set RESTART_COUNT=0
set LOG_FILE=auto_restart.log

:: Function to write log messages
:WriteLog
echo %date% %time% - %~1
echo %date% %time% - %~1 >> %LOG_FILE%
goto :eof

:: Main monitoring loop
call :WriteLog "=== CoopCam Auto-Restart Monitor Started ==="
call :WriteLog "Monitoring script: %SCRIPT_NAME%"
call :WriteLog "Max restart attempts: %MAX_RESTARTS%"
call :WriteLog "Restart delay: %RESTART_DELAY% seconds"
call :WriteLog "Press Ctrl+C to stop monitoring"

:MONITOR_LOOP
    set /a RESTART_COUNT+=1
    call :WriteLog "Starting %SCRIPT_NAME% (Attempt %RESTART_COUNT%/%MAX_RESTARTS%)..."
    
    :: Check if script exists
    if not exist "%SCRIPT_NAME%" (
        call :WriteLog "ERROR: Script %SCRIPT_NAME% not found!"
        pause
        exit /b 1
    )
    
    :: Start the Python script
    python %SCRIPT_NAME%
    
    :: If we get here, the script has exited
    call :WriteLog "WARNING: %SCRIPT_NAME% stopped running"
    
    :: Check if we've exceeded max restart attempts
    if %RESTART_COUNT% geq %MAX_RESTARTS% (
        call :WriteLog "ERROR: Maximum restart attempts (%MAX_RESTARTS%) reached. Exiting."
        pause
        exit /b 1
    )
    
    :: Wait before restarting
    call :WriteLog "Restarting in %RESTART_DELAY% seconds..."
    timeout /t %RESTART_DELAY% /nobreak >nul
    
    :: Loop back to restart
    goto MONITOR_LOOP

:END
call :WriteLog "=== Monitor stopped ==="
pause
