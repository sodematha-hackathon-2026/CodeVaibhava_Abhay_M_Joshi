const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withManifestFix(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    androidManifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";


    mainApplication.$["android:appComponentFactory"] = "androidx.core.app.CoreComponentFactory";

    mainApplication.$["tools:replace"] = "android:appComponentFactory";

    return config;
  });
};