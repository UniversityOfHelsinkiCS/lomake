/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'
const user = 'cypressUser'
const adminUser = 'cypressAdminUser'

describe('ComparisonPage tests', function () {
  this.beforeEach(function () {
    cy.givePermissions(user, testProgrammeName, 'write')
  })

  it('Changes in smileys are reflected to the single programme piecharts', function () {
    cy.login(adminUser)
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.visit('/comparison')
  
    cy.get('[data-cy=programme-filter]').click()
    cy.get('span').contains('TOSKA-en').click()
    cy.get('[data-cy=comparison-chart-review_of_last_years_situation_report_text')
    cy.get('path')
      .should('have.css', 'stroke')
      .and('eq', 'rgb(249, 208, 59)')
  })

  it('User should not be able to see the comparison page if they have rights for only one programme', function () {
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.reload()
    cy.visit('/comparison')
  
    cy.get('[data-cy=smileytable-link-to-TOSKA101]')
  })

})