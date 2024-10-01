import { testFacultyCode, testFacultyName } from '../../config/common'

describe('Tracking page tests', () => {
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
  })

  it('should open tracking page', () => {
    cy.contains(testFacultyName.toUpperCase())
  })

  it('should pick questions', () => {
    cy.login(cypressSuperAdmin)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(2024, 'Toimenpiteiden toteutus ja seuranta tiedekunnissa')
    cy.get('[data-cy=form-8-deadline]').contains('2024')

    cy.visit(`/faculty-monitoring/${testFacultyCode}`)
    cy.get(`[data-cy=question-picker-${testFacultyCode}]`).click()
  })
})
