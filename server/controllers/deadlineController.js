const db = require('@models/index')
const logger = require('@util/logger')

const { createDraftAnswers, createFinalAnswers } = require('../scripts/draftAndFinalAnswers')

const createOrUpdate = async (req, res) => {
  const { deadline, draftYear, form } = req.body

  if (!deadline || !draftYear || !form) {
    throw new Error('No deadline, draft year or form defined')
  }

  try {
    // Unlock all programmes
    await db.studyprogramme.update({ locked: false }, { where: {} })

    // Create new or update old deadline for a specific form
    let newDeadline = null
    const existingDeadline = await db.deadline.findOne({
      where: { form },
    })

    if (!existingDeadline) {
      newDeadline = await db.deadline.create({
        date: deadline,
        form,
      })
    } else {
      existingDeadline.date = deadline
      newDeadline = await existingDeadline.save()
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

    await createDraftAnswers(draftYear, form)
    return res.status(200).json({ deadline: newDeadline, draftYear: newDraftYear, form })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const remove = async (req, res) => {
  const { form } = req.body

  if (!form) {
    throw new Error('No form defined')
  }

  try {
    const existingDeadline = await db.deadline.findOne({
      where: { form },
    })
    if (!existingDeadline) {
      return res.status(404).json({ error: 'Deadline not found' })
    }

    await existingDeadline.destroy()

    // Destroy draftYear and lock programmes if no other deadlines remain
    const draftYears = await db.draftYear.findAll({})
    const allDeadlines = await db.deadline.findAll({})

    if (allDeadlines.length === 0) {
      await db.studyprogramme.update({ locked: true }, { where: {} })
      await db.draftYear.destroy({
        truncate: true,
      })
    }

    await createFinalAnswers(draftYears[0].year, form)
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
