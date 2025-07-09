import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from '../../redux/formReducer'

const TrackingRadioButton = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_degree_radio`

  const initialValue = useSelector(state => state.form.data?.[fieldName]) || 'both'

  const [data, setData] = useState(initialValue)

  useEffect(() => {
    setData(initialValue)
  }, [initialValue])

  const handleChange = (e, { value }) => {
    setData(value)
    dispatch(updateFormField(fieldName, value, form))
  }

  if (id.startsWith('T')) return null

  return (
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column>
          <b>{t('facultyTracking:selectDegree')}</b>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ marginLeft: '20px' }}>
        <Grid.Column>
          <Radio label={t('facultyTracking:both')} value="both" checked={data === 'both'} onChange={handleChange} />
        </Grid.Column>
        <Grid.Column>
          <Radio
            label={t('facultyTracking:bachelor')}
            value="bachelor"
            checked={data === 'bachelor'}
            onChange={handleChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Radio
            label={t('facultyTracking:master')}
            value="master"
            checked={data === 'master'}
            onChange={handleChange}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default TrackingRadioButton
