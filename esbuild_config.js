const { sassPlugin } = require('esbuild-sass-plugin')
// const { sentryEsbuildPlugin } = require('@sentry/esbuild-plugin')

const devConfig = {
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  sourcemap: true,
  bundle: true,
  outdir: 'dev',
  define: {
    'process.env.BASE_PATH': "'/'",
    'process.env.NODE_ENV': "'development'",
    'process.env.ENVIRONMENT': "'development'",
    'process.env.SENTRY_ENVIRONMENT': "'development'",
    global: 'window',
  },
  plugins: [sassPlugin()],
  color: true,
}

const stagingConfig = {
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  bundle: true,
  minify: true,
  outdir: 'build',
  define: {
    'process.env.BASE_PATH': "'/tilannekuva/'",
    'process.env.NODE_ENV': "'production'",
    'process.env.ENVIRONMENT': "'production'",
    'process.env.SENTRY_ENVIRONMENT': "'staging'",
    global: 'window',
  },
  plugins: [sassPlugin()],
  color: true,
}

const prodConfig = {
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  bundle: true,
  minify: true,
  outdir: 'build',
  define: {
    'process.env.BASE_PATH': "'/tilannekuva/'",
    'process.env.NODE_ENV': "'production'",
    'process.env.ENVIRONMENT': "'production'",
    'process.env.SENTRY_ENVIRONMENT': `'${process.env.SENTRY_ENVIRONMENT}'` || "'production'",
    global: 'window',
  },
  sourcemap: true,
  plugins: [
    sassPlugin(),
    /* sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'toska',
      project: 'lomake',
      url: 'https://sentry.cs.helsinki.fi/',
    }), */
  ],
  color: true,
}

module.exports = { devConfig, prodConfig, stagingConfig }
