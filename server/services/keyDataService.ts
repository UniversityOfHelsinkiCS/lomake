import type { KandiohjelmatValues, MaisteriohjelmatValues, KeyDataMetadataRaw } from '@/shared/lib/types'
import { ProgrammeLevel } from '../../shared/lib/enums'

const transformProgramme = (programme: any) => ({
  key: programme.key,
  name: programme.name,
  level: programme.level,
  companionFaculties: programme.companionFaculties,
  international: programme.international,
})

const extractMultilingualField = (obj: any, fieldPrefix: string) => ({
  fi: obj[`${fieldPrefix}_fi`],
  se: obj[`${fieldPrefix}_se`],
  en: obj[`${fieldPrefix}_en`],
})

const restructureProgramme = <T extends KandiohjelmatValues | MaisteriohjelmatValues>(
  programme: T,
  programmes: ReturnType<typeof transformProgramme>[],
) => {
  const matchedProgramme = programmes.find(
    (p) => p.key === programme['Koulutusohjelman koodi'].trim(),
  )

  return {
    koulutusohjelmakoodi: programme['Koulutusohjelman koodi'],
    koulutusohjelma: matchedProgramme?.name,
    values: programme,
    year: programme['Vuosi'],
    international: matchedProgramme?.international,
    level: matchedProgramme?.level,
    additionalInfo: extractMultilingualField(programme, 'Lisätietoja'),
  }
}

const PROGRAMME_LEVEL_MAPPING: Record<string, ProgrammeLevel> = {
  'Kandi': ProgrammeLevel.Bachelor,
  'Maisteri': ProgrammeLevel.Master,
  'Tohtori': ProgrammeLevel.Doctor,
} as const

const restructureMetadata = (m: KeyDataMetadataRaw) => ({
  yksikko: m['Yksikkö'],
  kynnysarvot: m['Kynnysarvot'],
  ohjelmanTaso: PROGRAMME_LEVEL_MAPPING[m['Ohjelman taso']],
  liikennevalo: m['Liikennevalo'],
  mittarinRajat: m['Mittarin rajat'],
  arviointialue: m['Arviointialue_fi'],
  avainluvunNimi: extractMultilingualField(m, 'Avainluvun nimi'),
  maaritelma: extractMultilingualField(m, 'Määritelmä'),
  avainluvunArvo: m['Avainluvun nimi_fi'],
})

export const formatKeyData = (data: any, programmeData: any) => {
  const { kandiohjelmat, maisteriohjelmat, metadata } = data

  const programmes = programmeData.map(transformProgramme)

  return {
    kandiohjelmat: kandiohjelmat.map((k: KandiohjelmatValues) =>
      restructureProgramme(k, programmes)
    ),
    maisteriohjelmat: maisteriohjelmat.map((m: MaisteriohjelmatValues) =>
      restructureProgramme(m, programmes)
    ),
    metadata: metadata.map(restructureMetadata),
  }
}
