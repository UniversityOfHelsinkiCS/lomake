import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/redux/keyDataReducer'
import { RootState } from '../util/store'

export interface KeyData {
  data: {
    kandiohjelmat: KeyDataKandiohjelmat[]
    maisteriohjelmat: KeyDataMaisteriohjelmat[]
    metadata: KeyDataMetadata[]
  }
}

export interface KeyDataKandiohjelmat {
  koulutusohjelma: string
  hakupaine: number
  ensisijaiset: number
  aloituspaikkojenTayttyminen: number
  opinnotAloittaneet: number
  tutkinnot: number
  tavoiteajassaOsuus: number
  lasnaolevat: number
  tavoiteajassaEtenevat: number
  hyvinvointiIndikaattori: number
  ohjausIndeksi: number
  norppaPalaute: number
  vetovoimaisuus: string
  lapivirtaus: string
  opiskelijapalaute: string
}

export interface KeyDataMaisteriohjelmat {
  koulutusohjelma: string
  hakukelpoiset: number
  haunAloituspaikat: number
  hakupaine: number
  aloituspaikat: number
  opinnotAloittaneet: number
  tutkinnot: number
  tavoiteajassaOsuus: number
  lasnaolevat: number
  HUL3Linjakkuus: number
  HUL3Palaute: number
  HUL3Kiinnostavuus: number
  HUL3Vastaajat: number
  vetovoimaisuus: string
  lapivirtaus: string
  opiskelijapalaute: string
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
}

const useFetchKeyData = () => {
  const dispatch = useDispatch()
  const keyData = useSelector((state: RootState) => state.keyData.data)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  const { Kandiohjelmat, Maisteriohjelmat, metadata } = keyData[0].data

  const kandiohjelmat = Kandiohjelmat.map((kandiohjelma: any) => {
    const obj: KeyDataKandiohjelmat = {
      koulutusohjelma: kandiohjelma['Koulutusohjelma'],
      hakupaine: kandiohjelma['Hakupaine'],
      ensisijaiset: kandiohjelma['Ensisijaiset hakijat'],
      aloituspaikkojenTayttyminen: kandiohjelma['Aloituspaikkojen täyttyminen'],
      opinnotAloittaneet: kandiohjelma['Opinnot aloittaneet'],
      tutkinnot: kandiohjelma['Tutkinnot'],
      tavoiteajassaOsuus: kandiohjelma['Tavoiteajassa osuus'],
      lasnaolevat: kandiohjelma['Läsnäolevat / tutkinnot'],
      tavoiteajassaEtenevat: kandiohjelma['Vuosikurssin 23-24 tavoiteajassa etenevät'],
      hyvinvointiIndikaattori: kandiohjelma['Hyvinvointi-indikaattori'],
      ohjausIndeksi: kandiohjelma['Ohjausindikaattori'],
      norppaPalaute: kandiohjelma['Norppa-palautteeseen vastanneiden osuus'],
      vetovoimaisuus: kandiohjelma['Vetovoimaisuus'],
      lapivirtaus: kandiohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: kandiohjelma['Opiskelijapalaute ja työllistyminen'],
    }
    return obj
  }) as KeyDataKandiohjelmat[]

  const maisteriohjelmat = Maisteriohjelmat.map((maisteriohjelma: any) => {
    const obj: KeyDataMaisteriohjelmat = {
      koulutusohjelma: maisteriohjelma['Koulutusohjelma'],
      hakukelpoiset: maisteriohjelma['Maisterihaun hakukelpoiset hakijat'],
      haunAloituspaikat: maisteriohjelma['Maisterihaun aloituspaikat'],
      hakupaine: maisteriohjelma['Maisterihaun hakupaine'],
      aloituspaikat: maisteriohjelma['Aloituspaikat'],
      opinnotAloittaneet: maisteriohjelma['Opinnot aloittaneet'],
      tutkinnot: maisteriohjelma['Tutkinnot'],
      tavoiteajassaOsuus: maisteriohjelma['Tavoiteajassa osuus'],
      lasnaolevat: maisteriohjelma['Läsnäolevat / tutkinnot'],
      HUL3Linjakkuus: maisteriohjelma['HUL3 Linjakkuus'],
      HUL3Palaute: maisteriohjelma['HUL3 oppimista edistävä palaute'],
      HUL3Kiinnostavuus: maisteriohjelma['HUL3 Opintojen kiinnostavuus'],
      HUL3Vastaajat: maisteriohjelma['HUL3 vastaajamäärä'],
      vetovoimaisuus: maisteriohjelma['Vetovoimaisuus'],
      lapivirtaus: maisteriohjelma['Läpivirtaus ja valmistuminen'],
      opiskelijapalaute: maisteriohjelma['Opiskelijapalaute ja työllistyminen'],
    }
    return obj
  }) as KeyDataMaisteriohjelmat[]

  const meta = metadata
    // poistetaan ne metadata-objektit, joilla ei ole kynnysarvoja; poistetaan tää filtteri kun data on paremmassa muodossa
    .filter((meta: any) => {
      if (!meta['Kynnysarvot (punainen alaraja; keltaisen alaraja;vihreän alaraja)']) {
        return false
      }
      return true
    })
    .map((meta: any) => {
      const obj: KeyDataMetadata = {
        avainluku: meta['Avainluku'],
        kriteerinNimi: meta['Kriteerin nimi'],
        kriteerinNimiEn: meta['Kriteerin nimi_en'],
        kriteerinNimiSv: meta['Kriteerin nimi_sv'],
        maaritelma: meta['Määritelmä'],
        ohjelmanTaso: meta['Ohjelman taso'],
        kynnysarvot: meta['Kynnysarvot (punainen alaraja; keltaisen alaraja;vihreän alaraja)'],
        yksikko: meta['Yksikkö'],
      }
      return obj
    }) as KeyDataMetadata[]

  return { data: { kandiohjelmat, maisteriohjelmat, metadata: meta } } as KeyData
}

export default useFetchKeyData
