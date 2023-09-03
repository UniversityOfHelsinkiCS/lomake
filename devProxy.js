/* eslint-disable no-console */

const http = require('node:http')
const { startEsbuild } = require('./buildDev')

const BACKEND_PORT = 8001
const PROXY_PORT = 8000

const createProxy = (host, port) => {
  http
    .createServer((req, res) => {
      try {
        // Shit routing to backend
        if (req.url.startsWith('/api') || req.url.startsWith('/socket.io')) {
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
            console.log(`Proxyreq got the following error: ${e.message}`)
          })

          req.pipe(proxyReq, { end: true })
          return
        }

        const options = {
          hostname: host,
          port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        }

        // So that client side routing works when first loading app with url other than /
        if (
          !options.path.startsWith('/esbuild') &&
          !options.path.startsWith('/favicon') &&
          !options.path.startsWith('/index.js') &&
          !options.path.startsWith('/index.css')
        ) {
          options.path = '/'
        }

        // Forward each incoming request to esbuild
        const proxyReq = http.request(options, proxyRes => {
          try {
            // If esbuild returns "not found", send a custom 404 page
            if (proxyRes.statusCode === 404) {
              res.writeHead(404, { 'Content-Type': 'text/html' })
              res.end('<h1>A custom 404 page</h1>')
              return
            }

            // Otherwise, forward the response from esbuild to the client
            res.writeHead(proxyRes.statusCode, proxyRes.headers)
            proxyRes.pipe(res, { end: true })
          } catch (e) {
            console.log(e.message)
            res.end()
          }
        })

        // Forward the body of the request to esbuild
        req.pipe(proxyReq, { end: true })
      } catch (e) {
        console.log(e.message)
        res.end()
      }
    })
    .listen(PROXY_PORT)
    .on('error', e => {
      console.log(e.message)
      process.exit(1)
    })

  console.log(`Proxy listening on ${PROXY_PORT}`)
}

startEsbuild().then(({ host, port }) => createProxy(host, port))
