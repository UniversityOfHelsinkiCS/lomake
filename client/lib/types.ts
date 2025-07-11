import { GroupKey, StudyLevel } from './enums'
import { DocumentForm } from '@/shared/lib/types'

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
