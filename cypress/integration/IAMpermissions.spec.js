/* eslint-disable no-undef */
/// <reference types="cypress" />

const user = 'cypressReadGroupMember'

describe('IAM permission tests', function () {
  this.beforeEach(function () {
    cy.login(user)
  })

  it('Automatically gets read permissions for all studyprogrammes', function () {
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 129)
  })

  it('Report works', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains('Hello from 2019')
  })

  it('Comparison works', function () {
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(2019).click()

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains('129')
  })
})
