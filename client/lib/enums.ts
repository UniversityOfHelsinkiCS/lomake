import { GroupKey } from '@/shared/lib/enums'

export enum ProgrammeLevel {
  // levels in metadata
  KANDI = 'Kandi',
  MAISTERI = 'Maisteri',
}

export enum StudyLevel {
  // levels in studyProgrammes / keyDataProgrammes
  Bachelor = 'bachelor',
  Master = 'master',
  Doctor = 'doctoral',
}

export enum LightColors {
  Red = 'Punainen',
  Yellow = 'Keltainen',
  LightGreen = 'Vaaleanvihreä',
  DarkGreen = 'Tummanvihreä',
  Grey = 'Harmaa',
  Empty = 'Tyhjä',
}

export enum ColorKey {
  vetovoimaisuus = 'vetovoimaisuus',
  lapivirtaus = 'lapivirtaus',
  opiskelijapalaute = 'opiskelijapalaute',
  resurssit = 'resurssit',
}

export { GroupKey }
