// eslint-disable-next-line
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    viewportWidth: 1500,
    viewportHeight: 1200,
    watchForFileChanges: false,
    supportFile: false,
    specPattern: 'cypress/integration/*.spec.js',
  },
})
