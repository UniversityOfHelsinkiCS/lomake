/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeName } from '../../config/common'

describe("Previous year's answers", function () {
  this.beforeEach(function () {
    const user = 'cypressUser'
    cy.givePermissions(user, testProgrammeName, 'admin')
    cy.login(user)
    cy.visit('/')
  })

  it('If no answers for previousyears, cant change year', function () {
    cy.get('[data-cy=overviewpage-year]').then((el) => {
      el.click()
      expect(el.find('.item')).to.have.length(1)
    })
  })

  it('If answers for several years exist, can select old one and see old answers', function () {
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.get('[data-cy=overviewpage-year]').click()

    cy.get('[data-cy=overviewpage-year]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })

    cy.get('[data-cy=overviewpage-year]').contains(2019).click()
    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]')
      .find('i')
      .should('have.class', 'smile')

    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]').click()
    cy.get('.customModal-content').contains('Hello from 2019')

    cy.get('.customModal-content').find('.close').click()
    cy.get('[data-cy=overviewpage-year]').click()
    cy.get('[data-cy=overviewpage-year]').contains(2018).click()

    cy.get('[data-cy=TOSKA101-review_of_last_years_situation_report]').click()
    cy.get('.customModal-content').contains('Hello from 2018')
  })
})
