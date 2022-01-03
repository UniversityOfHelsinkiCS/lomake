/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

const user = 'cypressUser'

describe('Permission tests', function () {
  this.beforeEach(function () {
    cy.login(user)
  })

  it('Invalid url shows error', function () {
    cy.visit('/form/lmao')
    cy.contains('Error: Invalid url.')
  })

  it("Can't access form without permissions", function () {
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't access report page without permissions", function () {
    cy.visit(`/report`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't access comparison page without permissions", function () {
    cy.visit(`/comparison`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't WRITE with READ permissions and cant go to edit mode", function () {
    cy.givePermissions(user, testProgrammeName, 'read')
    cy.visit(`/form/${testProgrammeName}`)

    // Check that cant edit stuff:
    cy.get('[data-cy=form-section-I]').click() // Simulate open attept even though does not do anything
    cy.get('.editor-class').should('not.exist')
    cy.get('[data-cy=pdfdownload-go-back-button]').should('not.exist')
  })

  it('Can do management with ADMIN permissions', function () {
    cy.givePermissions(user, testProgrammeName, 'admin')
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeName}-manage]`).click()
    cy.get('[data-cy^=formLocker-button]')
  })
})
