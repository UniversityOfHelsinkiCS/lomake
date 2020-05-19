/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe('Form tests', function () {
  this.beforeEach(function () {
    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeName}`)
  })

  it('Can open a question, click on smiley face, and the result it saved.', () => {
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=street-light-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('/')

    cy.get(`[data-cy=${testProgrammeName}-review_of_last_years_situation_report]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get(`[data-cy=${testProgrammeName}-community_wellbeing]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can write to a textfield and the answer is saved.', function () {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.server()
    cy.focused().clear()

    cy.route('POST', '/socket.io/*').as('update')
    cy.focused().type('kissa', { delay: 500 })

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

  it('Measurements are created dynamically', function () {})
})
