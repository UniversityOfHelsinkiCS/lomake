const { sassPlugin } = require('esbuild-sass-plugin')

const devConfig = {
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  sourcemap: true,
  bundle: true,
  outdir: 'dist/dev',
  define: {
    'process.env.BASE_PATH': "'/'",
    'process.env.NODE_ENV': "'development'",
    'process.env.ENVIRONMENT': "'development'",
    'process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED': "false",
    global: 'window',
  },
  plugins: [sassPlugin()],
  color: true,
  watch: true,
}

const prodConfig = {
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  bundle: true,
  minify: true,
  outdir: 'dist/prod',
  define: {
    'process.env.BASE_PATH': "'/tilannekuva/'",
    'process.env.NODE_ENV': "'production'",
    'process.env.ENVIRONMENT': "'production'",
    'process.env.AUTOMATIC_IAM_PERMISSIONS_ENABLED': "true",
    global: 'window',
  },
  plugins: [sassPlugin()],
  color: true,
}

module.exports = { devConfig, prodConfig }
