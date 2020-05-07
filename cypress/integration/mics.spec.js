/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Misc tests', function () {
  this.beforeEach(function () {
    cy.visit('http://localhost:8000')
  })

  it('Locale can be changed and translations work', function () {
    cy.visit('http://localhost:8000/form/KH50_005')
    cy.contains('Answers are saved automatically. ')
    cy.get('[data-cy=navBar-localeDropdown]').click()
    cy.get('[data-cy=navBar-localeOption-fi]').click()
    cy.contains('Vastaukset tallentuvat automaattisesti.')
  })

  it('Access keys are pre-generated', function () {
    cy.get('[data-cy=KH80_001-manage]').click()
    cy.get('[data-cy=KH80_001-viewlink] > input').invoke('val').should('contain', '/access/')
    cy.get('[data-cy=KH80_001-editlink] > input').invoke('val').should('contain', '/access/')
  })

  it('Access link can be reset/updated', function () {
    cy.get('[data-cy=KH80_001-manage]').click()

    cy.get('[data-cy=KH80_001-viewlink] > input')
      .invoke('val')
      .then((text) => {
        const initialLink = text

        cy.get('[data-cy=KH80_001-viewlink-reset]')
          .click()
          .then(() => {
            cy.get('[data-cy=KH80_001-viewlink] > input')
              .invoke('val')
              .then((text) => {
                const newLink = text
                expect(initialLink).to.not.equal(newLink)
              })
          })
      })
  })
})
