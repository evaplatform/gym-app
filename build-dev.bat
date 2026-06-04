@echo off
echo ========================================
echo  Gerando APK de DESENVOLVIMENTO
echo ========================================

REM Define NODE_ENV
set NODE_ENV=development

REM Limpar builds anteriores
echo Limpando builds anteriores...
cd android
call gradlew clean

REM Gerar APK de desenvolvimento
echo Gerando APK de desenvolvimento...
call gradlew assembleDebug

REM Verificar se foi gerado
if not exist app\build\outputs\apk\debug\app-debug.apk (
    echo Erro: APK nao foi gerado!
    cd ..
    pause
    exit /b 1
)

REM Copiar para raiz do projeto
echo Copiando APK para raiz do projeto...
copy app\build\outputs\apk\debug\app-debug.apk ..\app-dev.apk

cd ..

echo.
echo ========================================
echo  APK GERADO COM SUCESSO!
echo ========================================
echo Local: app-dev.apk
echo.
echo Para instalar no celular:
echo   adb install -r app-dev.apk
echo.
echo Depois de instalar, rode:
echo   npx expo start --dev-client
echo ========================================
pause