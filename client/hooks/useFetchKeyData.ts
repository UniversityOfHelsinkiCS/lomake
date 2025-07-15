import { useEffect } from 'react'
import { fetchKeyData } from '../redux/keyData'
import type { KeyDataProgramme, KeyDataByCode } from '@/shared/lib/types'
import { useAppDispatch, useAppSelector } from '../util/hooks'

export const useFetchSingleKeyData = (programmeId: string): KeyDataByCode => {
  const keyData = useFetchKeyData()

  if (!keyData) {
    return null
  }

  const { kandiohjelmat, maisteriohjelmat, metadata } = keyData.data
  const allProgrammes = [...kandiohjelmat, ...maisteriohjelmat]

  const programme: KeyDataProgramme[] = allProgrammes.filter(p => p.koulutusohjelmakoodi.trim() === programmeId.trim())

  return { programme, metadata }
}

const useFetchKeyData = () => {
  const dispatch = useAppDispatch()
  const keyData = useAppSelector(state => state.keyData.data)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  if (!keyData) {
    return null
  }

  return keyData
}

export default useFetchKeyData
