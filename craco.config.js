// This is a configuration file for CRACO (Create React App Configuration Override)
// It allows customizing the webpack configuration of Create React App without ejecting

// Load environment variables from .env files using agilite-utils
require('agilite-utils/dist/dotenv').default.config()

module.exports = {
  webpack: {
    // Customize webpack configuration
    configure: (config) => ({
      ...config,
      module: {
        ...config.module,
        // Modify webpack rules to exclude certain file types from being processed
        rules: config.module.rules.map((rule) => {
          if (rule.oneOf instanceof Array) {
            // Exclude JS/TS files, HTML, and JSON from the last rule in oneOf array
            // This prevents double-processing of these files
            // eslint-disable-next-line no-param-reassign
            rule.oneOf[rule.oneOf.length - 1].exclude = [/\.(js|mjs|jsx|cjs|ts|tsx)$/, /\.html$/, /\.json$/]
          }
          return rule
        })
      },
      resolve: {
        // Disable the crypto polyfill as it's not needed
        fallback: {
          crypto: false
        }
      }
    })
  }
}
