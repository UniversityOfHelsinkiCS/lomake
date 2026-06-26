/// <reference types="cypress" />

import { testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Misc tests', () => {
  // Cypress.stop()
  // return
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/yearly')
  })

  it('CSV-download can be started on OverviewPage', () => {
    cy.get('[data-cy=csv-download]').should('contain', 'Download')
    cy.get('[data-cy=csv-download]').click()
  })

  it('CSV-download can be started on FormPage', () => {
    cy.visit(`/yearly/form/1/${testProgrammeCode}`)
    cy.get('[data-cy=csv-download]').should('contain', 'Download')
    cy.get('[data-cy=csv-download]').click()
  })
})
