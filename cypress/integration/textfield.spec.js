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

  it('User can type to the textfield', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.typeInTextField(`Vetovoimaisuus-Comment`, 'Test comment')
  })

  it('Textfield is locked for another user if one user is typing', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.request({
      method: 'POST',
      url: '/api/lock/KH50_005',
      body: { 
        field: "Vetovoimaisuus"},
      headers: {
        'Content-Type': 'application/json',
          uid: 'cypressUser',
          employeeNumber: 124,
          givenName: 'user',
          mail: 'cypress-user@helsinki.fi',
          schacDateOfBirth: 19990100,
          hyGroupCn: 'hy-mltdk-tkt-jory;hy-mltdk-kandi-kojot;hy-employees',
          sn: 'nah',
      },
    })
    
  })
})