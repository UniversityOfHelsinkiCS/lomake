/* eslint-disable no-undef */
/// <reference types="cypress" />

import * as _ from 'lodash'

function makeid(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * ::Start localstorage config
 * Required because cypress automatically clears localstorage to prevent state from building up.
 * https://github.com/cypress-io/cypress/issues/461
 */
let cachedLocalStorageAuth = JSON.stringify({
  uid: 'cypressUser',
})

function restoreLocalStorageAuth() {
  if (cachedLocalStorageAuth) {
    localStorage.setItem('fakeUser', cachedLocalStorageAuth)
  }
}

function cacheLocalStorageAuth() {
  cachedLocalStorageAuth = localStorage.getItem('fakeUser')
}

Cypress.on('window:before:load', restoreLocalStorageAuth)
beforeEach(restoreLocalStorageAuth)
afterEach(cacheLocalStorageAuth)
// ::End localstorage config

describe('Core tests', function () {
  this.beforeEach(function () {
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

describe('Form tests', function () {
  this.beforeEach(function () {
    cy.visit('http://localhost:8000/form/bsc_computer_science')
  })

  // This function just clears the forms' input fields
  this.beforeAll(function () {
    cy.visit('http://localhost:8000/form/bsc_computer_science')
    cy.get('[data-cy^=form-section').click({ multiple: true })
    cy.get('.editor-class').each(function (el, index, list) {
      cy.get(el).click()
      cy.focused().clear()
    })
  })

  it('Can open a question, click on smiley face, and the result it saved.', () => {
    cy.get('[data-cy=street-light-neutral-review_of_last_years_situation_report]').click()
    cy.get('[data-cy=street-light-positive-community_wellbeing]').click()

    // Check that the changes have been saved:
    cy.visit('http://localhost:8000')

    cy.get('[data-cy=bsc_computer_science-0]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 255, 177)')

    cy.get('[data-cy=bsc_computer_science-9]')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(157, 255, 157)')
  })

  it('Can write to a textfield and the answer is saved.', function () {
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()

    cy.focused().type('kissa')
    cy.wait(2000) // Bad practice, but it works :)
    cy.reload()

    cy.get('[data-cy=textarea-review_of_last_years_situation_report]')
      .find('.editor-class')
      .should('contain.text', 'kissa')
  })
})

describe('Permission tests', function () {
  it('Invalid url shows error', function () {
    cy.visit('http://localhost:8000/form/lmao')
    cy.contains('Error: Invalid url.')
  })

  it("Can't access form without permissions", function () {
    cy.visit('http://localhost:8000/form/bsc_languages')
    cy.contains('Error: No permissions.')
  })

  it("Can't WRITE with READ permissions and cant go to edit mode", function () {
    cy.visit('http://localhost:8000/form/bsc_teachers_of_mathematics_physics_and_chemistry')

    //Check that cant edit stuff:
    cy.get('[data-cy=form-section-I]').click() // Simulate open attept even though does not do anything
    cy.get('.editor-class').should('not.exist')
    cy.get('[data-cy=pdfdownload-go-back-button]').should('not.exist')
  })

  it('Can WRITE form with WRITE permissions and switch to readmode', function () {
    cy.visit('http://localhost:8000/form/bsc_agricultural_sciences')
    cy.get('[data-cy=form-section-I]').click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.focused().type('EDITING')
    cy.get('[data-cy=pdfdownload-go-to-readmode]').click()
  })

  it('Can do management with ADMIN permissions', function () {
    cy.visit('http://localhost:8000')
    cy.get('[data-cy=bsc_computer_science-manage]').click()
    cy.get('[data-cy^=formLocker-button]')
  })
})
