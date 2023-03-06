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
    setOrder([...order, id])
  }

  const noAnswers = (!selections && !otherText) || !Object.values(selections).some(value => value)

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
        <h4>{t('formView:noSystemsSelected')}</h4>
      ) : (
        <Segment placeholder>
          <Grid columns={2} divided verticalAlign="top">
            <Grid.Row>
              <Grid.Column textAlign="left">
                <Header>Hyödyllisimmät palautejärjestelmät</Header>
                <div>
                  <p>
                    <b>1.</b> {order[0] ? options[order[0]][lang] : ''}
                  </p>
                  <p>
                    <b>2.</b> {order[1] ? options[order[1]][lang] : ''}
                  </p>
                  <p>
                    <b>3.</b> {order[2] ? options[order[2]][lang] : ''}
                  </p>
                </div>
              </Grid.Column>
              <Grid.Column textAlign="left">
                <Header>Valitse järjestelmä</Header>
                {getUsedSystems().map(system => (
                  <div className="ordering-options">
                    {options[system] && !order.includes(system) && (
                      <Button onClick={(e, data) => handleClick(data.id)} id={system} disabled={viewOnly}>
                        {options[system][lang]}
                      </Button>
                    )}
                    {!options[system] && (
                      <Button onClick={(e, data) => handleClick(data.id)} id={system} disabled={viewOnly}>
                        {system}
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
