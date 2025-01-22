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

  it('Reform form for programmes is accessible through links and loads', () => {
    cy.login(cypressUser)
    cy.visit('/yearly')
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

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
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

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
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

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
    cy.get('[data-cy=form-2-deadline]').contains('14.')

    cy.login(cypressReadingRightsUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click().wait(1000)
    cy.get(`[data-cy=colortable-link-to-KH10_001]`).click()
    cy.get(`[data-cy="no-write-access-notice"]`).contains(
      `You don't have editing rights to this form. But you can view the answers.`,
    )
  })

  it('Degree Reform - Programme - Bachelor - Sections are shown', () => {
    cy.login(cypressUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process',
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
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get(`[data-cy=colortable-link-to-MH80_001]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process',
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
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get(`[data-cy=colortable-link-to-T923103]`).click()
    cy.get('[data-cy=form-section-0]').contains('Degree reform goals')
    cy.get('[data-cy=form-section-I]').contains('Master and minor based education to degree programmes')
    cy.get('[data-cy=form-section-II]').contains(
      'Genuine three-tier structure and the principles of the Bologna Process',
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

  it('Reform form for group check that data persists', () => {
    // Check that Status Message works and is closed
    cy.login(cypressUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get(`[data-cy="deadline-passed-notice"]`).contains('The deadline to edit form has passed.')
    // ----------------------------------------
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    // Create new deadline

    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - koulutusohjelmat')
    cy.get('[data-cy=form-2-deadline]').contains('14.')
    // Start filling in the form
    cy.login(cypressUser)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-degreeReform]').click()
    cy.get('[data-cy=nav-group]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.wait(1000)
    // Check that Status Message works and is open
    cy.get(`[data-cy="saving-answers-notice"]`)
    // ----------------------------------------
    cy.get('[data-cy=choose-basic-radio-helsinki_is_an_attractive_study_place]')
      .find('input[type="radio"]')
      .check('1', { force: true })

    cy.get('[data-cy=choose-basic-radio-changing_workplace_needs_are_reflected_in_education]')
      .find('input[type="radio"]')
      .as('radio2')
      .check('2', { force: true })

    cy.get('[data-cy=choose-basic-radio-study_content_is_up_to_date]')
      .find('input[type="radio"]')
      .as('radio3')
      .check('3', { force: true })

    cy.get('[data-cy=choose-basic-radio-teach_practices_are_up_to_date]')
      .find('input[type="radio"]')
      .as('radio4')
      .check('4', { force: true })

    cy.get('[data-cy=choose-basic-radio-study_support_services_are_functional]')
      .find('input[type="radio"]')
      .as('radio5')
      .check('5', { force: true })

    cy.get('[data-cy=choose-basic-radio-teaching_support_services_are_functional]')
      .find('input[type="radio"]')
      .as('radio6')
      .check("I don't know", { force: true })

    cy.reload()

    cy.wait(1000)

    cy.get('[data-cy=choose-basic-radio-helsinki_is_an_attractive_study_place] :checked')
      .should('be.checked')
      .and('have.value', '1')
    cy.get('[data-cy=choose-basic-radio-changing_workplace_needs_are_reflected_in_education] :checked')
      .should('be.checked')
      .and('have.value', '2')
    cy.get('[data-cy=choose-basic-radio-study_content_is_up_to_date] :checked')
      .should('be.checked')
      .and('have.value', '3')
    cy.get('[data-cy=choose-basic-radio-teach_practices_are_up_to_date] :checked')
      .should('be.checked')
      .and('have.value', '4')
    cy.get('[data-cy=choose-basic-radio-study_support_services_are_functional] :checked')
      .should('be.checked')
      .and('have.value', '5')
    cy.get('[data-cy=choose-basic-radio-teaching_support_services_are_functional] :checked')
      .should('be.checked')
      .and('have.value', "I don't know")
  })

  it('Reform form for individual check that data persists', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')

    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')

    cy.login(cypressUser)
    cy.visit('/individual')
    // Check that Status Message works
    cy.get(`[data-cy=saving-answers-notice]`)
    // ----------------------------------------

    cy.get('[data-cy=choose-checkbox-view_is_based_on]').find('input[value=bachelor]').as('checkbox').wait(500)

    cy.get('@checkbox').check('bachelor', { force: true })

    cy.get('@checkbox').should('be.checked')

    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=advanced-radio-primary_role]').contains('Student').as('primary_role-radio').click({ force: true })

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[value=Student]').should('be.checked')

    cy.reload()

    cy.wait(500)
    cy.get('@checkbox').should('be.checked')

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[value=Student]').should('be.checked')
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

  it.skip('"view-is-based-on"-checkbox works correctly', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')

    cy.login(cypressUser)
    cy.visit('/individual').wait(1500) // Wait for the form to load, (Increses the chance of the test passing exponentially)

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 6)

    cy.get('[data-cy=choose-radio-container-bachelor_programme_structure_is_clear]').should('not.exist')

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('bachelor', { force: true })

    cy.get('[data-cy=choose-radio-container-bachelor_programme_structure_is_clear]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-4]`).should(
      'contain',
      'Structure and functioning of bachelor’s programmes',
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 7)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('masters', { force: true })

    cy.get('[data-cy=choose-radio-container-master_programs_are_sufficiently_sized]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-5]`).should(
      'contain',
      'Structure and functioning of master’s programmes',
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 8)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('international', { force: true })

    cy.get('[data-cy=choose-radio-container-study_program_has_both_finnish_and_foreign]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-6]`).should(
      'contain',
      'Functioning of international master’s programmes',
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 9)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('doctoral', { force: true })

    cy.get('[data-cy=choose-radio-container-doctoral_program_has_clear_profile]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-7]`).should(
      'contain',
      'Structure and functioning of doctoral programmes',
    )

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 10)

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('faculty_collarobate', { force: true })

    cy.get('[data-cy=choose-radio-container-study_programmes_have_succesful_content]').should('exist')

    cy.get(`[data-cy=navigation-sidebar-section-9]`).should('contain', 'Joint degree programmes between faculties')

    cy.get('[data-cy=navigation-sidebar-list]').children().should('have.length', 11)
    // Check that each section has correct amount of questions
    cy.get(`[id=question-list-0]`).children().should('have.length', 4)
    cy.get(`[id=question-list-1]`).children().should('have.length', 7)
    cy.get(`[id=question-list-2]`).children().should('have.length', 7)
    cy.get(`[id=question-list-3]`).children().should('have.length', 4)
    cy.get(`[id=question-list-4]`).children().should('have.length', 6)
    cy.get(`[id=question-list-5]`).children().should('have.length', 6)
    cy.get(`[id=question-list-6]`).children().should('have.length', 7)
    cy.get(`[id=question-list-7]`).children().should('have.length', 6)
    cy.get(`[id=question-list-8]`).children().should('have.length', 8)
    cy.get(`[id=question-list-9]`).children().should('have.length', 6)
  })

  it('Saving individual form works correctly', () => {
    cy.login(cypressSuperAdmin)
    cy.visit('/yearly')
    // Create new deadline
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Koulutusuudistusarviointi - yksilöt')
    cy.get('[data-cy=form-3-deadline]').contains('14.')
    cy.login(cypressUser)

    cy.visit('/individual').wait(1000) // Wait for the form to load, (Increses the chance of the test passing exponentially)

    cy.get('[data-cy=reform-individual-form-container')
    cy.get('[data-cy=advanced-radio-background_unit]')
      .find('input[type="radio"]')
      .as('YPACheckbox')
      .check('University Services / Teaching and Learning Service', { force: true })

    cy.get('@YPACheckbox').should('be.checked')

    cy.get('[data-cy=advanced-radio-primary_role]')
      .find('input[type="radio"]')
      .as('primaryRole')
      .check('Member of teaching and research staff', { force: true })

    cy.get('@primaryRole').should('be.checked')

    cy.get('[data-cy=advanced-basic-radio-primary_role]')
      .find('input[value="Other"]')
      .check('Other', { force: true })
      .as('primaryRoleTeaching')

    cy.get('@primaryRoleTeaching').should('be.checked')

    cy.get('[data-cy=advanced-basic-input-other-field]').type('Other role')

    cy.get('[data-cy=advanced-basic-input-other-field]').find('input').should('have.value', 'Other role')

    cy.get('[data-cy=choose-basic-radio-how_many_years]')
      .find('input[type="radio"]')
      .check('Less than 1 year', { force: true })

    cy.get('[data-cy=choose-basic-radio-how_many_years]').find('input[value="Less than 1 year"]').should('be.checked')

    cy.get('[data-cy=choose-checkbox-view_is_based_on]')
      .find('input[type="checkbox"]')
      .check('bachelor', { force: true })

    cy.get('[data-cy=choose-checkbox-view_is_based_on]').find('input[value="bachelor"]').should('be.checked')

    cy.get('[data-cy=individual-form-ready-button]').click()

    /* Deprecated since there's no function to send form
    cy.get('[data-cy=individual-form-send-modal-button]').click()
    cy.get('[data-cy=individual-form-send-form-button]').click().wait(1000)

    // Check form was sent succesfully and form is empty

    cy.get('[data-cy=advanced-radio-background_unit]').find('input[type="radio"]').should('not.be.checked')

    cy.get('[data-cy=advanced-radio-primary_role]').find('input[type="radio"]').should('not.be.checked')

    cy.get('[data-cy=advanced-radio-background_unit]').find('input[value="Other"]').should('not.be.checked')

    cy.get('[data-cy=choose-basic-radio-how_many_years]').find('input[type="radio"]').should('not.be.checked')
    */
  })

  // individual: check that correct data shown
  //    login as someone else and make sure that they don't get admin's answers
})
