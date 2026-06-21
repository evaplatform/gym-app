@echo off
echo ========================================
echo  LIMPEZA E BUILD COMPLETO
echo ========================================

REM Limpar caches
echo [1/6] Limpando caches...
if exist node_modules rmdir /s /q node_modules
if exist android\.gradle rmdir /s /q android\.gradle
if exist android\app\.cxx rmdir /s /q android\app\.cxx
if exist android\app\build rmdir /s /q android\app\build
if exist android\build rmdir /s /q android\build
if exist .expo rmdir /s /q .expo
if exist package-lock.json del package-lock.json

REM Reinstalar dependências
echo [2/6] Reinstalando dependencias...
call npm install

REM Gerar codegen
echo [3/6] Gerando arquivos de codegen...
cd android
call gradlew :app:generateCodegenArtifactsFromSchema

REM Limpar build anterior
echo [4/6] Limpando build anterior...
call gradlew clean

REM Gerar APK
echo [5/6] Gerando APK de desenvolvimento...
call gradlew assembleDebug

REM Verificar se foi gerado
if not exist app\build\outputs\apk\debug\app-debug.apk (
    echo ERRO: APK nao foi gerado!
    cd ..
    pause
    exit /b 1
)

REM Copiar APK
echo [6/6] Copiando APK...
copy app\build\outputs\apk\debug\app-debug.apk ..\app-dev.apk

cd ..

echo.
echo ========================================
echo  BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo   1. adb uninstall com.seuapp.packagename
echo   2. adb install -r app-dev.apk
echo   3. adb reverse tcp:8081 tcp:8081
echo   4. npx expo start --dev-client --localhost
echo ========================================
pause