const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')
const { whereDraftYear, isAdmin, isSuperAdmin } = require('@util/common')

const getAll = async (_, res) => {
  try {
    const data = await db.answer.findAll({})
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getAllTempUserHasAccessTo = async (req, res) => {
  try {
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.tempAnswer.findAll({
        where: {
          year: await whereDraftYear(),
        },
      })
      return res.status(200).json(data)
    }
    const { access } = req.user
    const now = new Date()
    const data = await db.tempAnswer.findAll({
      where: {
        [Op.and]: [{ programme: Object.keys(req.user.access) }, { year: await whereDraftYear() }],
      },
    })
    // If the programme access has a year-limit on answers
    // filter out the ones, that are before that time
    const yearFilter = (answer, access) =>
      access[answer.programme].year ? now.getFullYear() === access[answer.programme].year : true

    const filteredAnswers = data.filter(answer => yearFilter(answer, access))
    return res.status(200).json(filteredAnswers)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getSingleProgrammesAnswers = async (req, res) => {
  try {
    const { programme, form, year } = req.params
    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    let data = null
    // TO FIX comparing number to string = never happens
    // How does everything still work?
    if (draftYear && draftYear === year) {
      data = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme, year: draftYear, form }],
        },
      })
    } else {
      data = await db.answer.findOne({
        where: {
          [Op.and]: [{ programme, year, form }],
        },
      })
    }

    const result = data ? data.data : {}

    return res.status(200).json(result)
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
        form: 3,
      },
    })

    const result = data?.data || {}

    return res.status(200).json(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const postIndividualFormAnswer = async (req, res) => {
  try {
    const { uid } = req.user
    const { data, formNumber } = req.body
    const result = await db.answer.create({
      programme: uid,
      data,
      form: formNumber,
      year: new Date().getFullYear(),
      submittedBy: uid,
    })

    return res.status(200).json(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getAllAnswersForUser = async (req, res) => {
  try {
    const { uid } = req.user

    const data = await db.answer.findAll({
      where: {
        programme: uid,
        form: 3,
      },
    })

    let result = {}
    if (data?.length > 1) {
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
    if (isAdmin(req.user) || isSuperAdmin(req.user)) {
      const data = await db.answer.findAll({})
      return res.status(200).json(data)
    }
    const { access } = req.user
    const data = await db.answer.findAll({
      where: {
        programme: Object.keys(access),
      },
    })

    // If the programme access has a year-limit on answers
    // filter out the ones, that are before that time
    const yearFilter = (answer, access) =>
      access[answer.programme].year ? answer.year === access[answer.programme].year : true

    const filteredAnswers = data.filter(answer => yearFilter(answer, access))
    return res.status(200).json(filteredAnswers)
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
        programme: req.params.programme, // Might have to switch to some kind of id, not sure how well full string works with urls.
      },
      order: [['createdAt', 'DESC']],
    })
    return res.status(200).json(data[0])
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
    return res.status(200).json(data[0])
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
    return res.status(200).json(savedAnswer)
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
    return res.status(200).send('ok').end()
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
        form: 4,
        year: 2023,
        programme: codes,
      },
    })

    return res.status(200).json({ programmes, answers })
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
        form: 1,
        year: years,
        programme: code,
      },
    })

    if (yearlyFormOpen) {
      const latestAnswers = await db.tempAnswer.findOne({
        where: {
          form: 1,
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
    return res.status(200).json({ answers })
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
  postIndividualFormAnswer,
  getAllAnswersForUser,
  getFacultySummaryData,
  getProgrammeSummaryData,
}
