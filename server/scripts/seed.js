/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import xlsx from 'xlsx'
import path from 'path'
import db from '../models/index.js'
import KeyData from '../models/keyData.js'

import logger from '../util/logger.js'
import { data, facultyMap } from '../../config/data.js'

const seedFacultiesAndStudyprogrammes = async () => {
  await db.companionFaculty.destroy({ where: {} })
  await db.studyprogramme.destroy({ where: {} })
  await db.faculty.destroy({ where: {} })

  /**
   * Create faculties
   */
  for (const { code, name } of data) {
    await db.faculty.create({
      code,
      name,
    })
  }

  /**
   * Create studyprogrammes
   */
  for (const { code, programmes } of data) {
    const primaryFaculty = await db.faculty.findOne({ where: { code } })

    for (const { key, name, level, international } of programmes) {
      await db.studyprogramme.create({
        key,
        name,
        level,
        international,
        lockedForms: { yearly: false, 'degree-reform': false, evaluation: false, 'evaluation-faculty': false },
        claimed: false,
        primaryFacultyId: primaryFaculty.id,
      })
    }
  }

  /**
   * Create companionFaculties "kumppanuusohjelma"
   */

  for (const { programmes } of data) {
    for (const { key, companionFaculties } of programmes) {
      for (const faculty of companionFaculties) {
        const facultyCode = facultyMap[faculty]

        const facultyId = (
          await db.faculty.findOne({
            where: {
              code: facultyCode,
            },
          })
        ).id

        const studyprogrammeId = (
          await db.studyprogramme.findOne({
            where: {
              key,
            },
          })
        ).id

        await db.companionFaculty.create({
          facultyId,
          studyprogrammeId,
        })
      }
    }
  }
}

// for this you have to have a data.xlsx file in the root of the project
const seedKeyData = async () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  let workbook
  try {
    workbook = xlsx.readFile(path.resolve(__dirname, '../../data.xlsx'))
  } catch (error) {
    logger.error('Workbook not found:', error)
    return
  }

  const jsonSheet = {}

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)
    console.log(JSON.stringify(data, null, 2))
    jsonSheet[sheetName] = data
  })

  // logger.info(JSON.stringify(jsonSheet, null, 2))

  await KeyData.destroy({ where: {} })

  try {
    await KeyData.create({
      data: jsonSheet,
    })
  } catch (error) {
    logger.error(error)
  }
}

const seed = async () => {
  logger.info('Seeding ...')
  await seedFacultiesAndStudyprogrammes()
  await seedKeyData()
  logger.info('Seeding completed')
}

export default seed
