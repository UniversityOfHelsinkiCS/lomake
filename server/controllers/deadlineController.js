const db = require('@models/index')
const logger = require('@util/logger')

const { createDraftAnswers, createFinalAnswers } = require('../scripts/draftAndFinalAnswers')

const createOrUpdate = async (req, res) => {
  const { deadline, draftYear, form } = req.body

  if (!deadline || !draftYear || !form) {
    throw new Error('No deadline, draft or form year defined')
  }

  try {
    // Unlock all programmes
    await db.studyprogramme.update({ locked: false }, { where: {} })

    // Create new or update old deadline
    let newDeadline = null
    const existingDeadlines = await db.deadline.findAll({ where: { form } })
    if (existingDeadlines.length === 0) {
      newDeadline = await db.deadline.create({
        date: deadline,
        form,
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

    await createDraftAnswers(draftYear, form)
    return res.status(200).json({ deadline: newDeadline, draftYear: newDraftYear })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const remove = async (req, res) => {
  const { form } = req.body

  if (!form) {
    throw new Error('No form type defined')
  }
  try {
    const existingDeadline = await db.deadline.findOne({
      where: { form },
    })
    if (!existingDeadline) {
      return res.status(404).json({ error: 'Deadline not found' })
    }
    await existingDeadline.destroy()

    const draftYears = await db.draftYear.findAll({})
    let draftYearToReturn = draftYears[0]

    // Unlock all programmes and remove draft year if no deadlines remain
    const existingDeadlines = await db.deadline.findAll({})
    if (existingDeadlines.length === 0) {
      await db.studyprogramme.update({ locked: true }, { where: {} })
      await db.draftYear.destroy({
        truncate: true,
      })
      draftYearToReturn = null
    }

    await createFinalAnswers(draftYears[0].year, form)
    return res.status(200).json({ deadline: null, draftYear: draftYearToReturn })
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const get = async (_, res) => {
  try {
    const deadlines = await db.deadline.findAll({})
    const draftYears = await db.draftYear.findAll({})
    const deadlineList = deadlines.length ? deadlines : null
    const draftYear = draftYears.length ? draftYears[0] : null

    return res.status(200).json({ deadlineList, draftYear })
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
