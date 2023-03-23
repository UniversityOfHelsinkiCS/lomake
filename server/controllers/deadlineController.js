const db = require('@models/index')
const logger = require('@util/logger')

const { createDraftAnswers, createFinalAnswers } = require('../scripts/draftAndFinalAnswers')

const createOrUpdate = async (req, res) => {
  const { deadline, draftYear } = req.body

  if (!deadline || !draftYear) {
    throw new Error('No deadline or draft year defined')
  }

  try {
    // Unlock all programmes
    await db.studyprogramme.update({ locked: false }, { where: {} })

    // Create new or update old deadline
    let newDeadline = null
    const existingDeadlines = await db.deadline.findAll({})
    if (existingDeadlines.length === 0) {
      newDeadline = await db.deadline.create({
        date: deadline,
      })
    } else {
      existingDeadlines[0].date = deadline
      newDeadline = await existingDeadlines[0].save()
    }

    // Create new or update old draft year
    let newDraftYear = null
    const existingDraftYears = await db.draftYear.findAll({})
    if (existingDraftYears.length === 0) {
      newDraftYear = await db.draftYear.create({
        year: draftYear,
      })
    } else {
      existingDraftYears[0].year = draftYear
      newDraftYear = await existingDraftYears[0].save()
    }

    await createDraftAnswers(draftYear)
    return res.status(200).json({ deadline: newDeadline, draftYear: newDraftYear })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const remove = async (_, res) => {
  try {
    // Just delete all deadlines, there should be only 1 anyway.
    await db.deadline.destroy({
      truncate: true,
    })

    // Unlock all programmes
    await db.studyprogramme.update({ locked: true }, { where: {} })

    const draftYears = await db.draftYear.findAll({})
    await db.draftYear.destroy({
      truncate: true,
    })

    await createFinalAnswers(draftYears[0].year)
    return res.status(200).json({ deadline: null, draftYear: null })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const get = async (_, res) => {
  try {
    const deadlines = await db.deadline.findAll({})
    const draftYears = await db.draftYear.findAll({})
    const deadline = deadlines.length ? deadlines[0] : null
    const draftYear = draftYears.length ? draftYears[0] : null

    return res.status(200).json({ deadline, draftYear })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  createOrUpdate,
  remove,
  get,
}
