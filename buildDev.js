/* eslint-disable no-console */

const esbuild = require('esbuild')
const { devConfig } = require('./esbuild_config')

/**
 * See https://esbuild.github.io/api/#live-reload
 */
const startEsbuild = async () => {
  const esbuildCtx = await esbuild.context(devConfig)

  await esbuildCtx.watch()
  const { host, port } = await esbuildCtx.serve({
    port: 8002,
    servedir: 'dev',
  })

  console.log(`Serving build on ${host}:${port}`)

  return { host, port }
}

module.exports = { startEsbuild }
