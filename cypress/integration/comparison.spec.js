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
    cy.get('[data-cy=color-neutral-review_of_last_years_situation_report]').click()
    cy.reload()
    cy.visit('/comparison')

    cy.get('[data-cy=programme-filter]').click()
    cy.get('span').contains('TOSKA-en').click()
    cy.get('[data-cy=comparison-chart-review_of_last_years_situation_report_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(249, 208, 59)')
  })

  it('Admin should be able to see all the programmes on the comparison page', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(2019).click()

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains('129')
  })

  it('Filtering of comparison programmes works by programme level', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=doctoral-filter]').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('All faculties').click()
    cy.get('[data-cy=comparison-responses-faculty-programme_identity_text]').contains('/ 32')
  })

  it('Tooltips work for compared programmes filtered by faculty', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })
    cy.get('[data-cy=yearSelector]').contains(2019).click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('Faculty of Educational Sciences').click()
    cy.get('[data-cy=comparison-chart-faculty-programme_identity_text]').trigger(
      'click',
      200,
      200
    )
    cy.get('[data-cy=comparison-tip-programme_identity_text]').should('contain', 'Changing')
  })

  it('Admin should be able to see answers from previous years', function () {
    cy.login(adminUser)
    cy.request('/api/cypress/createAnswers')
    cy.reload()
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').then((newEl) => {
      expect(newEl.find('.item')).to.have.length(3)
    })

    cy.get('[data-cy=comparison-chart-faculty-employability_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(29, 185, 84)')
  })
})
