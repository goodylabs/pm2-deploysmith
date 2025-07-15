export default {
  test: {
    include: [
    'test/**/*.test.mjs'
    ],
    exclude: [
      'test-e2e/**'
    ],
    coverage: {
      exclude: [
        'bin/index.mjs',
        'eslint.config.js',
        'vitest.config.js',
        'test-e2e/**'
      ],
    },
  },
}