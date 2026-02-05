import type { Request, Response } from 'express'
import multer from 'multer'
import xlsx from 'xlsx'
import KeyData from '../models/keyData.js'
import { formatKeyData } from '../services/keyDataService.js'

// Validations
import {
  MetadataSchema,
  KeyDataProgrammeSchema,
  MaisteriohjelmatValuesSchema,
  KandiohjelmatValuesSchema,
  logZodError,
  ZodError,
} from '../../shared/validators/index.js'
import { CanonicalSheetName, KeyData as KeyDataType } from '@/shared/lib/types.js'
import Studyprogramme from '../models/studyprogramme.js'
import logger from '../util/logger.js'


const deactivateExistingKeyData = async () => {
  await KeyData.update(
    { active: false },
    { where: { active: true } }
  )
}

const fetchProgrammeData = async () => {
  return await Studyprogramme.findAll({
    attributes: ['key', 'name', 'level', 'international'],
    include: ['primaryFaculty', 'companionFaculties'],
  })
}

const validateKeyData = async (keyData: any) => {
  try {
    KeyDataProgrammeSchema.extend({
      values: KandiohjelmatValuesSchema,
    })
      .array()
      .parse(keyData.kandiohjelmat)
    KeyDataProgrammeSchema.extend({
      values: MaisteriohjelmatValuesSchema,
    })
      .array()
      .parse(keyData.maisteriohjelmat)
    MetadataSchema.array().parse(keyData.metadata)
  } catch (zodError) {
    logZodError(zodError as ZodError)
    throw new Error('Invalid KeyData format')
  }
}

const getKeyData = async (_req: Request, res: Response) => {
  try {
    const { data } = await KeyData.findOne({
      where: {
        active: true,
      },
    })

    await validateKeyData(data)

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

const upload = multer({ storage: multer.memoryStorage() }).single('file')

const uploadKeyData = async (req: Request, res: Response) => {
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

        if (!workbook || !workbook.SheetNames?.length) {
          logger.error('Workbook is invalid or has no sheets')
          throw new Error('Invalid workbook: no sheets found')
        }
        const data: Partial<Record<CanonicalSheetName, any[]>> = {}

        const { SheetNames, Sheets } = workbook

        const order: CanonicalSheetName[] = [
          'kandiohjelmat',
          'maisteriohjelmat',
          // 'tohtoriohjelmat', commented out cuz not in pilotti
          'metadata',
        ]

        order.forEach((canonicalName, idx) => {
          const rawName = SheetNames[idx]
          const ws = Sheets[rawName]
          if (!ws) {
            throw new Error(`Worksheet at index ${idx} (${rawName}) is missing`)
          }

          const sheetAsJson = xlsx.utils.sheet_to_json(ws) as any[]
          data[canonicalName] = Array.isArray(sheetAsJson) ? sheetAsJson : []
        })

        await deactivateExistingKeyData()
        const programmeData = await fetchProgrammeData()
        const formattedKeyData: KeyDataType = formatKeyData(data, programmeData)
        await validateKeyData(formatKeyData)

        await KeyData.create({
          data: formattedKeyData,
          active: true,
        })

        resolve(res.status(201).json({ message: 'Key data uploaded' }))
      } catch (error) {
        resolve(res.status(500).json({ error: (error as Error).message }))
      }
    })
  })
}

const getKeyDataMeta = async (_req: Request, res: Response) => {
  try {
    const keyData = await KeyData.findAll({
      attributes: ['id', 'active', 'createdAt'],
    })

    if (!keyData.length) {
      return res.status(404).json({ error: 'No key data found' })
    }

    return res.status(200).json(keyData)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

const deleteKeyData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const keyData = await KeyData.findByPk(id)

    if (!keyData) {
      return res.status(404).json({ error: 'Key data not found' })
    }

    await keyData.destroy()
    return res.status(204).json({ message: 'Key data deleted' })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

const updateKeyData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const keyData = await KeyData.findByPk(id)

    if (!keyData) {
      return res.status(404).json({ error: 'Key data not found' })
    }

    await deactivateExistingKeyData()

    await keyData.update({
      active: true,
    })

    return res.status(200).json(keyData)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

export default { getKeyData, uploadKeyData, getKeyDataMeta, deleteKeyData, updateKeyData }
