/* eslint-disable no-undef */
/// <reference types="cypress" />

import * as _ from 'lodash'
import { getEditorInputLength } from '../support/helpers'
import { testProgrammeName } from '../../config/common'
const user = 'cypressUser'

describe('Sidebar tests', function () {
  this.beforeEach(function () {
    cy.givePermissions(user, testProgrammeName, 'write')
    cy.login(user)
    cy.visit(`/form/${testProgrammeName}`)
  })

  it('Answer length of 1 is OK', function () {
    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=street-light-positive-review_of_last_years_situation_report]').click()
    cy.writeToTextField(
      '[data-cy=textarea-review_of_last_years_situation_report]',
      _.repeat('A', 1)
    )
    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })

  it('Answer length 1000 of is OK', function () {
    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=street-light-positive-review_of_last_years_situation_report]').click()
    cy.writeToTextField(
      '[data-cy=textarea-review_of_last_years_situation_report]',
      _.repeat('A', 1000)
    )
    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })

  it('Answer length 1100 is also ok, but answer cant be longer than that.', function () {
    cy.get('[data-cy=review_of_last_years_situation_report-EMPTY]')
    cy.get('[data-cy=street-light-positive-review_of_last_years_situation_report]').click()

    cy.writeToTextField(
      '[data-cy=textarea-review_of_last_years_situation_report]',
      _.repeat('A', 1500)
    )

    getEditorInputLength('[data-cy=textarea-review_of_last_years_situation_report]').then((res) =>
      expect(res).to.be.eq(1100)
    )

    cy.get('[data-cy=textarea-review_of_last_years_situation_report] > [style="color: red;"]').then(
      (el) => {
        expect(el.text()).to.be.eq('1100/1000')
      }
    )

    cy.get('[data-cy=review_of_last_years_situation_report-OK]')
  })
})
