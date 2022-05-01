/* eslint-disable */
require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
const { sassPlugin } = require('esbuild-sass-plugin')

require('express-async-errors')

const { PORT, inProduction } = require('@util/common')
const logger = require('@util/logger')

const { initializeDatabaseConnection } = require('@root/server/database/connection')

const { startBackupJob } = require('@root/server/scripts/backupAnswers')
const { startDeadlineWatcher } = require('@root/server/scripts/deadlineWatcher')
const { seed } = require('@root/server/scripts/seed')
const { generateMissingTokens } = require('@root/server/scripts/generateMissingTokens')
const { getUserList } = require('@root/server/scripts/getUserList')
const { createTempAnswers } = require('@root/server/scripts/createTempAnswers')

initializeDatabaseConnection()
  .then(() => {
    // Scripts that can be ran manually
    if (process.argv[2]) {
      switch (process.argv[2]) {
        case 'seed':
          seed()
          return
        case 'generateMissingTokens':
          generateMissingTokens()
          return
        case 'getUserList':
          getUserList()
          return
        case 'generateMissingTempAnswers':
          createTempAnswers()
          return
        default:
          return
      }
    }

    const app = express()
    const server = require('http').Server(app)
    const io = require('socket.io')(server)
    io.on('connection', socket => {
      socket.on('update_field', room => require('@util/websocketHandlers').updateField(socket, room, io))
      socket.on('join', room => require('@util/websocketHandlers').joinRoom(socket, room, io))
      socket.on('leave', room => require('@util/websocketHandlers').leaveRoom(socket, room))
      socket.on('get_lock', room => require('@util/websocketHandlers').getLock(socket, room, io))
    })

    // Require is here so we can delete it from cache when files change (*)
    app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

    /**
     *  Use "hot loading" in backend
     */
    const watcher = chokidar.watch('server, client') // Watch server folder
    watcher.on('ready', () => {
      watcher.on('server, client', () => {
        logger.info('Hot reloaded.')
        Object.keys(require.cache).forEach(id => {
          if (id.includes('server')) delete require.cache[id] // Delete all require caches that point to server folder (*)
          if (id.includes('client')) delete require.cache[id] // Delete all require caches that point to server folder (*)
        })
      })
    })

    /**
     * For frontend use hot loading when in development, else serve the static content
     */

    if (!inProduction) {
      require('esbuild').build({
        entryPoints: ['client/index.js'],
        loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
        sourcemap: 'external',
        bundle: true,
        outdir: 'dist',
        define: { 'process.env.BASE_PATH': "'/'", 'process.env.NODE_ENV': "'development'", 'process.env.ENVIRONMENT': "'development'", global: 'window' },
        plugins: [sassPlugin()],
        color: true,
        watch: true,
      }).then(s => logger.info("Build successful"))
    } else {
      require('esbuild').build({
        entryPoints: ['client/index.js'],
        loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' },
        bundle: true,
        minify: true,
        outdir: 'dist',
        define: { 'process.env.NODE_ENV': "'production'", 'process.env.ENVIRONMENT': "'production'", global: 'window' },
        plugins: [sassPlugin()],
        color: true,
      }).then(s => logger.info("Build successful"))
    }

    const DIST_PATH = path.resolve(__dirname, './dist')
    const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

    app.use(express.static(DIST_PATH))
    app.get('*', (req, res) => res.sendFile(INDEX_PATH))

    server.listen(PORT, () => {
      logger.info(`Started on port ${PORT}`)
      startBackupJob()
      startDeadlineWatcher()
    })
  })
  .catch(e => {
    process.exitCode = 1
    logger.error(e)
  })
