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
  const cypressSuperAdmin = 'cypressSuperAdminUser'

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
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains(`Review ${defaultYears[1]}`)
  })

  it('User can navigate to evaluation faculty level form', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Faculty level').click()
    cy.get(`[data-cy=colortable-link-to-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)
    cy.contains(`Review ${defaultYears[0]}`)
  })

  it("Programme level user can see summary of previous years' answers", () => {
    cy.request(`/api/cypress/createAnswers/1`)
    cy.reload()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.wait(2000)
    cy.get('[data-cy=student_admittance-summary]').find('.answer-circle-green')
  })

  context('Answering evaluation faculty', () => {
    it('User can answer faculty level form', () => {
      const facultyUser = 'cypressFacultyKatselmusUser'
      // Check corrent saves notice message
      cy.login(facultyUser)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('Faculty level').click()
      cy.get(`[data-cy=colortable-link-to-H50]`).click()
      cy.get(`[data-cy="deadline-passed-notice"]`).contains('The deadline to edit form has passed.')
      // ----------------------------------------
      cy.login(cypressSuperAdmin)
      cy.visit('/')
      // Create new deadline

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - tiedekunnat')
      cy.get('[data-cy=form-5-deadline]').contains('14.')

      // Go to form and write answers
      cy.login(facultyUser)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('Faculty level').click()
      cy.get(`[data-cy=colortable-link-to-H50]`).click()
      cy.get(`[data-cy="saving-answers-notice"]`).contains(
        'Answers are saved automatically except for text fields. Final day for answering the form:',
      )
    })
  })

  context('Answering evaluation university', () => {})

  // Test that written answers can be seen by toggling the arrow button

  // Test that filling an answer in yearly form is updated in the summary element (programmes)

  // Test answering programme evaluation and that the asnwers is updated to faculty form summary

  // Test all answers pages
})
