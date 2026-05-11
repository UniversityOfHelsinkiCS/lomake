describe('KeyData', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.request(`/api/cypress/initInterventionProcedures`)
    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2024').click()
  })

  it('Active intervention procedure stays active when year changes and there are no red lights', () => {
    cy.get('[data-cy="interventionText-KH50_006"]').should('contain.text', 'Active')
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2024"]').click()
    cy.get(`[data-cy="Applications per student place-Punainen"]`).should('exist')
    cy.get('[data-cy="KH50_006-Vetovoimaisuus-Punainen"]').should('exist')
    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2026').click({ force: true })
    cy.get('[data-cy="interventionText-KH50_006"]').should('contain.text', 'Active')
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2026"]').click({ force: true })
    cy.get(`[data-cy="Applications per student place-Tummanvihreä"]`).should('exist')
    cy.get('[data-cy="KH50_006-Vetovoimaisuus-Vaaleanvihreä"]').should('exist')
  })

  it('Changed threshold and keydata values in new data do not affect the values of earlier years in overview', () => {
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2024"]').click()
    cy.get('[data-cy="Primary applicants-Punainen"]').should('contain.text', '1').click()
    cy.get('[data-cy="Primary applicants-description"]').should('not.contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '80')
    cy.get('[data-cy="no-history"]').should('contain.text', 'No previous history')

    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2026').click({ force: true })
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2026"]').click({ force: true })
    cy.get('[data-cy="Primary applicants-Vaaleanvihreä"]').should('contain.text', '260').click()
    cy.get('[data-cy="Primary applicants-description"]').should('contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '100')
    cy.get('[data-cy="history-Ensisijaiset hakijat-2023-value"]').should('contain.text', '260')
  })

  it('Changed threshold and keydata values in new data do not affect the values of earlier years in programme home page', () => {
    cy.get(`[data-cy="keydatatable-programme-KH50_006"]`).should('exist').click()
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2025"]').click()
    cy.get('[data-cy="Primary applicants-Punainen"]').should('contain.text', '1').click()
    cy.get('[data-cy="Primary applicants-description"]').should('not.contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '80')
    cy.get('[data-cy="history-Ensisijaiset hakijat-2023-value"]').should('contain.text', '1')

    cy.visit('/v1/overview')
    cy.get(`[data-cy="keydatatable-programme-KH50_006"]`).should('exist').click()
    cy.get('[data-cy="trafficlight-table-cell-KH50_006-Vetovoimaisuus-2026"]').click()
    cy.get('[data-cy="Primary applicants-Vaaleanvihreä"]').should('contain.text', '260').click()
    cy.get('[data-cy="Primary applicants-description"]').should('contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '100')
    cy.get('[data-cy="history-Ensisijaiset hakijat-2023-value"]').should('contain.text', '260')
  })

  it('Changed threshold and keydata values in new data do not affect the values of earlier years in programme yearly view', () => {
    cy.visit('/v1/programmes/10/KH50_006/2025')

    cy.get('[data-cy="Primary applicants-Punainen"]').should('contain.text', '1').click()
    cy.get('[data-cy="Primary applicants-description"]').should('not.contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '80')
    cy.get('[data-cy="history-Ensisijaiset hakijat-2023-value"]').should('contain.text', '1')

    cy.visit('/v1/programmes/10/KH50_006/2026')

    cy.get('[data-cy="Primary applicants-Vaaleanvihreä"]').should('contain.text', '260').click()
    cy.get('[data-cy="Primary applicants-description"]').should('contain.text', 'changed')
    cy.get('[data-cy="threshold-1"]').should('contain.text', '100')
    cy.get('[data-cy="history-Ensisijaiset hakijat-2023-value"]').should('contain.text', '260')
  })
})
