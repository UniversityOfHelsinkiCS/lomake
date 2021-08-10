const db = require('@models/index')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const data = await db.answer.findAll({})
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getAllTemp = async (req, res) => {
  try {
    const data = await db.tempAnswer.findAll({})
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getAllTempUserHasAccessTo = async (req, res) => {
  try {
    if (req.user.hasWideReadAccess) {
      const data = await db.tempAnswer.findAll({})
      return res.status(200).json(data)
    } else {
      const data = await db.tempAnswer.findAll({
        where: {
          programme: Object.keys(req.user.access),
        },
      })
      return res.status(200).json(data)
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getSingleTempAnswers = async (req, res) => {
  try {
    const data = await db.tempAnswer.findOne({
      where: {
        programme: req.params.programme,
      },
    })

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
    } else {
      const access = req.user.access
      const data = await db.answer.findAll({
        where: {
          programme: Object.keys(access),
        },
      })

      // If the programme access has a year-limit on answers
      // filter out the ones, that are before that time
      const yearFilter = (answer, access) => access[answer.programme].year 
        ? answer.year >= access[answer.programme].year 
        : true

      const filteredAnswers = data.filter((answer) => yearFilter(answer, access))
      return res.status(200).json(filteredAnswers)
    }
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
    answers.forEach((answer) => db.answer.create(answer))
    return res.status(200).send('ok').end()
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  getAllTemp,
  create,
  getOne,
  getPreviousYear,
  bulkCreate,
  getAllTempUserHasAccessTo,
  getAllUserHasAccessTo,
  getSingleTempAnswers,
}
