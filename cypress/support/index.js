import './commands'

function seed() {
  cy.request('/api/cypress/seed')
}

beforeEach(seed)
