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
