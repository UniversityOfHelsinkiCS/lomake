import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/redux/keyDataReducer'
import { RootState } from '../util/store'
import type { SingleKeyData } from '../lib/types'

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

  useEffect(() => {
    dispatch(fetchKeyData(lang))
  }, [dispatch])

  if (!keyData) {
    return null
  }

  return keyData
}

export default useFetchKeyData
