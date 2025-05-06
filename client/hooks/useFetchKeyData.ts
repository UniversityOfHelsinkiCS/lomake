import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/redux/keyDataReducer'
import { RootState } from '../util/store'
import type { KeyDataProgramme, KeyDataByCode } from '@/shared/lib/types'

export const useFetchSingleKeyData = (programmeId: string): KeyDataByCode => {
  const keyData = useFetchKeyData()

  if (!keyData) {
    return null
  }

  const { kandiohjelmat, maisteriohjelmat, metadata } = keyData.data
  const allProgrammes = [...kandiohjelmat, ...maisteriohjelmat]

  //TODO: refactor this and every component where this is used to get all years, now this returns only one year
  const programme = allProgrammes.find(p => p.koulutusohjelmakoodi.trim() === programmeId.trim())

  return { data: { programme, metadata } }
}

const useFetchKeyData = () => {
  const dispatch = useDispatch()
  const keyData = useSelector((state: RootState) => state.keyData.data)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  if (!keyData) {
    return null
  }

  return keyData
}

export default useFetchKeyData
