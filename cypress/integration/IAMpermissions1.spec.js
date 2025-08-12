/// <reference types="cypress" />

import helpers from '../support/helpers'
import '../support/commands'

describe('IAM permission tests', () => {
  it('Katselmus Projektiryhma user, who has rights to mltdk faculty also', () => {
    const user = 'cypressKatselmusProjektiryhmaUser'
    cy.login(user)
    cy.visit('/yearly')
    // cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 132)
    cy.visit('/evaluation')
    // cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 132)
    cy.visit('/degree-reform')
    // cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 132)
    cy.visit('/evaluation-faculty')
    // cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 12)
    cy.visit('/evaluation-university')
    cy.contains('University level')

    cy.hasAccess(user, 'KH50_006', { read: true, write: false, admin: false })
    cy.hasAccessEvaluation(user, 'KH50_006', { read: true, write: false, admin: false })
    cy.hasAccessEvaluationFaculty(user, 'H50', { read: true, write: true, admin: false })
    cy.hasAccessDegreeReform(user, 'KH50_006', { read: true, write: false, admin: false })

    cy.hasSpecialGroups(user, 'Evaluation faculty')
    cy.hasSpecialGroups(user, 'Evaluation university')
  })

  it('Ospa group grants admin access', () => {
    cy.login('cypressOspaUser')
    cy.visit('/yearly')
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
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 1)

    cy.hasAccess('cypressJoryUser', 'KH10_001', { read: true, write: true })
  })

  it('Jory and corresponding kojo give admin access to programme and read access to all', () => {
    cy.login('cypressKojoUser')
    cy.visit('/yearly')
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.hasAccess('cypressKojoUser', 'KH10_001', { read: true, write: true, admin: true })
  })

  it('Doctoral user has reading rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getDoctoralProgrammeCount())

    cy.hasAccess('cypressDoctoralUser', 'T920103', { read: true })

    cy.hasSpecialGroups('cypressDoctoralUser', 'All doctoral programmes')
  })

  it('Doctoral writing user has writing rights to all doctoral programmes', () => {
    cy.login('cypressDoctoralWritingUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getDoctoralProgrammeCount())

    cy.hasAccess('cypressDoctoralWritingUser', 'T920103', { read: true, write: true, admin: false })

    cy.hasSpecialGroups('cypressDoctoralWritingUser', 'All doctoral programmes')
  })

  it('Psyk and logo groups grant access to two programmes', () => {
    ;['cypressPsykoUser', 'cypressLogoUser'].forEach(user => {
      cy.login(user)
      cy.visit('/yearly')
      cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 2)
    })
  })

  it('Rehtoraatti gets university wide read access', () => {
    cy.login('cypressRehtoriUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressRehtoriUser', 'All programmes')
  })

  it('Faculty iam group gives reading rights to all programmes', () => {
    cy.login('cypressTheologyFacultyUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())

    cy.hasSpecialGroups('cypressTheologyFacultyUser', 'All programmes')
  })

  it('Kosu user gets wide writing access', () => {
    cy.login('cypressKosuUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 35)

    cy.hasAccess('cypressKosuUser', 'KH57_001', { read: true, write: true, admin: false })
    cy.hasAccess('cypressKosuUser', 'MH80_003', { read: true, write: true, admin: false })
  })

  /* Special cases with multiple rights groups */
  it('Dean who is also a kojo gets reading rights to all programmes and admin rights to one programme', () => {
    cy.login('cypressKojoDeanUser')
    cy.visit('/yearly')
    cy.get('[data-cy=overviewpage-filter-button]').click()
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', helpers.getTotalProgrammeCount())
    cy.hasAccess('cypressKojoDeanUser', 'MH50_001', { read: true, write: true, admin: true })
    cy.hasAccess('cypressKojoDeanUser', 'KH50_001', { read: true, write: false, admin: false })
  })

  it('Kosu who is also a jory-member gets writing rights to all programmes', () => {
    cy.login('cypressKosuJoryUser')
    cy.visit('/yearly')
    cy.get('[data-cy^=colortable-link-to]').should('have.have.length', 29)
    cy.hasAccess('cypressKosuJoryUser', 'MH50_002', { read: true, write: true, admin: false })
    cy.hasAccess('cypressKosuJoryUser', 'KH50_002', { read: true, write: true, admin: false })
  })
})
