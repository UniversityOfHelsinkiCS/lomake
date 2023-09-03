/* eslint-disable no-console */

const http = require('node:http')
const esbuild = require('esbuild')
const { devConfig } = require('./esbuild_config')

const BACKEND_PORT = 8001
const ESBUILD_PORT = 8002
const PROXY_PORT = 8000

const BACKEND_ROUTES = ['/api', '/socket.io']
const STATIC_ROUTES = ['/favicon.ico', '/index.js', '/index.css', '/esbuild']

/**
 * See https://esbuild.github.io/api/#live-reload
 */
const startEsbuild = async () => {
  const esbuildCtx = await esbuild.context(devConfig)

  await esbuildCtx.watch()
  const { host, port } = await esbuildCtx.serve({
    port: ESBUILD_PORT,
    servedir: 'dev',
  })

  console.log(`[Esbuild] serving on ${host}:${port}`)

  return { host, port }
}

/**
 * Start proxy server on PROXY_PORT
 * See https://esbuild.github.io/api/#serve-proxy
 *
 *
 */
const createProxy = (host, port) => {
  http
    .createServer((req, res) => {
      if (BACKEND_ROUTES.some(route => req.url.startsWith(route))) {
        // Forward incoming request to backend
        const proxyReq = http.request(
          {
            hostname: host,
            port: BACKEND_PORT,
            path: req.url,
            method: req.method,
            headers: req.headers,
          },
          proxyRes => {
            try {
              res.writeHead(proxyRes.statusCode, proxyRes.headers)
              proxyRes.pipe(res, { end: true })
            } catch (e) {
              console.log(e.message)
              res.end()
            }
          }
        )

        // This is the magic to fix Socket hang up when nodemon restarts backend. Now it doesn't process.exit(1)
        proxyReq.on('error', e => {
          console.log(`[DevProxy] error: ${e.message}`)
        })

        req.pipe(proxyReq, { end: true })
        return
      }

      // So that client side routing works when first loading app with url other than /
      let path = req.url
      if (!STATIC_ROUTES.some(route => req.url.startsWith(route))) {
        path = '/'
      }

      // Forward incoming request to esbuild
      const proxyReq = http.request(
        {
          hostname: host,
          port,
          path,
          method: req.method,
          headers: req.headers,
        },
        proxyRes => {
          try {
            res.writeHead(proxyRes.statusCode, proxyRes.headers)
            proxyRes.pipe(res, { end: true })
          } catch (e) {
            console.log(e.message)
            res.end()
          }
        }
      )

      // Forward the body of the request to esbuild
      req.pipe(proxyReq, { end: true })
    })
    .listen(PROXY_PORT)

  console.log(`[DevProxy] listening on ${PROXY_PORT}`)
}

startEsbuild().then(({ host, port }) => createProxy(host, port))
