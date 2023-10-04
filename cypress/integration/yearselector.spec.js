/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears, testProgrammeCode } from '../../config/common'
import '../support/commands'

const form = 1 // yearly assessment

describe("Previous year's answers", () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
  })

  it("Can switch which year's answers to see in OverViewPage", () => {
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.reload()

    cy.selectYear(defaultYears[1])
    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report]`).should('have.class', 'square-green')

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report]`).click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[1]}`)

    cy.get('.customModal-content').find('.close').click()
    cy.selectYear(defaultYears[2])

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report]`).click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[2]}`)
  })

  it("Can't write answers if viewing old answers", () => {
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=editing-area-review_of_last_years_situation_report]').should('be.visible')

    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[1]}`)

    cy.reload()
    cy.get('[data-cy=editing-area-review_of_last_years_situation_report]').should('not.exist')
  })

  it('Can view old answers in Form-page and switch back to editMode to continue working.', () => {
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit(`/form/${testProgrammeCode}`)

    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[1]}`)

    cy.selectYear(defaultYears[2])
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[2]}`)

    cy.selectYear(new Date().getFullYear())
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.typeInEditor('review_of_last_years_situation_report', 'koira')

    cy.reload()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .invoke('text')
      .should('match', /koir/)
  })
})
