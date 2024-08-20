/* eslint-disable no-console */
const { Op } = require('sequelize')
const db = require('../models/index')
const logger = require('../util/logger')
const { formKeys, committeeList } = require('../../config/data')

const handleNonProgrammeDraftAnswers = async form => {
  // here programme contains actually an uid

  const allAnswers = await db.answer.findAll({
    where: {
      form,
    },
  })

  if (allAnswers) {
    allAnswers.forEach(async a => {
      const programmeCleaned = a.programme.split('-')
      let tempAnswer = null
      tempAnswer = await db.tempAnswer.findOne({
        where: {
          [Op.and]: [{ programme: { [Op.startsWith]: programmeCleaned[0] } }, { year: a.year }, { form }],
        },
      })
      if (tempAnswer) {
        tempAnswer.data = a?.data || {}
        tempAnswer.changed('data', true)
        await tempAnswer.save()
      } else {
        await db.tempAnswer.create({
          data: a.data,
          programme: programmeCleaned[0],
          year: a.year,
          form,
        })
      }
    })
  }
}

const handleNonProgrammeFinalAnswers = async form => {
  // here programme contains actually a faculty code
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

const handleIndividualFinalAnswers = async form => {
  // here programme contains actually a uid
  const allTempAnswers = await db.tempAnswer.findAll({
    where: {
      form,
    },
  })

  if (allTempAnswers) {
    allTempAnswers.forEach(async temp => {
      let previousAnswers = []
      const programmeCleaned = temp.programme.split('-')[0]

      const allAnswers = await db.answer.findAll({
        where: {
          programme: {
            [Op.startsWith]: programmeCleaned,
          },
          form: formKeys.DEGREE_REFORM_INDIVIDUALS,
        },
      })
      previousAnswers = previousAnswers.concat(allAnswers)

      await db.answer.create({
        data: temp.data,
        programme: `${programmeCleaned}-${previousAnswers.length}`,
        year: temp.year,
        form,
      })
    })
  }
}

const createDraftAnswers = async (newYear, form) => {
  logger.info(`Creating draft answers from the year ${newYear} for form ${form}`)

  if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    await handleNonProgrammeDraftAnswers(form)
  } else {
    let toOpen = []

    if (form === formKeys.EVALUATION_FACULTIES) {
      toOpen = await db.faculty.findAll({})
    } else if (form === formKeys.EVALUATION_COMMTTEES) {
      toOpen = committeeList
    } else {
      toOpen = await db.studyprogramme.findAll({})
    }

    // Save the current answers as tempanswers
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

  if (form === formKeys.EVALUATION_FACULTIES) {
    await handleNonProgrammeFinalAnswers(form)
  }
  if (form === formKeys.EVALUATION_COMMTTEES) {
    await handleNonProgrammeFinalAnswers(form)
  } else if (form === formKeys.DEGREE_REFORM_INDIVIDUALS) {
    await handleIndividualFinalAnswers(form)
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
