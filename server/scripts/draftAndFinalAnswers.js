const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const handleIndividualDegreeDraftAnswers = async () => {
  // here programme contains actually an uid

  const allAnswers = await db.answer.findAll({
    where: {
      form: 3,
    },
  })

  if (allAnswers) {
    allAnswers.forEach(async a => {
      const tempAnswer = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme: a.programme }, { year: a.year }, { form: 3 }],
        },
      })
      if (tempAnswer) {
        tempAnswer.data = a?.data || {}
        await tempAnswer.save()
      } else {
        await db.tempAnswer.create({
          data: a.data,
          programme: a.programme,
          year: a.year,
          form: 3,
        })
      }
    })
  }
}

const handleIndividualDegreeFinalAnswers = async () => {
  // here programme contains actually an uid
  const allTempAnswers = await db.tempAnswer.findAll({
    where: {
      form: 3,
    },
  })

  if (allTempAnswers) {
    allTempAnswers.forEach(async temp => {
      const answer = await db.answer.findOne({
        where: {
          [Op.and]: [{ programme: temp.programme }, { year: temp.year }, { form: 3 }],
        },
      })
      if (answer) {
        answer.data = temp?.data || {}
        await answer.save()
      } else {
        await db.answer.create({
          data: temp.data,
          programme: temp.programme,
          year: temp.year,
          form: 3,
        })
      }
    })
  }
}

const createDraftAnswers = async (newYear, form) => {
  logger.info(`Creating draft answers from the year ${newYear} for form ${form}`)

  if (form === 3) {
    await handleIndividualDegreeDraftAnswers()
  } else {
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
  }

  logger.info(`Draft answers created`)
}

const createFinalAnswers = async (newYear, form) => {
  logger.info(`Creating final answers for the year ${newYear} for form ${form}`)

  if (form === 3) {
    await handleIndividualDegreeFinalAnswers()
  } else {
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
}

module.exports = { createDraftAnswers, createFinalAnswers }
