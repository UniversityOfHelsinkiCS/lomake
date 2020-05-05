/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Form tests', function () {
  this.beforeEach(function () {
    cy.visit('http://localhost:8000/form/bsc_computer_science')
  })

  // This function just clears the forms' input fields
  //   this.beforeAll(function () {
  //     cy.visit('http://localhost:8000/form/bsc_computer_science')
  //     cy.get('[data-cy^=form-section').click({ multiple: true })
  //     cy.get('.editor-class').each(function (el, index, list) {
  //       cy.get(el).click()
  //       cy.focused().clear()
  //     })
  //   })

  it('Can open a question, click on smiley face, and the result it saved.', () => {
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=street-light-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('http://localhost:8000')

    cy.get('[data-cy=bsc_computer_science-0]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get('[data-cy=bsc_computer_science-9]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can write to a textfield and the answer is saved.', function () {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()

    cy.focused().clear()
    cy.focused().type('kissa')
    cy.wait(2000) // Bad practice, but it works :)
    cy.reload()

    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .should('contain.text', 'kissa')
  })
})
