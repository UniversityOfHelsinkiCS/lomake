const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const getAllTemp = async (_, res) => {
  try {
    // TODO: get data also from db.answer
    const data = await db.tempAnswer.findAll({
      attributes: ['id', 'data', 'year', 'ready'],
      where: {
        form: 3,
        programme: {
          [Op.not]: '',
        },
      },
    })
    return res.send(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const getForFaculty = async (req, res) => {
  const { faculty } = req.params

  try {
    // TODO: get data also from db.answer, filtering by tdk in SQL?
    const data1 = await db.tempAnswer.findAll({
      attributes: ['id', 'data', 'year', 'ready'],
      where: {
        form: 3,
        programme: {
          [Op.not]: '',
        },
      },
    })

    const requiredFaculty = `faculty_-_${faculty}`

    const dataByFaculty = data1.filter(d => {
      return d.data?.background_unit === requiredFaculty
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
}
