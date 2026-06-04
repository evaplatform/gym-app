@echo off
REM Configurações

Remove-Item .\build-release.apk

set RELEASE_KEYSTORE=release.keystore
set KEYSTORE_PASS=salmos@23
set KEY_ALIAS=my-key-alias
set KEY_PASS=salmos@23
set OUTPUT_APK=app-release.apk

REM Verifique se o keystore existe
if not exist "%RELEASE_KEYSTORE%" (
    echo Erro: Keystore não encontrado em %RELEASE_KEYSTORE%
    exit /b 1
)

REM Copie o keystore para o local correto
copy "%RELEASE_KEYSTORE%" android\app\

REM Construa o APK
echo Construindo o APK...
cd android
call gradlew clean
call gradlew assembleRelease

REM Verifique se o APK foi gerado
if not exist app\build\outputs\apk\release\app-release.apk (
    echo Erro: APK não foi gerado!
    exit /b 1
)

REM Copie o APK para a raiz do projeto
copy app\build\outputs\apk\release\app-release.apk "..\%OUTPUT_APK%"

cd ..
echo APK gerado: %OUTPUT_APK%
echo Instale o APK com: adb install -r %OUTPUT_APK%
pause