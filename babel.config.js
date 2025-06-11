module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Use React 17 automatic JSX runtime.
          jsxRuntime: "automatic",
        },
        //  "react-native-reanimated/plugin",
        // ["module-resolver", {
        //   alias: {
        //     "^react-native$": "react-native"
        //   }
        // }]
      ],
    ],
  };
};
