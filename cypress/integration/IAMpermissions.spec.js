/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears } from '../../config/common'
import helpers from '../support/helpers'

describe('IAM permission tests', () => {
  it('Ospa group grants admin access', () => {
    cy.login('cypressOspaUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount() + 1)
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

  it('Jory and corresponding kojo give admin access to programme', () => {
    cy.login('cypressKojoUser')
    cy.visit('/')

    cy.login('cypressToskaUser')
    cy.visit('/')
    cy.get(`[data-cy=KH10_001-manage]`).click()

    cy.get('[data-cy=read-cypressKojoUser]')
    cy.get('[data-cy=write-cypressKojoUser]')
    cy.get('[data-cy=admin-cypressKojoUser]')
  })

  it('Kosu user gets read access to all programmes of campus', () => {
    // 'hy-ypa-opa-kosu-viikki': ['H57', 'H55', 'H80', 'H90'],
    const programmeCount =
      helpers.getFacultyProgrammeCount('H57') +
      helpers.getFacultyProgrammeCount('H55') +
      helpers.getFacultyProgrammeCount('H80') +
      helpers.getFacultyProgrammeCount('H90')

    cy.login('cypressKosuUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', programmeCount)
  })

  it('Doctoral user has reading rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getDoctoralProgrammeCount())

    cy.login('cypressToskaUser')
    cy.visit('/')
    cy.get(`[data-cy=KH10_001-manage]`).click()

    cy.get('[data-cy=read-cypressJoryReadUser]')
    cy.get('[data-cy=write-cypressJoryReadUser-false]') // <-- thats the tag when the icon is a red X
    cy.get('[data-cy=admin-cypressJoryReadUser-false]')
  })

  it('Psyk and logo groups grant access to two programmes', () => {
    ;['cypressPsykoUser', 'cypressLogoUser'].forEach(user => {
      cy.login(user)
      cy.visit('/')
      cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 2)
    })
  })

  it('Rehtoraatti gets university wide read access', () => {
    cy.login('cypressRehtoriUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
  })

  it('Faculty iam group gives reading rights to all programmes of faculty', () => {
    cy.login('cypressTheologyFacultyUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getFacultyProgrammeCount('H10'))
  })

  /* Maybe wrong spec file for these tests? */

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

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains(
      helpers.getTotalProgrammeCount() + 1
    )
  })
})
