#!/bin/bash

# Configurações
RELEASE_KEYSTORE="release.keystore"
KEYSTORE_PASS="salmos@23"
KEY_ALIAS="my-key-alias"
KEY_PASS="salmos@23"
OUTPUT_APK="app-release.apk"

# Verifique se o keystore existe
if [ ! -f "$RELEASE_KEYSTORE" ]; then
    echo "Erro: Keystore não encontrado em $RELEASE_KEYSTORE"
    exit 1
fi

# Copie o keystore para o local correto
cp "$RELEASE_KEYSTORE" android/app/

# Construa o APK
echo "Construindo o APK..."
cd android
./gradlew clean
./gradlew assembleRelease

# Verifique se o APK foi gerado
if [ ! -f app/build/outputs/apk/release/app-release.apk ]; then
    echo "Erro: APK não foi gerado!"
    exit 1
fi

# Copie o APK para a raiz do projeto
cp app/build/outputs/apk/release/app-release.apk "../$OUTPUT_APK"

cd ..
echo "APK gerado: $OUTPUT_APK"
echo "Instale o APK com: adb install -r $OUTPUT_APK"