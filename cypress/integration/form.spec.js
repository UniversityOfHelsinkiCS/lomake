/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe('Form tests', function () {
  this.beforeEach(function () {
    const user = 'cypressUser'
    cy.givePermissions(user, testProgrammeName, 'write')
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
  })

  it('Can write to a textfield and the answer is saved.', function () {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()

    cy.writeToTextField('[contenteditable="true"]', 'kissa')
    cy.reload()

    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .should('contain.text', 'kissa')
  })

  it('Can open a question, click on smiley face, and the result it saved.', () => {
    cy.get('[data-cy=color-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('/')

    cy.get(`[data-cy=${testProgrammeName}-review_of_last_years_situation_report]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get(`[data-cy=${testProgrammeName}-community_wellbeing]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can see upcoming deadline date', function () {
    cy.get('[data-cy=saving-answers-notice]').contains('Final day')
  })

  it('Measurements are created dynamically and saved correctly', function () {
    cy.intercept('POST', '/socket.io/*').as('update')
    cy.get('#measures_1_text').type('1')
    cy.get('#measures_2_text').type('2')
    cy.get('#measures_4_text').should('not.exist')
    cy.get('#measures_3_text').type('3')
    cy.get('#measures_4_text').type('4')
    cy.get('#measures_5_text').type('5')
    cy.get('#measures_6_text').should('not.exist')

    let i = 0
    while (i < 5) {
      i++
      cy.wait('@update')
    }

    cy.reload()
    cy.get('#measures_1_text').contains('1')
    cy.get('#measures_2_text').contains('2')
    cy.get('#measures_3_text').contains('3')
    cy.get('#measures_4_text').contains('4')
    cy.get('#measures_5_text').contains('5')

    cy.get('#measures_4_text').clear()
    cy.get('#measures_5_text').clear()
    cy.get('#measures_5_text').should('not.exist')
  })
})