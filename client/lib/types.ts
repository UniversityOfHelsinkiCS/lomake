import { GroupKey, StudyLevel } from './enums'
import { DocumentForm, QualityDocumentForm } from '@/shared/lib/types'

export interface KeyDataCardData {
  title: string
  groupKey: GroupKey
  description: string
  textField: boolean
}

export interface StudyProgramme {
  key: string
  name: {
    [lang: string]: string
  }
  level: StudyLevel
  companionFaculties: string[]
  international: boolean
  additionalInfo?: string
}

export interface Reason {
  reason: string, additionalInfo: string
}

export interface DocumentType {
  id: number
  data: DocumentForm
  studyprogrammeKey: string
  active: boolean
  activeYear: number
  reason: Reason | null
}

export interface QualityDocumentType {
  id: number
  data: QualityDocumentForm
  year: number
  studyprogrammeKey: string
  createdAt: string
}

export interface InterventionProcedureType {
  id: number
  studyprogrammeKey: string
  active: boolean
  startYear: number
  endYear: number | null
}

export type ReportDataKey = 'Vetovoimaisuus' | 'Opintojen sujuvuus ja valmistuminen' | 'Resurssien käyttö' | 'Palaute ja työllistyminen' | 'Toimenpiteet'
