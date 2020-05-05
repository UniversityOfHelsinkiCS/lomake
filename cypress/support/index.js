import './commands'

/**
 * ::Start localstorage config
 * Required because cypress automatically clears localstorage to prevent state from building up.
 * https://github.com/cypress-io/cypress/issues/461
 */
let cachedLocalStorageAuth = JSON.stringify({
  uid: 'cypressUser',
})

function restoreLocalStorageAuth() {
  if (cachedLocalStorageAuth) {
    localStorage.setItem('fakeUser', cachedLocalStorageAuth)
  }
}

function cacheLocalStorageAuth() {
  cachedLocalStorageAuth = localStorage.getItem('fakeUser')
}

Cypress.on('window:before:load', restoreLocalStorageAuth)
beforeEach(restoreLocalStorageAuth)
afterEach(cacheLocalStorageAuth)
// ::End localstorage config
