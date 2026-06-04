const fs = require('fs');
const path = require('path');

console.log('🔧 Patching expo-modules-core and reanimated...');

// Patch expo-modules-core CSSProps.kt
const cssPropsPath = path.join(
  __dirname,
  'node_modules/expo-modules-core/android/src/main/java/expo/modules/kotlin/views/decorators/CSSProps.kt'
);

if (fs.existsSync(cssPropsPath)) {
  let content = fs.readFileSync(cssPropsPath, 'utf8');
  
  if (content.includes('BoxShadow.parse(boxShadow, reactContext)')) {
    content = content.replace(
      /BoxShadow\.parse\(boxShadow,\s*reactContext\)/g,
      'BoxShadow.parse(boxShadow)'
    );
    fs.writeFileSync(cssPropsPath, content);
    console.log('✅ Patched CSSProps.kt');
  } else {
    console.log('⏭️  CSSProps.kt already patched');
  }
}

// Patch expo-modules-core ReactNativeFeatureFlags.kt
const featureFlagsPath = path.join(
  __dirname,
  'node_modules/expo-modules-core/android/src/main/java/expo/modules/rncompatibility/ReactNativeFeatureFlags.kt'
);

if (fs.existsSync(featureFlagsPath)) {
  let content = fs.readFileSync(featureFlagsPath, 'utf8');
  
  if (content.includes('ReactNativeFeatureFlags.enableBridgelessArchitecture()')) {
    content = content.replace(
      /ReactNativeFeatureFlags\.enableBridgelessArchitecture\(\)/g,
      'false // Patched: ReactNativeFeatureFlags.enableBridgelessArchitecture()'
    );
    fs.writeFileSync(featureFlagsPath, content);
    console.log('✅ Patched ReactNativeFeatureFlags.kt');
  } else {
    console.log('⏭️  ReactNativeFeatureFlags.kt already patched');
  }
}

console.log('✅ Patches completed!');