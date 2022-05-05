const { prodConfig } = require('./esbuild_config')

require('esbuild').build(prodConfig)
