/// <reference types="cypress" />
import '../support/commands'
import { possibleUsers } from '../../config/mockHeaders'

describe('QualityForm tests', () => {
  beforeEach(() => {
    cy.request(`/api/cypress/initKeyData`)
    cy.login('klemstro')
    cy.visit(`/v1/programmes/10/KH50_005`)
  })

  it('should indicate that the form is locked to you while creating new document', () => {
    cy.request(`/api/cypress/resetQualityDocuments`)
    cy.get('[data-cy="create-new-qualitydocument"]').click()
    cy.contains(
      `The form is locked for your processing. Save your changes and release the form for others before leaving the page.`
    ).should('exist')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.contains(
      'The form is locked for your processing. Open the form and save your changes to release it for others.'
    ).should('exist')
  })

  it('user can create a new quality document', () => {
    cy.request(`/api/cypress/resetQualityDocuments`)
    cy.intercept('POST', '**/api/qualitydocuments/**').as('saveQualityDoc')
    cy.intercept('DELETE', '**/api/lock').as('deleteLock')

    cy.get('[data-cy="create-new-qualitydocument"]').click()
    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')

    cy.get('[data-cy=save-document]').should('be.disabled')
    cy.contains('Please answer at least the following questions:').should('exist')
    cy.contains('Section 1: Select or add at least one feedback system or source of feedback').should('exist')
    cy.contains(
      'Section 4: How often is the achievement of learning outcomes discussed by the programme steering group?'
    ).should('exist')

    cy.get('[data-cy="radio-norppa-notUsed"]').find('input[type="radio"]').should('be.checked')
    cy.get('[data-cy="radio-norppa-annually"]').click()
    cy.get('[data-cy="radio-norppa-annually"]').find('input[type="radio"]').should('be.checked')
    cy.get('[data-cy=save-document]').should('not.be.disabled')
    cy.contains('Section 1: Select or add at least one feedback system or source of feedback').should('not.exist')

    cy.get('[data-cy="otherFeedbackSource"]').click()
    cy.get('[data-cy="otherFeedbackSource"]').type('TestFeedbackSystem')
    cy.get('[data-cy="add-new-feedbackSource"]').click()
    cy.contains('TestFeedbackSystem').should('exist')
    cy.get('[data-cy="radio-TestFeedbackSystem-annually"]').click()
    cy.get('[data-cy="radio-TestFeedbackSystem-annually"]').find('input[type="radio"]').should('be.checked')

    cy.get('[name=feedbackExamples]').click()
    cy.get('[name=feedbackExamples]').type('Esimerkkejä palautteiden hyödyntämisestä')

    cy.get('[data-cy="curriculum-example1-name"]').click()
    cy.get('[data-cy="curriculum-example1-name"]').type('Kehittämisekohteen esimerkkinimi1')

    cy.get('[data-cy="curriculum-example2-name"]').should('not.exist')

    cy.get('[data-cy="add-new-example-curriculum"]').click()
    cy.get('[data-cy="curriculum-example2-name"]').should('exist')

    cy.get('[data-cy="curriculum-example2-name"]').type('Kehittämisekohteen esimerkkinimi2')

    cy.get('[data-cy="learning"]').click()
    cy.get('[data-cy="learning"]').type('Osaamistavoitteiden saavuttamisen arviointi')

    cy.get('[data-cy="regularity-learning"]').find('input[type="radio"][value="annually"]').click()
    cy.get('[data-cy="regularity-learning"]').find('input[type="radio"][value="annually"]').should('be.checked')
    cy.contains(
      'Section 4: How often is the achievement of learning outcomes discussed by the programme steering group?'
    ).should('not.exist')

    cy.get('[data-cy=save-document]').click()
    cy.wait('@saveQualityDoc', { timeout: 10000 })
    cy.wait('@deleteLock', { timeout: 10000 })
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0-quality-document"]').should('exist')
    cy.contains(
      'The form is locked for your processing. Open the form and save your changes to release it for others.'
    ).should('not.exist')
  })

  it('user can view created quality document', () => {
    cy.get('[data-cy="accordion-0-quality-document"]').click()

    cy.contains('tr', 'TestFeedbackSystem').find('td').eq(3).should('contain.text', '✓')
    cy.contains('tr', 'Norppa').find('td').eq(3).should('contain.text', '✓')
    cy.contains('tr', 'HowULearn').find('td').eq(0).should('contain.text', '✓')

    cy.get('[data-cy="TestFeedbackSystem-description"]').should('contain.text', 'No answer provided')

    cy.get('[data-cy="feedback-examples"]').should('contain.text', 'Esimerkkejä palautteiden hyödyntämisestä')

    cy.get('[data-cy="curriculum-1-name"]').should('contain.text', 'Kehittämisekohteen esimerkkinimi1')
    cy.get('[data-cy="curriculum-1-changes"]').should('contain.text', 'No answer provided')
    cy.get('[data-cy="curriculum-2-name"]').should('contain.text', 'Kehittämisekohteen esimerkkinimi2')

    cy.get('[data-cy="quidance-1-name"]').should('not.exist')
    cy.get('[data-cy="guidance-empty-examples"]').should('exist')

    cy.get('[data-cy="learning"]').should('contain.text', 'Osaamistavoitteiden saavuttamisen arviointi')

    cy.get('[data-cy="learning-regularity"]').should('contain.text', 'Annually /\n once a year')

    cy.get('[data-cy="learning-1-name"]').should('not.exist')
    cy.get('[data-cy="learning-empty-examples"]').should('exist')
  })

  it('user can edit the document', () => {
    cy.intercept('PUT', '**/api/qualitydocuments/**').as('editQualityDoc')
    cy.intercept('DELETE', '**/api/lock').as('deleteLock')

    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').click()

    cy.contains(`Bachelor's Programme in Computer Science`).should('exist')

    cy.contains('Section 1: Select or add at least one feedback system or source of feedback').should('not.exist')

    cy.get('[data-cy="radio-norppa-notUsed"]').click()
    cy.get('[data-cy="radio-norppa-notUsed"]').find('input[type="radio"]').should('be.checked')

    cy.get('[data-cy="remove-TestFeedbackSystem"]').click()

    cy.contains('Section 1: Select or add at least one feedback system or source of feedback').should('exist')

    cy.get('[data-cy="curriculum-example1-name"]').click()
    cy.get('[data-cy="curriculum-example1-name"]').type(' - Muokattu')

    cy.get('[data-cy="curriculum-example2-name"]').should('exist')

    cy.get('[data-cy="remove-example2-curriculum"]').click()

    cy.get('[data-cy="curriculum-example2-name"]').should('not.exist')

    cy.get('[data-cy="regularity-learning"]').find('input[type="radio"][value="lessFrequently"]').click()
    cy.get('[data-cy="regularity-learning"]').find('input[type="radio"][value="annually"]').should('not.be.checked')
    cy.get('[data-cy="regularity-learning"]').find('input[type="radio"][value="lessFrequently"]').should('be.checked')

    cy.get('[data-cy=save-document]').click()
    cy.wait('@editQualityDoc', { timeout: 10000 })
    cy.wait('@deleteLock', { timeout: 10000 })
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0-quality-document"]').should('exist')
    cy.contains(
      'The form is locked for your processing. Open the form and save your changes to release it for others.'
    ).should('not.exist')
    cy.get('[data-cy="accordion-0-quality-document"]').click()

    cy.contains('TestFeedbackSystem').should('not.exist')
    cy.contains('tr', 'Norppa').find('td').eq(0).should('contain.text', '✓')

    cy.get('[data-cy="curriculum-1-name"]').should('contain.text', 'Kehittämisekohteen esimerkkinimi1 - Muokattu')
    cy.get('[data-cy="curriculum-2-name"]').should('not.exist')
    cy.get('[data-cy="learning-regularity"]').should('contain.text', 'Less than once every 4 years')
  })

  it('Should indicate that the form is locked to you while editing', () => {
    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').click()
    cy.contains(
      `The form is locked for your processing. Save your changes and release the form for others before leaving the page.`
    ).should('exist')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.contains(
      'The form is locked for your processing. Open the form and save your changes to release it for others.'
    ).should('exist')
  })

  it('User can see, if the form is locked for another user and can edit the form only if the lock is released', () => {
    cy.intercept('PUT', '**/api/qualitydocuments/**').as('editQualityDoc')
    cy.intercept('DELETE', '**/api/lock').as('deleteLock')

    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').click()

    cy.login('cypressReadingRightsUser')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0-quality-document"]')
      .closest('.MuiAccordion-root')
      .should('have.class', 'Mui-disabled')

    cy.get('[data-cy="accordion-0-quality-document"]').parent().trigger('mouseover', { force: true })
    cy.get('[role="tooltip"]').should(
      'contain',
      'Document is locked by another user. Wait until the user is finished, or contact the system administrator if the lock seems to be invalid.'
    )

    cy.login('klemstro')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').click()
    cy.get('[data-cy=save-document]').click()

    cy.wait('@editQualityDoc', { timeout: 10000 })
    cy.wait('@deleteLock', { timeout: 10000 })

    cy.login('cypressUser')
    cy.visit(`/v1/programmes/10/KH50_005`)
    cy.get('[data-cy="accordion-0-quality-document"]')
      .closest('.MuiAccordion-root')
      .should('not.have.class', 'Mui-disabled')

    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').should('not.be.disabled')
  })

  it('Should autosave every 5 minutes while editing', () => {
    cy.intercept('PUT', '**/api/qualitydocuments/**').as('editQualityDoc')
    cy.clock()

    cy.get('[data-cy="accordion-0-quality-document"]').click()
    cy.get('[data-cy="accordion-0-edit-qualitydocument-button"]').click()

    cy.get('[data-cy="feedback-examples"]').click()
    cy.get('[data-cy="feedback-examples"]').type('Esimerkki palautteiden hyödyntämisestä')
    cy.tick(6 * 60 * 1000)
    cy.contains('Last automatic save').should('exist')
    cy.get('[data-cy="back-button"]').click()

    cy.get('[data-cy="accordion-0-quality-document"]').click()

    cy.get('[data-cy="feedback-examples"]').should('contain.text', 'Esimerkki palautteiden hyödyntämisestä')
  })
})
