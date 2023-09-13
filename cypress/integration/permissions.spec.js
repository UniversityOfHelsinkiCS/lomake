/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode, testIAM } from '../../config/common'
import '../support/commands'

const user = 'cypressUser'
const noRightsUser = 'cypressNoRightsUser'
const readingRightsUser = 'cypressReadingRightsUser'
const cypressOspaUser = 'cypressOspaUser'

describe('Permission tests', () => {
  it('Invalid url shows error', () => {
    cy.login(user)
    cy.visit('/form/lmao')
    cy.contains('Error: Invalid url.')
  })

  it("Can't access form without permissions", () => {
    cy.login(noRightsUser)
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't access report page without permissions", () => {
    cy.login(noRightsUser)
    cy.visit(`/report`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't access comparison page without permissions", () => {
    cy.login(noRightsUser)
    cy.visit(`/comparison`)
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't WRITE with READ permissions and cant go to edit mode", () => {
    cy.login(readingRightsUser)
    cy.visit(`/form/${testProgrammeCode}`)

    // Check that cant edit stuff:
    cy.get('[data-cy=form-section-I]').click() // Simulate open attept even though does not do anything
    cy.get('.editor-class').should('not.exist')
    cy.get('[data-cy=pdfdownload-go-back-button]').should('not.exist')
  })

  it('Can do management with ADMIN permissions', () => {
    cy.login(cypressOspaUser)
    cy.visit('/')

    cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
    cy.get('[data-cy^=formLocker-button]')
  })

  it('Can see programme jory IAM-group with ADMIN permissions', () => {
    cy.login(cypressOspaUser)
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
    cy.contains(testIAM)

    cy.login(readingRightsUser)
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeCode}-manage]`).should('not.exist')
  })

  it("Can see users' deducted role with ADMIN permissions", () => {
    cy.visit('/')
    cy.get('[data-cy=nav-admin]').should('not.exist')
    cy.login(cypressOspaUser)

    cy.visit('/admin')
    cy.get('[data-cy=cypressOspaUser-userRole]').contains('Ospa-ryhmä')
    cy.get('[data-cy=cypressReadingRightsUser-userRole]').contains('Rehtoraatti')
    cy.get('[data-cy=cypressUser-userRole]').contains('Koulutusohjelman johtaja - mltdk - kandi')
  })
})
