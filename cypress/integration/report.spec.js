/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

const user = 'cypressUser'
const adminUser = 'cypressOspaUser'

describe('ReportPage tests', () => {
  it('Piecharts are not shown if there are no answers', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()

    // the year changes to year with answers by default, if form not open for current year
    cy.selectYear(defaultYears[0])

    cy.get('[data-cy=report-select-all]').click()
    cy.get('div').contains('colors').should('contain', 'Smiley')
    cy.get('div').contains('colors').click()
    cy.get('div').contains('colors')
    cy.get('[data-cy=report-chart-review_of_last_years_situation_report_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(230, 230, 230)')
  })

  it('User should be able to see the just written answers in the report', () => {
    cy.login(user)
    cy.visit('/')
    cy.selectYear(defaultYears[0])

    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=textarea-learning_outcomes]').find('.editor-class').click()

    cy.writeToTextField('[contenteditable="true"]', 'test words')

    cy.visit('/')
    cy.reload()
    cy.wait(1000)
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-learning_outcomes_text]').should('be.visible').click()
    cy.get('[data-cy=report-question-content-learning_outcomes_text]').should('contain.text', 'test words')
  })

  it('User should be able to see answers from only one programme, when they have rights for only one', () => {
    cy.login(user)
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-programmes-list]').should('have.length', 1)
  })

  it('User should not be able to see answers in fields where there are none', () => {
    cy.login(user)
    cy.visit('/')
    cy.wait(1000)
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=textarea-community_wellbeing]').find('.editor-class').click()
    cy.writeToTextField('[contenteditable="true"]', 'more words')
    cy.reload()

    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-disabled-language_environment_text]').contains('0')
  })

  it('User should be able to see answers from previous years', () => {
    cy.login(user)
    cy.request('/api/cypress/createAnswers')

    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-content-teacher_skills_text]').contains(`Hello from ${defaultYears[1]}`)
  })

  it('Filtering works for programme level', () => {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()

    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=master-filter]').should('be.visible').click()
    cy.get('[data-cy=report-select-all]').should('contain', 'all')
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=answered-label-language_environment_text]').contains('/ 63')
  })

  it('Filtering works for faculty level', () => {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.wait(1000)
    cy.get('[data-cy=faculty-filter]').contains('Faculty of Law').should('be.visible').click()
    cy.get('[data-cy=report-list-programme-KH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_003]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH57_001]').should('not.exist')
  })

  it('Filtering works for doctoral schools', () => {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=doctoral-school-filter]').should('not.exist')
    cy.get('[data-cy=doctoral-filter]')
    cy.get('[data-cy=doctoral-filter]').click()
    cy.wait(1000)
    cy.get('[data-cy=doctoral-school-filter]').click()
    cy.get('span').contains('Doctoral school in natural sciences').should('be.visible').click()
    cy.get('[data-cy=report-list-programme-T923104]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T923107]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T922104]').should('not.exist')
  })

  it('Filtering works for companion programmes', () => {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=companion-filter]').should('not.exist')
    cy.get('[data-cy=faculty-filter]').should('be.visible').click()
    cy.get('span').contains('Faculty of Arts').should('be.visible').click()
    cy.get('[data-cy=doctoral-filter]').should('be.visible').click()
    cy.get('[data-cy=companion-filter]').should('be.visible')
    cy.get('[data-cy=companion-filter]').click()
    // Companion programmes
    cy.get('[data-cy=report-list-programme-T921107]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T923102]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T922103]').should('be.visible')
    // Original programmes
    cy.get('[data-cy=report-list-programme-T920103]').should('be.visible')
    // Other level and faculty
    cy.get('[data-cy=report-list-programme-MH40_003]').should('not.exist')
    cy.get('[data-cy=report-list-programme-T922105]').should('not.exist')

    cy.get('[data-cy=master-filter').click()
    cy.get('[data-cy=report-list-programme-MH40_003]').should('be.visible')
  })

  it('Changes in smileys are reflected to the piecharts', () => {
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=color-negative-review_of_last_years_situation_report]').click()
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('div').contains('colors').should('be.visible').click()
    cy.get('[data-cy=report-chart-review_of_last_years_situation_report_text]')
    cy.wait(1000)
    cy.get('path').eq(1).should('have.css', 'stroke').and('eq', 'rgb(243, 119, 120)')
  })
})
