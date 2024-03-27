/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import {
  testFacultyCode,
  testFacultyName,
  testProgrammeCode,
  testProgrammeName,
  defaultYears,
} from '../../config/common'
import '../support/commands'

describe('Evaluation forms tests', () => {
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    // ADD THESE WHEN FORM OPENED TO ALL
    // const user = 'cypressUser'
    // cy.login(user)
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit('/')
  })

  // ***
  // EDIT 'BEFORE EACH' AFTER FORM IS ACCESSIBLE TO ALL
  // ***

  it('User can navigate to evaluation programme level form', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains(`Review ${defaultYears[1]}`)
  })

  it('User can navigate to evaluation faculty level form', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Faculty level').click()
    cy.get(`[data-cy=colortable-link-to-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)
    cy.contains(`Review ${defaultYears[1]}`)
  })

  it("Programme level user can see summary of previous years' answers", () => {
    cy.request(`/api/cypress/createAnswers/1`)
    cy.reload()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.contains('Degree programme level').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.wait(2000)
    cy.get('[data-cy=student_admittance-summary]').find('.answer-circle-green')
  })

  context('Answering evaluation faculty', () => {
    it('User can answer faculty level form', () => {
      const facultyUser = 'cypressFacultyKatselmusUser'
      // Check corrent saves notice message
      cy.login(facultyUser)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('Faculty level').click()
      cy.get(`[data-cy=colortable-link-to-H50]`).click()
      cy.get(`[data-cy="deadline-passed-notice"]`).contains('The deadline to edit form has passed.')
      // ----------------------------------------
      cy.login(cypressSuperAdmin)
      cy.visit('/')
      // Create new deadline

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - tiedekunnat')
      cy.get('[data-cy=form-5-deadline]').contains('14.')

      // Go to form and write answers
      cy.login(facultyUser)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('Faculty level').click()
      cy.get(`[data-cy=colortable-link-to-H50]`).click()
      cy.get(`[data-cy="saving-answers-notice"]`).contains(
        'Answers are saved automatically except for text fields. Final day for answering the form:',
      )
      cy.typeInEditor(
        'student_admittance_faculty',
        'Bachelor is kinda okay \n Master is doing okay \n Doctoral is not doing so good',
      )
      cy.get("[data-cy='color-neutral-student_admittance_faculty_bachelor']").click()
      cy.get("[data-cy='color-neutral-student_admittance_faculty_master']").click()
      cy.get("[data-cy='color-negative-student_admittance_faculty_doctoral']").click()

      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('Faculty level').click()

      cy.get('[data-cy=H50-student_admittance_faculty-bachelor]').should(
        'have.css',
        'background-color',
        'rgb(255, 255, 177)',
      )
      cy.get('[data-cy=H50-student_admittance_faculty-master]').should(
        'have.css',
        'background-color',
        'rgb(255, 255, 177)',
      )
      cy.get('[data-cy=H50-student_admittance_faculty-doctoral]').should(
        'have.css',
        'background-color',
        'rgb(255, 127, 127)',
      )
    })
  })

  context('Answering evaluation university', () => {
    it('Test the traffic lights and text answers are saved', () => {
      cy.login(cypressSuperAdmin)
      cy.visit('/')
      // Create new deadline

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - yliopisto')
      cy.get('[data-cy=form-6-deadline]').contains('14.')

      // Go to form and write answers
      const hyTineUser = 'cypressHyTineUser'
      cy.login(hyTineUser)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University level').click()
      cy.get("[data-cy='color-positive-student_admittance_university-university-bachelor']").click()
      cy.get("[data-cy='color-neutral-student_admittance_university-university-master']").click()
      cy.get("[data-cy='color-negative-student_admittance_university-university-doctoral']").click()

      cy.typeInEditor('student_admittance_university-university-bachelor', 'ONE: Bachelor is really good')
      cy.typeInEditor('student_admittance_university-university-master', 'ONE: Master is doing okay')
      cy.typeInEditor('student_admittance_university-university-doctoral', 'TINE: Doctoral is not doing so good')

      cy.reload()

      cy.get("[data-cy='color-positive-student_admittance_university-university-bachelor']").should(
        'have.class',
        'selected-animated',
      )
      cy.get("[data-cy='color-neutral-student_admittance_university-university-master']").should(
        'have.class',
        'selected-animated',
      )
      cy.get("[data-cy='color-negative-student_admittance_university-university-doctoral']").should(
        'have.class',
        'selected-animated',
      )

      cy.get("[data-cy='editing-area-student_admittance_university-university-bachelor']").contains(
        'ONE: Bachelor is really good',
      )
      cy.get("[data-cy='editing-area-student_admittance_university-university-master']").contains(
        'ONE: Master is doing okay',
      )
      cy.get("[data-cy='editing-area-student_admittance_university-university-doctoral']").contains(
        'TINE: Doctoral is not doing so good',
      )
      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University overview').click()

      cy.get('[data-cy=UNI-student_admittance_university-university-master-single]').should(
        'have.css',
        'background-color',
        'rgb(255, 255, 177)',
      )
      cy.get('[data-cy=UNI-student_admittance_university-university-doctoral-single]').should(
        'have.css',
        'background-color',
        'rgb(255, 127, 127)',
      )
    })

    it('Test that overview page level filter works', () => {
      cy.login(cypressSuperAdmin)
      cy.visit('/')
      // Create new deadline

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - yliopisto')
      cy.get('[data-cy=form-6-deadline]').contains('14.')

      // Go to form and write answers
      const hyTineUser = 'cypressHyTineUser'
      cy.login(hyTineUser)
      cy.visit('/')

      cy.get('[data-cy=navBar-localeDropdown]').click()
      cy.get('[data-cy=navBar-localeOption-fi]').click()

      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University level').click()
      cy.get("[data-cy='color-positive-student_admittance_university-university-bachelor']").click()
      cy.get("[data-cy='color-neutral-student_admittance_university-university-master']").click()
      cy.get("[data-cy='color-negative-student_admittance_university-university-doctoral']").click()

      cy.typeInEditor('student_admittance_university-university-bachelor', 'ONE: Bachelor is really good')
      cy.typeInEditor('student_admittance_university-university-master', 'ONE: Master is doing okay')
      cy.typeInEditor('student_admittance_university-university-doctoral', 'TINE: Doctoral is not doing so good')

      cy.get("[data-cy='color-positive-student_admittance_university-arviointi-bachelor']").click()
      cy.get("[data-cy='color-neutral-student_admittance_university-arviointi-master']").click()
      cy.get("[data-cy='color-negative-student_admittance_university-arviointi-doctoral']").click()

      cy.typeInEditor('student_admittance_university-arviointi-bachelor', 'ONE: Bachelor is really good')
      cy.typeInEditor('student_admittance_university-arviointi-master', 'ONE: Master is doing okay')
      cy.typeInEditor('student_admittance_university-arviointi-doctoral', 'TINE: Doctoral is not doing so good')

      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University overview').click()

      // At start all levels are visible
      cy.get('[data-cy=UNI-student_admittance_university-university-master-single]').should('be.visible')
      cy.get('[data-cy=UNI-student_admittance_university-arviointi-master-single]').should('be.visible')
      cy.get('[data-cy=UNI-student_admittance_university-university-doctoral-single]').should('be.visible')
      cy.get('[data-cy=UNI-student_admittance_university-arviointi-doctoral-single]').should('be.visible')
      // ----------------

      // Choose master level
      cy.get('[data-cy=committee-level-filter-master]').click()

      cy.get('[data-cy=UNI-student_admittance_university-university-master-single]').should('be.visible')
      cy.get('[data-cy=UNI-student_admittance_university-arviointi-master-single]').should('be.visible')
      // Doctoral shouldn't be visible
      cy.get('[data-cy=UNI-student_admittance_university-university-doctoral-single]').should('not.exist')
      cy.get('[data-cy=UNI-student_admittance_university-arviointi-doctoral-single]').should('not.exist')
    })

    it('Test that actions are saved', () => {
      cy.login(cypressSuperAdmin)
      cy.visit('/')
      // Create new deadline

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - yliopisto')
      cy.get('[data-cy=form-6-deadline]').contains('14.')

      // Go to form and write answers
      const hyTineUser = 'cypressHyTineUser'
      cy.login(hyTineUser)
      cy.visit('/')

      cy.get('[data-cy=navBar-localeDropdown]').click()
      cy.get('[data-cy=navBar-localeOption-fi]').click()

      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University level').click()
      cy.wait(100)
      cy.get("[data-cy='university_ease_of_study_actions-university-master-development-area-1']").type(
        'Master: This is a development area',
      )
      cy.wait(100)
      cy.get("[data-cy='university_ease_of_study_actions-university-master-action-1']").type('Master: This is action')
      cy.wait(100)
      cy.get('[data-cy=university_ease_of_study_actions-university-master-add-action-button]').click()
      cy.get("[data-cy='university_ease_of_study_actions-university-master-development-area-2']").type(
        'Master: This is also development area',
      )
      cy.wait(100)
      cy.get("[data-cy='university_ease_of_study_actions-university-master-action-2']").type(
        'Master: This is second action',
      )
      cy.wait(100)

      cy.get('[data-cy=nav-evaluation]').click()
      cy.contains('University overview').click()

      cy.get('[data-cy=university_ease_of_study_actions-university-master]').click()
      cy.get("[data-cy='modal-title-action-1']").contains('Master: This is a development area')
      cy.get("[data-cy='modal-title-action-1']").click()
      cy.get("[data-cy='modal-content-action-1']").contains('Master: This is action')
    })
  })

  // Test that written answers can be seen by toggling the arrow button

  // Test that filling an answer in yearly form is updated in the summary element (programmes)

  // Test answering programme evaluation and that the asnwers is updated to faculty form summary

  // Test all answers pages
})
