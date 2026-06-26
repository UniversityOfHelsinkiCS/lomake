/// <reference types="cypress" />

import { defaultYears, testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Form Notification tests', () => {
  // Cypress.stop()
  // return

  it('After deadline is locked, correct message is sent', () => {
    cy.login('cypressUser')
    cy.visit('/yearly')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=deadline-passed-notice]')
  })
})
