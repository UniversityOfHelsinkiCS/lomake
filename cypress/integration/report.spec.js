/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'
const user = 'cypressUser'

describe('ReportPage tests', function () {
  this.beforeEach(function () {
    cy.login(user)
    cy.givePermissions(user, testProgrammeName, 'write')
  })

  it('User should be able to see the just written answers in the report', function () {
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.writeToTextField('[data-cy=textarea-review_of_last_years_situation_report]', 'kissa')
    cy.reload()

    cy.visit('/report')  
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.get('[data-cy=report-question-content-review_of_last_years_situation_report_text]')
      .should('contain.text', 'kissa')
  })

  it('User should not be able to see answers in fields where there are none', function () {
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.writeToTextField('[data-cy=textarea-review_of_last_years_situation_report]', 'kissa')
    cy.reload()

    cy.visit('/report')  
    cy.get('[data-cy=report-question-language_environment_text]').click()
    cy.get('[data-cy=report-question-content-language_environment_text]')
      .should('have.length', 0)
  })

  it('User should be able to see answers from previous years', function() {
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.get('[data-cy=yearSelector]').click()

    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })

    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=report-question-content-teacher_skills_text]').contains('Hello from 2019')
  })

})