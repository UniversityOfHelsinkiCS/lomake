/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import { testFacultyCode, testFacultyName, testProgrammeCode, testProgrammeName } from '../../config/common'
import '../support/commands'

describe('Evaluation forms tests', () => {
  beforeEach(() => {
    // ADD THESE WHEN FORM OPENED TO ALL
    // const user = 'cypressUser'
    // cy.login(user)
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit('/')
  })

  // ***
  // EDIT 'BEFORE EACH' AFTER FORM IS ACCESSIBLE TO ALL
  // ***

  it('User can navigate to evaluation programme level form', () => {
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains('Evaluation 2023')
  })

  it('User can navigate to evaluation faculty level form', () => {
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Faculty level').click()
    cy.get(`[data-cy=colortable-link-to-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)
    cy.contains('Evaluation 2023')
  })

  it("Programme level user can see summary of previous years' answers", () => {
    cy.request(`/api/cypress/createAnswers/1`)
    cy.reload()
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.wait(2000)
    cy.get('[data-cy=student_admittance-summary]').find('.answer-circle-green')
  })

  // Test that written answers can be seen by toggling the arrow button

  // Test that filling an answer in yearly form is updated in the summary element (programmes)

  // Test answering programme evaluation and that the asnwers is updated to faculty form summary

  // Test all answers pages
})
