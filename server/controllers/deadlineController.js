const db = require('@models/index')
const logger = require('@util/logger')

const createOrUpdate = async (req, res) => {
  try {
    // Unlock all programmes
    const programmes = await db.studyprogramme.findAll({})
    for (const programme of programmes) {
      programme.locked = false
      await programme.save()
    }

    const existingDeadlines = await db.deadline.findAll({})
    // Create new deadline entity
    if (existingDeadlines.length === 0) {
      const newDeadline = await db.deadline.create({
        date: req.body.date,
      })
      return res.status(200).json(newDeadline)
    }

    // Update existing deadline entity
    existingDeadlines[0].date = req.body.date
    await existingDeadlines[0].save()
    return res.status(200).json(existingDeadlines[0])
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const remove = async (req, res) => {
  try {
    // Just delete all deadlines, there should be only 1 anyway.
    await db.deadline.destroy({
      truncate: true,
    })

    // Then lock all programmes.
    const programmes = await db.studyprogramme.findAll({})
    programmes.forEach(async programme => {
      programme.locked = true
      await programme.save()
    })

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const get = async (req, res) => {
  try {
    const deadline = await db.deadline.findAll({})

    if (deadline.length === 0) {
      return res.status(200).json(null)
    }

    return res.status(200).json(deadline[0])
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
