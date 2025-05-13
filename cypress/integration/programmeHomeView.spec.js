describe('ProgrammeHomeView page test', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/programmes/10/KH50_005')
  })

  describe('Testing keyDataTable interactions', () => {
    it('should direct to correct programme page on programme name click', () => {
      const programmeCode = 'KH50_005' // Computer science bachelor programme
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
    })
  })

  describe('Testing modals', () => {
    it('Should open modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus"]').should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })
    it('Should have view only textfields', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Opintojen sujuvuus ja valmistuminen"]').should('exist').click()
      cy.get('[data-cy="textfield-viewonly"]').should('exist')
    })
    // it('displays text in textfields')
    it('directs to correct programme page on programme name click', () => {
      const programmeCode = 'KH50_005'
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
    })
  })

  describe('Testing modals', () => {
    it('Should open modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus"]').should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })
  })
})
