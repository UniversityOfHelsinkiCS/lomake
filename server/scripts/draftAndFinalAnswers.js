const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const handleNonProgrammeDraftAnswers = async form => {
  // here programme contains actually an uid

  const allAnswers = await db.answer.findAll({
    where: {
      form,
    },
  })

  if (allAnswers) {
    allAnswers.forEach(async a => {
      const tempAnswer = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme: a.programme }, { year: a.year }, { form }],
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
          form,
        })
      }
    })
  }
}

const handleNonProgrammeFinalAnswers = async form => {
  // here programme contains actually an uid or faculty code
  const allTempAnswers = await db.tempAnswer.findAll({
    where: {
      form,
    },
  })

  if (allTempAnswers) {
    allTempAnswers.forEach(async temp => {
      const answer = await db.answer.findOne({
        where: {
          [Op.and]: [{ programme: temp.programme }, { year: temp.year }, { form }],
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
          form,
        })
      }
    })
  }
}

const createDraftAnswers = async (newYear, form) => {
  logger.info(`Creating draft answers from the year ${newYear} for form ${form}`)

  if (form === 3) {
    await handleNonProgrammeDraftAnswers(form)
  } else {
    let toOpen = []

    if (form === 5) {
      toOpen = await db.faculty.findAll({})
    } else {
      toOpen = await db.studyprogramme.findAll({})
    }
    // const programmes = await db.studyprogramme.findAll({})

    // Save the current tempanswers as answers
    toOpen.forEach(async obj => {
      const key = obj?.key || obj?.code

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

  if (form === 3 || form === 5) {
    await handleNonProgrammeFinalAnswers(form)
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
