/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-undef */
/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />

import { testProgrammeCode, defaultYears } from '../../config/common'
import '../support/commands'

describe('Yearly assessment form tests', () => {
  beforeEach(() => {
    const user = 'cypressUser'
    cy.login(user)
    cy.visit('/')
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()
  })

  it('Can write to a textfield and the answer is saved.', () => {
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])
    cy.typeInEditor('community_wellbeing', 'other words')
    cy.reload()

    cy.get('[data-cy=textarea-community_wellbeing]').find('.editor-class').should('contain.text', 'other')
  })

  it('Can open a question, click on a traffic light, and the result it saved.', () => {
    cy.get('[data-cy=color-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=color-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('/')
    cy.wait(1000)

    cy.get(`[data-cy=${testProgrammeCode}-review_of_last_years_situation_report-single]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get(`[data-cy=${testProgrammeCode}-community_wellbeing-single]`)
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can see upcoming deadline date', () => {
    cy.get('[data-cy=saving-answers-notice]').contains('Final day')
  })

  it('Measurements are created dynamically and saved correctly', () => {
    cy.get('#measures_1_text').type('1111')
    cy.get('#measures_2_text').type('2222')
    cy.get('#measures_4_text').should('not.exist')
    cy.get('#measures_3_text').type('3333')
    cy.get('#measures_4_text').type('4444')
    cy.get('#measures_5_text').type('5555').wait(2000)
    cy.get('#measures_6_text').should('not.exist')

    cy.reload()
    cy.wait(1000)
    cy.get('#measures_4_text').contains('4444')
    cy.get('#measures_5_text').contains('5555')

    cy.get('#measures_4_text').clear()
    cy.get('#measures_5_text').clear()
    cy.get('#measures_5_text').should('not.exist')
  })

  it(`Other years' form pages are locked`, () => {
    cy.selectYear(defaultYears[1])
    cy.get('[data-cy=locked-form-notice]')
    cy.get('.editor-class').should('not.exist')
  })

  it("Opening another form and saving to it doesn't affect yearly assesment data", () => {
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])
    cy.typeInEditor('recruitment_influence', 'new words')
    cy.reload()
    cy.visit('/')

    cy.login('cypressSuperAdminUser')
    cy.visit('/')

    // open another form
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Katselmus - koulutusohjelmat')
    cy.get('[data-cy=form-4-deadline]').contains('14.')

    // write to other form
    cy.visit('/evaluation/form/4/KH50_005')
    cy.wait(1000)
    cy.typeInEditor('degree_flow', 'evaluation words')
    cy.reload()

    // check yearly assessment form
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=textarea-recruitment_influence]')
      .find('.editor-class')
      .invoke('text')
      .should('match', /new wo/)
  })

  it("Closing a form and doesn't affect other forms' data", () => {
    cy.login('cypressSuperAdminUser')
    cy.visit('/')
    // check page is ready
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])

    // open another form
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.createDeadline(defaultYears[0], 'Katselmus - koulutusohjelmat')
    cy.get('[data-cy=form-4-deadline]').contains('14.')

    cy.login('cypressUser')
    cy.visit('/')

    // write to yearly form
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])
    cy.typeInEditor('employability', 'new words')
    cy.reload()
    cy.visit('/')

    cy.login('cypressSuperAdminUser')
    cy.visit('/')
    // check page is ready
    cy.get('[data-cy=yearSelector]').contains(defaultYears[1])

    // close the other form
    cy.get('[data-cy=nav-admin]').click()
    cy.contains('Deadline settings').click()

    cy.closeDeadline(defaultYears[0], 'Katselmus - koulutusohjelmat')
    cy.get('[data-cy=form-4-deadline]').should('not.exist')

    cy.login('cypressUser')
    cy.visit('/')

    // check yearly assessment form
    cy.visit(`/form/${testProgrammeCode}`)
    cy.get('[data-cy=textarea-employability]')
      .find('.editor-class')
      .invoke('text')
      .should('match', /new wo/)
  })
})
