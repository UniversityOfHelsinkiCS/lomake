/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Form tests', function () {
  this.beforeEach(function () {
    cy.login('cypressUser')
    cy.visit('/form/KH50_005')
  })

  // This function just clears the forms' input fields
  //   this.beforeAll(function () {
  //     cy.visit('/form/KH50_005')
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
    cy.visit('/')

    cy.get('[data-cy=KH50_005-review_of_last_years_situation_report]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get('[data-cy=KH50_005-community_wellbeing]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can write to a textfield and the answer is saved.', function () {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.server()
    cy.focused().clear()

    cy.route('POST', '/socket.io/*').as('update')
    cy.focused().type('kissa')

    // There should be 5 post requests to socket.io, because kissa is a 5 letter word.
    cy.wait('@update').wait('@update').wait('@update').wait('@update').wait('@update')

    cy.reload()

    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .should('contain.text', 'kissa')
  })

  it('Can see upcoming deadline date', function () {
    cy.get('[data-cy=statusMessage]').contains('Deadline: ')
  })
})
