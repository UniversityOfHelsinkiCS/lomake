describe('Overview page test', () => {
  
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/overview')
  })

  // describe('Testing visual elements', () => {
  //   it("Should have a title", () => {
  //     expect(true).to.equal(true)
  //   })
  // })

  describe('Testing keydata table controls', () => {

    describe('Test programme level filters', () => {

      it('Displays all programme level options', () => {

      })

      it('Displays bachelor programmes only', () => {
        cy.get('[data-cy="level-filter"]').click()
        cy.get('[data-cy="level-filter-bachelor"]').click()
        
      })
    })

    // it.skip('Filters programmes by faculty', () => {
    //   expect(true).to.equal(true)
    // })

    // TODO: Implement this test when years are implemented
    // // it.skip('Filters programmes by year', () => {
    // //   expect(true).to.equal(true)
    // // })

    // it.skip('Filters programmes by search input', () => {
    //   expect(true).to.equal(true)
    // })

    // it.skip('Sorts programmes by name', () => {
    //   expect(true).to.equal(true)
    // })

    // it.skip('Sorts programmes by code', () => {
    //   expect(true).to.equal(true)
    // })

  })

  describe('Testing keydata modals', () => {

    // it.skip('Modals open', () => {
    //   expect(true).to.equal(true)
    // })

    // it.skip('Modals close', () => {
    //   expect(true).to.equal(true)
    // })

    // it.skip('Modals contain', () => {
    //   expect(true).to.equal(true)
    // })

  })
})

