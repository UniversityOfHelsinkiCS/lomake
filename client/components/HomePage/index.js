/* eslint-disable no-nested-ternary */
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from 'Components/Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '@root/config/common'
import { Container, Header, Grid, Divider } from 'semantic-ui-react'
import { formKeys } from '@root/config/data'

const PageItem = ({ title, content }) => (
  <div style={{ marginBottom: '30px' }}>
    <Header as="h3" style={{ textAlign: 'center' }}>
      {title.toUpperCase()}
    </Header>
    <Container textAlign="justified">{content}</Container>
  </div>
)

const DateItem = ({ timestamp, t }) => {
  const date = new Date(timestamp)

  // Extract date
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1 // getUTCMonth() returns 0-11
  const day = date.getUTCDate()

  // Extract time
  let hours = date.getUTCHours()
  if (hours.toString().length === 1) hours = `0${hours.toString()}`
  let minutes = date.getUTCMinutes()
  if (minutes.toString().length === 1) minutes = `0${minutes.toString()}`

  return (
    <p>
      {day}/{month}/{year} {t('clock')}: {hours}:{minutes}
    </p>
  )
}

const HomePage = () => {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.currentUser)
  const { nextDeadline } = useSelector(state => state.deadlines)
  const [deadlineInfo, setDeadlineInfo] = useState([])
  const header = 'tilannekuvalomake'

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
      title: t('yearlyAssessment'),
      content: (
        <div>
          <p>{t('yearlyAssessmentText')}</p>
        </div>
      ),
      links: ['/yearly'],
    },
    {
      title: t('evaluation'),
      content: (
        <div>
          <p>{t('evaluationText')}</p>
        </div>
      ),
      links: ['/evaluation', '/evaluation-faculty', 'evaluation-university/form/6/UNI', '/evaluation-university'],
    },
    {
      title: t('degree-reform'),
      content: (
        <div>
          <p>{t('degreeReformText')}</p>
        </div>
      ),
      links: ['/degree-reform', '/reform-answers', '/individual'],
    },
    {
      title: t('metaevaluation'),
      content: (
        <div>
          <p>{t('metaevaluationText')}</p>
        </div>
      ),
      links: ['/meta-evaluation', '/meta-evaluation/doctor'],
    },
  ]

  if (Object.keys(currentUser.data.access).length < 1) {
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
            <Grid.Column>
              {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={`${index} -${item.title} `}>
                  <PageItem key={item.title} title={item.title} content={item.content} />
                  {!isAdmin(currentUser.data) ? (
                    index !== items.length - 1 ? (
                      <Divider section />
                    ) : null
                  ) : (
                    <Divider section />
                  )}
                </Fragment>
              ))}
              {isAdmin(currentUser.data) && (
                <Fragment key="adminpage">
                  <PageItem key="admini" title={t('adminPage')} content={t('adminpageText')} />
                </Fragment>
              )}
            </Grid.Column>
            <Grid.Column style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Header as="h3">{t('timesensitive')}</Header>
              {deadlineInfo.length > 0 && <p>{t('timesensitiveDesc')}</p>}
              {deadlineInfo.length > 0 ? (
                deadlineInfo.map(dl => {
                  return <DateItem timestamp={dl.date} t={t} />
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

export default HomePage
