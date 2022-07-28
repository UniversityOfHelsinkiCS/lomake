/* eslint-disable no-undef */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears, testProgrammeName } from '../../config/common'
import helpers from '../support/helpers'
import '../support/commands'

const adminUser = 'cypressOspaUser'

describe('ComparisonPage tests', () => {
  it('Changes in smileys are reflected to the single programme piecharts', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
    cy.get('[data-cy=color-neutral-review_of_last_years_situation_report]').click()

    cy.visit('/comparison')
    cy.get('[data-cy=programme-filter]').click()
    cy.get('span').contains(testProgrammeName).click()
    cy.get('[data-cy=comparison-chart-review_of_last_years_situation_report_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(249, 208, 59)')
  })

  it('Admin should be able to see all the programmes on the comparison page', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()
    cy.selectYear(defaultYears[2])
    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains(
      helpers.getTotalProgrammeCount()
    )
  })

  it('Filtering of comparison programmes works by programme level', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()
    cy.selectYear(defaultYears[1])

    cy.get('[data-cy=doctoral-filter]').click()
    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('All faculties').click()
    cy.get('[data-cy=comparison-responses-faculty-programme_identity_text]').contains(
      `/ ${helpers.getDoctoralProgrammeCount()}`
    )
  })

  it('Tooltips work for compared programmes filtered by faculty', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()
    cy.selectYear(defaultYears[2])

    cy.get('[data-cy=faculty-filter]').click()
    cy.get('span').contains('Faculty of Educational Sciences').click()
    cy.get('[data-cy=comparison-chart-faculty-programme_identity_text]').trigger('click', 200, 200)
    cy.get('[data-cy=comparison-tip-programme_identity_text]').should('contain', 'Changing')
  })

  it('Admin should be able to see answers from previous years', () => {
    cy.login(adminUser)
    cy.visit('/')
    cy.get('[data-cy=nav-comparison]').click()

    cy.getYearSelector()
    cy.get('[data-cy=comparison-chart-faculty-employability_text')
    cy.get('path').should('have.css', 'stroke').and('eq', 'rgb(29, 185, 84)')
  })
})
