import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'

import './Generic.scss'
import { updateFormField } from '../../util/redux/formReducer'

const OrderSelection = ({ id, label, description, extrainfo, lang, options, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const values = useSelector(({ form }) => form.data.used_systems_selection)
  const selections = values ? JSON.parse(values) : null
  const otherText = useSelector(({ form }) => form.data.used_systems_text) || ''

  const orderFromD = useSelector(({ form }) => form.data.used_systems_usefullness_order) || ''
  const systemList = orderFromD ? orderFromD.split(';;') : []

  const getUsedSystems = () => {
    const toShow = []
    if (selections) {
      Object.entries(selections).forEach(([key, value]) => {
        if (value) {
          toShow.push(key)
        }
      })
    }
    if (otherText) {
      toShow.push(otherText)
    }
    return toShow
  }

  const handleClick = optionId => {
    if (systemList.length < 4) {
      const updated = [...systemList, optionId]

      dispatch(updateFormField(id, updated.join(';;'), form))
    }
  }

  const handleClear = () => {
    dispatch(updateFormField(id, '', form))
  }

  const getLabel = id => {
    if (Object.keys(options).includes(id)) {
      return options[id][lang]
    }
    return id
  }

  const noAnswers = !otherText && (!selections || (selections && !Object.values(selections).some(value => value)))

  return (
    <div className="ordering-area">
      <h4>
        <span>{label} </span>
      </h4>
      <div className="ordering-description">
        <p>{description}</p>
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>
      {noAnswers ? (
        <h4 className="no-selections">{t('formView:noSystemsSelected')}</h4>
      ) : (
        <Segment placeholder>
          <Grid columns={2} divided verticalAlign="top">
            <Grid.Row>
              <Grid.Column textAlign="left">
                <Header size="small">{t('formView:mostUseful')}</Header>
                <div className="ordered-systems">
                  <p>
                    <b>1.</b> {systemList[0] ? getLabel(systemList[0]) : ''}
                  </p>
                  <p>
                    <b>2.</b> {systemList[1] ? getLabel(systemList[1]) : ''}
                  </p>
                  <p>
                    <b>3.</b> {systemList[2] ? getLabel(systemList[2]) : ''}
                  </p>
                </div>
                <div>
                  <Button disabled={viewOnly} onClick={handleClear}>
                    {t('clearSelection')}
                  </Button>
                </div>
              </Grid.Column>
              <Grid.Column textAlign="left">
                <Header size="small">{t('formView:selectSystems')}</Header>
                {getUsedSystems().map(system => (
                  <div className="ordering-options" key={system}>
                    {!systemList.includes(system) && (
                      <Button onClick={(e, data) => handleClick(data.id)} id={system} key={system} disabled={viewOnly}>
                        {getLabel(system)}
                      </Button>
                    )}
                  </div>
                ))}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}
    </div>
  )
}

export default OrderSelection
