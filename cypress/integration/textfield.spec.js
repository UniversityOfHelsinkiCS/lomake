/// <reference types="cypress" />
import '../support/commands'
import { possibleUsers } from '../../config/mockHeaders'

const year = 2025

describe('Textfield tests', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit(`/admin`)
    cy.contains('Deadline settings').click()
    cy.closeDeadline(year, 'Vuosiseuranta')

    cy.get('[data-cy=draft-year-selector]').click()
    cy.get('.item').contains(year).click()

    cy.get('[data-cy=form-selector]').click()
    cy.get('.item').contains('Vuosiseuranta - UUSI').click()

    cy.get('.react-datepicker__input-container > input').click() // Open datepicked
    cy.get('.react-datepicker__navigation--next').click() // Go to next month
    cy.get('.react-datepicker__day--014').click() // Select 14th day

    cy.get('[data-cy=updateDeadline]').click()
    cy.get('[data-cy=form-10-deadline]').contains('14.')
    cy.visit(`/v1/programmes/10/KH50_005/${year}`)
  })

  it('Should indicate that the field is locked to you', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.get(`[data-cy=edit-${id}]`).click()
    cy.contains('Press the button to release the field for others to edit!').should('exist')
    cy.get(`[data-cy=save-${id}]`).click()
  })

  it('Should not allow user to write more than 1000 characters', () => {
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'a'.repeat(1001))
    cy.get(`[data-cy=save-${id}]`).click()
    cy.get(`[data-cy=box-${id}]`).contains('a'.repeat(1000))
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
    cy.visit(`/v1/programmes/10/KH50_005/${year}`)
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('be.disabled')
    cy.login(possibleUsers[7].uid)
    cy.visit(`/v1/programmes/10/KH50_005/${year}`)
    const id = `Vetovoimaisuus-Comment`
    cy.typeInTextField(id, 'Test comment')
    cy.get(`[data-cy=save-${id}]`).click()
  })

  it('Textfield is viewonly for user without write rights', () => {
    cy.login('cypressReadingRightsUser')
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })

  it('Page thorws no access for user without read rights', () => {
    cy.login('cypressNoRightsUser')
    cy.contains(`Bachelor's Programme in Computer Science`).should('not.exist')
    cy.get('[data-cy=edit-Vetovoimaisuus-Comment]').should('not.exist')
  })
})
