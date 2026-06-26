/* eslint-disable cypress/no-unnecessary-waiting */

/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

const user = 'cypressUser'
const adminUser = 'cypressOspaUser'
const form = 1 // yearly assessment

describe('ReportPage tests', () => {
  // Cypress.stop()
  // return

  it('User should be able to see answers from only one programme, when they have rights for only one', () => {
    cy.login(user)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-programmes-list]').should('have.length', 1)
  })

  it('User should not be able to see answers in fields where there are none', () => {
    cy.login(user)

    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-disabled-language_environment_text]').contains('0')
  })

  it('User should be able to see answers from previous years', () => {
    cy.login(user)
    cy.request(`/api/cypress/createAnswers/${form}`)

    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=report-question-content-teacher_skills_text]').contains(`Hello from ${defaultYears[1]}`)
  })

  it('Filtering works for programme level', () => {
    cy.login(adminUser)
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()

    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=master-filter]').should('be.visible').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-select-all]').should('contain', 'all')
    cy.get('[data-cy=report-select-all]').click()
  })

  it('Filtering works for faculty level', () => {
    cy.login(adminUser)
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.reload()
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.wait(1000)
    cy.get('[data-cy=faculty-filter]').contains('Faculty of Law').should('be.visible').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-list-programme-KH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_003]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH20_001]').should('be.visible')
    cy.get('[data-cy=report-list-programme-MH57_001]').should('not.exist')
  })

  it('Filtering works for doctoral schools', () => {
    cy.login(adminUser)
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.reload()
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=doctoral-school-filter]').should('not.exist')

    cy.get('[data-cy=doctoral-filter]').click()
    cy.wait(1000)
    cy.get('[data-cy=doctoral-school-filter]').click()
    cy.get('span').contains('Doctoral school in natural sciences').should('be.visible').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-list-programme-T923104]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T923107]').should('be.visible')
    cy.get('[data-cy=report-list-programme-T922104]').should('not.exist')
  })

  it('Filtering works for companion programmes', () => {
    cy.login(adminUser)
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=companion-filter]').should('not.exist')
    cy.get('[data-cy=faculty-filter]').should('be.visible').click()
    cy.get('span').contains('Faculty of Arts').should('be.visible').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('[data-cy=doctoral-filter]').should('be.visible').click()
    cy.get('[data-cy=companion-filter]').should('be.visible')
    cy.get('[data-cy=companion-filter]').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
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
})
