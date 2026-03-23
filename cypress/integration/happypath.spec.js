/// <reference types="cypress" />
import '../support/commands'

describe('Core tests', () => {
  // Cypress.stop()
  // return
  beforeEach(() => {
    cy.login('cypressNoRightsUser')
    cy.visit('/yearly')
  })

  it('Frontpage loads', () => {
    cy.get('[data-cy=no-permissions-message]')
  })
})
