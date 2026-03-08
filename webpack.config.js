const { createWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createWebpackConfigAsync(
    {
      ...env,
      pwa: true, // Active le support PWA automatiquement
    },
    argv
  );

  // Optimisations supplémentaires
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
    },
  };

  return config;
};
