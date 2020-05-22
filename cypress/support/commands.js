// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Logs in as specified user.
 * @param {string} uid Uid of user to login as
 */
Cypress.Commands.add('login', (uid) => {
  window.localStorage.setItem('fakeUser', JSON.stringify({ uid }))
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
Cypress.Commands.add('writeToTextField', (editorName, textToBeTyped) => {
  cy.server()
  cy.route('POST', '/socket.io/*').as('update')
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
