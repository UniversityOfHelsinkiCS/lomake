import { GroupKey, StudyLevel } from './enums'

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
