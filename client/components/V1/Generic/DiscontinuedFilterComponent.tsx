import { useTranslation } from 'react-i18next'
import { setShowDiscontinued } from '../../../redux/filterReducer'

import { useAppDispatch, useAppSelector } from '@/client/util/hooks'
import { Checkbox } from '@mui/material'

const DiscontinuedProgramFilter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const showDiscontinued = useAppSelector(state => state.filters.showDiscontinued)

  return (
    <div>
      <Checkbox
        checked={showDiscontinued}
        color="primary"
        name="showDiscontinued"
        onChange={() => dispatch(setShowDiscontinued())}
        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
      />
      {t('common:showDiscontinued')}
    </div>
  )
}

export default DiscontinuedProgramFilter
