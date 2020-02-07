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

const create = async (req, res) => {
  try {
    const answer = {
      programme: req.body.room,
      data: req.body.data,
      year: new Date().getFullYear()
    }
    const savedAnswer = await db.answer.create(answer)
    res.status(200).json(savedAnswer)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  create
}
