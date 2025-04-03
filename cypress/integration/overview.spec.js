describe('Overview page test', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/overview')
  })


  describe('Testing keyDataTable interactions', () => {
    it('opens a modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell"]').first().should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })

    it('directs to correct programme page on programme-name-cell click', () => {
      cy.get('[data-cy="programme-name-table-cell"]').should('exist')
    })
  })


  describe('Testing keyDataTable filtering controls', () => {
    describe('Test programme level filters', () => {
      it('Displays correct programme level options', () => {
        cy.get('[data-cy="level-filter"]').click()

        const programmes = [
          'All programmes',
          "Bachelor's programmes",
          "Master's programmes",
          'Doctoral programmes',
          "International Master's programmes",
        ]

        cy.get('[data-cy="level-filter-option"]')
          .should('have.length', programmes.length)
          .then($options => {
            $options.each((index, $option) => {
              expect($option).to.contain(programmes[index])
            })
          })
      })

      it('Displays correct faculty options', () => {
        cy.get('[data-cy="faculty-filter"]').click()

        const faculties = [
          'All faculties',
          'Faculty of Agriculture and Forestry',
          'Faculty of Arts',
          'Faculty of Biological and Environmental Sciences',
          'Faculty of Educational Sciences',
          'Faculty of Law',
          'Faculty of Medicine',
          'Faculty of Pharmacy',
          'Faculty of Science',
          'Faculty of Social Sciences',
          'Faculty of Theology',
          'Faculty of Veterinary Medicine',
          'Swedish School of Social Science',
        ].sort()

        cy.get('[data-cy="faculty-filter-option"]')
          .should('have.length', faculties.length)
          .then($options => {
            $options.each((index, $option) => {
              expect($option).to.contain(faculties[index])
            })
          })
      })

      it('Displays correct year options', () => {
        cy.get('[data-cy="year-filter"]').click()

        const years = ['2025', '2024', '2023']

        cy.get('[data-cy="year-filter-option"]')
          .should('have.length', years.length)
          .then($options => {
            $options.each((index, $option) => {
              expect($option).to.contain(years[index])
            })
          })
      })
    })

    // TODO: Implement these tests when useFetchKeyData is updated

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
})
