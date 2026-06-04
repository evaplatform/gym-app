const fs = require("fs");
const path = require("path");

console.log("🔧 Patching react-native-reanimated...");

const buildGradlePath = path.join(
  __dirname,
  "node_modules",
  "react-native-reanimated",
  "android",
  "build.gradle",
);

if (!fs.existsSync(buildGradlePath)) {
  console.error("❌ build.gradle not found at:", buildGradlePath);
  process.exit(1);
}

let content = fs.readFileSync(buildGradlePath, "utf8");

// Pattern para encontrar a função problemática
const pattern =
  /def resolveReactNativeWorkletsDirectory\(\) \{[\s\S]*?return file\(reactNativeWorkletsDir\)\.getParentFile\(\)\s*\}/;

const replacement = `def resolveReactNativeWorkletsDirectory() { try { def reactNativeWorkletsDir = providers.exec { workingDir(projectDir) commandLine("node", "--print", "require.resolve('react-native-worklets-core/package.json', { paths: [require.resolve('react-native-reanimated/package.json')] })") }.standardOutput.asText.get().trim() return file(reactNativeWorkletsDir).getParentFile() } catch (Exception e) { logger.warn("Could not resolve react-native-worklets-core: \${e.message}") // Fallback para null se não encontrar return null } }`;

if (content.match(pattern)) {
  content = content.replace(pattern, replacement);
  fs.writeFileSync(buildGradlePath, content);
  console.log("✅ Successfully patched react-native-reanimated build.gradle");
} else {
  console.log("⚠️ Pattern not found - checking if already patched...");
  if (
    content.includes("try {") &&
    content.includes("resolveReactNativeWorkletsDirectory")
  ) {
    console.log("✅ Already patched!");
  } else {
    console.log("❌ Manual patch required. Check the file at:");
    console.log(buildGradlePath);
  }
}
