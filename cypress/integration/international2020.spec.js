/* eslint-disable no-undef */
/// <reference types="cypress" />
import { defaultYears } from '../../config/common'

const user = 'cypressInternationalUser'

describe('IAM permission tests', () => {
  beforeEach(() => {
    cy.login(user)
  })

  it("User with access to International Master's programmes, should see 35 programmes on first page", () => {
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 35)
  })

  it('Report works for 35 international programmes', () => {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=yearSelector]').should('have.class', 'disabled').contains(2020)
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains("Master's Programme in Agricultural Sciences")
    cy.contains(`Hello from ${defaultYears[1]}`)
  })

  it('Comparison works for 35 international programmes', () => {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()
    cy.get('[data-cy=yearSelector]').should('have.class', 'disabled').contains(2020)
    cy.get('[data-cy=comparison-responses-faculty-review_of_last_years_situation_report_text]').should('contain', '35')
    cy.get('[data-cy=comparison-responses-university-language_environment_text]').should('not.exist')
  })
})
