import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/redux/keyDataReducer'
import { RootState } from '../util/store'
import type { KeyData, KeyDataMetadata, KeyDataProgramme, SingleKeyData, StudyProgramme } from '../lib/types'

export const useFetchSingleKeyData = (programmeId: string, lang: string): SingleKeyData => {
  const keyData = useFetchKeyData(lang)

  if (!keyData) {
    return null
  }

  const { kandiohjelmat, maisteriohjelmat, metadata } = keyData.data
  const allProgrammes = [...kandiohjelmat, ...maisteriohjelmat]

  const programme = allProgrammes.find(p => p.koulutusohjelmakoodi.trim() === programmeId.trim())

  return { programme, metadata }
}

const useFetchKeyData = (lang: string) => {
  const dispatch = useDispatch()
  const keyData = useSelector((state: RootState) => state.keyData.data)
  const programmeData = useSelector((state: RootState) => state.studyProgrammes.data)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  if (!keyData || !programmeData) {
    return null
  }

  const { Kandiohjelmat, Maisteriohjelmat, metadata } = keyData[0].data

  const programmes = programmeData.map((programme: any) => {
    const obj: StudyProgramme = {
      key: programme.key,
      name: programme.name[lang],
      level: programme.level,
      companionFaculties: programme.companionFaculties,
      international: programme.international,
    }
    return obj
  }) as StudyProgramme[]

  const kandiohjelmat = Kandiohjelmat.map((kandiohjelma: any) => {
    const matchedProgramme = programmes.find(
      programme => programme.key === kandiohjelma['Koulutusohjelman koodi'].trim(),
    )

    const obj: KeyDataProgramme = {
      koulutusohjelmakoodi: kandiohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme ? matchedProgramme.name : kandiohjelma['Koulutusohjelman nimi'],
      values: kandiohjelma,
      vetovoimaisuus: kandiohjelma['Vetovoimaisuus'],
      lapivirtaus: kandiohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: kandiohjelma['Opiskelijapalaute ja työllistyminen'],
      resurssit: kandiohjelma['Resurssit'],
      international: matchedProgramme ? matchedProgramme.international : undefined,
      level: matchedProgramme ? matchedProgramme.level : undefined,
    }
    return obj
  }) as KeyDataProgramme[]

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
    const matchedProgramme = programmes.find(
      programme => programme.key === maisteriohjelma['Koulutusohjelman koodi'].trim(),
    )
    const obj: KeyDataProgramme = {
      koulutusohjelmakoodi: maisteriohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: matchedProgramme ? matchedProgramme.name : maisteriohjelma['Koulutusohjelman nimi'],
      values: maisteriohjelma,
      vetovoimaisuus: maisteriohjelma['Vetovoimaisuus'],
      lapivirtaus: maisteriohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: maisteriohjelma['Opiskelijapalaute ja työllistyminen'],
      resurssit: maisteriohjelma['Resurssit'],
      international: matchedProgramme ? matchedProgramme.international : undefined,
      level: matchedProgramme ? matchedProgramme.level : undefined,
    }
    return obj
  }) as KeyDataProgramme[]

  const meta = metadata.map((meta: any) => {
    const obj: KeyDataMetadata = {
      avainluku: meta['Avainluku'],
      kriteerinArvo: meta['Kriteerin nimi_fi'],
      kriteerinNimi: meta[`Kriteerin nimi_${lang}`],
      maaritelma: meta['Määritelmä'],
      ohjelmanTaso: meta['Ohjelman taso'],
      kynnysarvot: meta['Kynnysarvot'],
      yksikko: meta['Yksikkö'],
      liikennevalo: meta['Liikennevalo'], // boolean-kenttä sille näytetäänkö liikennevalo vai pelkkä luku
    }
    return obj
  }) as KeyDataMetadata[]

  return { data: { kandiohjelmat, maisteriohjelmat, metadata: meta } } as KeyData
}

export default useFetchKeyData
