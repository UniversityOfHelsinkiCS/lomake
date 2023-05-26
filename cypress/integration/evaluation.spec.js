/// <reference types="cypress" />

import { testFacultyCode, testFacultyName, testProgrammeCode, testProgrammeName } from '../../config/common'
import '../support/commands'

describe('Evaluation forms tests', () => {
  beforeEach(() => {
    // ADD THESE WHEN FORM OPENED TO ALL
    // const user = 'cypressUser'
    // cy.login(user)
    cy.visit('/')
  })

  // ***
  // EDIT 'BEFORE EACH' AFTER FORM IS ACCESSIBLE TO ALL
  // ***

  it('Can navigate to evaluation programme level form', () => {
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Study programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains('Evaluation 2023')
  })

  it('Can navigate to evaluation faculty level form', () => {
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Faculty level').click()
    cy.get(`[data-cy=colortable-link-to-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)
    cy.contains('Evaluation 2023')
  })
})
