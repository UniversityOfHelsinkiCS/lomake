const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const createDraftAnswers = async (newYear, form) => {
  logger.info(`Creating draft answers from the year ${newYear} for form ${form}`)
  const programmes = await db.studyprogramme.findAll({})

  // Save the current tempanswers as answers
  programmes.forEach(async programme => {
    const { key } = programme

    const answers = await db.answer.findOne({
      where: {
        [Op.and]: [{ programme: key }, { year: newYear }, { form }],
      },
    })
    const acualAnswers = answers ? answers.data : {}

    const tempAnswer = await db.tempAnswer.findOne({
      where: {
        [Op.and]: [{ programme: key }, { year: newYear }, { form }],
      },
    })
    if (tempAnswer) {
      tempAnswer.data = acualAnswers
      await tempAnswer.save()
    } else {
      await db.tempAnswer.create({
        data: acualAnswers,
        programme: key,
        year: newYear,
        form,
      })
    }
  })
  logger.info(`Draft answers created`)
}

const createFinalAnswers = async (newYear, form) => {
  logger.info(`Creating final answers for the year ${newYear} for form ${form}`)
  const programmes = await db.studyprogramme.findAll({})

  programmes.forEach(async programme => {
    const { key } = programme

    const tempAnswer = await db.tempAnswer.findOne({
      where: {
        [Op.and]: [{ programme: key }, { year: newYear }, { form }],
      },
    })

    const acualAnswers = tempAnswer ? tempAnswer.data : {}

    const answer = await db.answer.findOne({
      where: {
        [Op.and]: [{ programme: key }, { year: newYear }, { form }],
      },
    })

    if (answer) {
      answer.data = acualAnswers
      await answer.save()
    } else {
      await db.answer.create({
        data: acualAnswers,
        programme: key,
        year: newYear,
        form,
      })
    }
  })
}

module.exports = { createDraftAnswers, createFinalAnswers }
