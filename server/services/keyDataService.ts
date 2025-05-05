import type { KandiohjelmatValues, MaisteriohjelmatValues, KeyDataMetadataRaw } from '@/shared/lib/types'

export const formatKeyData = (data: any, programmeData: any) => {
  const { Kandiohjelmat, Maisteriohjelmat, metadata } = data

  const programmes = programmeData.map((programme: any) => ({
    key: programme.key,
    name: programme.name,
    level: programme.level,
    companionFaculties: programme.companionFaculties,
    international: programme.international,
  }))

  const kandiohjelmat = Kandiohjelmat.map((kandiohjelma: KandiohjelmatValues) => {
    const matchedProgramme = programmes.find(
      (programme: any) => programme.key === kandiohjelma['Koulutusohjelman koodi'].trim(),
    )

    return {
      koulutusohjelmakoodi: kandiohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme && matchedProgramme.name,
      values: kandiohjelma,
      year: kandiohjelma['Vuosi'],
      international: matchedProgramme?.international,
      level: matchedProgramme?.level,
      additionalInfo: {
        fi: kandiohjelma[`Lisätietoja_fi`],
        se: kandiohjelma[`Lisätietoja_se`],
        en: kandiohjelma[`Lisätietoja_en`],
      },
    }
  })

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: MaisteriohjelmatValues) => {
    const matchedProgramme = programmes.find(
      (programme: any) => programme.key === maisteriohjelma['Koulutusohjelman koodi'].trim(),
    )

    return {
      koulutusohjelmakoodi: maisteriohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme && matchedProgramme.name,
      values: maisteriohjelma,
      year: maisteriohjelma['Vuosi'],
      international: matchedProgramme?.international,
      level: matchedProgramme?.level,
      additionalInfo: {
        fi: maisteriohjelma[`Lisätietoja_fi`],
        se: maisteriohjelma[`Lisätietoja_se`],
        en: maisteriohjelma[`Lisätietoja_en`],
      },
    }
  })

  const meta = metadata.map((m: KeyDataMetadataRaw) => ({
    yksikko: m['Yksikkö'],
    kynnysarvot: m['Kynnysarvot'],
    ohjelmanTaso: m['Ohjelman taso'],
    liikennevalo: m['Liikennevalo'],
    mittarinRajat: m['Mittarin rajat'],
    arviointialue: m['Arviointialue_fi'],
    avainluvunNimi: {
      fi: m[`Avainluvun nimi_fi`],
      se: m[`Avainluvun nimi_se`],
      en: m[`Avainluvun nimi_en`],
    },
    maaritelma: {
      fi: m[`Määritelmä_fi`],
      se: m[`Määritelmä_se`],
      en: m[`Määritelmä_en`],
    },
    avainluvunArvo: m['Avainluvun nimi_fi'],
  }))

  return { kandiohjelmat, maisteriohjelmat, metadata: meta }
}
