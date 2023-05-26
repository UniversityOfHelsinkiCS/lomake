/// <reference types="cypress" />

import { testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Evaluation forms tests', () => {
  beforeEach(() => {
    // ADD THESE WHEN FORM OPENED TO ALL
    // const user = 'cypressUser'
    // cy.login(user)
    cy.visit('/')
  })

  // ***
  // EDIT BEFORE EACH AFTER FOR IS ACCESSIBLE TO ALL
  // ***

  it('Can navigate to evaluation programme level form', () => {
    cy.get('[data-cy=nav-evaluation-dropdown]').click()
    cy.contains('Study programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains("Bachelor's Programme in Computer Science")
    cy.contains('Evaluation 2023')
  })
})
