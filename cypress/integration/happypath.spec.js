/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Core tests', () => {
  beforeEach(() => {
    cy.login('cypressNoRightsUser')
    cy.visit('/')
  })

  it('Frontpage loads', () => {
    cy.get('[data-cy=no-permissions-message]')
  })
})
