@echo off
title AccedeED Prototype - Google Login
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Creando entorno virtual de AccedeED...
    python -m venv .venv
    if errorlevel 1 goto error
)

echo Comprobando dependencias de AccedeED...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto error

echo.
echo Iniciando AccedeED con el login de Google...
".venv\Scripts\python.exe" app.py
if errorlevel 1 goto error
goto end

:error
echo.
echo No se pudo iniciar AccedeED.
echo Verifica que Python 3 este instalado y que el puerto 5000 este libre.
pause

:end
