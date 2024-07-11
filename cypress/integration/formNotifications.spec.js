/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears, testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Form Notification tests', () => {
  it('Save message is shown by default', () => {
    cy.login('cypressUser')
    cy.visit('/yearly')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=saving-answers-notice]')
  })

  it('After being locked by admin, message matches the state', () => {
    cy.login('cypressUser')
    cy.visit(`/`)
    // check page ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)
    cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
    cy.get(`[data-cy=formLocker-button-close]`).click()
    cy.get(`[data-cy=formLocker-verify-close-button]`).click({ waitForAnimations: false })

    cy.login('cypressUser')
    cy.visit('/yearly')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=locked-form-notice]')
  })

  it('After Toska locks all forms, message matches the state', () => {
    cy.login('cypressToskaUser')
    cy.visit('/yearly')
    // check page ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    // Delete pre-set deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()
    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()
    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').should('not.exist')

    cy.login('cypressUser')
    cy.visit('/yearly')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=deadline-passed-notice]')
  })
})
