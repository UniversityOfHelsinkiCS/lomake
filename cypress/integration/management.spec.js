/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Management tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
  })

  it('Locking the form updates the display and prevents editing the form', () => {
    cy.get(`[data-cy=formLocker-button-close]`).click()
    cy.get(`[data-cy=formLocker-verify-close-button]`).click({ waitForAnimations: false })
    cy.get(`[data-cy=formLocker-button-open]`)
    cy.get(`[data-cy=formLocker-verify-open-button]`)

    cy.login('cypressUser')
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').should('not.exist')
  })
})
