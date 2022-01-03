/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Core tests', function () {
  this.beforeEach(function () {
    cy.login('cypressUser')
    cy.visit('/')
  })

  it('Frontpage loads', function () {
    cy.get('[data-cy=no-permissions-message]')
  })

  /* changed filter so that it only shows up when >10 programs to view - add more programs the test user can see
     or remove this test?
  it('Filter works and form can be opened', function () {
    cy.get('[data-cy=overviewpage-filter]').type("bachelor's programme in computer science")
    cy.get('[data-cy^=colortable-link-to]').should('have.length', 1).click()
    cy.get('[data-cy=formview-title]')
  }) */
})
