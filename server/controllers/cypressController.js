import { Op } from 'sequelize'
import moment from 'moment'
import db from '../models/index.js'
import logger from '../util/logger.js'
import { testProgrammeCode, defaultYears } from '../util/common.js'
import { createDraftAnswers } from '../scripts/draftAndFinalAnswers.js'
import { facultyList } from '../../config/data.js'

const getFakeYearlyAnswers = year => {
  const fields = [
    'feedback_text',
    'guidance_text',
    'feedback_light',
    'guidance_light',
    'curriculum_text',
    'management_text',
    'measures_1_text',
    'measures_2_text',
    'resourcing_text',
    'curriculum_light',
    'management_light',
    'resourcing_light',
    'employability_text',
    'employability_light',
    'teacher_skills_text',
    'teacher_skills_light',
    'student_feedback_text',
    'learning_outcomes_text',
    'learning_outcomes_light',
    'programme_identity_text',
    'student_admissions_text',
    'teaching_resources_text',
    'community_wellbeing_text',
    'cooperation_success_text',
    'programme_identity_light',
    'student_admissions_light',
    'teaching_resources_light',
    'community_wellbeing_light',
    'cooperation_success_light',
    'language_environment_text',
    'language_environment_light',
    'recruitment_influence_text',
    'recruitment_influence_light',
    'wellbeing_information_used_text',
    'wellbeing_information_needed_text',
    'overall_status_information_used_text',
    'successes_and_development_needs_text',
    'joint_programme_information_used_text',
    'overall_status_information_needed_text',
    'joint_programme_information_needed_text',
    'review_of_last_years_situation_report_text',
    'sufficient_resources_information_used_text',
    'review_of_last_years_situation_report_light',
    'sufficient_resources_information_needed_text',
  ]

  return fields.reduce((pre, cur) => {
    return {
      ...pre,
      [cur]: cur.includes('light') ? 'green' : `Hello from ${year}`,
    }
  }, {})
}

const resetForm = async () => {
  try {
    logger.info('Cypress::resetForm')

    await db.tempAnswer.destroy({
      where: {
        programme: testProgrammeCode,
      },
    })
    // clean individual user test inputs
    await db.tempAnswer.destroy({
      where: {
        [Op.or]: [
          { programme: { [Op.startsWith]: 'cypressSuperAdminUser' } },
          { programme: 'cypressSuperAdminUser' },
          { programme: 'cypressUser' },
          { programme: 'cypressNoRightsUser' },
        ],
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetAnswers = async () => {
  try {
    logger.info('Cypress::clearAnswers')

    await db.answer.destroy({
      where: {
        programme: testProgrammeCode,
      },
    })
    // clean individual user test inputs
    await db.answer.destroy({
      where: {
        [Op.or]: [
          { programme: { [Op.startsWith]: 'cypressSuperAdminUser' } },
          { programme: 'cypressSuperAdminUser' },
          { programme: { [Op.startsWith]: 'cypressUser' } },
          { programme: { [Op.startsWith]: 'cypressNoRightsUser' } },
        ],
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetDeadlines = async () => {
  const deadline = moment().add(7, 'days')
  const draftYear = defaultYears[0]
  const form = 1

  try {
    // Unlock all programmes
    await db.studyprogramme.update(
      {
        locked: false,
        lockedForms: { evaluation: false, yearly: false, 'degree-reform': false, 'evaluation-faculty': false },
      },
      { where: {} },
    )

    // Close all deadlines and create new for yearly form
    await db.deadline.destroy({
      truncate: true,
    })
    await db.deadline.create({
      date: deadline,
      form,
    })

    // Create new or update old draft year
    const existingDraftYears = await db.draftYear.findAll({})
    if (existingDraftYears.length === 0) {
      await db.draftYear.create({
        year: draftYear,
      })
    } else {
      existingDraftYears[0].year = draftYear
      await existingDraftYears[0].save()
    }

    await createDraftAnswers(draftYear, form)
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const seed = async (_, res) => {
  try {
    logger.info('Cypress::seeding database')

    await resetAnswers()
    await resetForm()
    await resetDeadlines()

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createAnswers = async (req, res) => {
  const form = req.params.form || 1
  try {
    logger.info('Cypress::creating answers')

    await db.answer.destroy({ where: {} })
    await db.tempAnswer.destroy({ where: {} })

    const programmes = await db.studyprogramme.findAll({})

    defaultYears.forEach(async year => {
      const fakeanswers = getFakeYearlyAnswers(year)
      const currentYear = new Date().getFullYear()

      programmes.forEach(async prog => {
        if (year !== currentYear) {
          await db.answer.create({
            programme: prog.key,
            data: fakeanswers,
            year,
            form,
            submittedBy: 'cypressFakeTest',
          })
        }
        await db.tempAnswer.create({
          data: {},
          programme: prog.key,
          year,
          form,
        })
      })
    })

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createFacultyAnswers = async (req, res) => {
  const form = req.params.form || 8
  try {
    logger.info('Cypress::creating answers')

    await db.tempAnswer.destroy({ where: {} })

    const promises = facultyList.map(async faculty => {
      const facultyPromises = []
      const answerData = { selectedQuestionIds: [] }

      for (let i = 1; i <= 30; i++) {
        answerData[`${i}_modal`] = ''
        answerData[`${i}_actions_text`] = `Action text for ${i}`
        answerData[`${i}_degree_radio`] = 'both'
        answerData[`${i}_end_date_text`] = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString() // Example end date
        answerData[`${i}_lights_history`] = [
          {
            date: new Date().toISOString(),
            color: 'green',
            value: 1,
          },
        ]
        answerData[`${i}_resources_text`] = `Resource text for ${i}`
        answerData[`${i}_start_date_text`] = new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000).toISOString() // Example start date
        answerData[`${i}_contact_person_text`] = `Contact person for ${i}`
        answerData[`${i}_responsible_entities_text`] = `Responsible entity for ${i}`
        answerData.selectedQuestionIds.push(i.toString())
      }
      // Create a promise for inserting answerData into the database
      const insertPromise = db.tempAnswer.create({
        programme: faculty.code,
        data: answerData,
        year: 2024,
        form,
      })

      facultyPromises.push(insertPromise)
      await Promise.all(facultyPromises)
    })
    await Promise.all(promises)

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

export default { seed, createAnswers, createFacultyAnswers }
