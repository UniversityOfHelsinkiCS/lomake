import { defaultYears } from '../../config/common'

describe('Notification badge tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(defaultYears[0], 'Vuosiseuranta - UUSI')
    cy.get('[data-cy=form-10-deadline]').contains('14.')
    cy.visit('/v1/overview')
  })

  const redProgramme = 'KH50_005' // all red
  const greenProgramme = 'KH50_002' // light green, green, gray
  const yellowProgramme = 'MH40_015' // all yellow
  const discontinuedProgramme = 'MH50_009' // all red but discontinued
  const oneRedProgramme = 'KH50_006' // one red, rest green

  describe('Testing badges in overview page', () => {
    it('Light and actions badges should display on red lights', () => {
      cy.get(`[data-cy=lightCellBadge-${redProgramme}-Vetovoimaisuus]`).should('exist')
      cy.get(`[data-cy*="lightCellBadge-${redProgramme}-Opintojen sujuvuus ja valmistuminen"]`).should('exist')
      cy.get(`[data-cy*="lightCellBadge-${redProgramme}-Palaute ja työllistyminen"]`).should('exist')
      cy.get(`[data-cy="actionsCellBadge-${redProgramme}"]`).should('exist')
    })

    it('Light or actions badges shouldnt display on green or gray lights', () => {
      cy.get(`[data-cy=lightCellBadge-${greenProgramme}-Vetovoimaisuus]`).should('not.exist')
      cy.get(`[data-cy*="lightCellBadge-${greenProgramme}-Opintojen sujuvuus ja valmistuminen"]`).should('not.exist')
      cy.get(`[data-cy*="lightCellBadge-${greenProgramme}-Palaute ja työllistyminen"]`).should('not.exist')
    })

    it('Light badges should but action badges shouldnt display on yellow lights ', () => {
      cy.get(`[data-cy=lightCellBadge-${yellowProgramme}-Vetovoimaisuus]`).should('exist')
      cy.get(`[data-cy*="lightCellBadge-${yellowProgramme}-Opintojen sujuvuus ja valmistuminen"]`).should('exist')
      cy.get(`[data-cy*="lightCellBadge-${yellowProgramme}-Palaute ja työllistyminen"]`).should('exist')
      cy.get(`[data-cy="actionsCellBadge-${yellowProgramme}"]`).should('not.exist')
    })

    it('Any badges shouldnt display on a discontinued programme', () => {
      cy.get(`[data-cy=lightCellBadge-${discontinuedProgramme}-Vetovoimaisuus]`).should('not.exist')
      cy.get(`[data-cy*="lightCellBadge-${discontinuedProgramme}-Opintojen sujuvuus ja valmistuminen"]`).should(
        'not.exist',
      )
      cy.get(`[data-cy*="lightCellBadge-${discontinuedProgramme}-Palaute ja työllistyminen"]`).should('not.exist')
      cy.get(`[data-cy="actionsCellBadge-${discontinuedProgramme}"]`).should('not.exist')
    })

    it('Adding comments or actions should reflect in overview page badges', () => {
      cy.visit(`/v1/programmes/10/${redProgramme}`)

      cy.typeInTextField('Vetovoimaisuus-Comment', 'Test comment')
      cy.get(`[data-cy=save-Vetovoimaisuus-Comment]`).click()

      cy.typeInTextField('Opintojen sujuvuus ja valmistuminen-Comment', 'Test comment')
      cy.get(`[data-cy*="save-Opintojen sujuvuus ja valmistuminen-Comment"]`).click()

      cy.typeInTextField('Palaute ja työllistyminen-Comment', 'Test comment')
      cy.get(`[data-cy*="save-Palaute ja työllistyminen-Comment"]`).click()

      cy.get('[data-cy="actionsTab"]').click()

      cy.typeInTextField('Toimenpiteet-Measure', 'Test action')
      cy.get('[data-cy="save-Toimenpiteet-Measure"]').click()

      cy.visit('/v1/overview')
      cy.get(`[data-cy=lightCellBadge-${redProgramme}-Vetovoimaisuus]`).should('not.exist')
      cy.get(`[data-cy*="lightCellBadge-${redProgramme}-Opintojen sujuvuus ja valmistuminen"]`).should('not.exist')
      cy.get(`[data-cy*="lightCellBadge-${redProgramme}-Palaute ja työllistyminen"]`).should('not.exist')
      cy.get(`[data-cy="actionsCellBadge-${redProgramme}"]`).should('not.exist')
    })
  })

  describe('Testing badges in programme view page', () => {
    it('Light and actions badges should display on red lights', () => {
      cy.visit(`/v1/programmes/10/${redProgramme}`)

      cy.get(`[data-cy="tabBadge-lights"]`).should('exist')
      cy.get(`[data-cy="tabBadge-actions"]`).should('exist')

      cy.get(`[data-cy=textfieldBadge-Vetovoimaisuus]`).should('exist')
      cy.get(`[data-cy*="textfieldBadge-Opintojen sujuvuus ja valmistuminen"]`).should('exist')
      cy.get(`[data-cy*="textfieldBadge-Palaute ja työllistyminen"]`).should('exist')
    })

    it('Light or action badges should not display on green or gray lights', () => {
      cy.visit(`/v1/programmes/10/${greenProgramme}`)

      cy.get(`[data-cy="tabBadge-lights"]`).should('not.exist')
      cy.get(`[data-cy="tabBadge-actions"]`).should('not.exist')

      cy.get(`[data-cy=textfieldBadge-Vetovoimaisuus]`).should('not.exist')
      cy.get(`[data-cy*="textfieldBadge-Opintojen sujuvuus ja valmistuminen"]`).should('not.exist')
      cy.get(`[data-cy*="textfieldBadge-Palaute ja työllistyminen"]`).should('not.exist')
    })

    it('Light badges should but action badges shouldnt display on yellow lights', () => {
      cy.visit(`/v1/programmes/10/${yellowProgramme}`)

      cy.get(`[data-cy="tabBadge-lights"]`).should('exist')
      cy.get(`[data-cy="tabBadge-actions"]`).should('not.exist')

      cy.get(`[data-cy=textfieldBadge-Vetovoimaisuus]`).should('exist')
      cy.get(`[data-cy*="textfieldBadge-Opintojen sujuvuus ja valmistuminen"]`).should('exist')
      cy.get(`[data-cy*="textfieldBadge-Palaute ja työllistyminen"]`).should('exist')
    })

    it('Any badges shouldnt display on a discontinued programme', () => {
      cy.visit(`/v1/programmes/10/${discontinuedProgramme}`)

      cy.get(`[data-cy="tabBadge-lights"]`).should('not.exist')
      cy.get(`[data-cy="tabBadge-actions"]`).should('not.exist')

      cy.get(`[data-cy=textfieldbadge-Vetovoimaisuus]`).should('not.exist')
      cy.get(`[data-cy*="textfieldbadge-Opintojen sujuvuus ja valmistuminen"]`).should('not.exist')
      cy.get(`[data-cy*="textfieldbadge-Palaute ja työllistyminen"]`).should('not.exist')
    })

    it('Opinion of programme tab + text field badge should appear and disappear when opinion of the programme is added', () => {
      cy.visit(`/v1/programmes/10/${oneRedProgramme}`)

      cy.get(`[data-cy="tabBadge-lights"]`).should('exist')
      cy.get(`[data-cy=textfieldBadge-Vetovoimaisuus]`).should('exist')

      cy.typeInTextField('Vetovoimaisuus-Comment', 'Test comment')
      cy.get(`[data-cy=save-Vetovoimaisuus-Comment]`).click()

      cy.get(`[data-cy="tabBadge-lights"]`).should('not.exist')
      cy.get(`[data-cy=textfieldBadge-Vetovoimaisuus]`).should('not.exist')
    })

    it('Actions tab + text field badge should appear and disappear when actions are added', () => {
      cy.visit(`/v1/programmes/10/${oneRedProgramme}`)

      cy.get(`[data-cy="tabBadge-actions"]`).should('exist')
      cy.get('[data-cy="actionsTab"]').click()

      cy.get(`[data-cy="tabBadge-actions"]`).should('exist')
      cy.get(`[data-cy="actionsfieldBadge"]`).should('exist')

      cy.typeInTextField('Toimenpiteet-Measure', 'Test action')
      cy.get('[data-cy="save-Toimenpiteet-Measure"]').click()

      cy.get(`[data-cy="tabBadge-actions"]`).should('not.exist')
      cy.get(`[data-cy="actionsfieldBadge"]`).should('not.exist')
    })
  })
})
