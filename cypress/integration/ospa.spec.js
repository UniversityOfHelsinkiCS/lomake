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
})
