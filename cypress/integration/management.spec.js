/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode, iamsInUse } from '../../config/common'

describe('Management tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
  })

  !iamsInUse &&
    it('Giving admin permissions enables all permissions', () => {
      cy.get('[data-cy=admin-cypressUser2-false]').click()
      cy.get('[data-cy=grantPermissions-button]').click()

      cy.get('[data-cy=read-cypressUser2]')
      cy.get('[data-cy=write-cypressUser2]')
      cy.get('[data-cy=admin-cypressUser2]')
    })

  !iamsInUse &&
    it('Cant remove read/edit permissions if targetuser is admin, but can remove admin permissions.', () => {
      cy.get('[data-cy=admin-cypressUser2-false]').click()
      cy.get('[data-cy=grantPermissions-button]').click()

      cy.get('[data-cy=read-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').should('be.disabled')

      cy.get('[data-cy=write-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').should('be.disabled')

      cy.get('[data-cy=admin-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').click()
    })

  !iamsInUse &&
    it('Removing read permissions removed write permissions too', () => {
      cy.get('[data-cy=admin-cypressUser2-false]').click()
      cy.get('[data-cy=grantPermissions-button]').click()

      cy.get('[data-cy=admin-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').click()

      cy.get('[data-cy=read-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').click()

      cy.get('[data-cy=read-cypressUser2]').should('not.exist')
      cy.get('[data-cy=write-cypressUser2]').should('not.exist')
      cy.get('[data-cy=admin-cypressUser2]').should('not.exist')
    })

  !iamsInUse &&
    it('Cant remove permissions of last admin user remaining', () => {
      cy.get('[data-cy=admin-cypressUser]').click()
      cy.get('[data-cy=removePermissions-button]').should('be.disabled')
    })

  !iamsInUse &&
    it('Can remove admin from self, once other user has admin permissions', () => {
      cy.get('[data-cy=admin-cypressUser2-false]').click()
      cy.get('[data-cy=grantPermissions-button]').click()

      cy.get('[data-cy=admin-cypressUser]').click()
      cy.get('[data-cy=removePermissions-button]').click()
    })

  !iamsInUse &&
    it('Removing admin permissions only removes admin permissions', () => {
      cy.get('[data-cy=admin-cypressUser2-false]').click()
      cy.get('[data-cy=grantPermissions-button]').click()

      cy.get('[data-cy=admin-cypressUser2]').click()
      cy.get('[data-cy=removePermissions-button]').click()

      cy.get('[data-cy=read-cypressUser2]')
      cy.get('[data-cy=write-cypressUser2]')
      cy.get('[data-cy=admin-cypressUser2-false]')
    })

  it('Locking the form updates the display and prevents editing the form', () => {
    cy.get(`[data-cy=formLocker-button-close]`).click()
    cy.get(`[data-cy=formLocker-verify-close-button]`).click()
    cy.get(`[data-cy=formLocker-button-open]`)
    cy.get(`[data-cy=formLocker-verify-open-button]`)

    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').should('not.exist')
  })
})
