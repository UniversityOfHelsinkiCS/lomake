/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe('Form Notificaton tests', function () {
  this.beforeEach(() => {
    cy.server()
    cy.givePermissions('cypressUser', testProgrammeName, 'write')
  })

  it('Save message is shown by default', () => {
    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=saving-answers-notice]')
  })

  it('After being locked by admin, message matches the state', () => {
    cy.login('cypressAdminUser')
    cy.visit(`/`)
    cy.get(`[data-cy=${testProgrammeName}-manage]`).click()
    cy.get(`[data-cy=formLocker-button-close]`).click()
    cy.get(`[data-cy=formLocker-verify-close-button]`).click()

    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=locked-form-notice]')
  })

  it('After OSPA locks all forms, message matches the state', () => {
    cy.login('cypressAdminUser')
    cy.visit('/')
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline').click()
    cy.route('DELETE', '/api/deadlines').as('delete')
    cy.get('[data-cy=deleteDeadline]').click()
    cy.wait('@delete')

    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=deadline-passed-notice]')
  })
})
