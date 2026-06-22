import {
  testFacultyCode,
  testFacultyName,
  testProgrammeCode,
  testProgrammeName,
  testProgrammeCodeDoctor,
  testProgrammeNameDoctor,
  defaultYears,
} from '../../config/common'

describe('Meta evaluation form & overview tests', () => {
  // Cypress.stop()
  // return
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit('/yearly')
  })

  it('should open meta evaluation form', () => {
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains(`Review ${defaultYears[0]}`)
  })

  it('should open meta evaluation form with doctoral degree', () => {
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get('[data-cy=degreeDropdown]').click()
    cy.get('[data-cy=doctoralOptionText]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCodeDoctor}]`).click()

    cy.contains(testProgrammeNameDoctor)
    cy.contains(`Review ${defaultYears[0]}`)
  })

  it('should open dropdown and select faculty', () => {
    cy.get('[data-cy=nav-archive]').click()
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get('[data-cy=faculty-dropdown]').click()
    cy.get(`[data-cy=dropdown-item-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)

    cy.get('[data-cy=faculty-dropdown]').click()
    cy.get(`[data-cy=dropdown-item-all]`).click()

    cy.contains('Choose faculty')
  })

  context('Answering meta evaluation form', () => {
    it('should only see comments', () => {
      const cypressOspa = 'cypressOspaUser'
      cy.login(cypressSuperAdmin)

      cy.visit('/')

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'evaluation', 7)
      cy.get('[data-cy=form-7-deadline]').contains('14.')

      cy.login(cypressOspa)

      cy.visit(`/meta-evaluation/form/7/${testProgrammeCodeDoctor}`)

      cy.visit('/meta-evaluation/answers')
      cy.get('[data-cy=degreeDropdown]').click()
      cy.get('[data-cy=doctoralOptionText]').click()
      cy.get('[data-cy=content-type-dropdown]').click()
      cy.contains('Only answers').click()

      cy.get('[data-cy=content-type-dropdown]').click()
      cy.contains('Only comments').click()
    })
  })
})
