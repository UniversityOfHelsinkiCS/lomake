/* eslint-disable no-nested-ternary */
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from 'Components/Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { Container, Header, Grid, Divider, Loader, List } from 'semantic-ui-react'
import { formKeys } from '@root/config/data'
import rypsiImage from 'Assets/rypsi.jpg'
import wheelImage from 'Assets/big_wheel.jpg'
import calendarImage from 'Assets/calendar.jpg'
import powerlineImage from 'Assets/APowerlineTower.jpg'
import { PageItem, FormCard } from '../Generic/Homepage'

const Homepage = () => {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.currentUser)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { nextDeadline } = useSelector(state => state.deadlines)
  const [deadlineInfo, setDeadlineInfo] = useState([])
  const header = 'tilannekuvalomake'

  const access = Object.keys(currentUser).length > 0

  useEffect(() => {
    document.title = 'Tilannekuvalomake'

    let tempDl = []
    Object.keys(formKeys).forEach(form => {
      const foundDeadline = nextDeadline?.find(a => a.form === formKeys[form])
      if (foundDeadline) {
        tempDl = [...tempDl, foundDeadline]
      }
    })

    setDeadlineInfo(tempDl)
  }, [formKeys])

  const items = [
    {
      show: access,
      title: t('yearlyAssessment'),
      content: (
        <List bulleted>
          <List.Item>
            <i>Vuosiseurantalomake ja sen yleiskatsaus</i>
          </List.Item>
        </List>
      ),
      links: ['/yearly'],
      forms: [1],
      thumbnail: rypsiImage,
    },
    {
      show: access,
      title: t('evaluation'),
      content: (
        <div>
          <p>{t('evaluationText')}</p>
        </div>
      ),
      links: [],
      forms: [4, 5, 6],
      thumbnail: calendarImage,
    },
    {
      show: access,
      title: t('degree-reform'),
      content: (
        <div>
          <p>{t('degreeReformText')}</p>
        </div>
      ),
      links: [],
      forms: [2, 3],
      thumbnail: wheelImage,
    },
    {
      show: false,
      title: t('metaevaluation'),
      content: (
        <div>
          <p>{t('metaevaluationText')}</p>
        </div>
      ),
      links: ['/meta-evaluation'],
      forms: [7],
      thumbnail: powerlineImage,
    },
  ]

  const getItem = formId => {
    const item = items.find(item => item.forms && item.forms.includes(formId))
    return item
  }

  if (!usersProgrammes) return <Loader active />

  if (usersProgrammes.length + Object.keys(currentUser.data.access).length < 1) {
    return <NoPermissions t={t} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Container style={{ paddingTop: 50, marginBottom: '30px' }} textAlign="justified">
        <Header as="h1" style={{ textAlign: 'center' }}>
          {header.toUpperCase()}
        </Header>
        <p style={{ textAlign: 'center' }}>{t('description')}</p>
        <Grid columns={2} divided style={{ marginTop: '40px' }}>
          <Grid.Row>
            <Grid.Column style={{ display: 'flex', flexDirection: 'column', alingItems: 'left' }}>
              {items.map(
                (item, index) =>
                  item.show && (
                    <Fragment key={item.title}>
                      <PageItem title={item.title} content={item.content} />
                      {index !== items.length - 2 ? <Divider section /> : null}
                    </Fragment>
                  ),
              )}
            </Grid.Column>
            <Grid.Column style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
              <Header as="h3">{t('timesensitive')}</Header>
              {deadlineInfo.length > 0 && <p>{t('timesensitiveDesc')}</p>}
              {deadlineInfo.length > 0 ? (
                deadlineInfo.map(dl => {
                  const item = getItem(dl.form)
                  return <FormCard key={dl.form} item={item} dl={dl} t={t} />
                })
              ) : (
                <Header as="h3">{t('noTimesensitive')}</Header>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  )
}

export default Homepage
