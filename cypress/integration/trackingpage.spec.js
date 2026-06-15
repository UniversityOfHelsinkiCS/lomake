import { testFacultyCode, testFacultyName, defaultYears } from '../../config/common'

describe('Tracking page tests', () => {
  // Cypress.stop()
  // return
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    cy.login(cypressSuperAdmin)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(defaultYears[0], 'evaluation', 8)
    cy.get('[data-cy=form-8-deadline]').contains('14.')
    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
  })

  it('should open tracking page and select question 1', () => {
    cy.contains(testFacultyName.toUpperCase())
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains(
      '1. Degree programmes include model schedules in curricula that support understanding of the education system, study paths, and course offerings'
    ).click()
    cy.get('[data-cy=send-selection-button]').click()
  })

  it('should pick questions and write to modal', () => {
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains(
      '1. Degree programmes include model schedules in curricula that support understanding of the education system, study paths, and course offerings'
    ).click()
    cy.get('[data-cy=send-selection-button]').click()

    cy.get('[data-cy=accordion-group-0]').click()
    cy.get('[data-cy=modify-plan-1]').click()

    cy.get('[id=1_contact_person_text]').type('contact person')

    cy.get('[data-cy=close-modal]').click()
  })

  it('should open tracking page and select question 1 and 2', () => {
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains('1.').click()
    cy.contains('2.').click()
    cy.get('[data-cy=send-selection-button]').click()

    cy.get('[data-cy=accordion-group-0]').click()
    cy.get('[data-cy=modify-plan-1]').click()
    cy.get('[data-cy=toggle-chooser]').click()
    cy.get('[data-cy=color-positive-1]').click()
    cy.get('[id=1_contact_person_text]').type('contact person')

    cy.get('[data-cy=close-modal]').click()

    cy.get('[data-cy=modify-plan-2]').click()
    cy.get('[data-cy=toggle-chooser]').click()
    cy.get('[data-cy=color-negative-2]').click()

    cy.get('[data-cy=close-modal]').click()
  })

  it('should pick all the questions and fill them with ligths', () => {
    const faculty = 'H57'
    cy.visit(`faculty-monitoring/${faculty}`)
    cy.get('[data-cy=degreeDropdown]').click()
    cy.contains('Doctoral programmes').click()

    cy.get(`[data-cy=question-picker-${faculty}]`).click()

    cy.get('[data-cy=questions-list-0]').click()
    cy.contains('1.').click()
    cy.contains('2.').click()
    cy.contains('3.').click()
    cy.contains('4.').click()
    cy.contains('5.').click()
    cy.get('[data-cy=questions-list-1]').click()
    cy.contains('6.').click()

    cy.get('[data-cy=questions-list-2]').click()
    cy.contains('7.').click()

    cy.get('[data-cy=questions-list-3]').click()
    cy.contains('8.').click()
    cy.contains('9.').click()

    cy.get('[data-cy=send-selection-button]').click()

    cy.get('[data-cy=accordion-group-0]').click()
    for (let i = 1; i < 6; i++) {
      cy.get(`[data-cy=modify-plan-T${i}]`).click()
      cy.get('[data-cy=toggle-chooser]').click()
      cy.get(`[data-cy=color-positive-T${i}]`).click()
      cy.get('[data-cy=close-modal]').click()
    }

    cy.get('[data-cy=accordion-group-1]').click()
    cy.get(`[data-cy=modify-plan-T6]`).click()
    cy.get('[data-cy=toggle-chooser]').click()
    cy.get(`[data-cy=color-positive-T6]`).click()
    cy.get('[data-cy=close-modal]').click()

    cy.get('[data-cy=accordion-group-2]').click()
    cy.get(`[data-cy=modify-plan-T7]`).click()
    cy.get('[data-cy=toggle-chooser]').click()
    cy.get(`[data-cy=color-positive-T7]`).click()
    cy.get('[data-cy=close-modal]').click()

    cy.get('[data-cy=accordion-group-3]').click()
    for (let i = 8; i < 10; i++) {
      cy.get(`[data-cy=modify-plan-T${i}]`).click()
      cy.get('[data-cy=toggle-chooser]').click()
      cy.get(`[data-cy=color-positive-T${i}]`).click()
      cy.get('[data-cy=close-modal]').click()
    }
  })
})
