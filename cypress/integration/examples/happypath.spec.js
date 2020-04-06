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

  it('Can open a question and click on a face', function () {
    cy.get('[data-cy=form-section-I]').click() // Opens question 1
    cy.get('[data-cy=form-section-I]').get('[data-cy=street-light-neutral]').click()
  })
})
