/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import {
  testFacultyCode,
  testFacultyName,
  testProgrammeCode,
  testProgrammeName,
  defaultYears,
} from '../../config/common'
import '../support/commands'

describe('Evaluation forms tests', () => {
  // Cypress.stop()
  // return
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    // ADD THESE WHEN FORM OPENED TO ALL
    // const user = 'cypressUser'
    // cy.login(user)
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit('/yearly')
  })

  // ***
  // EDIT 'BEFORE EACH' AFTER FORM IS ACCESSIBLE TO ALL
  // ***

  it('User can navigate to evaluation programme level form', () => {
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains(`Review ${defaultYears[1]}`)
  })

  it('User can navigate to evaluation faculty level form', () => {
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Faculty level').click()
    cy.get(`[data-cy=colortable-link-to-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)
    cy.contains(`Review ${defaultYears[1]}`)
  })

  it("Programme level user can see summary of previous years' answers", () => {
    cy.request(`/api/cypress/createAnswers/1`)
    cy.reload()
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.wait(2000)
    cy.get('[data-cy=student_admittance-summary]').find('.answer-circle-green')
  })
})
