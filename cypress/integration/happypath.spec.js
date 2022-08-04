/* eslint-disable no-undef */
/// <reference types="cypress" />
import '../support/commands'

describe('Core tests', () => {
  beforeEach(() => {
    cy.login('cypressNoRightsUser')
    cy.visit('/')
  })

  it('Frontpage loads', () => {
    cy.get('[data-cy=no-permissions-message]')
  })
})
