const db = require('@models/index')
const logger = require('@util/logger')

const getAll = async (req, res) => {
  try {
    const data = await db.deadline.findAll({
      where: {
        passed: false,
      },
    })
    res.status(200).json(data)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

/**
 * Creates a new deadline for specific date.
 */
const createOne = async (req, res) => {
  try {
    const { date } = req.body
    const actualDate = new Date(date + 'UTC')

    const isDublicate = await db.deadline.findOne({
      where: {
        date: actualDate,
      },
    })

    if (isDublicate) {
      return res.status(500).json({ error: 'Deadline for this date already exists.' })
    }

    const unpassedDeadlineCount = await db.deadline.count({
      where: {
        passed: false,
      },
    })

    if (unpassedDeadlineCount === 0) {
      // Unlock forms
      const programmes = await db.studyprogramme.findAll()
      programmes.forEach(async (programme) => {
        programme.locked = false
        await programme.save()
      })

      // Clear answers
      await db.tempAnswer.destroy({
        where: {},
        truncate: true,
      })
    }

    const newDeadline = await db.deadline.create({
      date: actualDate,
      passed: false,
    })

    logger.info(`User ${req.user.uid} created a new deadline ${date}`)

    return res.status(200).json(newDeadline)
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const getNextDeadline = async (req, res) => {
  try {
    const nextDeadline = await db.deadline.findAll({
      limit: 1,
      where: {
        passed: false,
      },
      order: [['date', 'ASC']],
    })

    if (nextDeadline.length > 0) {
      return res.status(200).json(nextDeadline)
    } else {
      return res.status(200).json(null)
    }
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

const deleteOne = async (req, res) => {
  try {
    const deadline = await db.deadline.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!deadline) {
      res.status(500).json({ error: 'Deadline you tried to delete did not exist.' })
    }

    const deletedId = deadline.id

    await deadline.destroy()

    // Check if theres any open deadlines remaining, incase this was the last one that was supposed to upcoming
    // If thats the case, need to lock all the forms.
    const currentUnpassedDeadlines = await db.deadline.findAll({
      where: {
        passed: false,
      },
    })

    if (currentUnpassedDeadlines.length === 0) {
      const programmes = await db.studyprogramme.findAll()
      programmes.forEach(async (programme) => {
        programme.locked = true
        await programme.save()
      })
    }

    res.status(200).json({ id: deletedId })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getAll,
  createOne,
  getNextDeadline,
  deleteOne,
}
