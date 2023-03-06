import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'

import './Generic.scss'

const OrderSelection = ({ label, description, extrainfo, lang, options }) => {
  const { t } = useTranslation()
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const values = useSelector(({ form }) => form.data.used_systems_selection)
  const selections = values ? JSON.parse(values) : null
  const otherText = useSelector(({ form }) => form.data.used_systems_text) || ''

  const [order, setOrder] = useState([])

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

  const handleClick = id => {
    if (order.length < 4) {
      setOrder([...order, id])
    }
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
      <h3>
        <span>{label} </span>
      </h3>
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
                <Header>{t('formView:mostUseful')}</Header>
                <div className="ordered-systems">
                  <p>
                    <b>1.</b> {order[0] ? getLabel(order[0]) : ''}
                  </p>
                  <p>
                    <b>2.</b> {order[1] ? getLabel(order[1]) : ''}
                  </p>
                  <p>
                    <b>3.</b> {order[2] ? getLabel(order[2]) : ''}
                  </p>
                </div>
                <div>
                  <Button disabled={viewOnly} onClick={() => setOrder([])}>
                    {t('clearSelection')}
                  </Button>
                </div>
              </Grid.Column>
              <Grid.Column textAlign="left">
                <Header>{t('formView:selectSystems')}</Header>
                {getUsedSystems().map(system => (
                  <div className="ordering-options" key={system}>
                    {!order.includes(system) && (
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
