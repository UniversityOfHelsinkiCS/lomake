/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Core tests', function () {
  this.beforeEach(function () {
    cy.visit('localhost:8000')
  })

  it('Frontpage loads', function () {
    cy.contains("Bachelor's Programme for Teachers of Mathematics, Physics and Chemistry")
  })

  it('Filter works and form can be opened', function () {
    cy.get('[data-cy=overviewpage-filter]').type("bachelor's programme in computer science")
    cy.get('[data-cy=smileytable-link-to-form]').should('have.length', 1).click()
    cy.get('[data-cy=formview-title]')
  })
})

describe('Form tests', function () {
  this.beforeEach(function () {
    cy.visit("http://localhost:8000/form/Bachelor's%20Programme%20in%20Computer%20Science")
  })

  it('Can open a question, select a face and type in the textfield', function () {
    cy.get('[data-cy=form-section-I]').click()
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .type('Yes. Last year went very well.')

    cy.get('[data-cy=form-section-III]').click()
    cy.get('[data-cy=textarea-wellbeing_information_used]')
      .find('.editor-class')
      .type('Google was a good source.')

    cy.get('[data-cy=street-light-positive-community_wellbeing]').click()
  })
})
