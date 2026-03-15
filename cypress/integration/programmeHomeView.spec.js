describe('ProgrammeHomeView page test', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/programmes/10/KH50_005')
  })

  describe('Testing keyDataTable interactions', () => {
    it('should direct to correct programme page on programme name click', () => {
      const year = 2025
      const programmeCode = 'KH50_005' // Computer science bachelor programme
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}-${year}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
    })
  })

  describe('Testing modals', () => {
    it('Should open modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus-2025"]').should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })
    it('Should have view only textfields', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Opintojen sujuvuus ja valmistuminen-2025"]')
        .should('exist')
        .click()
      cy.get('[data-cy="textfield-viewonly"]').should('exist')
    })
    // it('displays text in textfields')
    it('directs to correct programme page on programme name click', () => {
      const programmeCode = 'KH50_005'
      const year = 2025
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}-${year}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
    })
  })

  describe('Testing modals', () => {
    it('Should open modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus-2025"]').should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })
  })

  describe('TEST CREATE-DOCUMENT-BUTTON EXISTANCE when possible', () => {})
})
