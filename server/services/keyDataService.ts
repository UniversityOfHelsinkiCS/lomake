export const formatKeyData = (data: any, programmeData: any) => {
  const { Kandiohjelmat, Maisteriohjelmat, metadata } = data

  const programmes = programmeData.map((programme: any) => ({
    key: programme.key,
    name: programme.name,
    level: programme.level,
    companionFaculties: programme.companionFaculties,
    international: programme.international,
  }))

  const kandiohjelmat = Kandiohjelmat.map((kandiohjelma: any) => {
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
      additionalInfo: kandiohjelma['Uusi tai lakkautettu ohjelma'],
    }
  })

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
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
      additionalInfo: maisteriohjelma['Uusi tai lakkautettu ohjelma'],
    }
  })

  const meta = metadata.map((m: any) => ({
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
