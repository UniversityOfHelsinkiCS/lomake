const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')
const { parseInt } = require('lodash')

const getQuestions = async (req, res) => {
  const { form, faculty } = req.params

  try {
    const data = await db.tempAnswer.findAll({
      where: {
        programme: faculty,
        form: parseInt(form, 10),
        data: {
          [Op.contains]: { show: true },
        },
      },
    })
    console.log(data) // Log the retrieved data
    return res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const setQuestions = (req, res) => {}

module.exports = { getQuestions, setQuestions }
