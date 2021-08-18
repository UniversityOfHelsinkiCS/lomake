/* eslint-disable no-undef */
/// <reference types="cypress" />

import { removeLoggedInUsersGroups } from '../../client/util/mockHeaders'
import { defaultYears } from '../../config/common'

const user = 'cypressReadGroupMember'

describe('IAM permission tests', function () {
  beforeEach(() => {
    cy.login(user)
  })

  it('Permission is granted and revoked automatically based on IAM group', function () {
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]')
      .should('have.have.length', 129)
      .then(() => {
        removeLoggedInUsersGroups()
        cy.reload()
        cy.get('[data-cy=no-permissions-message]')
      })
  })

  it('Report works', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains(`Hello from ${defaultYears[1]}`)
  })

  it('Comparison works', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains('129')
  })
})
