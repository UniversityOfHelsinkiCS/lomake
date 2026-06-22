/// <reference types="cypress" />

import { ARCHIVE_LAST_YEAR, defaultYears, testProgrammeCode } from '../../config/common'
import '../support/commands'

const form = 1 // yearly assessment

describe("Previous year's answers", () => {
  // Cypress.stop()
  // return
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/yearly')
  })

  it("Can switch which year's answers to see in OverViewPage", () => {
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.reload()

    cy.selectYear(defaultYears[1])

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report-single]`).should(
      'have.class',
      'square-green'
    )

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report-single]`).click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[1]}`)

    cy.get('.customModal-content').find('.close').click()
    cy.selectYear(defaultYears[2])

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report-single]`).click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[2]}`)
  })
})
