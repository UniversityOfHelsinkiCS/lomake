/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

describe('Degree reform form tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
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
    cy.visit('/individual')
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
    cy.visit('/individual')
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
    cy.get('[data-cy=choose-radio-degree_abilities_in_changing_conditions]')
      .find('input[type="radio"]')
      .check('1', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-studytrack_was_clear]')
      .find('input[type="radio"]')
      .as('radio2')
      .check('2', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-studytrack_choices_and_transitions_are_flexible]')
      .find('input[type="radio"]')
      .as('radio3')
      .check('3', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-university_is_interationally_attractive]')
      .find('input[type="radio"]')
      .as('radio4')
      .check('4', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-university_graduates_are_international_worklife_oriented]')
      .find('input[type="radio"]')
      .as('radio5')
      .check('5', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-study_design_and_implementation_good_practices_are_shared]')
      .find('input[type="radio"]')
      .as('radio6')
      .check("I don't know", { force: true })
      .wait(1000)

    cy.reload()

    cy.wait(3000)

    cy.get('[data-cy=choose-radio-degree_abilities_in_changing_conditions] :checked')
      .should('be.checked')
      .and('have.value', '1')
    cy.get('[data-cy=choose-radio-studytrack_was_clear] :checked').should('be.checked').and('have.value', '2')
    cy.get('[data-cy=choose-radio-studytrack_choices_and_transitions_are_flexible] :checked')
      .should('be.checked')
      .and('have.value', '3')
    cy.get('[data-cy=choose-radio-university_is_interationally_attractive] :checked')
      .should('be.checked')
      .and('have.value', '4')
    cy.get('[data-cy=choose-radio-university_graduates_are_international_worklife_oriented] :checked')
      .should('be.checked')
      .and('have.value', '5')
    cy.get('[data-cy=choose-radio-study_design_and_implementation_good_practices_are_shared] :checked')
      .should('be.checked')
      .and('have.value', "I don't know")
  })

  // individual: click, reload, check data persists

  it('Reform form for individual check that data persists', () => {
    // Create new deadline
    cy.reload()
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/individual').wait(3000)

    // Start filling in the form

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .as('checkbox')
      .check('bachelor', { force: true })
      .wait(1000)

    cy.get('@checkbox').should('be.checked')

    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=advanced-radio-primary_role]')
      .contains('Student')
      .as('primary_role-radio')
      .click({ force: true })
      .wait(2000)

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[value=Student]').should('be.checked')

    cy.reload()

    cy.wait(2000)

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[value=Student]').should('be.checked')
  })

  it('If individual degree reform is closed, answering is disabled', () => {
    cy.reload()

    cy.visit('/individual').wait(3000)

    // Start filling in the form

    cy.get('[data-cy=advanced-radio-background_unit]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=choose-radio-how_many_years]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=choose-checkbox-view_is_based_on]').find('input[type="checkbox"]').should('be.disabled')

    cy.get('[data-cy=choose-radio-degree_abilities_in_changing_conditions]')
      .find('input[type="radio"]')
      .should('be.disabled')

    cy.get('[data-cy=choose-radio-studytrack_was_clear]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=editing-area-degree_reform_free_answer]').should('not.exist')

    cy.reload()

    cy.wait(2000)
  })

  it('"view-is-based-on"-checkbox works correctly', () => {
    cy.reload()
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/individual').wait(3000)

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 7)

    cy.get('[data-cy=choose-radio-container-bachelor_programme_structure_is_clear]').should('not.exist')

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('bachelor', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-bachelor_programme_structure_is_clear]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-4]`).should(
      'contain',
      'Bachelor programmes structure and functionality'
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 8)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('masters', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-master_programs_are_sufficiently_sized]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-5]`).should('contain', 'Master programmes structure and functionality')

    cy.get('[data-cy=choose-radio-container-study_program_has_both_finnish_and_foreign]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-6]`).should('contain', 'International master programmes criteria')

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 10)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('doctoral', { force: true })
      .wait(1000)

    cy.get('[data-cy=choose-radio-container-doctoral_program_has_clear_profile]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-7]`).should(
      'contain',
      'Doctoral programmes structure and functionality'
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 11)
  })

  // individual: check that correct data shown
  //    login as someone else and make sure that they don't get admin's answers
})
