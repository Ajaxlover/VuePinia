export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Chrome >= 60',
        'Firefox >= 60',
        'Safari >= 12',
        'Edge >= 79',
        '> 1%',
        'last 2 versions',
        'not dead'
      ]
    },
    cssnano: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true
        }
      ]
    }
  }
}