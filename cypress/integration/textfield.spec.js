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
    cy.visit(`/v1/programmes/10/KH50_005/2024`)
  })

  it('Should indicate that the field is locked to you', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.get(`[data-cy=edit-${id}]`).click()
    cy.contains('Press the button to release the field for others to edit!').should('exist')
    cy.get(`[data-cy=save-${id}]`).click()
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
    cy.on('window:confirm', message => {
      expect(message).to.equal('You have unsaved changes. By pressing the "OK" button, the changes will be saved.')
      return true
    })
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
        field: 'Vetovoimaisuus',
      },
      headers: {
        'Content-Type': 'application/json',
        ...possibleUsers[7],
      },
    })
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('be.disabled')
    cy.login(user)
    cy.visit(`/v1/programmes/10/KH50_005/2024`)
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment')
    cy.get(`[data-cy=save-${id}]`).click()
  })

  it('Textfield is viewonly for user without write rights', () => {
    cy.login('cypressReadingRightsUser')
    cy.visit(`/v1/programmes/10/KH50_005/2024`)
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })

  it('Page thorws no access for user without read rights', () => {
    cy.login('cypressNoRightsUser')
    cy.visit(`/v1/programmes/10/KH50_005/2024`)
    cy.contains(`Bachelor's Programme in Computer Science`).should('not.exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })
})
