/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

describe('SuperAdmin user tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.visit('/')
  })

  it('A second year cannot be opened if another year is already open.', () => {
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Try adding deadline for another draft year
    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[2]).click()

    cy.get('[data-cy=updateDeadline]').should('be.disabled')
    cy.get('[data-cy=previousDeadline-warning]')

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=previousDeadline-warning]').should('not.exist')
  })

  it('Deadline can be deleted and created and deleting a deadline locks forms.', () => {
    cy.login('cypressSuperAdminUser')

    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // select draft year
    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    // select form
    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    // Delete pre-generated deadline
    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').should('not.exist')

    // Check that form is locked as it should be
    cy.visit('/form/KH50_004')
    cy.get('.editor-class').should('not.exist')
    cy.visit('/')
    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').contains('14.')
  })

  it('Deadline for a past year can be created when no form is open for the current year, the form of that year can be edited and the form can be then again closed', () => {
    cy.login('cypressSuperAdminUser')
    cy.request('/api/cypress/createAnswers')

    // Delete pre-generated deadline
    cy.visit('/')
    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').should('not.exist')

    // Create new deadline for the past year
    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[1]).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').contains('14.')

    // Visit the form page
    cy.visit('/form/KH50_004')

    // Edit text, year should have automatically switched to editable year
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])
    cy.get('[data-cy=textarea-learning_outcomes]').find('.editor-class').click()
    cy.get('[data-cy=textarea-learning_outcomes]').type(`{moveToEnd}, editing old year`)
    cy.reload()

    // Check that edits have been added
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=textarea-learning_outcomes]')
      .find('.editor-class')
      .should('contain.text', `Hello from 2022, editing old year`)

    // Close the form
    cy.visit('/admin')
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[1]).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').should('not.exist')

    // Check that changes persisted and fields with no changes stay the same
    cy.visit('/form/KH50_004')
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=textarea-learning_outcomes]').should('contain.text', `Hello from 2022, editing old year`)
    cy.get('[data-cy=textarea-curriculum]').should('contain.text', `Hello from 2022`)
  })

  it('Can write to form and change from smiley table to trends view', () => {
    cy.login('cypressSuperAdminUser')
    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    // Create a new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta').click()

    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=form-1-deadline]').contains('14.')

    // Login as another user to see if answers can be created
    cy.login('cypressUser')
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    cy.visit('/')

    cy.get(`[data-cy=${testProgrammeCode}-community_wellbeing]`).should('have.class', 'square-green')
  })
})
