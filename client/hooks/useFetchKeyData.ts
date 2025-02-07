import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/redux/keyDataReducer'
import { RootState } from '../util/store'
import { KeyData, KeyDataMetadata, KeyDataProgramme, SingleKeyData } from '../lib/types'

export const useFetchSingleKeyData = (programmeId: string, lang: string): SingleKeyData => {
  const keyData = useFetchKeyData(lang)

  if (!keyData) {
    return null
  }

  const { kandiohjelmat, maisteriohjelmat, metadata } = keyData.data
  let programme: KeyDataProgramme

  if (programmeId.startsWith('K')) {
    programme = kandiohjelmat.find((kandiohjelma: { koulutusohjelmakoodi: string | string[] }) =>
      kandiohjelma.koulutusohjelmakoodi.includes(programmeId),
    )
  } else {
    programme = maisteriohjelmat.find((maisteriohjelma: { koulutusohjelmakoodi: string | string[] }) =>
      maisteriohjelma.koulutusohjelmakoodi.includes(programmeId),
    )
  }

  return { programme, metadata }
}

const useFetchKeyData = (lang: string) => {
  const dispatch = useDispatch()
  const keyData = useSelector((state: RootState) => state.keyData.data)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  if (!keyData) {
    return null
  }

  const { Kandiohjelmat, Maisteriohjelmat, metadata } = keyData[0].data

  const kandiohjelmat = Kandiohjelmat.map((kandiohjelma: any) => {
    const obj: KeyDataProgramme = {
      koulutusohjelmakoodi: kandiohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: kandiohjelma['Koulutusohjelman nimi'],
      values: kandiohjelma,
      vetovoimaisuus: kandiohjelma['Vetovoimaisuus'],
      lapivirtaus: kandiohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: kandiohjelma['Opiskelijapalaute ja työllistyminen'],
      resurssit: kandiohjelma['Resurssit'],
    }
    return obj
  }) as KeyDataProgramme[]

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
    const obj: KeyDataProgramme = {
      koulutusohjelmakoodi: maisteriohjelma['Koulutusohjelman koodi'],
      koulutusohjelma: maisteriohjelma['Koulutusohjelman nimi'],
      values: maisteriohjelma,
      vetovoimaisuus: maisteriohjelma['Vetovoimaisuus'],
      lapivirtaus: maisteriohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: maisteriohjelma['Opiskelijapalaute ja työllistyminen'],
      resurssit: maisteriohjelma['Resurssit'],
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
