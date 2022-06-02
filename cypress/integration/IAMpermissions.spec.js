/* eslint-disable no-undef */
/// <reference types="cypress" />

import { defaultYears } from '../../config/common'
import { getDoctoralProgrammeCount, getTotalProgrammeCount } from '../support/helpers'

describe('IAM permission tests', () => {
  it('Ospa group grants admin access', () => {
    cy.login('cypressOspaUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', getTotalProgrammeCount() + 1)
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

    cy.hasAccess('cypressJoryUser', 'KH10_001', { read: true, write: true })
  })

  it('Non-employee jory user only gets read access to organisation', () => {
    cy.login('cypressJoryReadUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)

    cy.hasAccess('cypressJoryReadUser', 'KH10_001', { read: true })
  })

  it('Jory and corresponding kojo give admin access to programme', () => {
    cy.login('cypressKojoUser')
    cy.visit('/')

    cy.hasAccess('cypressKojoUser', 'KH10_001', { read: true, write: true, admin: true })
  })

  it('Doctoral user has reading rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', getDoctoralProgrammeCount())

    cy.hasAccess('cypressDoctoralUser', 'T920103', { read: true })

    cy.hasSpecialGroups('cypressDoctoralUser', 'All doctoral programmes')
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
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressRehtoriUser', 'All programmes')
  })

  it('Faculty iam group gives reading rights to all programmes of faculty', () => {
    cy.login('cypressTheologyFacultyUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressTheologyFacultyUser', 'All programmes')
  })

  it('Kosu user gets wide read access', () => {
    cy.login('cypressKosuUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressKosuUser', 'All programmes')
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

    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains(getTotalProgrammeCount() + 1)
  })
})
