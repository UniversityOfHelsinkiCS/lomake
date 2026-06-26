/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

const cypressSuperAdmin = 'cypressSuperAdminUser'
const cypressUser = 'cypressUser'
const cypressReadingRightsUser = 'cypressReadingRightsUser'

describe('Degree reform form tests', () => {
  // **************************************************
  // * tests use admin now due to access restrictions  *
  // * Use normal role once this changes              *

  // * ADJUST beforeEach seeding IN BACKEND as well!! *
  // * now cleans admin's answers                     *
  // **************************************************
  // Cypress.stop()
  // return
  it('Reform form for programmes is accessible through links and loads', () => {
    cy.login(cypressUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=reform-form-group-container')
    cy.get('[data-cy=choose-radio-container-helsinki_is_an_attractive_study_place]')

    // check that no individual form contents
    cy.get('[data-cy=advanced-radio-background_unit]').should('not.exist')
  })

  it('Reform form for individuals loads', () => {
    cy.login(cypressUser)
    cy.visit('/individual')
    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=choose-radio-container-helsinki_is_an_attractive_study_place]')
    cy.get('[data-cy=advanced-radio-background_unit]')
  })

  it('Reform form for studyprogrammes can be opened and edited', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'degree-reform', 2)
    cy.get('[data-cy=form-2-deadline]').contains('14.')
    cy.visit(`/degree-reform/form/${testProgrammeCode}`)

    // test you can click some buttons
  })

  it('Reform form for individual can be opened and edited', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'degree-reform', 3)
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.visit('/individual')
    cy.get('[data-cy=form-section-0]')
  })

  it('Degree Reform - Programme - Status Message, no rights', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'degree-reform', 2)
    cy.get('[data-cy=form-2-deadline]').contains('14.')

    cy.login(cypressReadingRightsUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click().wait(1000)
    cy.get(`[data-cy=colortable-link-to-KH10_001]`).click()
  })

  it('Degree Reform - Programme - Bachelor - Sections are shown', () => {
    cy.login(cypressUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process'
    )
    cy.get('[data-cy=form-section-III]').contains('Structure and functioning of bachelor’s programmes')
    cy.get('[data-cy=form-section-VII]').contains('Management and leadership of degree programmes')
    cy.get('[data-cy=form-section-VIII]').contains('Joint degree programmes between faculties')
    cy.get('[data-cy=form-section-IX]').contains('Other comments')
    // Check that no other programmes questions show:
    cy.get('[data-cy=form-section-IV]').should('not.exist') // master
    cy.get('[data-cy=form-section-V]').should('not.exist') // master int
    cy.get('[data-cy=form-section-VI]').should('not.exist') // doctoral

    // Sidebar works Bachelor

    cy.get(`[id=question-list-1]`).children().should('have.length', 7)
    cy.get(`[id=question-list-2]`).children().should('have.length', 7)
    cy.get(`[id=question-list-3]`).children().should('have.length', 4)
    cy.get(`[id=question-list-4]`).children().should('have.length', 5)
    cy.get(`[id=question-list-8]`).children().should('have.length', 7)
    cy.get(`[id=question-list-9]`).children().should('have.length', 5)

    // ----------------------------------------
    // Check that Master's sections work
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get(`[data-cy=colortable-link-to-MH80_001]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process'
    )
    cy.get('[data-cy=form-section-IV]').contains('Structure and functioning of master’s programmes')
    cy.get('[data-cy=form-section-V]').contains('Functioning of international master’s programmes')
    cy.get('[data-cy=form-section-VII]').contains('Management and leadership of degree programmes')
    cy.get('[data-cy=form-section-VIII]').contains('Joint degree programmes between faculties')
    cy.get('[data-cy=form-section-IX]').contains('Other comments')
    // Check that no other programmes questions show:
    cy.get('[data-cy=form-section-III]').should('not.exist') // bachelor
    cy.get('[data-cy=form-section-VI]').should('not.exist') // doctoral

    // Sidebar works Master

    cy.get(`[id=question-list-1]`).children().should('have.length', 7)
    cy.get(`[id=question-list-2]`).children().should('have.length', 7)
    cy.get(`[id=question-list-3]`).children().should('have.length', 4)
    cy.get(`[id=question-list-5]`).children().should('have.length', 5)
    cy.get(`[id=question-list-6]`).children().should('have.length', 6)
    cy.get(`[id=question-list-8]`).children().should('have.length', 7)
    cy.get(`[id=question-list-9]`).children().should('have.length', 5)

    // ----------------------------------------
    // Check that Doctoral sections work
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get(`[data-cy=colortable-link-to-T923103]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process'
    )
    cy.get('[data-cy=form-section-VI]').contains('Structure and functioning of doctoral programmes')
    cy.get('[data-cy=form-section-VII]').contains('Management and leadership of degree programmes')
    cy.get('[data-cy=form-section-VIII]').contains('Joint degree programmes between faculties')
    cy.get('[data-cy=form-section-IX]').contains('Other comments')
    // Check that no other programmes questions show:
    cy.get('[data-cy=form-section-III]').should('not.exist') // bachelor
    cy.get('[data-cy=form-section-IV]').should('not.exist') // master
    cy.get('[data-cy=form-section-V]').should('not.exist') // master int

    // Sidebar works Doctoral

    cy.get(`[id=question-list-1]`).children().should('have.length', 7)
    cy.get(`[id=question-list-2]`).children().should('have.length', 7)
    cy.get(`[id=question-list-3]`).children().should('have.length', 4)
    cy.get(`[id=question-list-7]`).children().should('have.length', 5)
    cy.get(`[id=question-list-8]`).children().should('have.length', 7)
    cy.get(`[id=question-list-9]`).children().should('have.length', 5)
  })

  it('If individual degree reform is closed, answering is disabled', () => {
    cy.login(cypressUser)
    cy.visit('/individual')

    // Check that Status Message works
    cy.get(`[data-cy=deadline-passed-notice]`).contains('The deadline to edit form has passed.')
    // ----------------------------------------

    // Start filling in the form

    cy.get('[data-cy=advanced-radio-background_unit]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=choose-basic-radio-how_many_years]').find('input[type="radio"]').should('be.disabled')

    cy.get('[data-cy=choose-checkbox-view_is_based_on]').find('input[type="checkbox"]').should('be.disabled')

    cy.get('[data-cy=choose-basic-radio-helsinki_is_an_attractive_study_place]')
      .find('input[type="radio"]')
      .should('be.disabled')

    cy.get('[data-cy=choose-basic-radio-changing_workplace_needs_are_reflected_in_education]')
      .find('input[type="radio"]')
      .should('be.disabled')

    cy.get('[data-cy=editing-area-degree_reform_free_answer]').should('not.exist')
  })
})
