import './commands'

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

function seed() {
  cy.request('/api/cypress/seed')
}

beforeEach(seed)
