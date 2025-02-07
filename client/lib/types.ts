import { GroupKey } from "./enums"

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
    koulutusohjelma: string
    values: {
        [key: string]: number
    }
    vetovoimaisuus: string
    lapivirtaus: string
    opiskelijapalaute: string
    resurssit: string
}

export interface KeyDataMetadata {
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

export interface KeyDataCardData {
    title: string
    groupKey: GroupKey
    description: string
    color: string
}
