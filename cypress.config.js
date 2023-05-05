// eslint-disable-next-line
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    viewportWidth: 1500,
    viewportHeight: 1200,
    watchForFileChanges: false,
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/*.spec.js',
    experimentalRunAllSpecs: true,
  },
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
})
