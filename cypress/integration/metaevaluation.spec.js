import {
  testFacultyCode,
  testFacultyName,
  testProgrammeCode,
  testProgrammeName,
  testProgrammeCodeDoctor,
  testProgrammeNameDoctor,
  defaultYears,
} from '../../config/common'

describe('Meta evaluation form & overview tests', () => {
  const cypressSuperAdmin = 'cypressSuperAdminUser'

  beforeEach(() => {
    const cypressOspa = 'cypressOspaUser'
    cy.login(cypressOspa)
    cy.visit('/yearly')
  })

  it('should open meta evaluation form', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

    cy.contains(testProgrammeName)
    cy.contains(`Review ${defaultYears[0]}`)
  })

  it('should open meta evaluation form with doctoral degree', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get('[data-cy=degreeDropdown]').click()
    cy.get('[data-cy=doctoralOptionText]').click()
    cy.get(`[data-cy=colortable-link-to-${testProgrammeCodeDoctor}]`).click()

    cy.contains(testProgrammeNameDoctor)
    cy.contains(`Review ${defaultYears[0]}`)
  })

  it('should open dropdown and select faculty', () => {
    cy.get('[data-cy=nav-evaluation]').click()
    cy.get('[data-cy=nav-meta-evaluation]').click()
    cy.get('[data-cy=faculty-dropdown]').click()
    cy.get(`[data-cy=dropdown-item-${testFacultyCode}]`).click()

    cy.contains(testFacultyName)

    cy.get('[data-cy=faculty-dropdown]').click()
    cy.get(`[data-cy=dropdown-item-all]`).click()

    cy.contains('Choose faculty')
  })

  context('Answering meta evaluation form', () => {
    it('should open meta evaluation form and answer questions and then inspect questions in overview and answers pages', () => {
      const cypressOspa = 'cypressOspaUser'
      cy.login(cypressOspa)
      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.get('[data-cy=nav-meta-evaluation]').click()
      cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

      cy.get(`[data-cy="deadline-passed-notice"]`).contains('The deadline to edit form has passed.')

      cy.login(cypressSuperAdmin)
      cy.visit('/')

      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - toimeenpano')
      cy.get('[data-cy=form-7-deadline]').contains('14.')

      cy.login(cypressOspa)
      cy.visit('/')

      cy.get('[data-cy=nav-evaluation]').click()
      cy.get('[data-cy=nav-meta-evaluation]').click()
      cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

      cy.get(`[data-cy="saving-answers-notice"]`).contains(
        'Answers are saved automatically except for text fields. Final day for answering the form:',
      )

      cy.get(`[data-cy="color-negative-1"]`).click()
      cy.get(`[data-cy="textarea-1"]`).should('exist')
      cy.get(`[data-cy="color-irrelevant-1"]`).click()
      cy.get(`[data-cy="textarea-1"]`).should('not.exist')
      cy.get(`[data-cy="color-positive-2"]`).click()

      cy.get('[data-cy=nav-evaluation]').click()
      cy.get('[data-cy=nav-meta-evaluation]').click()

      cy.get(`[data-cy=${testProgrammeCode}-1-single]`).should('have.css', 'background-color', 'rgb(128, 128, 128)')

      cy.get(`[data-cy=${testProgrammeCode}-2-single]`).should('have.css', 'background-color', 'rgb(157, 255, 157)')

      cy.visit('/')
      cy.get('[data-cy=nav-evaluation]').click()
      cy.get('[data-cy=nav-meta-evaluation]').click()
      cy.get(`[data-cy=colortable-link-to-${testProgrammeCode}]`).click()

      cy.typeInEditor('2', '1234')

      cy.get('[data-cy=color-negative-2]').click()

      cy.visit('/meta-evaluation/answers')
      cy.get('[data-cy=report-question-2_text]').click()
      cy.get('[data-cy=report-question-content-2_text]').contains('1234')
    })

    it('should only see comments', () => {
      cy.login(cypressSuperAdmin)

      cy.visit('/')
      cy.get('[data-cy=nav-admin]').click()
      cy.contains('Deadline settings').click()

      cy.createDeadline(defaultYears[0], 'Katselmus - toimeenpano')
      cy.get('[data-cy=form-7-deadline]').contains('14.')

      cy.visit(`/meta-evaluation/form/7/${testProgrammeCodeDoctor}`)
      cy.typeInEditor('T1', '2345')

      cy.typeInEditor('T1_comment', '3456')

      cy.visit('/meta-evaluation/answers')
      cy.get('[data-cy=degreeDropdown]').click()
      cy.get('[data-cy=doctoralOptionText]').click()
      cy.get('[data-cy=content-type-dropdown]').click()
      cy.contains('Only answers').click()

      cy.get('[data-cy=report-question-T1_text]').click()
      cy.get('[data-cy=report-question-content-T1_text]').contains('2345')

      cy.get('[data-cy=content-type-dropdown]').click()
      cy.contains('Only comments').click()

      cy.get('[data-cy=report-question-T1_text]').click()
      cy.get('[data-cy=report-question-content-T1_text]').contains('3456')
    })
  })
})
