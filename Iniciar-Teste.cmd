@echo off
cd /d "%~dp0"
where node >nul 2>&1
if %errorlevel% equ 0 (
  node server.mjs
) else (
  if exist "C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1105-1297-0_26.1105.1297.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe" (
    "C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1105-1297-0_26.1105.1297.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe" server.mjs
  ) else (
    echo Instale Node.js 20 ou posterior para executar o servidor local.
  )
)
pause
