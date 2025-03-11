/* eslint-disable no-undef */
/* eslint-disable cypress/unsafe-to-chain-command */
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
  cy.visit('/yearly')
  cy.get(`[data-cy=${programCode}-manage]`).click()
  cy.get(`[data-cy=read-${uid}${access.read ? '' : '-false'}]`)
  cy.get(`[data-cy=write-${uid}${access.write ? '' : '-false'}]`)
  cy.get(`[data-cy=admin-${uid}${access.admin ? '' : '-false'}]`)
})

Cypress.Commands.add('hasAccessEvaluation', (uid, programCode, access) => {
  cy.login('cypressToskaUser')
  cy.visit('/evaluation')
  cy.get(`[data-cy=${programCode}-manage]`).click()
  cy.get(`[data-cy=read-${uid}${access.read ? '' : '-false'}]`)
  cy.get(`[data-cy=write-${uid}${access.write ? '' : '-false'}]`)
  cy.get(`[data-cy=admin-${uid}${access.admin ? '' : '-false'}]`)
})

Cypress.Commands.add('hasAccessEvaluationFaculty', (uid, programCode, access) => {
  cy.login('cypressToskaUser')
  cy.visit('/evaluation-faculty')
  cy.get(`[data-cy=${programCode}-manage]`).click()
  cy.get(`[data-cy=read-${uid}${access.read ? '' : '-false'}]`)
  cy.get(`[data-cy=write-${uid}${access.write ? '' : '-false'}]`)
  cy.get(`[data-cy=admin-${uid}${access.admin ? '' : '-false'}]`)
})

Cypress.Commands.add('hasAccessDegreeReform', (uid, programCode, access) => {
  cy.login('cypressToskaUser')
  cy.visit('/degree-reform')
  cy.get(`[data-cy=${programCode}-manage]`).click()
  cy.get(`[data-cy=read-${uid}${access.read ? '' : '-false'}]`)
  cy.get(`[data-cy=write-${uid}${access.write ? '' : '-false'}]`)
  cy.get(`[data-cy=admin-${uid}${access.admin ? '' : '-false'}]`)
})

Cypress.Commands.add('hasAccessEvaluationUniversity', (uid, programCode, access) => {
  cy.login('cypressToskaUser')
  cy.visit('/evaluation-university/form/6/UNI')
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

Cypress.Commands.add('typeInEditor', (questionId, textToBeTyped, flakyness = 24) => {
  // focus to aquire lock
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  const attempt = Cypress.currentRetry + 1
  cy.get(`[data-cy=textarea-${questionId}]`)
    .find('.editor-class')
    .click()
    .wait(500 * attempt)
    .find('[contenteditable]')
    .focus()
  // TRUST ME THIS IS NEEDED
  cy.get(`[data-cy=textarea-${questionId}]`)
    .find('[contenteditable]')
    .click()
    .type(`${textToBeTyped}${' '.repeat(flakyness)}`, { delay: 0 })
    .wait(1000 * attempt)

  cy.get(`[data-cy=save-button-${questionId}]`).click()
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

Cypress.Commands.add('typeInTextField', (id, textToBeTyped) => {
  const attempt = Cypress.currentRetry + 1
  cy.get(`[data-cy=edit-${id}]`)
    .click()
    .wait(500 * attempt)

  cy.get(`[data-cy=editor-${id}]`).type(textToBeTyped, { delay: 0 })
})
