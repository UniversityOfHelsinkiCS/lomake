/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'
const user = 'cypressUser'
const adminUser = 'cypressAdminUser'

describe('ReportPage tests', function () {
  this.beforeEach(function () {
    cy.givePermissions(user, testProgrammeName, 'write')
  })

  it('Piecharts are not shown if there are no answers', function () {
    cy.login(user)
    cy.visit('/report')
    cy.get('div').contains('colors').should('contain', 'Smiley')
    cy.get('div').contains('colors').click()
    cy.get('[data-cy=report-no-data]')
  })

  //FIXME: flaky
  it.skip('User should be able to see the just written answers in the report', function () {
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.writeToTextField('[data-cy=textarea-review_of_last_years_situation_report]', 'kissa')
    cy.reload()

    cy.visit('/report')
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.get('[data-cy=report-question-content-review_of_last_years_situation_report_text]').should(
      'contain.text',
      'kissa'
    )
  })

  it('User should be able to see answers from only one programme, when they have rights for only one', function () {
    cy.login(user)
    cy.visit('/report')
    cy.get('[data-cy=report-programmes-list]').should('have.length', 1)
  })

  //FIXME: flaky
  it.skip('User should not be able to see answers in fields where there are none', function () {
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.writeToTextField('[data-cy=textarea-review_of_last_years_situation_report]', 'kissa')
    cy.reload()

    cy.visit('/report')
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-disabled-language_environment_text]').contains('0')
  })

  it('User should be able to see answers from previous years', function () {
    cy.login(user)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.get('[data-cy=yearSelector]').click()

    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })

    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-content-teacher_skills_text]').contains('Hello from 2019')
  })

  it('Filtering works for programme level', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/report')
    cy.get('[data-cy=yearSelector]').click()

    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=master-filter]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=answered-label-language_environment_text]').contains('/ 63')
  })

  it('Filtering works for faculty level', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/report')
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('Faculty of Law').should('be.visible').click()
    cy.get('[data-cy=report-list-programme-KH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_003]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH57_001]').should('not.be.visible')
  })

  it('Filtering works for doctoral schools', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/report')
    cy.get('[data-cy=doctoral-school-filter]').should('not.be.visible')
    cy.get('[data-cy=doctor-filter]').click()
    cy.get('[data-cy=doctoral-school-filter]').should('be.visible')
    cy.get('[data-cy=doctoral-school-filter]').click()
    cy.get('span').contains('Doctoral school in natural sciences').should('be.visible').click()
    cy.get('[data-cy=report-list-programme-T923104]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T923107]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T922104]').should('not.be.visible')
  })

  it('Filtering works for companion programmes', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/report')
    cy.get('[data-cy=companion-filter]').should('not.be.visible')
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('Veterinary Medicine').should('be.visible').click()
    cy.get('[data-cy=doctor-filter]').click()
    cy.get('[data-cy=companion-filter]').should('be.visible')
    cy.get('[data-cy=companion-filter]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=answered-label-language_environment_text]').contains('/ 6')
    cy.get('[data-cy=master-filter').click()
    cy.get('[data-cy=report-list-programme-MH90_001]').should('be.visible')
  })

  it('Changes in smileys are reflected to the piecharts', function () {
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=street-light-negative-review_of_last_years_situation_report]').click()
    cy.visit('/report')
    cy.get('[data-cy=report-select-all]').should('contain', 'all')
    cy.get('[data-cy=report-select-all]').click()

    cy.get('div').contains('colors').click()
    cy.get('[data-cy=report-chart-review_of_last_years_situation_report_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(243, 119, 120)')
  })
})
