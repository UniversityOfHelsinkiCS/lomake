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

  it('Answer length of 1 is OK', () => {
    cy.typeInEditor('review_of_last_years_situation_report', 'A')

    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=color-negative-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })
})
