describe('homepage tests', () => {
  beforeEach(() => {
    const ospaUser = 'cypressOspaUser'

    cy.login(ospaUser)
    cy.visit('/')
  })

  it('Should see homepage', () => {
    cy.contains('TILANNEKUVALOMAKE')
  })

  it('Should see open form alerts', () => {
    const superAdmin = 'cypressSuperAdminUser'

    cy.login(superAdmin)
    cy.visit('/admin')

    cy.contains('Deadline settings').click()

    cy.createDeadline(2024, 'Vuosiseuranta')
    cy.get('[data-cy=form-1-deadline]').contains('2024')

    cy.visit('/')

    cy.get('[data-cy=1]').contains('Vuosiseuranta')
  })
})
