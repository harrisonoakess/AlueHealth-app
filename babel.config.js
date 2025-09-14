// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // ✅
      "nativewind/babel",                                       // ✅ preset
    ],
    plugins: [
      "react-native-worklets/plugin", // ✅ only this plugin, keep last
    ],
  };
};
