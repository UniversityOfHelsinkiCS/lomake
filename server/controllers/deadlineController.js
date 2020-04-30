const db = require('@models/index')
const logger = require('@util/logger')

const createOrUpdate = async (req, res) => {
  try {
    const deadlineDate = new Date(req.body.date + 'UTC')
    const existingDeadlines = await db.deadline.findAll({})

    // Unlock all programmes
    const programmes = await db.studyprogramme.findAll({})
    programmes.forEach(async (programme) => {
      programme.locked = false
      await programme.save()
    })

    if (existingDeadlines.length === 0) {
      // Create new deadline entity
      const newDeadline = await db.deadline.create({
        date: deadlineDate,
        passed: false,
      })

      return res.status(200).json(newDeadline)
    } else {
      // Update existing deadline entity
      existingDeadlines[0].date = deadlineDate
      await existingDeadlines[0].save()
      return res.status(200).json(existingDeadlines[0])
    }
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
    programmes.forEach(async (programme) => {
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
