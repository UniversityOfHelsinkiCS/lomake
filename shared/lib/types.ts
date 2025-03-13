import { z } from 'zod'
import { MaisteriohjelmatSchema, KandiohjelmatSchema, MetadataSchema } from './validations'

export type Maisteriohjelmat = z.infer<typeof MaisteriohjelmatSchema>
export type Kandiohjelmat = z.infer<typeof KandiohjelmatSchema>
export type Metadata = z.infer<typeof MetadataSchema>

export interface KeyData {
  data: {
    kandiohjelmat: Kandiohjelmat[]
    maisteriohjelmat: Maisteriohjelmat[]
    metadata: Metadata[]
  }
}

export interface SingleKeyData {
  programme: Kandiohjelmat | Maisteriohjelmat
  metadata: Metadata[]
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
