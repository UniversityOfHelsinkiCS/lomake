/* eslint-disable no-undef */
/// <reference types="cypress" />

import * as _ from 'lodash'

describe('Core tests', function () {
  this.beforeEach(function () {
    cy.login('cypressUser')
    cy.visit('http://localhost:8000')
  })

  it('Frontpage loads', function () {
    cy.contains("Bachelor's Programme in Computer Science")
  })

  it('Filter works and form can be opened', function () {
    cy.get('[data-cy=overviewpage-filter]').type("bachelor's programme in computer science")
    cy.get('[data-cy^=smileytable-link-to]').should('have.length', 1).click()
    cy.get('[data-cy=formview-title]')
  })
})
