/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode } from '../../config/common'
import '../support/commands'

const user = 'cypressUser'

describe('Sidebar tests', () => {
  beforeEach(() => {
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
  })

  // Skip for now, figure out later why this does not work in CI-pipeline when it works locally
  it('Answer length of 1 is OK', () => {
    cy.typeInEditor('[data-cy=textarea-review_of_last_years_situation_report]', 'A')

    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=color-negative-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })

  // Cypress and react-editor do not currently work together, when trying to copy text
  // Copying to the editor however actually works
  it('Answer length 1000 of is OK', () => {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()

    cy.typeInEditor('[data-cy=textarea-review_of_last_years_situation_report]', 'A'.repeat(1000))

    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=color-positive-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=review_of_last_years_situation_report-OK]')

    cy.getEditorInputLength('[data-cy=textarea-review_of_last_years_situation_report]').then(res =>
      expect(res).to.be.eq(1000)
    )
  })

  // Cypress and react-editor do not currently work together, when trying to copy text
  // Copying to the editor however actually works
  it('Answer length 1100 is also ok, but answer cant be longer than that.', () => {
    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy="color-positive-review_of_last_years_situation_report"]').wait(300).click()

    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()

    cy.typeInEditor('[data-cy=textarea-review_of_last_years_situation_report]', 'A'.repeat(1100))

    cy.typeInEditor('[data-cy=textarea-review_of_last_years_situation_report]', 'more more')
    cy.getEditorInputLength('[data-cy=textarea-review_of_last_years_situation_report]').then(res =>
      expect(res).to.be.eq(1100)
    )

    cy.get('[data-cy=textarea-review_of_last_years_situation_report] > [style="color: rgb(230, 78, 64);"]').then(el => {
      expect(el.text()).to.be.eq('1100/1000')
    })

    cy.wait(2000)

    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })
})
