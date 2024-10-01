import { testFacultyCode, testFacultyName } from '../../config/common'

describe('Tracking page tests', () => {
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    cy.login(cypressSuperAdmin)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(2024, 'Toimenpiteiden toteutus ja seuranta tiedekunnissa')
    cy.get('[data-cy=form-8-deadline]').contains('2024')
    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
  })

  it('should open tracking page and select question 1', () => {
    cy.contains(testFacultyName.toUpperCase())
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains('1. Degree programmes include model schedules in curricula that support understanding of the education system, study paths, and course offerings').click()
    cy.get('[data-cy=send-selection-button]').click()
  })

  it('should pick questions and write to modal', () => {
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains('1. Degree programmes include model schedules in curricula that support understanding of the education system, study paths, and course offerings').click()
    cy.get('[data-cy=send-selection-button]').click()

    cy.get('[data-cy=accordion-group-0]').click()
    cy.get('[data-cy=modify-plan-1]').click()

    cy.get('[id=1_contact_person_text]').type('contact person')
    cy.wait(100)
    cy.get('[data-cy=send-form]').click()
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
    cy.wait(100)
    cy.get('[data-cy=send-form]').click()

    cy.get('[data-cy=modify-plan-2]').click()
    cy.get('[data-cy=toggle-chooser]').click()
    cy.get('[data-cy=color-negative-2]').click()

    cy.get('[data-cy=send-form]').click()
  })

  it('should modify the date', () => {
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()

    cy.get('[data-cy=questions-list-0]').click()

    cy.contains('1.').click()
    cy.get('[data-cy=send-selection-button]').click()

    cy.get('[data-cy=accordion-group-0]').click()
    cy.get('[data-cy=modify-plan-1]').click()

    cy.get('[data-cy=toggle-chooser]').click()
    cy.get('[data-cy=color-positive-1]').click()

    cy.get('[data-cy=toggle-chooser]').click()
    cy.get('[data-cy=date-picker]').type('{selectAll}01.01.2000')
    cy.get('[data-cy=color-negative-1]').click()

    cy.get('[data-cy=send-form]').click()
    cy.contains('01.01.2000').should('exist')
  })
})