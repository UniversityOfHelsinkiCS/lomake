/// <reference types="cypress" />

import { defaultYears } from '../../config/common'
import helpers from '../support/helpers'
import '../support/commands'

const form = 1 // yearly assessment

describe('IAM permission tests', () => {
  it('Doctoral kosu who is also a regular kosu gets writing rights to all programmes', () => {
    cy.login('cypressDoctoralKosuAndRegularKosuUser')
    cy.visit('/yearly')
    // cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 55)

    cy.hasAccess('cypressDoctoralKosuAndRegularKosuUser', 'T920103', { read: true, write: true, admin: false })
    cy.hasAccess('cypressDoctoralKosuAndRegularKosuUser', 'KH50_004', { read: true, write: true, admin: false })

    cy.hasSpecialGroups('cypressDoctoralKosuAndRegularKosuUser', 'All doctoral programmes')
    // cy.hasSpecialGroups('cypressDoctoralKosuAndRegularKosuUser', 'All programmes')
  })

  it('User who has random IAM-groups and one jory group and is an employee can write to one programme', () => {
    cy.login('cypressRandomRightsUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)
    cy.get(`[data-cy=colortable-link-to-KH50_006]`).click()

    cy.typeInEditor('review_of_last_years_situation_report', 'random')

    cy.visit('/yearly')
    cy.reload()
    cy.get('[data-cy=nav-report]').click()
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').should('be.visible').click()
    cy.get('[data-cy=report-question-content-review_of_last_years_situation_report_text]').should(
      'contain.text',
      'random',
    )
    cy.hasAccess('cypressRandomRightsUser', 'KH50_006', { read: true, write: true, admin: false })
  })

  it('Dekanaatti who has also writing rights to Faculty Evaluation works', () => {
    cy.login('cypressDeanKatselmusUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.visit('/evaluation')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.visit('/degree-reform')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.visit('/evaluation-faculty')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 13)

    cy.hasAccess('cypressDeanKatselmusUser', 'T920103', { read: true, write: false, admin: false })
    cy.hasAccessEvaluation('cypressDeanKatselmusUser', 'T920103', { read: true, write: false, admin: false })
    cy.hasAccessEvaluationFaculty('cypressDeanKatselmusUser', 'H40', { read: true, write: true, admin: false })
    cy.hasAccessDegreeReform('cypressDeanKatselmusUser', 'T920103', { read: true, write: false, admin: false })
    cy.hasSpecialGroups('cypressDeanKatselmusUser', 'All programmes')
  })

  it('Jory group who has also writing rights to Faculty Evaluation works', () => {
    cy.login('cypressFacultyKatselmusUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 29)
    cy.visit('/evaluation')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 29)
    cy.visit('/degree-reform')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 29)
    cy.visit('/evaluation-faculty')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 13)

    cy.hasAccess('cypressFacultyKatselmusUser', 'KH50_006', { read: true, write: true, admin: false })
    cy.hasAccessEvaluation('cypressFacultyKatselmusUser', 'KH50_006', { read: true, write: true, admin: false })
    cy.hasAccessEvaluationFaculty('cypressFacultyKatselmusUser', 'H50', { read: true, write: true, admin: false })
    cy.hasAccessDegreeReform('cypressFacultyKatselmusUser', 'KH50_006', { read: true, write: true, admin: false })

    cy.hasSpecialGroups('cypressFacultyKatselmusUser', 'Evaluation faculty')
  })
  /* Maybe wrong spec file for these tests? */

  it('Report works', () => {
    cy.login('cypressOspaUser')
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-report]').click()
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=report-select-all-accordion]').click()
    cy.get('[data-cy=report-select-all]').should('contain', 'all')
    cy.get('[data-cy=report-select-all]').click()
    cy.get('[data-cy=report-question-review_of_last_years_situation_report_text]').click()
    cy.contains(`Hello from ${defaultYears[1]}`)
  })

  it('Comparison works', () => {
    cy.login('cypressOspaUser')
    cy.request(`/api/cypress/createAnswers/${form}`)
    cy.visit('/yearly')
    cy.get('[data-cy=nav-comparison]').click()
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=comparison-responses-university-language_environment_text]').contains(
      helpers.getTotalProgrammeCount(),
    )
  })

  it('HY employee with no other IAMs sees nothing', () => {
    const user = 'cypressHyEmployeeUser'
    cy.login(user)
    // Check that no permissions to overview
    cy.visit('/yearly')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/evaluation')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/degree-reform')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/evaluation-faculty')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/evaluation-university/form/6/UNI')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    // Check that no permissions to formView
    cy.visit('/yearly/form/1/KH50_006')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/evaluation/form/4/KH50_006')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/degree-reform/form/KH50_006')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
    cy.visit('/evaluation-faculty/form/5/H50')
    cy.get('[data-cy=no-permissions-message]').should('be.visible')
  })
})
