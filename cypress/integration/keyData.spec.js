describe('KeyData', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2024').click()
  })

  it('Active intervention procedure stays active when year changes and there are no red lights', () => {
    const programmeCode = 'KH50_006' // Bachelor's Programme in Geosciences
    cy.get('[data-cy="interventionText-KH50_006').should('contain.text', 'Active')
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2024"]').click()
    cy.get(`[data-cy="Applications per student place-Punainen"]`).should('exist')
    cy.get('[data-cy="KH50_006-Vetovoimaisuus-Punainen"]').should('exist')
    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2026').click({ force: true })
    cy.get('[data-cy="interventionText-KH50_006').should('contain.text', 'Active')
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2026"]').click({ force: true })
    cy.get(`[data-cy="Applications per student place-Tummanvihreä"]`).should('exist')
    cy.get('[data-cy="KH50_006-Vetovoimaisuus-Vaaleanvihreä"]').should('exist')
  })
})
