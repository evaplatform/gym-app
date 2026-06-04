@echo off
echo ========================================
echo  LIMPEZA COMPLETA DO PROJETO
echo ========================================

echo Parando procesos do Metro...
taskkill /F /IM node.exe 2>nul

echo Limpando cache do npm...
npm cache clean --force

echo Removendo node_modules...
rd /s /q node_modules 2>nul

echo Removendo android/build...
rd /s /q android\build 2>nul

echo Removendo android/app/build...
rd /s /q android\app\build 2>nul

echo Removendo .gradle...
rd /s /q android\.gradle 2>nul

echo Removendo %USERPROFILE%\.gradle\caches...
rd /s /q %USERPROFILE%\.gradle\caches 2>nul

echo Reinstalando dependencias...
npm install

echo Executando prebuild...
npx expo prebuild --clean

echo.
echo ========================================
echo  LIMPEZA CONCLUIDA!
echo ========================================
echo Agora execute: ./build-dev
pause