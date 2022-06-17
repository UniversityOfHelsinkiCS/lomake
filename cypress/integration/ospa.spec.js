/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'

describe('SuperAdmin user tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.visit('/')
  })

  it('Deadline can be deleted and created and deleting a deadline locks forms.', () => {
    cy.login('cypressSuperAdminUser')
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Delete pre-generated deadline
    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=noNextDeadline]')

    // Check that form is locked as it should be
    cy.visit('/form/KH50_004')
    cy.get('.editor-class').should('not.exist')
    cy.visit('/')

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()
    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=nextDeadline]').contains('14.')
  })

  it('Deadline for a past year can be created, the form of that year can be edited and the form can be then again closed', () => {
    cy.login('cypressSuperAdminUser')
    cy.request('/api/cypress/createAnswers')

    // Delete pre-generated deadline
    cy.visit('/')
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()
    cy.get('[data-cy=deleteDeadline]').click()
    cy.get('[data-cy=noNextDeadline]')

    // Create new deadline for the past year
    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[1]).click()

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=nextDeadline]').contains('14.')

    // Visit the form page
    cy.visit('/form/KH50_004')

    // Edit text
    cy.get('[data-cy=textarea-learning_outcomes]').find('.editor-class').click()
    cy.writeToTextField('[contenteditable="true"]', ' and editing old year')
    cy.reload()

    // Check that edits have been added
    cy.getYearSelector()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()
    cy.get('[data-cy=textarea-learning_outcomes]')
      .find('.editor-class')
      .should('contain.text', `Hello from 2021 and editing old year`)

    // Close the form
    cy.visit('/admin')
    cy.contains('Deadline settings').click()
    cy.get('[data-cy=deleteDeadline]').click()

    // Check that changes persisted and fields with no changes stay the same
    cy.visit('/form/KH50_004')
    cy.getYearSelector()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()
    cy.get('[data-cy=textarea-learning_outcomes]').should('contain.text', `Hello from 2021 and editing old year`)
    cy.get('[data-cy=textarea-curriculum]').should('contain.text', `Hello from 2021`)

    cy.request(`/api/cypress/createDeadline/${defaultYears[0]}`)
  })

  it('Can write to form and change from smiley table to trends view', () => {
    cy.login('cypressSuperAdminUser')
    // check that page is ready
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`)

    // Create a new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()
    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(defaultYears[0]).click()

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=nextDeadline]').contains('14.')

    // Login as another user to see if answers can be created
    cy.login('cypressUser')
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    cy.visit('/')

    cy.get(`[data-cy=${testProgrammeCode}-community_wellbeing]`).should('have.class', 'square-green')
  })
})
