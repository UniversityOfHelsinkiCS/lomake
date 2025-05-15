/// <reference types="cypress" />
import '../support/commands'

describe('Textfield tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit(`/v1/programmes/10/KH50_005`)
  })
  it('user can create new document', () => {
    cy.get('[data-cy="create-new-document"]').click()
    cy.contains(
      `Bachelor's Programme in Computer Science - ${new Date().toLocaleString('fi-FI').split(' ')?.[0]}`,
    ).should('exist')
    cy.get('[data-testid=ArrowBackIcon]').click()
  })
  it('user can edit the document', () => {
    cy.get(':nth-child(5) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-content').click()
    cy.get(
      '.MuiPaper-root.Mui-expanded > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiAccordion-region > .MuiAccordionDetails-root > [style="margin-top: 1rem;"] > .MuiTypography-root',
    ).click()
    cy.get('[data-cy=editor-title]').click()
    cy.get('[data-cy=editor-title]').type('Koira istuu puussa ')
    cy.get(':nth-child(4) > .MuiPickersInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root').click()
    cy.get('.MuiPickersDay-today').click()
    cy.get('[data-cy=editor-participants]').click()
    cy.get('[data-cy=editor-participants]').type('Koira istuu puussa ja kana linnassa')
    cy.get('[data-cy=editor-matters]').click()
    cy.get('[data-cy=editor-matters]').type('Koira istuu puussa '.repeat(10))
    cy.get('[data-cy=editor-schedule]').click()
    cy.get('[data-cy=editor-schedule]').type('Koira istuu puussa ja kana linnassa')
    cy.get(':nth-child(12) > .MuiPickersInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root').click()
    cy.get('.MuiPickersDay-today').click()
    cy.get('[data-cy="save-document"]').click()
  })
})
