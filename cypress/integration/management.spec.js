/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe('Management tests', function () {
  this.beforeEach(function () {
    const user = 'cypressUser'
    cy.login(user)
    cy.givePermissions(user, testProgrammeName, 'admin')
    cy.givePermissions('cypressUser2', testProgrammeName, 'read')
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeName}-manage]`).click()
  })

  it('Giving admin permissions enables all permissions', function () {
    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').should('have.class', 'check')
    cy.get('[data-cy=write-cypressUser2]').should('have.class', 'check')
    cy.get('[data-cy=admin-cypressUser2]').should('have.class', 'check')
  })

  it('Cant remove read/edit permissions if targetuser is admin, but can remove admin permissions.', function () {
    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').should('be.disabled')

    cy.get('[data-cy=write-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').should('be.disabled')

    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').click()
  })

  it('Removing read permissions removed write permissions too', function () {
    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').should('have.class', 'close')
    cy.get('[data-cy=write-cypressUser2]').should('have.class', 'close')
    cy.get('[data-cy=admin-cypressUser2]').should('have.class', 'close')
  })

  it('Cant remove permissions of last admin user remaining', function () {
    cy.get('[data-cy=admin-cypressUser]').click()
    cy.get('[data-cy=removePermissions-button]').should('be.disabled')
  })

  it('Can remove admin from self, once other user has admin permissions', function () {
    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=admin-cypressUser]').click()
    cy.get('[data-cy=removePermissions-button]').click()
  })

  it('Adding write permissions also grants read permission', function () {
    cy.get('[data-cy=read-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').click()

    cy.get('[data-cy=write-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').should('have.class', 'check')
    cy.get('[data-cy=write-cypressUser2]').should('have.class', 'check')
  })

  it('Removing admin permissions only removes admin permissions', function () {
    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=grantPermissions-button]').click()

    cy.get('[data-cy=admin-cypressUser2]').click()
    cy.get('[data-cy=removePermissions-button]').click()

    cy.get('[data-cy=read-cypressUser2]').should('have.class', 'check')
    cy.get('[data-cy=write-cypressUser2]').should('have.class', 'check')
    cy.get('[data-cy=admin-cypressUser2]').should('have.class', 'close')
  })
})
