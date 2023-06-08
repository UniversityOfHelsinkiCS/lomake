const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')
const { whereDraftYear, isAdmin, isSuperAdmin } = require('@util/common')
const { formKeys } = require('@root/config/data')

/**
 * The LINJAUS function: if user has ANY access, they can see all programmes' answers
 */
const hasAnyAccess = user => {
  const { access } = user
  const accessibleProgrammes = Object.keys(access)
  return accessibleProgrammes.length > 0
}

const getAll = async (_, res) => {
  try {
    const data = await db.answer.findAll({})
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllTempUserHasAccessTo = async (req, res) => {
  try {
    // admin route
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.tempAnswer.findAll({
        where: {
          year: await whereDraftYear(),
        },
      })
      return res.send(data)
    }

    // normal user route
    const anyAccess = hasAnyAccess(req.user)
    const data = await db.tempAnswer.findAll({
      where: {
        year: await whereDraftYear(),
        [Op.or]: [{ programme: Object.keys(req.user.access) }, anyAccess ? { form: formKeys.YEARLY_ASSESSMENT } : {}],
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

const getIndividualFormAnswers = async (req, res) => {
  try {
    // if (isAdmin(req.user) || isSuperAdmin(req.user)) {
    //   const data = await db.answer.findAll({ where: { form: 3 } })
    //   return res.status(200).json(data)
    // }
    const { uid } = req.user
    const data = await db.answer.findOne({
      where: {
        programme: uid,
        form: formKeys.DEGREE_REFORM_INDIVIDUALS,
      },
    })

    const result = data?.data || {}

    return res.send(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllUserHasAccessTo = async (req, res) => {
  try {
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.answer.findAll({})
      return res.send(data)
    }

    const anyAccess = hasAnyAccess(req.user)

    // Access to answers where user has programme access & access to all yearly assessment form answers if user has any access. Wider access might be applied to other forms later
    const data = await db.answer.findAll({
      where: {
        [Op.or]: [{ programme: Object.keys(req.user.access) }, anyAccess ? { form: formKeys.YEARLY_ASSESSMENT } : {}],
      },
    })

    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getOne = async (req, res) => {
  try {
    const data = await db.answer.findAll({
      limit: 1,
      where: {
        programme: req.params.programme,
      },
      order: [['createdAt', 'DESC']],
    })
    return res.send(data[0])
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

const create = async (req, res) => {
  try {
    const answer = {
      programme: req.body.room,
      data: req.body.data,
      year: new Date().getFullYear(),
      submittedBy: req.user.uid,
    }
    const savedAnswer = await db.answer.create(answer)
    return res.send(savedAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const bulkCreate = async (req, res) => {
  if (!process.env.BULK_INSERT_TOKEN || req.headers.token !== process.env.BULK_INSERT_TOKEN)
    return res.status(404).send('Not found.').end()
  try {
    const answers = req.body
    answers.forEach(answer => db.answer.create(answer))
    return res.send('ok')
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

const getProgrammeSummaryData = async (req, res) => {
  const { code } = req.params
  if (!code) {
    throw new Error('No programme defined')
  }
  try {
    const years = [2019, 2020, 2021, 2022]

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
          year: 2023,
          programme: code,
        },
      })
      answers.push(latestAnswers)
    } else {
      const latestAnswers = await db.answer.findOne({
        where: {
          form: 1,
          year: 2023,
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
    const years = [2019, 2020, 2021, 2022]
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
          year: 2023,
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
          year: 2023,
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

module.exports = {
  getAll,
  create,
  getOne,
  getPreviousYear,
  bulkCreate,
  getAllTempUserHasAccessTo,
  getIndividualFormAnswers,
  getAllUserHasAccessTo,
  getSingleProgrammesAnswers,
  getFacultySummaryData,
  getProgrammeSummaryData,
  getOldFacultySummaryData,
  getEvaluationSummaryDataForFaculty,
  updateAnswerReady,
}
