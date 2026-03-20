/// <reference types="cypress" />
import '../support/commands'
import { possibleUsers } from '../../config/mockHeaders'

describe('Textfield tests', () => {
  beforeEach(() => {
    cy.request(`/api/cypress/initKeyData`)
  })

  it('user can create new document', () => {
    cy.request(`/api/cypress/resetDocuments`)
    // login to klemstro
    cy.login(possibleUsers[1].uid)
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="create-new-document"]').click()
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')

    cy.get(':nth-child(4) > .MuiPickersInputBase-root > .MuiPickersSectionList-root').type('16052025')
    cy.get('[name=participants]').click()
    cy.get('[name=participants]').type('Koira istuu puussa ja kana linnassa')
    cy.get('[name=matters]').click()
    cy.get('[name=matters]').type('Koira istuu puussa '.repeat(10))
    cy.get('[name=schedule]').click()
    cy.get('[name=schedule]').type('Koira istuu puussa ja kana linnassa')

    cy.get(':nth-child(12) > .MuiPickersInputBase-root > .MuiPickersSectionList-root').type('25062026')
    cy.get('[data-cy=save-document]').click()
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0"]').should('exist')
  })
  it('user can edit the document', () => {
    // login to klemstro
    cy.login(possibleUsers[1].uid)
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0"]').click()
    cy.get('[data-cy="accordion-0-edit-button"]').click()
    cy.get('[name=title]').clear()
    cy.get('[name=title]').click()
    cy.get('[name=title]').type('Muokattu')
    cy.get(':nth-child(4) > .MuiPickersInputBase-root > .MuiPickersSectionList-root').type('15052025')
    cy.get('[name=participants]').clear()
    cy.get('[name=participants]').click()
    cy.get('[name=participants]').type('Muokattu koira istuu puussa ja kana linnassa')
    cy.get('[name=matters]').clear()
    cy.get('[name=matters]').click()
    cy.get('[name=matters]').type('Muokattu koira istuu puussa '.repeat(10))
    cy.get('[name=schedule]').clear()
    cy.get('[name=schedule]').click()
    cy.get('[name=schedule]').type('Muokattu koira istuu puussa ja kana linnassa')
    cy.get(':nth-child(12) > .MuiPickersInputBase-root > .MuiPickersSectionList-root').type('26062026')
    cy.get('[data-cy=save-document]').click()
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.contains(`Muokattu`).should('exist')
  })

  it('dean can close the intervention procedure and it wont display as active any more', () => {
    cy.login('cypressKojoDeanUser')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="closeInterventionProcedureAlertBox"]')
    cy.get('.MuiSelect-select').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-value="2"]').click({ force: true })
    cy.request({
      method: 'PUT',
      url: '/api/documents/KH50_005/close/all',
      body: {
        reason: '2',
        additonalInformation: '',
      },
      headers: {
        'Content-Type': 'application/json',
        ...possibleUsers[20],
      },
    })
    cy.get('[data-cy="closeInterventionProcedureButton"]').click()
    cy.get('[data-cy="closeInterventionProcedureAlertBox"]').should('not.exist')

    cy.login(possibleUsers[1].uid)
    cy.visit('/v1/programmes/10/KH50_005')
    cy.get('[data-cy="create-new-document"]').should('not.exist')
  })
})
