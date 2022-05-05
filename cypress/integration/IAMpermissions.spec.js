/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears } from '../../config/common'

describe('IAM permission tests', () => {
  it('Ospa group grants admin access', () => {
    cy.login('cypressOspaUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 129)
    cy.visit('/admin')
    cy.get('[data-cy^=cypressOspaUser-userGroup]').contains('Admin')
  })

  it('Toska group grants superAdmin access', () => {
    cy.login('cypressToskaUser')
    cy.visit('/admin')
    cy.get('[data-cy^=cypressToskaUser-userGroup]').contains('Super admin')
  })

  it('Jory && employee iams grant read and write access to organisation', () => {
    cy.login('cypressJoryUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)

    cy.login('cypressToskaUser')
    cy.visit('/')
    cy.get(`[data-cy=KH10_001-manage]`).click()

    cy.get('[data-cy=read-cypressJoryUser]')
    cy.get('[data-cy=write-cypressJoryUser]')
    cy.get('[data-cy=admin-cypressJoryUser-false]') // <-- thats the tag when the icon is a red X
  })

  it('Non-employee jory user only gets read access to organisation', () => {
    cy.login('cypressJoryReadUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)

    cy.login('cypressToskaUser')
    cy.visit('/')
    cy.get(`[data-cy=KH10_001-manage]`).click()

    cy.get('[data-cy=read-cypressJoryReadUser]')
    cy.get('[data-cy=write-cypressJoryReadUser-false]') // <-- thats the tag when the icon is a red X
    cy.get('[data-cy=admin-cypressJoryUser-false]')
  })

  it('Doctoral user has reading rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 32)

    cy.login('cypressToskaUser')
    cy.visit('/')
    cy.get(`[data-cy=KH10_001-manage]`).click()

    cy.get('[data-cy=read-cypressJoryReadUser]')
    cy.get('[data-cy=write-cypressJoryReadUser-false]') // <-- thats the tag when the icon is a red X
    cy.get('[data-cy=admin-cypressJoryUser-false]')
  })

  it('Psyk and logo groups grant access to two programmes', () => {
    cy.login('cypressPsykoUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 2)
  })

  it('Rehtoraatti gets university wide read access', () => {
    cy.login('cypressRehtoriUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 128)
  })

  /* TODO: fix with new IAM groups */

  it('Report works', () => {
    cy.login('cypressOspaUser')
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=yearSelector]').click()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()
    cy.get('[data-cy=report-select-all]').should('contain', 'all')
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains(`Hello from ${defaultYears[1]}`)
  })

  it('Comparison works', () => {
    cy.login('cypressOspaUser')
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.getYearSelector()
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1]).click()

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains('129')
  })
})
