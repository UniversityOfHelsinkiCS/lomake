interface KeyData {
  data: {
    kandiohjelmat: KeyDataProgramme[]
    maisteriohjelmat: KeyDataProgramme[]
    metadata: KeyDataMetadata[]
  }
}

interface SingleKeyData {
  programme: KeyDataProgramme
  metadata: KeyDataMetadata[]
}

interface KeyDataProgramme {
  koulutusohjelmakoodi: string
  koulutusohjelma: string
  values: {
    [key: string]: number
  }
  vetovoimaisuus: string
  lapivirtaus: string
  opiskelijapalaute: string
  resurssit: string
}

interface KeyDataMetadata {
  avainluku: string
  kriteerinNimi: string
  kriteerinNimiEn: string
  kriteerinNimiSv: string
  maaritelma: string
  ohjelmanTaso: string
  kynnysarvot: string
  yksikko: string
  liikennevalo: boolean
}

interface KeyDataCardData {
  title: string
  groupKey: GroupKey
  description: string
  color: string
}
