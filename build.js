/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fs = require('fs')
const { prodConfig } = require('./esbuild_config')

require('esbuild')
  .build(prodConfig)
  .then(async result => {
    // output bundle
    /*
for (const out of result.outputFiles) {
  await fs.mkdirp(path.dirname(out.path))
  await fs.writeFile(out.path, new TextDecoder().decode(out.contents), 'utf8')
}
*/ if (result.metafile) {
      // use https://bundle-buddy.com/esbuild to analyses
      await fs.writeFileSync('./build/metafile.json', JSON.stringify(result.metafile))
    }
  })
