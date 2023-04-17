/* eslint-disable cypress/no-unnecessary-waiting */
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
    cy.get('[data-cy=choose-radio-container-degree_abilities_in_changing_conditions]')

    // check that no individual form contents
    cy.get('[data-cy=unit-selection]').should('not.exist')
  })

  it('Reform form for individuals loads', () => {
    cy.visit('/degree-reform-individual/form')
    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=choose-radio-container-degree_abilities_in_changing_conditions]')
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

  // FIX THIS TEST
  it('Reform form for group check that data persists', () => {
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
    cy.get('[data-cy=form-2-deadline]').contains('14.')
    // Start filling in the form

    cy.get('[data-cy=nav-degree-reform-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click().wait(1000)
    cy.wait(3000)
    cy.get('[data-cy=choose-radio-container-degree_abilities_in_changing_conditions]')
      .find('input[type="radio"]')
      .as('radio1')
      .check('1', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-skills_for_worklife]')
      .find('input[type="radio"]')
      .as('radio2')
      .check('2', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-degrees_give_skills_for_digitalization]')
      .find('input[type="radio"]')
      .as('radio3')
      .check('3', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-digitalization_and_university]')
      .find('input[type="radio"]')
      .as('radio4')
      .check('4', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-multiple_environments]')
      .find('input[type="radio"]')
      .as('radio5')
      .check('5', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-studying_process]')
      .find('input[type="radio"]')
      .as('radio6')
      .check("I don't know", { force: true })
      .wait(1000)

    cy.get('@radio1').should('be.checked')
    cy.get('@radio2').should('be.checked')
    cy.get('@radio3').should('be.checked')
    cy.get('@radio4').should('be.checked')
    cy.get('@radio5').should('be.checked')
    cy.get('@radio6').should('be.checked')

    // test you can click some buttons
  })

  // individual: click, reload, check data persists

  it('Reform form for individual check that data persists', () => {
    // Create new deadline
    cy.reload()
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/degree-reform-individual/form').wait(1000)

    // Start filling in the form

    cy.get('[data-cy=choose-checkbox-view-is-based-on]')
      .find('input[type="checkbox"]')
      .as('checkbox')
      .check('bachelor', { force: true })

    cy.get('@checkbox').should('be.checked')

    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=choose-radio-container-primary-role]')
      .contains('Opiskelija')
      .as('primary-role-radio')
      .click({ force: true })
      .wait(500)

    cy.get('[data-cy=choose-radio-container-primary-role]').find('input[value=Opiskelija]').should('be.checked')

    // test you can click some buttons
  })

  // individual: check that correct data shown
  //    login as someone else and make sure that they don't get admin's answers
})
