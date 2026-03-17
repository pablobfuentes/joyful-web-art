@echo off
setlocal

REM Simple launcher for the Hostinger sync PowerShell script.
REM Run this from the repo root (WebPage2) after building your site.
REM Example:
REM   npm run build
REM   HostingerUpdater.bat

set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%

REM Default directories (can be overridden via environment variables)
set HOSTINGER_DIR=%REPO_ROOT%Hostinger
set DIST_DIR=%REPO_ROOT%dist

echo [HostingerUpdater] Repo root: %REPO_ROOT%
echo [HostingerUpdater] Hostinger dir: %HOSTINGER_DIR%
echo [HostingerUpdater] Dist dir: %DIST_DIR%

powershell -NoProfile -ExecutionPolicy Bypass ^
  -File "%REPO_ROOT%scripts\sync-hostinger.ps1" ^
  -HostingerDir "%HOSTINGER_DIR%" ^
  -DistDir "%DIST_DIR%"

if errorlevel 1 (
  echo [HostingerUpdater] Sync failed.
  exit /b 1
) else (
  echo [HostingerUpdater] Sync completed successfully.
)

endlocal
exit /b 0

