import { useTranslation } from 'react-i18next'
import { setShowDiscontinued } from '../../../redux/filterReducer'

import { useAppDispatch, useAppSelector } from '../../../util/hooks'
import { Checkbox, Tooltip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const DiscontinuedProgramFilter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const showDiscontinued = useAppSelector(state => state.filters.showDiscontinued)

  return (
    <div>
      <Checkbox
        checked={showDiscontinued}
        color="primary"
        data-cy="show-discontinued-checkbox"
        name="showDiscontinued"
        onChange={() => dispatch(setShowDiscontinued())}
      />
      {t('common:showDiscontinued')}
      <Tooltip
        arrow
        placement="right"
        slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { maxWidth: '700px' } } } }}
        title={t('keyData:discontinuedProgrammeInfoIcon')}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <InfoOutlinedIcon
            color="secondary"
            fontSize="small"
            sx={{
              verticalAlign: 'middle',
            }}
          />
        </span>
      </Tooltip>
    </div>
  )
}

export default DiscontinuedProgramFilter
