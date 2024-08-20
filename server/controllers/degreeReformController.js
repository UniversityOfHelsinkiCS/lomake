const { Op } = require('sequelize')
const db = require('../models/index')
const logger = require('../util/logger')

const getAnswersFromDb = async () => {
  const existingDeadline = await db.deadline.findOne({
    where: { form: 3 },
  })

  const query = {
    attributes: existingDeadline ? ['id', 'data', 'year', 'ready'] : ['id', 'data', 'year'],
    where: {
      form: 3,
      programme: {
        [Op.not]: '',
      },
      createdAt: {
        [Op.between]: [new Date('2023-10-29'), new Date('2023-11-01')],
      },
    },
  }

  return existingDeadline ? db.tempAnswer.findAll(query) : db.answer.findAll(query)
}

const getAllTemp = async (_, res) => {
  try {
    const data = await getAnswersFromDb()
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getForFaculty = async (req, res) => {
  const { faculty } = req.params

  try {
    const data = await getAnswersFromDb()

    const dataByFaculty = data.filter(d => {
      return d.data?.background_unit === `faculty_-_${faculty}`
    })

    return res.send(dataByFaculty)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getForUniversity = async (req, res) => {
  let { dropdownFilter } = req.params
  try {
    const data = await getAnswersFromDb()
    if (dropdownFilter === 'UNI') {
      return res.send(data)
    }
    dropdownFilter = dropdownFilter.split(',')
    const dataByFaculty = data.filter(d => {
      const backgroundUnit = d.data?.background_unit
      if (!backgroundUnit) return false
      return dropdownFilter.some(f => backgroundUnit.includes(`faculty_-_${f}`))
    })

    return res.send(dataByFaculty)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAllTemp,
  getForFaculty,
  getForUniversity,
}
