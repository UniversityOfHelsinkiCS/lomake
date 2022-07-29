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
    global: 'window',
  },
  plugins: [sassPlugin()],
  color: true,
  logLevel: 'info',
}

module.exports = { devConfig, prodConfig }
