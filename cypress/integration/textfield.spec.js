/// <reference types="cypress" />
import '../support/commands'
import { defaultYears } from '../../config/common'

const user = 'cypressUser'

describe('Textfield tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.createDeadline(defaultYears[0], 'Vuosiseuranta - UUSI')
    cy.get('[data-cy=form-10-deadline]').contains('14.')
    cy.visit(`/v1/programmes/KH50_005`)
  })

  it('', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.typeInTextField(`Vetovoimaisuus-Comment`, 'Test comment')
  })
})