/* eslint-disable no-undef */
/// <reference types="cypress" />

const user = 'cypressInternationalUser'

describe('IAM permission tests', function () {
  beforeEach(() => {
    cy.login(user)
  })

  it("User with access to International Master's programmes, should see 35 programmes on first page", function () {
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]')
      .should('have.have.length', 35)
  })

  it('Report works for 35 international programmes', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(2020).click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains("Master's Programme in Agricultural Sciences")
    cy.contains('Hello from 2020')
  })

  it('Comparison works for 35 international programmes', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(2)
    })
    cy.get('[data-cy=yearSelector]').contains(2020).click()

    cy.get('[data-cy=comparison-responses-faculty-review_of_last_years_situation_report_text]').should('contain', '35')
    cy.get('[data-cy=comparison-responses-university-language_environment_text]').should('not.exist')
  })
})