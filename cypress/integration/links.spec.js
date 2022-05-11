/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName, iamsInUse } from '../../config/common'

!iamsInUse &&
  describe('Link tests', () => {
    beforeEach(() => {
      cy.login('cypressUser')
    })

    it('Can claim read access', () => {
      cy.visit('/access/readTest')
      cy.get('[data-cy=claim-button]').click()
      cy.get(`[data-cy=colortable-link-to-${testProgrammeName}]`)
    })

    it('Can claim write access', () => {
      cy.visit('/access/writeTest')
      cy.get('[data-cy=claim-button]').click()
      cy.get(`[data-cy=colortable-link-to-${testProgrammeName}]`)
    })

    it('Can claim admin (owner) access after typing confirmation, and claimed status is updated', () => {
      cy.visit('/access/adminTest')
      cy.get('[data-cy=claim-button]').should('be.disabled')
      cy.get('[data-cy=claimAccessPage-confirmation-input]').type('TOSKA-en')
      cy.get('[data-cy=claim-button]').click()
      cy.get(`[data-cy=${testProgrammeName}-manage]`).click()
      cy.get('[data-cy=read-cypressUser]').should('have.class', 'check')
      cy.get('[data-cy=write-cypressUser]').should('have.class', 'check')
      cy.get('[data-cy=admin-cypressUser]').should('have.class', 'check')
    })

    it("Can't use admin link more than once", () => {
      cy.visit('/access/adminTest')
      cy.get('[data-cy=claimAccessPage-confirmation-input]').type('TOSKA-en')
      cy.get('[data-cy=claim-button]').click()
      cy.visit('/access/adminTest')
      cy.get('[data-cy=invalidTokenError]')
    })

    it("Can't claim token that does not exist", () => {
      cy.visit('/access/kdaskdaskadsk')
      cy.get('[data-cy=invalidTokenError]')
    })

    it('Claiming programme wide read-permissions grants correct permissions', () => {
      cy.visit('/access/facultyReadTest')
      cy.get('[data-cy=programmeList-item]').should('have.length', 29)
      cy.get('[data-cy=claim-button]').click()

      cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 29)
    })

    it('Claiming read token for facultys doctor programmes gives correct permissions', () => {
      cy.visit('/access/facultyReadDoctorTest')
      cy.get('[data-cy=programmeList-item]').should('have.length', 8)
      cy.get('[data-cy=claim-button]').click()

      cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 8)
    })
  })
