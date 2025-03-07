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
      vetovoimaisuus: kandiohjelma['Vetovoimaisuus'],
      lapivirtaus: kandiohjelma['Opintojen sujuvuus ja valmistuminen'],
      opiskelijapalaute: kandiohjelma['Palaute ja työllistyminen'],
      resurssit: kandiohjelma['Resurssien käyttö'],
      year: kandiohjelma['Vuosi'],
      international: matchedProgramme?.international,
      level: matchedProgramme?.level,
    }
  })

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
    const matchedProgramme = programmes.find(
      (programme: any) => programme.key === maisteriohjelma['Koulutusohjelman koodi'].trim(),
    )
    return {
      koulutusohjelmakoodi: maisteriohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme ? matchedProgramme.name : maisteriohjelma['Koulutusohjelman nimi'],
      values: maisteriohjelma,
      vetovoimaisuus: maisteriohjelma['Vetovoimaisuus'],
      lapivirtaus: maisteriohjelma['Opintojen sujuvuus ja valmistuminen'],
      opiskelijapalaute: maisteriohjelma['Palaute ja työllistyminen'],
      resurssit: maisteriohjelma['Resurssien käyttö'],
      year: maisteriohjelma['Vuosi'],
      international: matchedProgramme?.international,
      level: matchedProgramme?.level,
    }
  })

  const meta = metadata.map((m: any) => ({
    arviointialue: m['Arviointialue'],
    avainluvunArvo: m['Avainluvun nimi_fi'],
    avainluvunNimiSE: m[`Avainluvun nimi_se`],
    avainluvunNimiEN: m[`Avainluvun nimi_en`],
    avainluvunNimiFI: m[`Avainluvun nimi_fi`],
    maaritelma: m['Määritelmä_fi'],
    ohjelmanTaso: m['Ohjelman taso'],
    kynnysarvot: m['Kynnysarvot'],
    yksikko: m['Yksikkö'],
    liikennevalo: m['Liikennevalo'],
    mittarinRajat: m['Mittarin rajat'],
  }))

  return { kandiohjelmat, maisteriohjelmat, metadata: meta }
}
