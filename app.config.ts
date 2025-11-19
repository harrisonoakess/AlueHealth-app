export default () => ({
  expo: {
    name: "AlueHealth",
    slug: "aluehealth",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/aluehealth-app_splash.png",
    scheme: "aluehealth",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/aluehealth-app_splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aluehealth.app",
      buildNumber: "4",
      infoPlist: {
        NSCameraUsageDescription: "We use the camera to capture meal photos.",
        NSPhotoLibraryUsageDescription: "We access your photo library so you can upload meal images.",
        NSMicrophoneUsageDescription: "Microphone is used for optional voice notes.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.aluehealth.app",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "d0e611c4-fe8f-4ff5-9187-58c94c6823a5",
      },
    },
  },
});
