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
    const redLights = [
      'Vetovoimaisuus',
      'Opintojen sujuvuus ja valmistuminen',
      'Palaute ja työllistyminen',
      'Resurssien käyttö',
    ].filter(field => kandiohjelma[field] === 'Punainen')

    const yellowLights = [
      'Vetovoimaisuus',
      'Opintojen sujuvuus ja valmistuminen',
      'Palaute ja työllistyminen',
      'Resurssien käyttö',
    ].filter(field => kandiohjelma[field] === 'Keltainen')

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
      redLights: redLights,
      yellowLights: yellowLights,
    }
  })

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
    const matchedProgramme = programmes.find(
      (programme: any) => programme.key === maisteriohjelma['Koulutusohjelman koodi'].trim(),
    )
    const redLights = [
      'Vetovoimaisuus',
      'Opintojen sujuvuus ja valmistuminen',
      'Palaute ja työllistyminen',
      'Resurssien käyttö',
    ].filter(field => maisteriohjelma[field] === 'Punainen')

    const yellowLights = [
      'Vetovoimaisuus',
      'Opintojen sujuvuus ja valmistuminen',
      'Palaute ja työllistyminen',
      'Resurssien käyttö',
    ].filter(field => maisteriohjelma[field] === 'Keltainen')

    return {
      koulutusohjelmakoodi: maisteriohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme && matchedProgramme.name,
      values: maisteriohjelma,
      vetovoimaisuus: maisteriohjelma['Vetovoimaisuus'],
      lapivirtaus: maisteriohjelma['Opintojen sujuvuus ja valmistuminen'],
      opiskelijapalaute: maisteriohjelma['Palaute ja työllistyminen'],
      resurssit: maisteriohjelma['Resurssien käyttö'],
      year: maisteriohjelma['Vuosi'],
      international: matchedProgramme?.international,
      level: matchedProgramme?.level,
      redLights: redLights,
      yellowLights: yellowLights,
    }
  })

  const meta = metadata.map((m: any) => ({
    arviointialue: m['Arviointialue'],
    avainluvunArvo: m['Avainluvun nimi_fi'],
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
    ohjelmanTaso: m['Ohjelman taso'],
    kynnysarvot: m['Kynnysarvot'],
    yksikko: m['Yksikkö'],
    liikennevalo: m['Liikennevalo'],
    mittarinRajat: m['Mittarin rajat'],
  }))

  return { kandiohjelmat, maisteriohjelmat, metadata: meta }
}
