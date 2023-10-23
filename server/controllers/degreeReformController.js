const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

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

    const fieldsToRemove = [
      'degree_reform_free_answer_text',
      'major_and_minor_free_to_answer_text',
      'three_stairs_free_to_answer_text',
      'bachelor_free_answer_text',
      'masters_free_to_answer_text',
      'int_master_free_to_answer_text',
      'phd_free_to_answer_text',
      'studyprogramme_leading_free_to_answer_text',
      'faculties_common_free_to_answer_text',
      'general_free_to_answer_text',
    ]

    const mapper = obj => {
      // eslint-disable-next-line no-restricted-syntax
      for (const f of fieldsToRemove) {
        if (obj.data[f]) {
          obj.data[f] = undefined
        }
      }
      return obj
    }

    return res.send(dataByFaculty.map(mapper))
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAllTemp,
  getForFaculty,
}
