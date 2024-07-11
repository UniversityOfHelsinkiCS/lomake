/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode } from '../../config/common'
import '../support/commands'

describe('Misc tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/yearly')
  })

  it('Locale can be changed and translations work', () => {
    cy.visit(`/form/${testProgrammeCode}`)
    cy.contains('Answers are saved automatically')
    cy.get('[data-cy=navBar-localeDropdown]').click()
    cy.get('[data-cy=navBar-localeOption-fi]').click()
    cy.contains('Vastaukset tallentuvat automaattisesti')
  })

  it('CSV-download can be started on OverviewPage', () => {
    cy.get('[data-cy=csv-download]').should('contain', 'Download')
    cy.get('[data-cy=csv-download]').click()
  })

  it('CSV-download can be started on FormPage', () => {
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=csv-download]').should('contain', 'Download')
    cy.get('[data-cy=csv-download]').click()
  })
})
