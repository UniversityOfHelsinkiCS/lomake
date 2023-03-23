/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

describe('Form tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
  })

  it('Can write to a textfield and the answer is saved.', () => {
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])
    cy.wait(2000)
    cy.get('[data-cy=textarea-community_wellbeing]').find('.editor-class').click()
    cy.writeToTextField('[contenteditable="true"]', 'other words')
    cy.reload()
    cy.wait(5000)

    cy.get('[data-cy=textarea-community_wellbeing]').find('.editor-class').should('contain.text', 'other words')
  })

  it('Can open a question, click on smiley face, and the result it saved.', () => {
    cy.get('[data-cy=color-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('/')
    cy.wait(1000)

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get(`[data-cy=${testProgrammeCode}-community_wellbeing]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can see upcoming deadline date', () => {
    cy.get('[data-cy=saving-answers-notice]').contains('Final day')
  })

  it('Measurements are created dynamically and saved correctly', () => {
    cy.get('#measures_1_text').type('1111')
    cy.get('#measures_2_text').type('2222')
    cy.get('#measures_4_text').should('not.exist')
    cy.get('#measures_3_text').type('3333')
    cy.get('#measures_4_text').type('4444')
    cy.get('#measures_5_text').type('5555')
    cy.get('#measures_6_text').should('not.exist')

    cy.reload()
    cy.wait(1000)
    cy.get('#measures_4_text').contains('4444')
    cy.get('#measures_5_text').contains('5555')

    cy.get('#measures_4_text').clear()
    cy.get('#measures_5_text').clear()
    cy.get('#measures_5_text').should('not.exist')
  })

  it(`Other years' form pages are locked`, () => {
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=locked-form-notice]')
    cy.get('.editor-class').should('not.exist')
  })
})
