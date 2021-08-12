/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe('OSPA user tests', function () {
  this.beforeEach(function () {
    cy.login('cypressAdminUser')
    cy.visit('/')
  })

  it('Deadline can be deleted, created and updated & deleting a deadline locks forms.', () => {
    cy.server()
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline').click()

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
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline').click()
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

  it('Can add and remove a valid user', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.get('[data-cy=add-user-button').click()
    cy.get('[data-cy=user-form-add-email').type('testemail@test.com')
    cy.get('[data-cy=user-form-add-user-id]').type('testuid')
    cy.get('[data-cy=user-form-add-firstname]').type('testfirstname')
    cy.get('[data-cy=user-form-add-lastname]').type('testlastname')
    cy.get('[data-cy=user-form-add-user-button]').click()
    cy.contains('testfirstname testlastname').parent().find('[data-cy=editUser]').click()
    cy.get('[data-cy=user-delete-button]').click()
    cy.get('[data-cy=user-confirm-delete-button]').click()
  })

  it('Can not add an invalid user ', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.get('[data-cy=add-user-button').click()

    // Missing uid
    cy.get('[data-cy=user-form-add-email').type('testemail@test.com')
    cy.get('[data-cy=user-form-add-firstname]').type('testfirstname')
    cy.get('[data-cy=user-form-add-lastname]').type('testlastname')
    cy.get('[data-cy=user-form-add-user-button]').should('be.disabled')

    // Duplicate uid
    cy.get('[data-cy=user-form-add-user-id]').type('cypressUser')
    cy.get('[data-cy=user-form-add-user-button]').should('be.disabled')

    // Missing email
    cy.get('[data-cy=user-form-add-email').clear()
    cy.get('[data-cy=user-form-add-user-id]').clear().type('validUid')

    // Missing first name
    cy.get('[data-cy=user-form-add-firstname]').clear()
    cy.get('[data-cy=user-form-add-email').type('testemail@test.com')
    cy.get('[data-cy=user-form-add-user-button]').should('be.disabled')

    // Missing last name
    cy.get('[data-cy=user-form-add-lastname]').clear()
    cy.get('[data-cy=user-form-add-firstname').type('testfirstname')
    cy.get('[data-cy=user-form-add-user-button]').should('be.disabled')

    // Once everything correct, can still add the user
    cy.get('[data-cy=user-form-add-lastname').type('testlastname')
    cy.get('[data-cy=user-form-add-user-button]').click()
    cy.contains('testfirstname testlastname').parent().find('[data-cy=editUser]').click()
    cy.get('[data-cy=user-delete-button]').click()
    cy.get('[data-cy=user-confirm-delete-button]').click()
  })

  it('Can give admin permissions', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('cyp res').parent().find('[data-cy=editUser]').click()
    cy.get('[data-cy=accessAdmin').click()
    cy.get('[data-cy=accessAdmin-confirm]').click()
    cy.reload()
    cy.contains('cyp res').parent().find('[data-cy=userGroup]').should('contain', 'Admin')
  })

  it('Can give and remove faculty read permissions', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('cypress faculty').parent().find('[data-cy=editUser]').click()

    // Give access to the programmes in Faculty of Theology
    cy.get('[data-cy=user-access-group-selector]').click().contains('Faculty of Theology').should('be.visible').click()
    cy.get('[data-cy=user-access-group-selector]').click()
    cy.get('[data-cy=access-group-save-button]').click()
  
    // Check that all programmes are given only reading rights
    cy.get('[data-cy=read-T920101]').should('have.class', 'check')
    cy.get('[data-cy=write-T920101]').should('have.class', 'close')
    cy.get('[data-cy=admin-T920101]').should('have.class', 'close')

    cy.get('[data-cy=read-MH10_001]').should('have.class', 'check')
    cy.get('[data-cy=write-MH10_001]').should('have.class', 'close')
    cy.get('[data-cy=admin-MH10_001]').should('have.class', 'close')

    cy.get('[data-cy=read-KH10_001]').should('have.class', 'check')
    cy.get('[data-cy=write-KH10_001]').should('have.class', 'close')
    cy.get('[data-cy=admin-KH10_001]').should('have.class', 'close')

    cy.reload()

    // Check that earlier rights have been unaffected
    cy.contains('cypress faculty').parent().find('[data-cy=userAccess]').should('contain', 'Doctoral Programme in Theology and Religious Studies')
    cy.contains('cypress faculty').parent().find('[data-cy=userAccess]').should('contain', '+5 more programmes')

    // Remove access to the Faculty of Theology
    cy.contains('cypress faculty').parent().find('[data-cy=editUser]').click()
    cy.get('[data-cy=user-access-group-selector] > a > i').click()
    cy.get('[data-cy=access-group-save-button]').click()

    // Check that all earlier rights are unaffected
    cy.get('[data-cy=read-KH50_004]').should('have.class', 'check')
    cy.get('[data-cy=write-KH50_004]').should('have.class', 'check')
    cy.get('[data-cy=admin-KH50_004]').should('have.class', 'close')

    cy.get('[data-cy=read-KH80_001]').should('have.class', 'check')
    cy.get('[data-cy=write-KH80_001]').should('have.class', 'check')
    cy.get('[data-cy=admin-KH80_001]').should('have.class', 'check')

    cy.get('[data-cy=read-KH50_003]').should('have.class', 'check')
    cy.get('[data-cy=write-KH50_003]').should('have.class', 'close')
    cy.get('[data-cy=admin-KH50_003]').should('have.class', 'close')

    cy.reload()
    // Check that the user has the correct amount of rights afterwards
    cy.contains('cypress faculty').parent().find('[data-cy=userAccess]').should('not.contain', 'Doctoral Programme in Theology and Religious Studies')
    cy.contains('cypress faculty').parent().find('[data-cy=userAccess]').should('contain', 'Chemistry')
    cy.contains('cypress faculty').parent().find('[data-cy=userAccess]').should('contain', '+2 more programmes')
  })


  it('Can navigate between tabs and the tables render', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Links for owners').click()
    cy.get('tr').should('have.length.gt', 50)

    cy.contains('Links for faculties').click()
    cy.get('tr').should('have.length', 13)
  })

  it('Can write to form and change from smiley table to trends view', () => {
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    cy.visit('/')

    cy.get('[data-cy=TOSKA101-community_wellbeing]').should('have.class', 'square-green')
  })
})
