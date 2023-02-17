/// <reference types="cypress" />

import { defaultYears } from '../../config/common'
import helpers from '../support/helpers'
import '../support/commands'

describe('IAM permission tests', () => {
  it('Ospa group grants admin access', () => {
    cy.login('cypressOspaUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
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

  it('Jory and corresponding kojo give admin access to programme and read access to all', () => {
    cy.login('cypressKojoUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.hasAccess('cypressKojoUser', 'KH10_001', { read: true, write: true, admin: true })
  })

  it('Doctoral user has reading rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getDoctoralProgrammeCount())

    cy.hasAccess('cypressDoctoralUser', 'T920103', { read: true })

    cy.hasSpecialGroups('cypressDoctoralUser', 'All doctoral programmes')
  })

  it('Doctoral writing user has writing rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralWritingUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getDoctoralProgrammeCount())

    cy.hasAccess('cypressDoctoralWritingUser', 'T920103', { read: true, write: true, admin: false })

    cy.hasSpecialGroups('cypressDoctoralWritingUser', 'All doctoral programmes')
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

    cy.hasSpecialGroups('cypressRehtoriUser', 'All programmes')
  })

  it('Faculty iam group gives reading rights to all programmes', () => {
    cy.login('cypressTheologyFacultyUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressTheologyFacultyUser', 'All programmes')
  })

  it('Kosu user gets wide writing access', () => {
    cy.login('cypressKosuUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressKosuUser', 'All programmes')
    cy.hasAccess('cypressKosuUser', 'KH50_001', { read: true, write: true, admin: false })
    cy.hasAccess('cypressKosuUser', 'MH50_003', { read: true, write: true, admin: false })
  })

  /* Special cases with multiple rights groups */
  it('Dean who is also a kojo gets reading rights to all programmes and admin rights to one programme', () => {
    cy.login('cypressKojoDeanUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.hasAccess('cypressKojoDeanUser', 'MH50_001', { read: true, write: true, admin: true })
    cy.hasAccess('cypressKojoDeanUser', 'KH50_001', { read: true, write: false, admin: false })
  })

  it('Kosu who is also a jory-member gets writing rights to all programmes', () => {
    cy.login('cypressKosuJoryUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.hasAccess('cypressKosuJoryUser', 'MH50_002', { read: true, write: true, admin: false })
    cy.hasAccess('cypressKosuJoryUser', 'KH50_002', { read: true, write: true, admin: false })
  })

  it('Doctoral kosu who is also a regular kosu gets writing rights to all programmes', () => {
    cy.login('cypressDoctoralKosuAndRegularKosuUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())

    cy.hasAccess('cypressDoctoralKosuAndRegularKosuUser', 'T920103', { read: true, write: true, admin: false })
    cy.hasAccess('cypressDoctoralKosuAndRegularKosuUser', 'KH50_004', { read: true, write: true, admin: false })

    cy.hasSpecialGroups('cypressDoctoralKosuAndRegularKosuUser', 'All doctoral programmes')
    cy.hasSpecialGroups('cypressDoctoralKosuAndRegularKosuUser', 'All programmes')
  })

  it('User who has random IAM-groups and one jory group and is an employee can write to one programme', () => {
    cy.login('cypressRandomRightsUser')
    cy.visit('/')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)
    cy.get(`[data-cy=colortable-link-to-KH50_006]`).click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click().wait(200)
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').type('random')

    cy.visit('/')
    cy.reload()
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').should('be.visible').click()
    cy.get('[data-cy=report-question-content-review_of_last_years_situation_report_text]').should(
      'contain.text',
      'random'
    )
    cy.hasAccess('cypressRandomRightsUser', 'KH50_006', { read: true, write: true, admin: false })
  })

  /* Maybe wrong spec file for these tests? */

  it('Report works', () => {
    cy.login('cypressOspaUser')
    cy.request('/api/cypress/createAnswers')
    cy.visit('/')
    cy.get('[data-cy=nav-report]').click()
    cy.selectYear(defaultYears[1])
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
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains(
      helpers.getTotalProgrammeCount()
    )
  })
})
