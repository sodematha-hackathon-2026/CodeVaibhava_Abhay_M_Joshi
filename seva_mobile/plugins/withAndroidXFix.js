const { withProjectBuildGradle, withAppBuildGradle } = require("@expo/config-plugins");

module.exports = (config) => {
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      if (!config.modResults.contents.includes("resolutionStrategy")) {
        config.modResults.contents = config.modResults.contents.replace(
          /allprojects {/g,
          `allprojects {
    configurations.all {
        resolutionStrategy {
            force "androidx.core:core:1.16.0"
            force "androidx.versionedparcelable:versionedparcelable:1.1.1"
            force "androidx.customview:customview:1.1.0"
        }
        exclude group: "com.android.support", module: "support-compat"
        exclude group: "com.android.support", module: "versionedparcelable"
        exclude group: "com.android.support", module: "customview"
    }`
        );
      }
    }
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      const packagingBlock = `
    packagingOptions {
        pickFirst 'META-INF/*.version'
        pickFirst 'META-INF/library_release.reddit'
    }
`;
      if (config.modResults.contents.includes("android {")) {
        config.modResults.contents = config.modResults.contents.replace(
          /android {/,
          `android { ${packagingBlock}`
        );
      } else {
        config.modResults.contents += `\nandroid { ${packagingBlock} }`;
      }
    }
    return config;
  });

  return config;
};