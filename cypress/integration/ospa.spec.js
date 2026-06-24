/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

const form = 1 // yearly assessment

describe('SuperAdmin user tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.visit('/yearly')
  })

  it('A second year cannot be opened if another year is already open.', () => {
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Try adding deadline for another draft year
    cy.get('[data-cy=draft-year-selector]').click()
    cy.get(`[data-cy=draft-year-${defaultYears[2]}]`).click()

    cy.get('[data-cy=updateDeadline]').should('be.disabled')
    cy.get('[data-cy=previousDeadline-warning]')

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get(`[data-cy=draft-year-${defaultYears[0]}]`).click()

    cy.get('[data-cy=previousDeadline-warning]').should('not.exist')
  })

  it('Deadline for a past year can be created when no form is open for the current year, the form of that year can be edited and the form can be then again closed', () => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/createAnswers/${form}`)

    cy.login('cypressOspaUser')

    // Check that changes persisted and fields with no changes stay the same
    cy.visit('/yearly/form/1/KH50_004')
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=textarea-curriculum]').should('contain.text', `Hello from ${defaultYears[1]}`)
  })

  it('Multiple deadlines can be opened and all relevant forms are editable', () => {
    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.closeDeadline(defaultYears[0], 'yearlyAssessment', 1)
    cy.get('[data-cy=form-1-deadline]').should('not.exist')

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'yearlyAssessment', 1)
    cy.get('[data-cy=form-1-deadline]').contains('14.')

    // Create other deadline
    cy.createDeadline(defaultYears[0], 'evaluation', 4)
    cy.get('[data-cy=form-4-deadline]').contains('14.')
  })
})
