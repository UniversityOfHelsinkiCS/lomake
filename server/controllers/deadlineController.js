import db from '../models/index.js'
import logger from '../util/logger.js'
import { getFormType } from '../util/common.js'
import { createDraftAnswers, createFinalAnswers } from '../scripts/draftAndFinalAnswers.js'
import Studyprogramme from '../models/studyprogramme.js'

const createOrUpdate = async (req, res) => {
  const { deadline, draftYear, form } = req.body

  if (!deadline || !draftYear || !form) {
    throw new Error('No deadline, draft or form year defined')
  }

  try {
    if ([1, 2, 4].includes(form)) {
      // Unlock all programmes
      const formType = getFormType(form)
      const studyprogrammes = await Studyprogramme.findAll({})

      await studyprogrammes.forEach(async programme => {
        programme.lockedForms = { ...programme.lockedForms, [formType]: false }
        await programme.save()
      })

      // await Studyprogramme.update({ lockedForms: { [formType]: false } }, { where: {} })
    }

    // Create new or update old deadline
    const existingDeadlines = await db.deadline.findAll({ where: { form } })
    if (existingDeadlines.length === 0) {
      await db.deadline.create({
        date: deadline,
        form,
      })
    } else {
      existingDeadlines[0].date = deadline
      await existingDeadlines[0].save()
      const allDeadlines = await db.deadline.findAll({})
      return res.status(200).json({ deadline: allDeadlines })
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

    const allDeadlines = await db.deadline.findAll({})

    await createDraftAnswers(draftYear, form)

    return res.status(200).json({ deadline: allDeadlines, draftYear: newDraftYear })
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

    const remainingDeadlines = await db.deadline.findAll({})
    let deadlinesToReturn = remainingDeadlines

    // Unlock all programmes and remove draft year if no deadlines remain
    if (remainingDeadlines.length === 0) {
      await Studyprogramme.update(
        { lockedForms: { evaluation: true, yearly: true, 'degree-reform': true } },
        { where: {} },
      )
      await db.draftYear.destroy({
        truncate: true,
      })
      draftYearToReturn = null
      deadlinesToReturn = null
    }

    await createFinalAnswers(draftYears[0].year, form)
    return res.status(200).json({ deadline: deadlinesToReturn, draftYear: draftYearToReturn })
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

export default { createOrUpdate, remove, get }
