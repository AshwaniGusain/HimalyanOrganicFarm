@echo off
setlocal
cd /d "%~dp0"
REM Download images script for Himalyan Organic Farm
REM Uses PowerShell script for consistent behavior on Windows

echo.
echo ==========================================
echo Himalyan Organic Farm - Image Downloader
echo ==========================================
echo.

echo Running PowerShell downloader...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0download_images.ps1"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo SUCCESS! All images downloaded.
    echo ==========================================
) else (
    echo.
    echo ERROR: Download failed. Check internet connection.
)

pause
