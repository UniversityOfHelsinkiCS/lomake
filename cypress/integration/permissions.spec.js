/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Permission tests', function () {
  it('Invalid url shows error', function () {
    cy.visit('http://localhost:8000/form/lmao')
    cy.contains('Error: Invalid url.')
  })

  it("Can't access form without permissions", function () {
    cy.visit('http://localhost:8000/form/KH40_003')
    cy.get('[data-cy=no-permissions-message]')
  })

  it("Can't WRITE with READ permissions and cant go to edit mode", function () {
    cy.visit('http://localhost:8000/form/KH50_004')

    //Check that cant edit stuff:
    cy.get('[data-cy=form-section-I]').click() // Simulate open attept even though does not do anything
    cy.get('.editor-class').should('not.exist')
    cy.get('[data-cy=pdfdownload-go-back-button]').should('not.exist')
  })

  it('Can WRITE form with WRITE permissions and switch to readmode', function () {
    cy.visit('http://localhost:8000/form/KH50_005')
    cy.get('[data-cy=form-section-I]').click()
    cy.get('[data-cy=textarea-review_of_last_years_situation_report]').find('.editor-class').click()
    cy.focused().type('EDITING')
    cy.get('[data-cy=pdfdownload-go-to-readmode]').click()
  })

  it('Can do management with ADMIN permissions', function () {
    cy.visit('http://localhost:8000')
    cy.get('[data-cy=KH80_001-manage]').click()
    cy.get('[data-cy^=formLocker-button]')
  })
})
