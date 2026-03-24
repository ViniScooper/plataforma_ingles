@echo off
REM Script para rodar a plataforma de ingles

echo ========================================
echo Plataforma de Ingles - Startup Script
echo ========================================

REM Verificar se está na pasta correta
if not exist "package.json" (
    echo Erro: NÃO ESTÁ NO DIRETÓRIO CORRETO
    echo Execute este script da raiz do projeto (template_react_login)
    pause
    exit /b 1
)

REM Oferecer opções
echo.
echo Escolha o que deseja rodar:
echo 1 - Backend apenas
echo 2 - Frontend apenas
echo 3 - Ambos (Backend + Frontend - abre em 2 abas)
echo.

set /p choice="Escolha (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo Iniciando Backend...
    cd backend
    npm start
) else if "%choice%"=="2" (
    echo.
    echo Iniciando Frontend...
    npm run dev
) else if "%choice%"=="3" (
    echo.
    echo Iniciando Backend...
    start cmd /k "cd backend && npm start"
    timeout /t 3
    echo Iniciando Frontend...
    npm run dev
) else (
    echo Opção inválida!
    pause
    exit /b 1
)
