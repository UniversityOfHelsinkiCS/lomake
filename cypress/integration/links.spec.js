/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Link tests', function () {
  this.beforeEach(function () {
    cy.request('/api/cypress/resetTokens')
    cy.request('/api/cypress/resetUsers')
    cy.login('cypressUser')
  })

  it('Can claim read access', function () {
    cy.visit('/access/readTest')
    cy.get('[data-cy=claim-button]').click()
    cy.get('[data-cy=smileytable-link-to-TOSKA101]')
  })

  it('Can claim write access', function () {
    cy.visit('/access/writeTest')
    cy.get('[data-cy=claim-button]').click()
    cy.get('[data-cy=smileytable-link-to-TOSKA101]')
  })

  it('Can claim admin (owner) access after typing confirmation', function () {
    cy.visit('/access/adminTest')
    cy.get('[data-cy=claim-button]').should('be.disabled')
    cy.get('[data-cy=claimAccessPage-confirmation-input]').type('TOSKA-en')
    cy.get('[data-cy=claim-button]').click()
    cy.get('[data-cy=TOSKA101-manage]').click()
    cy.get('[data-cy=read-cypressUser]').should('have.class', 'check')
    cy.get('[data-cy=write-cypressUser]').should('have.class', 'check')
    cy.get('[data-cy=admin-cypressUser]').should('have.class', 'check')
  })

  it("Can't use admin link more than once", function () {
    cy.visit('/access/adminTest')
    cy.get('[data-cy=claimAccessPage-confirmation-input]').type('TOSKA-en')
    cy.get('[data-cy=claim-button]').click()
    cy.visit('/access/adminTest')
    cy.get('[data-cy=invalidTokenError]')
  })

  it("Can't claim token that does not exist", function () {
    cy.visit('/access/kdaskdaskadsk')
    cy.get('[data-cy=invalidTokenError]')
  })
})
