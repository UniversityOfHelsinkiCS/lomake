const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')
const { whereDraftYear } = require('@util/common')

const getAll = async (req, res) => {
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
    if (req.user.hasWideReadAccess) {
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
    res.status(500).json({ error: 'Database error' })
  }
}

const getSingleProgrammesAnswers = async (req, res) => {
  try {
    const { programme, year } = req.params
    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    let data = null

    if (draftYear === year) {
      data = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme, year: await whereDraftYear() }],
        },
      })
    } else {
      data = await db.answer.findOne({
        where: {
          [Op.and]: [{ programme, year }],
        },
      })
    }

    const result = data ? data.data : {}

    return res.status(200).json(result)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getAllUserHasAccessTo = async (req, res) => {
  try {
    if (req.user.hasWideReadAccess) {
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
    res.status(500).json({ error: 'Database error' })
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
    res.status(200).json(data[0])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getPreviousYear = async (req, res) => {
  try {
    const data = await db.answer.findAll({
      limit: 1,
      where: {
        programme: req.params.programme, // Might have to switch to some kind of id, not sure how well full string works with urls.
        year: new Date().getFullYear() - 1,
      },
      order: [['createdAt', 'DESC']],
    })
    if (data.length === 0) return res.status(204).end()
    res.status(200).json(data[0])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
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
    res.status(200).json(savedAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
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
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  create,
  getOne,
  getPreviousYear,
  bulkCreate,
  getAllTempUserHasAccessTo,
  getAllUserHasAccessTo,
  getSingleProgrammesAnswers,
}
