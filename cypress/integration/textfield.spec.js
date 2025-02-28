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

  it('Should not allow user to write more than 500 characters', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'a'.repeat(501))
    cy.get(`[data-cy=save-${id}]`).click()
    cy.get(`[data-cy=box-${id}]`).contains('a'.repeat(500))
  })

  it('Should alert user if trying to leave without saving', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment')
    cy.contains('Unsaved changes!').should('exist')
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('You have unsaved changes. By pressing the "OK" button, the changes will be saved.')
      return true
    })
    cy.get(`[data-cy=box-Resurssit-Comment]`).click()
  })

  it('Should lose changes when cancel is pressed on window confirmation and field should be released', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment to be lost')
    cy.contains('Unsaved changes!').should('exist')

    cy.on('window:confirm', () => false)
    cy.get(`[data-cy=box-Resurssit-Comment]`).click()
    cy.get(`[data-cy=box-Vetovoimaisuus-Comment]`).click()
    cy.contains('Test comment to be lost').should('not.exist')

    cy.login(user)
    cy.visit(`/v1/programmes/KH50_005`)
    cy.typeInTextField(id, 'Field is released')
    cy.get(`[data-cy=save-${id}]`).click()
  })

  it('User can type to the textfield', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment')
    cy.contains('Unsaved changes!').should('exist')
    cy.get(`[data-cy=save-${id}]`).click()
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
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment')
    cy.get(`[data-cy=save-${id}]`).click()
  })

  it('Textfield is viewonly for user without write rights', () => {
    cy.login('cypressPsykoUser')
    cy.visit(`/v1/programmes/KH50_005`)
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })

})