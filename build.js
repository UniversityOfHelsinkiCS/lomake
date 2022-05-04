const { sassPlugin } = require('esbuild-sass-plugin')

require('esbuild').build({
  entryPoints: ['client/index.js'],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
  bundle: true,
  minify: true,
  outdir: 'dist',
  define: { 'process.env.NODE_ENV': "'production'", 'process.env.ENVIRONMENT': "'production'", global: 'window' },
  plugins: [sassPlugin()],
  color: true,
})
