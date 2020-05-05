/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Misc tests', function () {
  this.beforeEach(function () {
    cy.visit('http://localhost:8000/form/bsc_computer_science')
  })

  it('Locale can be changed and translations work', function () {
    cy.contains('Answers are saved automatically. ')
    cy.get('[data-cy=navBar-localeDropdown]').click()
    cy.get('[data-cy=navBar-localeOption-fi]').click()
    cy.contains('Vastaukset tallentuvat automaattisesti.')
  })
})
