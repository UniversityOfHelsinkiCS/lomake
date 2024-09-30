import { 
  testFacultyCode,
  testFacultyName,
} from '../../config/common'

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
})