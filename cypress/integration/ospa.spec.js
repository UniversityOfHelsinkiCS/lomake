/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('OSPA user tests', function () {
  this.beforeEach(function () {
    cy.login('cypressAdminUser')
    cy.visit('/')
  })

  it('Deadline can be deleted, created and updated & deleting a deadline locks forms.', function () {
    cy.server()

    // Delete pre-generated deadline
    cy.route('DELETE', '/api/deadlines').as('delete')
    cy.get('[data-cy=deleteDeadline]').click()
    cy.wait('@delete')
    cy.get('[data-cy=noNextDeadline]')

    // Check that form is locked as it should be
    cy.visit('/form/KH50_004')
    cy.get('.editor-class').should('not.exist')
    cy.visit('/')

    // Create new deadline
    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day
    cy.route('POST', '/api/deadlines').as('update')
    cy.get('[data-cy=updateDeadline]').click()
    cy.wait('@update').should('have.property', 'status', 200)
    cy.get('[data-cy=nextDeadline]').contains('14.')

    // Update deadline
    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation').click() // Go to next month
    cy.get('.react-datepicker__day--024').click() // Select 24th day
    cy.route('POST', '/api/deadlines').as('update')
    cy.get('[data-cy=updateDeadline]').click()
    cy.wait('@update').should('have.property', 'status', 200)
    cy.get('[data-cy=nextDeadline]').contains('24.')
  })

  it('Can give admin permissions', function () {
    cy.get('[data-cy=nav-admin]').click()
    cy.get('[data-cy=cypressUser-not-admin]').click()
    cy.get('[data-cy=grant-admin-confirm]').click()
    cy.reload()
    cy.get('[data-cy=cypressAdminUser-is-admin]').should('have.class', 'check')
  })

  it('Can mark users as irrelevant', function () {
    cy.get('[data-cy=nav-admin]').click()
    cy.get('[data-cy=cypressAdminUser-not-irrelevant]').click()
    cy.get('[data-cy=mark-irrelevant-confirm]').click()
    cy.reload()
    cy.get('[data-cy=cypressAdminUser-is-irrelevant]').should('have.class', 'check')
  })

  it('Can navigate between tabs and the tables render', function () {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Links for owners').click()
    cy.get('tr').should('have.length.gt', 50)

    cy.contains('Links for faculties').click()
    cy.get('tr').should('have.length', 13)
  })
})
