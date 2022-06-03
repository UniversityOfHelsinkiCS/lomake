/* eslint-disable no-undef */
/// <reference types="cypress" />

import { iamsInUse, testProgrammeCode } from '../../config/common'

describe('Misc tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
  })

  it('Locale can be changed and translations work', () => {
    cy.visit(`/form/${testProgrammeCode}`)
    cy.contains('Answers are saved automatically. ')
    cy.get('[data-cy=navBar-localeDropdown]').click()
    cy.get('[data-cy=navBar-localeOption-fi]').click()
    cy.contains('Vastaukset tallentuvat automaattisesti.')
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

  // eslint-disable-next-line no-unused-expressions
  !iamsInUse &&
    it('Access keys are pre-generated', () => {
      cy.get(`[data-cy=${testProgrammeCode}-manage]`).click()
      cy.get(`[data-cy=${testProgrammeCode}-viewlink] > input`).invoke('val').should('contain', '/access/')
      cy.get(`[data-cy=${testProgrammeCode}-editlink] > input`).invoke('val').should('contain', '/access/')
    })
})
