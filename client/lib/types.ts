import { GroupKey, StudyLevel } from './enums'

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

export interface KeyDataProgramme {
  koulutusohjelmakoodi: string
  koulutusohjelma: Record<string, string>
  values: {
    [key: string]: number
  }
  level: StudyLevel
  vetovoimaisuus: string
  lapivirtaus: string
  opiskelijapalaute: string
  resurssit: string
  international: boolean
  year: number
}

export interface KeyDataMetadata {
  arviointialue: string
  avainluvunArvo: string
  avainluvunNimi: Record<string, string>
  maaritelma: string
  ohjelmanTaso: string
  kynnysarvot: string
  yksikko: string
  liikennevalo: boolean
  mittarinRajat: string
}

export interface KeyDataCardData {
  title: string
  groupKey: GroupKey
  description: string
  color: string
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
}
