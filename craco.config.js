require('agilite-utils/dist/dotenv').default.config()

const path = require('path')

module.exports = {
  webpack: {
    /** Required for vibe-coding imports: `core/infra/…`, `core/store/…`, `assets/…`. */
    alias: {
      core: path.resolve(__dirname, 'src/core'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf instanceof Array) {
          // eslint-disable-next-line no-param-reassign
          rule.oneOf[rule.oneOf.length - 1].exclude = [/\.(js|mjs|jsx|cjs|ts|tsx)$/, /\.html$/, /\.json$/]
        }
      })

      webpackConfig.resolve = webpackConfig.resolve || {}
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        crypto: false,
      }

      return webpackConfig
    },
  },
}
