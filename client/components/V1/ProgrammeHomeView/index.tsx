import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { ProgrammeLevel } from '@/client/lib/enums'
import { RootState, AppDispatch } from '@/client/util/store'

const ProgrammeHomeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const selectedYear = useSelector((state: RootState) => state.filters.keyDataYear)
  const keyData = useFetchSingleKeyData(programmeKey)
  const form = 10

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  return (
    <div>
      <h1>{programmeKey}</h1>
    </div>
  )
}

export default ProgrammeHomeView
