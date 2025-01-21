import type { Request, Response } from 'express'
import KeyData from '../models/keyData.js'

const getKeyData = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyData = await KeyData.findAll()
    res.status(200).json(keyData)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export default { getKeyData }