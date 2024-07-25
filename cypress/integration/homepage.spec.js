describe('homepage tests', () => {
  beforeEach(() => {
    const ospaUser = 'cypressOspaUser'

    cy.login(ospaUser)
    cy.visit('/')
  })

  it('Should see homepage', () => {
    cy.contains('TILANNEKUVALOMAKE')
  })
})
