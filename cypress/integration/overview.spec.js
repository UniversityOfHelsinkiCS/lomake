describe('Overview page test', () => {
  beforeEach(() => {
    cy.login('cypressSuperAdminUser')
    cy.request(`/api/cypress/initKeyData`)
    cy.visit('/v1/overview')
    cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
    cy.contains('2024').click()
  })

  describe('Testing keyDataTable interactions', () => {
    it('should direct to correct programme page on programme name click', () => {
      const programmeCode = 'KH50_005' // Computer science bachelor programme
      cy.get(`[data-cy="keydatatable-programme-${programmeCode}"]`).should('exist').click()
      cy.url().should('include', `/${programmeCode}`)
    })
  })

  describe('Testing modals', () => {
    it('Should open modal on trafficlight cell click', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus"]').should('exist').click()
      cy.get('[data-cy="keydata-modal"]').should('be.visible')
    })

    it('Should have view only textfields', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Opintojen sujuvuus ja valmistuminen"]').should('exist').click()
      cy.get('[data-cy="textfield-viewonly"]').should('exist')
    })

    // it('displays text in textfields')
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
          // "International Master's programmes",
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

        const years = ['2024', '2025']

        cy.get('[data-cy="year-filter-option"]')
          .should('have.length', years.length)
          .then($options => {
            $options.each((index, $option) => {
              expect($option).to.contain(years[index])
            })
          })
      })
    })
  })

  describe('Testing trafficlights', () => {
    it('Calculates correct values for evaluationarea', () => {
      cy.get('[data-cy="trafficlight-table-cell-MH50_009-Vetovoimaisuus"]').click()
      cy.get(`[data-cy="Eligible applicants for Master's application-Punainen"]`).should('exist')
      cy.get('[data-cy="Number of new students-Punainen"]').should('exist')
      cy.get('[data-cy="Intake-Keltainen"]').should('exist')
      cy.get('[data-cy="Applications per student place-Punainen"]').should('exist')

      // Check if the specific element exists
      cy.get('[data-cy="MH50_009-Vetovoimaisuus-Punainen"]')
        .should('exist')
        .then(() => {
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

      cy.get('[data-cy="MH50_009-Opintojen sujuvuus ja valmistuminen-Punainen"]')
        .should('exist')
        .then(() => {
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

    it('Calculates correct values when values are at 0', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Palaute ja työllistyminen"]').click()

      cy.get('[data-cy="KH50_005-Palaute ja työllistyminen-Punainen"]')
        .should('exist')
        .then(() => {
          cy.get('[data-cy]').then($elements => {
            let punainenCount = 0

            $elements.each((index, element) => {
              const dataCyValue = element.getAttribute('data-cy')
              if (dataCyValue.includes('Punainen')) {
                punainenCount++
              }
            })

            // atleast 3 because the header has punainen also
            expect(punainenCount).to.be.at.least(4)
          })
        })
    })

    it('Calculates correct values with two yellows and two reds', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_005-Vetovoimaisuus"]').click()

      cy.get('[data-cy="KH50_005-Vetovoimaisuus-Punainen"]')
        .should('exist')
        .then(() => {
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

  describe('Color history tests', () => {
    beforeEach(() => {
      cy.get('[data-cy="year-filter"] > .MuiSelect-select').click()
      cy.contains('2025').click()
    })

    it('Displays correct color history for previous years', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_002-Vetovoimaisuus"]').should('exist').click()

      // Red + lightgreen
      cy.get('[data-cy="Applications per student place-Vaaleanvihreä"]').should('exist').click()

      cy.get('[data-cy="history-Hakupaine-2022"]').should('exist')
      cy.get('[data-cy="history-Hakupaine-2022-value"]').should('exist')
      cy.get('[data-cy="history-Hakupaine-2022-Punainen"]').should('exist')
      cy.get('[data-cy="history-Hakupaine-2023-Vaaleanvihreä"]').should('exist')

      // Yellow + lightgreen
      cy.get('[data-cy="Primary applicants-Vaaleanvihreä"]').should('exist').click()

      cy.get('[data-cy="history-Ensisijaiset hakijat-2022"]').should('exist')
      cy.get('[data-cy="history-Ensisijaiset hakijat-2022-value"]').should('exist')

      cy.get('[data-cy="history-Ensisijaiset hakijat-2022-Keltainen"]').should('exist')
      cy.get('[data-cy="history-Ensisijaiset hakijat-2023-Vaaleanvihreä"]').should('exist')

      // Lightgreen + darkgreen
      cy.get('[data-cy="Filling rate of intake-Tummanvihreä"]').should('exist').click()

      cy.get('[data-cy="history-Aloituspaikkojen täyttö-2022"]').should('exist')
      cy.get('[data-cy="history-Aloituspaikkojen täyttö-2022-value"]').should('exist')

      cy.get('[data-cy="history-Aloituspaikkojen täyttö-2022-Vaaleanvihreä"]').should('exist')
      cy.get('[data-cy="history-Aloituspaikkojen täyttö-2023-Tummanvihreä"]').should('exist')

      // Darkgreen
      cy.get('[data-cy="Number of new students-Tummanvihreä"]').should('exist').click()

      cy.get('[data-cy="history-Opintonsa aloittaneet-2022"]').should('exist')
      cy.get('[data-cy="history-Opintonsa aloittaneet-2022-value"]').should('exist')

      cy.get('[data-cy="history-Opintonsa aloittaneet-2022-Tummanvihreä"]').should('exist')
      cy.get('[data-cy="history-Opintonsa aloittaneet-2023-Tummanvihreä"]').should('exist')
    })

    it('Displays color history correctly for missing values', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_002-Opintojen sujuvuus ja valmistuminen"]').should('exist').click()

      // No history
      cy.get('[data-cy="Degrees-Tummanvihreä"]').should('exist').click()
      cy.get('[data-cy="no-history"]').should('exist').contains('No previous history')

      // Only 22
      cy.get('[data-cy="Graduation within target time-Tummanvihreä"]').should('exist').click()

      cy.get('[data-cy="history-Tavoiteajassa valmistuminen-2022-Punainen"]').should('exist')
      cy.get('[data-cy="history-Tavoiteajassa valmistuminen-2023-Harmaa"]').should('not.exist')

      // Only 23
      cy.get('[data-cy="Progress of studies-Tummanvihreä"]').should('exist').click()
      cy.get('[data-cy="history-Opintojen eteneminen-2022-Harmaa"]').should('not.exist')
      cy.get('[data-cy="history-Opintojen eteneminen-2023-Tummanvihreä"]').should('exist')
    })

    it('Displays no color history for gray values ', () => {
      cy.get('[data-cy="trafficlight-table-cell-KH50_002-Palaute ja työllistyminen"]').should('exist').click()

      // No color meter or history
      cy.get('[data-cy="Guidance-Harmaa"]').should('exist').click()
      cy.get('[data-cy="no-colormeter"]')
        .should('exist')
        .contains('No traffic light estimate is displayed for this key figure.')
    })
  })
})
