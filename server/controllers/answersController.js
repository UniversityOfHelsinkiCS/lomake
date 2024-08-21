import { Op } from 'sequelize'
import db from '../models/index.js'
import logger from '../util/logger.js'
import { whereDraftYear, isAdmin, isSuperAdmin } from '../util/common.js'
import { formKeys } from '../../config/data.js'

/**
 * The LINJAUS function: if user has ANY access, they can see all programmes' answers
 */
const hasAnyAccess = user => {
  const { access } = user
  const accessibleProgrammes = Object.keys(access)
  return accessibleProgrammes.length > 0
}

const getAll = async (_req, res) => {
  try {
    const data = await db.answer.findAll({})
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

// getting all temp answers user has access to from every year
const getAllTempUserHasAccessTo = async (req, res) => {
  try {
    // admin route
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.tempAnswer.findAll({
        // where: {
        //   year: await whereDraftYear(),
        // },
      })
      return res.send(data)
    }

    const finalCommitee = ['UNI', 'UNI_EN', 'UNI_SE']

    // normal user route
    const awaitYear = await whereDraftYear()
    const anyAccess = hasAnyAccess(req.user)
    const data = await db.tempAnswer.findAll({
      where: {
        // year: awaitYear,
        [Op.or]: [
          { programme: Object.keys(req.user.access).concat(finalCommitee) },
          anyAccess
            ? { form: [formKeys.YEARLY_ASSESSMENT, formKeys.EVALUATION_PROGRAMMES, formKeys.FACULTY_MONITORING] }
            : {},
        ],
      },
    })
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getFacultyTempAnswersAfterDeadline = async (req, res) => {
  const { form, year } = req.params

  try {
    const deadline = await db.deadline.findOne({ where: { form } })

    if (deadline) {
      return res.status(403).json({ error: 'Deadline is active, this should not be used' })
    }

    const data = await db.tempAnswer.findAll({
      where: {
        form,
        year,
      },
    })
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

/**
 * Note: programme may mean a single programme or a faculty (who fixed this? :D) -Joni
 */
const getSingleProgrammesAnswers = async (req, res) => {
  try {
    const { programme, form, year } = req.params
    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    let data = null

    /*
    start using these when 1.11 DL passed:

    const existingDeadlines = await db.deadline.findAll({ where: { form } })

    if (draftYear && draftYear === Number(year) && existingDeadlines.length > 0) {
    */

    if (draftYear && draftYear === Number(year)) {
      data = await db.tempAnswer.findOne({
        where: {
          programme,
          year: draftYear,
          form,
        },
      })
    } else {
      data = await db.answer.findOne({
        where: {
          programme,
          year,
          form,
        },
      })
    }

    const result = {
      ...data?.data,
      ready: data?.ready,
    }

    return res.send(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getIndividualFormAnswerForUser = async (req, res) => {
  try {
    const { uid } = req.user
    const deadline = await db.deadline.findOne({ where: { form: 3 } })
    let data = null
    if (deadline) {
      data = await db.tempAnswer.findOne({
        where: {
          programme: {
            [Op.startsWith]: uid,
          },
          form: formKeys.DEGREE_REFORM_INDIVIDUALS,
        },
        order: [['updated_at', 'DESC']],
      })

      if (!data) {
        const answer = {
          programme: uid,
          data: {},
          year: new Date().getFullYear(),
          form: 3,
          submittedBy: uid,
        }
        data = await db.tempAnswer.create(answer)
      }
    } else {
      data = await db.answer.findOne({
        where: {
          programme: {
            [Op.startsWith]: uid,
          },
          form: formKeys.DEGREE_REFORM_INDIVIDUALS,
        },
        order: [['updated_at', 'DESC']],
      })
    }
    const result = data?.data || {}
    const ready = data?.ready || false

    return res.status(200).json({ result, ready })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllIndividualAnswersForUser = async (req, res) => {
  try {
    const { uid } = req.user
    const data = await db.answer.findAll({
      where: {
        programme: {
          [Op.startsWith]: uid,
        },
        form: formKeys.DEGREE_REFORM_INDIVIDUALS,
      },
    })

    let result = {}
    if (data?.length > 0) {
      result = data[data.length - 1]
    }
    return res.status(200).json(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllUserHasAccessTo = async (req, res) => {
  try {
    let years = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
    if (!req.path.endsWith('/all')) {
      years = [new Date().getFullYear()]
    }

    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.answer.findAll({ where: { year: years } })
      return res.send(data)
    }

    const anyAccess = hasAnyAccess(req.user)

    // Access to answers where user has programme access & access to all yearly assessment form answers if user has any access. Wider access might be applied to other forms later

    const finalCommitee = ['UNI', 'UNI_EN', 'UNI_SE']

    const data = await db.answer.findAll({
      where: {
        [Op.or]: [
          { programme: Object.keys(req.user.access).concat(finalCommitee), year: years },
          anyAccess ? { year: years, form: formKeys.YEARLY_ASSESSMENT } : {},
        ],
      },
    })

    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getPreviousYear = async (req, res) => {
  const { programme, form } = req.params
  try {
    const data = await db.answer.findAll({
      limit: 1,
      where: {
        [Op.and]: [{ programme, form, year: (await whereDraftYear()) - 1 }],
      },
      order: [['createdAt', 'DESC']],
    })
    if (data.length === 0) return res.status(204).end()
    return res.send(data[0])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getFacultySummaryData = async (req, res) => {
  const { code, lang } = req.params
  if (!code) {
    throw new Error('No faculty defined')
  }
  try {
    const faculty = await db.faculty.findOne({ where: { code }, include: ['ownedProgrammes'] })
    const programmes = faculty.ownedProgrammes
    programmes.sort((a, b) => {
      return a?.name[lang].localeCompare(b?.name[lang])
    })

    const codes = programmes.map(p => p.key)

    const answers = await db.tempAnswer.findAll({
      where: {
        form: formKeys.EVALUATION_PROGRAMMES,
        year: 2023,
        programme: codes,
      },
    })

    return res.send({ programmes, answers })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getCommitteeSummaryData = async (req, res) => {
  const { code, lang } = req.params
  if (!code) {
    throw new Error('No faculty defined')
  }
  try {
    const faculty = await db.faculty.findAll({})
    const faculties = faculty.sort((a, b) => {
      return a?.name[lang].localeCompare(b?.name[lang])
    })

    const codes = faculties.map(p => p.code)

    const answers = await db.tempAnswer.findAll({
      where: {
        form: formKeys.EVALUATION_FACULTIES,
        year: 2023,
        programme: codes,
      },
    })

    return res.send({ faculties, answers })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getProgrammeSummaryData = async (req, res) => {
  const { code } = req.params
  if (!code) {
    throw new Error('No programme defined')
  }
  try {
    const years = [2019, 2020, 2021, 2022, 2023]

    const yearlyFormOpen = await db.deadline.findOne({ where: { form: 1 } })

    const answers = await db.answer.findAll({
      where: {
        form: formKeys.YEARLY_ASSESSMENT,
        year: years,
        programme: code,
      },
    })

    if (yearlyFormOpen) {
      const latestAnswers = await db.tempAnswer.findOne({
        where: {
          form: formKeys.YEARLY_ASSESSMENT,
          year: 2024,
          programme: code,
        },
      })
      answers.push(latestAnswers)
    } else {
      const areThereAnswersFor2024 = await db.answer.findOne({
        where: {
          form: formKeys.YEARLY_ASSESSMENT,
          year: 2024,
          programme: code,
        },
      })
      const latestAnswers = await db.answer.findOne({
        where: {
          form: 1,
          year: areThereAnswersFor2024 ? 2024 : 2023,
          programme: code,
        },
      })
      answers.push(latestAnswers)
    }
    return res.send({ answers })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getOldFacultySummaryData = async (req, res) => {
  const { code, lang } = req.params
  if (!code) {
    throw new Error('No programme defined')
  }
  try {
    const faculty = await db.faculty.findOne({ where: { code }, include: ['ownedProgrammes'] })
    const programmes = faculty.ownedProgrammes
    programmes.sort((a, b) => {
      return a?.name[lang].localeCompare(b?.name[lang])
    })
    const years = [2019, 2020, 2021, 2022, 2023]
    const codes = programmes.map(p => p.key)
    const answers = await db.answer.findAll({
      where: {
        form: formKeys.YEARLY_ASSESSMENT,
        year: years,
        programme: codes,
      },
    })

    const yearlyFormOpen = await db.deadline.findOne({ where: { form: 1 } })

    if (yearlyFormOpen) {
      const latestAnswers = await db.tempAnswer.findOne({
        where: {
          form: formKeys.YEARLY_ASSESSMENT,
          year: 2024,
          programme: codes,
        },
      })
      answers.push(latestAnswers)
    } else {
      const latestAnswers = await db.answer.findOne({
        where: {
          form: formKeys.YEARLY_ASSESSMENT,
          year: 2023,
          programme: codes,
        },
      })
      answers.push(latestAnswers)
    }
    return res.send({ answers })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getEvaluationSummaryDataForFaculty = async (req, res) => {
  const { code, lang } = req.params
  if (!code) {
    throw new Error('No programme defined')
  }
  try {
    const faculty = await db.faculty.findOne({ where: { code }, include: ['ownedProgrammes'] })
    const programmes = faculty.ownedProgrammes
    programmes.sort((a, b) => {
      return a?.name[lang].localeCompare(b?.name[lang])
    })
    const codes = programmes.map(p => p.key)
    let answers = []

    const yearlyFormOpen = await db.deadline.findOne({ where: { form: 4 } })

    if (yearlyFormOpen) {
      const latestAnswers = await db.tempAnswer.findAll({
        where: {
          form: formKeys.EVALUATION_PROGRAMMES,
          year: 2024,
          programme: codes,
        },
      })
      answers = answers.concat(latestAnswers)
    } else {
      const latestAnswers = await db.answer.findAll({
        where: {
          form: formKeys.EVALUATION_PROGRAMMES,
          year: 2023,
          programme: codes,
        },
      })
      answers = answers.concat(latestAnswers)
    }
    return res.send({ answers })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateAnswerReady = async (req, res) => {
  const { programme, form, year } = req.params
  const { ready } = req.body
  if (!form || !year || !programme) return res.sendStatus(400)

  try {
    const tempAnswer = await db.tempAnswer.findOne({
      where: {
        programme,
        form,
        year,
      },
    })

    tempAnswer.ready = Boolean(ready)
    await tempAnswer.save()
    return res.send(tempAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const updateIndividualReady = async (req, res) => {
  const { uid } = req.params
  const { ready } = req.body
  if (!uid) return res.sendStatus(400)

  try {
    const tempAnswer = await db.tempAnswer.findOne({
      where: {
        programme: uid,
        form: 3,
      },
    })

    tempAnswer.ready = Boolean(ready)
    await tempAnswer.save()
    return res.send(tempAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const removeBackupForIndividual = async uid => {
  try {
    await db.backupAnswer.destroy({
      where: {
        [Op.and]: [{ programme: uid }, { form: formKeys.DEGREE_REFORM_INDIVIDUALS }],
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const clearTempForIndividual = async uid => {
  try {
    await db.tempAnswer.update(
      { data: {} },
      {
        where: {
          [Op.and]: [{ programme: uid }, { form: formKeys.DEGREE_REFORM_INDIVIDUALS }],
        },
      },
    )
    logger.info(`Cleared temp answer for current user`)
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const postIndividualFormAnswer = async (req, res) => {
  const { data } = req.body
  const { uid } = req.user
  let previousAnswers = []

  const allAnswers = await db.answer.findAll({
    where: {
      programme: {
        [Op.startsWith]: uid,
      },
      form: formKeys.DEGREE_REFORM_INDIVIDUALS,
    },
  })

  previousAnswers = previousAnswers.concat(allAnswers)

  try {
    const answer = {
      programme: `${uid}-${previousAnswers.length}`,
      data,
      year: new Date().getFullYear(),
      form: 3,
      submittedBy: uid,
    }
    const savedAnswer = await db.answer.create(answer)
    if (savedAnswer) {
      await removeBackupForIndividual(uid)
      await clearTempForIndividual(uid)
    }
    return res.status(200).json(savedAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const postIndividualFormPartialAnswer = async (req, res) => {
  const { data } = req.body
  const { uid } = req.user

  let answers = await db.tempAnswer.findOne({
    where: {
      programme: uid,
      form: formKeys.DEGREE_REFORM_INDIVIDUALS,
    },
  })
  try {
    const previousData = answers.data

    const updatedData = { ...previousData, [data.field]: data.value }

    answers.data = updatedData

    await answers.save()

    answers = await db.tempAnswer.findOne({
      where: {
        programme: uid,
        form: formKeys.DEGREE_REFORM_INDIVIDUALS,
      },
    })

    return res.status(200).json(answers)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getDataFromFinnishUniForm = async (req, res) => {
  try {
    const { year } = req.params
    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    let data = null

    if (draftYear && draftYear === Number(year)) {
      data = await db.tempAnswer.findOne({
        where: {
          programme: 'UNI',
          year: draftYear,
          form: 6,
        },
      })
    } else {
      data = await db.answer.findOne({
        where: {
          programme: 'UNI',
          year,
          form: 6,
        },
      })
    }
    return res.send({ data: data.data })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getFacultyTempAnswersByForm = async (req, res) => {
  const { form } = req.params

  try {
    const data = await db.tempAnswer.findAll({
      where: {
        form,
      },
    })
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}


export default {
  getAll,
  getPreviousYear,
  getAllTempUserHasAccessTo,
  getIndividualFormAnswerForUser,
  getAllUserHasAccessTo,
  getSingleProgrammesAnswers,
  postIndividualFormAnswer,
  postIndividualFormPartialAnswer,
  getAllIndividualAnswersForUser,
  getFacultySummaryData,
  getProgrammeSummaryData,
  getOldFacultySummaryData,
  getEvaluationSummaryDataForFaculty,
  updateAnswerReady,
  updateIndividualReady,
  getCommitteeSummaryData,
  getFacultyTempAnswersAfterDeadline,
  getDataFromFinnishUniForm,
  getFacultyTempAnswersByForm,
}
