/* eslint-disable no-undef */
/// <reference types="cypress" />

import { setHeaders } from "../../client/util/mockHeaders"

/**
 * Logs in as specified user.
 * @param {string} uid Uid of user to login as
 */
Cypress.Commands.add('login', (uid) => {
  setHeaders(uid)
  cy.log('Logged in as', uid)
})

/**
 * Gives permissions to user.
 * @param {string} uid Uid of user to grant permissions
 * @param {string} programme Name of programme to give rights for
 * @param {string} level Level of permissions to give (read,write,admin)
 */
Cypress.Commands.add('givePermissions', (uid, programme, level) => {
  cy.request(`/api/cypress/givePermissions/${uid}/${programme}/${level}`)
  cy.log(`Gave ${level}-permissions for ${programme} to ${uid}`)
})

/**
 * Writes text to custom editor used in form.
 * Can be used to "paste" long texts.
 */
Cypress.Commands.add('copyToTextField', (editorName, textToBeTyped) => {
  cy.server()
  cy.route('POST', '/socket.io/*').as('update')

  // Get "edit-lock" for the textfield
  cy.route('GET', '/socket.io/*').as('getLock')
  cy.get(editorName).click()
  cy.wait('@getLock')

  cy.get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .then((input) => {
      var textarea = input.get(0)
      textarea.dispatchEvent(new Event('focus'))

      var textEvent = document.createEvent('TextEvent')
      textEvent.initTextEvent('textInput', true, true, null, textToBeTyped)
      textarea.dispatchEvent(textEvent)

      textarea.dispatchEvent(new Event('blur'))
    })
  cy.wait('@update')
})

Cypress.Commands.add('writeToTextField', (editorName, textToBeTyped) => {
  cy.server()
  cy.route('POST', '/socket.io/*').as('update')

  // Get "edit-lock" for the textfield
  cy.route('GET', '/socket.io/*').as('getLock')
  cy.get(editorName).click()
  cy.wait('@getLock')

  cy.get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .type(textToBeTyped)
    .wait('@update')
})
