/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

describe('Degree reform form tests', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/')
  })

  // **************************************************
  // * tests use admin now due to access restrictions  *
  // * Use normal role once this changes              *

  // * ADJUST beforeEach seeding IN BACKEND as well!! *
  // * now cleans admin's answers                     *
  // **************************************************

  it('Reform form for programmes is accessible through links and loads', () => {
    cy.get('[data-cy=nav-degree-reform-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=reform-form-group-container')
    cy.get('[data-cy=choose-radio-degree_abilities_in_changing_conditions]')

    // check that no individual form contents
    cy.get('[data-cy=unit-selection]').should('not.exist')
  })

  it('Reform form for individuals loads', () => {
    cy.visit('/degree-reform-individual/form')
    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=choose-radio-degree_abilities_in_changing_conditions]')
    cy.get('[data-cy=unit-selection]')
  })

  it('Reform form for studyprogrammes can be opened and edited', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
    cy.get('[data-cy=form-2-deadline]').contains('14.')
    cy.visit(`/degree-reform/form/${testProgrammeCode}`)

    // test you can click some buttons
  })

  it('Reform form for individual can be opened and edited', () => {
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/degree-reform-individual/form')

    // test you can click some buttons
  })

  // programmes : click, reload, check data persists

  /* FIX THIS TEST
  it('Reform form for group check that data persists', () => {
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
    cy.get('[data-cy=form-2-deadline]').contains('14.')
    // Start filling in the form

    cy.get('[data-cy=nav-degree-reform-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=choose-checkbox-bachelor] [type="checkbox"]').check({ force: true })
    cy.get('[data-cy=choose-radio-container-degree_abilities_in_changing_conditions] [type="radio"]').check({
      force: true,
    })
    // test you can click some buttons
  })

  // individual: click, reload, check data persists

  it('Reform form for individual check that data persists', () => {
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/degree-reform-individual/form')

    // Start filling in the form

    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=choose-radio-primary-role]')
    // test you can click some buttons
  })
*/
  // individual: check that correct data shown
  //    login as someone else and make sure that they don't get admin's answers
})
