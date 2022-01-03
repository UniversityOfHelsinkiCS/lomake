const db = require('@models/index')
const logger = require('@util/logger')

const createOrUpdate = async (req, res) => {
  try {
    const existingDraftYears = await db.draftYear.findAll({})
    // Create new deadline entity
    if (existingDraftYears.length === 0) {
      const newDraftYear = await db.draftYear.create({
        year: req.body.draftYear,
      })
      console.log({ newDraftYear })
      return res.status(200).json(newDraftYear.year)
    }

    // Update existing deadline entity
    existingDraftYears[0].year = req.body.draftYear
    await existingDraftYears[0].save()
    return res.status(200).json(existingDraftYears[0].year)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const remove = async (req, res) => {
  try {
    // Just delete all deadlines, there should be only 1 anyway.
    await db.draftYear.destroy({
      truncate: true,
    })
    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const get = async (req, res) => {
  try {
    const draftYears = await db.draftYear.findAll({})

    if (draftYears.length === 0) {
      return res.status(200).json(null)
    }

    return res.status(200).json(draftYears[0].year)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  createOrUpdate,
  remove,
  get,
}
