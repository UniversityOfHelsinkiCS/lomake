describe('homepage tests', () => {
  beforeEach(() => {
    const ospaUser = 'cypressOspaUser'
    cy.login(ospaUser)
    cy.visit('/')
  })

  it('Should see homepage', () => {
    cy.get('[data-cy=landingpage-title]').contains(/TILANNEKUVALOMAKE|STATUS REPORT FORM/)
    cy.get('[data-cy=landingpage-subtitle]').should('have.length.above', 0)
  })

  it('Should see open form alerts', () => {
    const superAdmin = 'cypressSuperAdminUser'

    cy.login(superAdmin)
    cy.visit('/admin')

    cy.contains('Deadline settings').click()

    cy.createDeadline(2024, 'Vuosiseuranta')
    cy.get('[data-cy=form-1-deadline]').contains('2024')

    cy.visit('/')

    cy.get('[data-cy=deadline-label-1]').contains(/Vuosiseuranta|Annual follow-up/)
  })

  it('Should not see ospa', () => {
    const user = 'cypressJoryUser'

    cy.login(user)
    cy.visit('/')

    cy.get('[data-cy=OSPA]').should('not.exist')
  })
})
