/// <reference types="cypress" />
import '../support/commands'

const user = 'cypressUser'

describe('Textfield tests', () => {
  beforeEach(() => {
    cy.login(user)
    cy.visit('/v1/programmes/KH50_005')
  })

  it('', () => {
    
  })
})