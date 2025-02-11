import type { Request, Response } from 'express'
import multer from 'multer'
import xlsx from 'xlsx'
import KeyData from '../models/keyData.js'


const getKeyData = async (req: Request, res: Response): Promise<Response> => {
  try {
    const keyData = await KeyData.findAll()
    return res.status(200).json(keyData)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

const upload = multer({ storage: multer.memoryStorage() }).single('file')

const uploadKeyData = async (req: Request, res: Response): Promise<Response> => {
  return new Promise((resolve) => {
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

        workbook.SheetNames.forEach((sheetName) => {
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