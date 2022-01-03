/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears, testProgrammeName } from '../../config/common'

describe("Previous year's answers", function () {
  this.beforeEach(function () {
    const user = 'cypressUser'
    cy.givePermissions(user, testProgrammeName, 'admin')
    cy.login(user)
    cy.visit('/')
  })

  it("Can switch which year's answers to see in OverViewPage", function () {
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.get('[data-cy=yearSelector]').click()

    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()
    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]').should(
      'have.class',
      'square-green'
    )

    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]').click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[1]}`)

    cy.get('.customModal-content').find('.close').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[2]).click()

    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]').click()
    cy.get('.customModal-content').contains(`Hello from ${defaultYears[2]}`)
  })

  it("Can't write answers if viewing old answers", function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=editing-area-review_of_last_years_situation_report]').should('be.visible')

    cy.get('[data-cy=yearSelector]').click()
    cy.get('span').contains(defaultYears[1]).should('be.visible').click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[1]}`)

    cy.reload()
    cy.get('[data-cy=editing-area-review_of_last_years_situation_report]').should('not.exist')
  })

  // FIXME: flaky
  it('Can view old answers in Form-page and switch back to editMode to continue working.', function () {
    cy.request('/api/cypress/createAnswers')
    cy.visit(`/form/${testProgrammeName}`)

    cy.get('[data-cy=yearSelector]').click()
    cy.get('span').contains(defaultYears[1]).should('be.visible').click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[1]}`)

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[2]).click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').contains(`Hello from ${defaultYears[2]}`)

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(new Date().getFullYear()).click() // select current year
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.writeToTextField('[contenteditable="true"]', 'koira')

    cy.reload()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .should('contain.text', 'koira')
  })
})
