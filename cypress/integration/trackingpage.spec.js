import { testFacultyCode, testFacultyName } from '../../config/common'

describe('Tracking page tests', () => {
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    cy.login(cypressSuperAdmin)
    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
  })

  it('should open tracking page', () => {
    cy.contains(testFacultyName.toUpperCase())
  })

  it('should pick questions', () => {
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(2024, 'Toimenpiteiden toteutus ja seuranta tiedekunnissa')
    cy.get('[data-cy=form-8-deadline]').contains('2024')

    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
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
})