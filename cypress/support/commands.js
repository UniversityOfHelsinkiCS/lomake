/* eslint-disable no-undef */
/// <reference types="cypress" />

import { setHeaders } from '../../config/mockHeaders'

/**
 * Logs in as specified user.
 * @param {string} uid Uid of user to login as
 */
Cypress.Commands.add('login', uid => {
  setHeaders(uid)
  cy.log('Logged in as', uid)
})

/**
 * Writes text to custom editor used in form.
 * Can be used to "paste" long texts.
 */
Cypress.Commands.add('copyToTextField', (editorName, textToBeTyped) => {
  cy.get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .then(input => {
      const textarea = input.get(0)
      textarea.dispatchEvent(new Event('focus'))

      const textEvent = document.createEvent('TextEvent')
      textEvent.initTextEvent('textInput', true, true, null, textToBeTyped)
      textarea.dispatchEvent(textEvent)

      textarea.dispatchEvent(new Event('blur'))
    })
})

Cypress.Commands.add('writeToTextField', (editorName, textToBeTyped) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get(editorName).click().type(`{moveToEnd}${textToBeTyped}`)
})

Cypress.Commands.add('getEditorInputLength', editorName => {
  cy.get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .then(input => {
      const textarea = input.get(0)
      return textarea.textContent.length
    })
})

Cypress.Commands.add('getYearSelector', () => {
  const currentDate = new Date()
  cy.get('[data-cy=yearSelector]').click()
  cy.get('[data-cy=yearSelector]').then(newEl => {
    expect(newEl.find('.item')).to.have.length(currentDate.getFullYear() - 2018)
  })
})

Cypress.Commands.add('selectYear', year => {
  const currentDate = new Date()
  cy.get('[data-cy=yearSelector]').click()
  cy.get('[data-cy=yearSelector]').then(newEl => {
    expect(newEl.find('.item')).to.have.length(currentDate.getFullYear() - 2018)
  })
  cy.get('[data-cy=yearSelector]').contains(year).click()
})

Cypress.Commands.add('hasAccess', (uid, programCode, access) => {
  cy.login('cypressToskaUser')
  cy.visit('/')
  cy.get(`[data-cy=${programCode}-manage]`).click()
  cy.get(`[data-cy=read-${uid}${access.read ? '' : '-false'}]`)
  cy.get(`[data-cy=write-${uid}${access.write ? '' : '-false'}]`)
  cy.get(`[data-cy=admin-${uid}${access.admin ? '' : '-false'}]`)
})

Cypress.Commands.add('hasSpecialGroups', (uid, ...specialGroup) => {
  cy.login('cypressToskaUser')
  cy.visit('/admin')
  specialGroup.forEach(sg => {
    cy.get('[data-cy^=user-access-groups]').contains(sg)
  })
})

Cypress.Commands.add('typeInEditor', (editorTag, textToBeTyped, flakyness = 24) => {
  // focus to aquire lock
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  const attempt = Cypress.currentRetry + 1
  cy.get(editorTag)
    .find('.editor-class')
    .click()
    .wait(500 * attempt)
    .find('[contenteditable]')
    .wait(500 * attempt)
    // TRUST ME THIS IS NEEDED
    .type(`${textToBeTyped}${' '.repeat(flakyness)}`, { delay: 0 })
    .wait(100 * attempt)
    .blur()
})

Cypress.Commands.add('createDeadline', (draftYear, formName) => {
  cy.get('[data-cy=draft-year-selector]').click()
  cy.get('.item').contains(draftYear).click()

  cy.get('[data-cy=form-selector]').click()
  cy.get('.item').contains(formName).click()

  cy.get('.react-datepicker__input-container > input').click() // Open datepicked
  cy.get('.react-datepicker__navigation').click() // Go to next month
  cy.get('.react-datepicker__day--014').click() // Select 14th day

  cy.get('[data-cy=updateDeadline]').click()
})

Cypress.Commands.add('closeDeadline', (draftYear, formName) => {
  cy.get('[data-cy=draft-year-selector]').click()
  cy.get('.item').contains(draftYear).click()

  cy.get('[data-cy=form-selector]').click()
  cy.get('.item').contains(formName).click()

  cy.get('[data-cy=deleteDeadline]').click()
})
