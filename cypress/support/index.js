import './commands'

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

function seed() {
  cy.request('/api/cypress/seed')
}

// eslint-disable-next-line import/prefer-default-export
export const LOMAKE_NOW = new Date('2024-10-01T00:00:00.000Z')

beforeEach(seed)
