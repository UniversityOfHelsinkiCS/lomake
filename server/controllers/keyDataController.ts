import type { Request, Response } from 'express'
import multer from 'multer'
import xlsx from 'xlsx'
import KeyData from '../models/keyData.js'
import db from '../models/index.js'
import { formatKeyData } from '../services/keyDataService.js'

// Validations
import { ZodError } from 'zod'
import {
  MetadataSchema,
  KandiohjelmatSchema,
  MaisteriohjelmatSchema,
  logZodError,
} from '../../shared/lib/validations.js'

const getKeyData = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const keyData = await KeyData.findAll()

    // @ts-expect-error
    const programmeData = await db.studyprogramme.findAll({
      attributes: ['key', 'name', 'level', 'international'],
      include: ['primaryFaculty', 'companionFaculties'],
    })

    if (!keyData.length) {
      return res.status(404).json({ error: 'No key data found' })
    }

    const formattedKeyData = formatKeyData(keyData[0].data, programmeData)

    try {
      KandiohjelmatSchema.parse(formattedKeyData.kandiohjelmat)
      MaisteriohjelmatSchema.parse(formattedKeyData.maisteriohjelmat)
      MetadataSchema.parse(formattedKeyData.metadata)
    } catch (zodError) {
      logZodError(zodError as ZodError)
      throw new Error('Invalid KeyData format')
    }

    return res.status(200).json({ data: formattedKeyData })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

const upload = multer({ storage: multer.memoryStorage() }).single('file')

const uploadKeyData = async (req: Request, res: Response): Promise<Response> => {
  return new Promise(resolve => {
    upload(req, res, async (err: any) => {
      if (err) {
        resolve(res.status(500).json({ error: err.message }))
        return
      }

      const { file }: any = req

      if (!file) {
        resolve(res.status(400).json({ error: 'No file uploaded' }))
        return
      }

      try {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' })
        const jsonSheet: { [key: string]: any[] } = {}

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          const data = xlsx.utils.sheet_to_json(worksheet)
          jsonSheet[sheetName] = data
        })

        await KeyData.create({
          data: jsonSheet,
        })
        resolve(res.status(201).json({ message: 'Key data uploaded' }))
      } catch (error) {
        resolve(res.status(500).json({ error: (error as Error).message }))
      }
    })
  })
}

export default { getKeyData, uploadKeyData }
