const db = require('@models/index')
const logger = require('@util/logger')
const { cypressUsers, testProgrammeName } = require('@util/common')

const getFakeAnswers = (year) => {
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

const resetUsers = async (req, res) => {
  try {
    for (const user of cypressUsers) {
      await db.user.destroy({ where: { uid: user.uid } })
      await db.user.create(user)
    }

    logger.info('Cypress::resetUsers')
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetTokens = async (req, res) => {
  try {
    await db.token.destroy({
      where: {
        programme: testProgrammeName,
      },
    })

    const tokens = [
      {
        url: 'readTest',
        programme: testProgrammeName,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'writeTest',
        programme: testProgrammeName,
        type: 'WRITE',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'adminTest',
        programme: testProgrammeName,
        type: 'ADMIN',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'facultyReadTest',
        faculty: 'H50', // MatLu
        type: 'READ',
        valid: true,
        usageCounter: 0,
      },
      {
        url: 'facultyReadDoctorTest',
        faculty: 'H50', // MatLu
        type: 'READ_DOCTOR',
        valid: true,
        usageCounter: 0,
      },
    ]

    for (const token of tokens) {
      await db.token.create(token)
    }

    logger.info('Cypress::resetTokens')
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetForm = async (req, res) => {
  try {
    logger.info('Cypress::resetForm')

    await db.tempAnswer.destroy({
      where: {
        programme: testProgrammeName,
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetAnswers = async (req, res) => {
  try {
    logger.info('Cypress::clearAnswers')

    await db.answer.destroy({
      where: {
        programme: testProgrammeName,
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const createDeadlineIfNoneExist = async () => {
  const count = await db.deadline.count()

  if (count === 0) {
    await db.deadline.create({
      date: new Date(),
    })
  }
}

const createTestProgramme = async () => {
  try {
    logger.info('Creating testprogramme')

    await db.studyprogramme.destroy({ where: { key: testProgrammeName } })

    const matluId = (await db.faculty.findOne({where: {code: "H50"}})).id

    await db.studyprogramme.create({
      key: testProgrammeName,
      name: {
        en: 'TOSKA-en',
        fi: 'TOSKA-fi',
        se: 'TOSKA-se',
      },
      locked: false,
      claimed: false,
      primaryFacultyId: matluId
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const seed = async (req, res) => {
  try {
    logger.info('Cypress::seeding database')

    await resetAnswers()
    await resetUsers()
    await resetTokens()
    await resetForm()
    await createDeadlineIfNoneExist()
    await createTestProgramme()

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const givePermissions = async (req, res) => {
  try {
    logger.info('Cypress::giving permissions')

    const { uid, programme, level } = req.params

    const user = await db.user.findOne({ where: { uid } })

    let permissions = {}
    switch (level) {
      case 'read':
        permissions = {
          read: true,
        }
        break

      case 'write':
        permissions = {
          read: true,
          write: true,
        }
        break

      case 'admin':
        permissions = {
          read: true,
          write: true,
          admin: true,
        }
        break

      default:
        break
    }

    user.access = {
      [programme]: permissions,
    }

    await user.save()

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const createAnswers = async (req, res) => {
  try {
    logger.info('Cypress::creating answers')

    await db.answer.destroy({ where: {} })

    const years = [2019, 2020]

    const programmes = await db.studyprogramme.findAll({})

    for (const year of years) {
      const fakeanswers = getFakeAnswers(year)

      for (const prog of programmes) {
        await db.answer.create({
          programme: prog.key,
          data: fakeanswers,
          year: year,
          submittedBy: 'cypressFakeTest',
        })
      }
    }

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  seed,
  givePermissions,
  createAnswers,
}
