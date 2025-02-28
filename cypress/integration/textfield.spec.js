/// <reference types="cypress" />
import '../support/commands'
import { defaultYears } from '../../config/common'
import { possibleUsers } from '../../config/mockHeaders'

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

  it('User can type to the textfield', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.typeInTextField(`Vetovoimaisuus-Comment`, 'Test comment')
  })

  it('Textfield is locked for another user if one user is typing and releasing lock should open the field for all users', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.request({
      method: 'POST',
      url: '/api/lock/KH50_005',
      body: { 
        field: "Vetovoimaisuus"},
        headers: {
          'Content-Type': 'application/json',
          ...possibleUsers[7],
      },
    })
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('be.disabled')
    cy.login(user)
    cy.visit(`/v1/programmes/KH50_005`)
    cy.typeInTextField(`Vetovoimaisuus-Comment`, 'Test comment')
  })

  it('Textfield is viewonly for user without write rights', () => {
    cy.login('cypressPsykoUser')
    cy.visit(`/v1/programmes/KH50_005`)
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })
})