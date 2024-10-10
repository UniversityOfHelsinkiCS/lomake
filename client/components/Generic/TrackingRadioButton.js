import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from 'Utilities/redux/formReducer'

const TrackingRadioButton = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_degree_radio`

  const initialValue = useSelector(state => state.form[form]?.[fieldName]) || 'both'

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
    <Grid columns={6}>
      <Grid.Row>
        <Grid.Column>
          <b>{t('trackingPage:selectDegree')}</b>
        </Grid.Column>
        <Grid.Column>
          <Radio
            label={t('trackingPage:bachelor')}
            value="bachelor"
            checked={data === 'bachelor'}
            onChange={handleChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Radio label={t('trackingPage:master')} value="master" checked={data === 'master'} onChange={handleChange} />
        </Grid.Column>
        <Grid.Column>
          <Radio label={t('trackingPage:both')} value="both" checked={data === 'both'} onChange={handleChange} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default TrackingRadioButton
