import { z } from 'zod'
import {
  MaisteriohjelmatValuesSchema,
  KandiohjelmatValuesSchema,
  KeyDataProgrammeSchema,
  MetadataSchema,
} from './validations'

export type KeyDataProgramme = z.infer<typeof KeyDataProgrammeSchema>
export type KandiohjelmatValues = z.infer<typeof KandiohjelmatValuesSchema>
export type MaisteriohjelmatValues = z.infer<typeof MaisteriohjelmatValuesSchema>
export type KeyDataMetadata = z.infer<typeof MetadataSchema>

export interface KeyData {
  data: {
    kandiohjelmat: KeyDataProgramme[]
    maisteriohjelmat: KeyDataProgramme[]
    metadata: KeyDataMetadata[]
  }
}

export interface SingleKeyData {
  programme: KeyDataProgramme
  metadata: KeyDataMetadata[]
}

export interface Faculty {
  id: number
  name: {
    en: string
    fi: string
    se: string
  }
  code: string
  companionStudyprogrammes: Array<{ [key: string]: any }> // Replace with actual structure if known
  ownedProgrammes: Array<{ [key: string]: any }> // Replace with actual structure if known
  createdAt: string
  updatedAt: string
}

export interface ReportData {
  Vetovoimaisuus?: string
  'Opintojen sujuvuus ja valmistuminen'?: string
  'Palaute ja työllistyminen'?: string
  'Resurssien käyttö'?: string
  Toimenpiteet?: string
}
