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

    it('directs to correct programme page on programme name click', () => {
      const programmeCode = 'KH50_005'
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
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

        const years = ['2025']

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
  it('Calculates correct values for evaluationarea', () => {
    cy.get('[data-cy="trafficlight-table-cell-MH50_009-Vetovoimaisuus"]').click()
    cy.get(`[data-cy="Eligible applicants for Master's application-Punainen"]`).should('exist')
    cy.get('[data-cy="Number of new students-Punainen"]').should('exist')
    cy.get('[data-cy="Intake-Keltainen"]').should('exist')
    cy.get('[data-cy="Applications per student place-Punainen"]').should('exist')
    
    // Check if the specific element exists
    cy.get('[data-cy="MH50_009-Vetovoimaisuus-Punainen"]').should('exist').then(() => {
      // Count all elements with "Punainen" in their data-cy attribute
      cy.get('[data-cy]').then($elements => {
        let punainenCount = 0

        $elements.each((index, element) => {
          const dataCyValue = element.getAttribute('data-cy')
          if (dataCyValue.includes('Punainen')) {
            punainenCount++
          }
        })

        // atleast 3 because the header has punainen also
        expect(punainenCount).to.be.at.least(3)
      })
    })
  })
  it('Calculates correct values with one grey', () => {
    cy.get('[data-cy="trafficlight-table-cell-MH50_009-Opintojen sujuvuus ja valmistuminen"]').click()
    
    cy.get('[data-cy="MH50_009-Opintojen sujuvuus ja valmistuminen-Punainen"]').should('exist').then(() => {
      cy.get('[data-cy]').then($elements => {
        let punainenCount = 0

        $elements.each((index, element) => {
          const dataCyValue = element.getAttribute('data-cy')
          if (dataCyValue.includes('Punainen')) {
            punainenCount++
          }
        })

        // atleast 3 because the header has punainen also
        expect(punainenCount).to.be.at.least(3)
      })
    })
  })
  it('Calculates correct values with multiple grey', () => {
    cy.get('[data-cy="trafficlight-table-cell-KH50_005-Palaute ja työllistyminen"]').click()
    
    cy.get('[data-cy="KH50_005-Palaute ja työllistyminen-Harmaa"]').should('exist').then(() => {
      cy.get('[data-cy]').then($elements => {
        let harmaaCount = 0

        $elements.each((index, element) => {
          const dataCyValue = element.getAttribute('data-cy')
          if (dataCyValue.includes('Harmaa')) {
            harmaaCount++
          }
        })

        // atleast 3 because the header has punainen also
        expect(harmaaCount).to.be.at.least(3)
      })
    })
  })
  it('Calculates correct values with two yellows and two reds', () => {
    cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus"]').click()
    
    cy.get('[data-cy="KH50_005-Vetovoimaisuus-Punainen"]').should('exist').then(() => {
      cy.get('[data-cy]').then($elements => {
        let punainenCount = 0
        let keltainenCount = 0

        $elements.each((index, element) => {
          const dataCyValue = element.getAttribute('data-cy')
          if (dataCyValue.includes('Punainen')) {
            punainenCount++
          if (dataCyValue.includes('Keltainen')) {
            keltainenCount++
          }
          }
        })

        // atleast 3 because the header has punainen also
        expect(punainenCount).to.be.at.least(3)
        expect(keltainenCount).to.be.at.most(2)
      })
    })
  })
})
