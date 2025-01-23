import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKeyData } from '../util/slices/keyDataSlicer'
import { RootState } from '../util/store'

const useFetchKeyData = () => {
  const dispatch = useDispatch()
  const keyData = useSelector((state: RootState) => state.keyData)

  useEffect(() => {
    dispatch(fetchKeyData())
  }, [dispatch])

  return keyData
}

export default useFetchKeyData