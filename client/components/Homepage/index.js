/* eslint-disable no-nested-ternary */
import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NoPermissions from 'Components/Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '@root/config/common'
import {
  Container,
  Header,
  Grid,
  Divider,
  Item,
  ItemMeta,
  ItemHeader,
  ItemGroup,
  Button,
  Icon,
} from 'semantic-ui-react'
import { formKeys, forms } from '@root/config/data'
import powerlineImage from 'Assets/APowerlineTower.png'
import rypsiImage from 'Assets/rypsi.jpg'
import wheelImage from 'Assets/big_wheel.jpg'
import calendarImage from 'Assets/calendar.jpg'

const PageItem = ({ title, content }) => (
  <div style={{ marginBottom: '30px' }}>
    <Header as="h3" style={{ textAlign: 'center' }}>
      {title.toUpperCase()}
    </Header>
    <Container textAlign="justified">{content}</Container>
  </div>
)

export const DateItem = ({ timestamp, t }) => {
  const date = new Date(timestamp)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1 // getUTCMonth() returns 0-11
  const day = date.getUTCDate()

  let hours = date.getUTCHours()
  if (hours.toString().length === 1) hours = `0${hours.toString()}`
  let minutes = date.getUTCMinutes()
  if (minutes.toString().length === 1) minutes = `0${minutes.toString()}`

  return (
    <p>
      {t('formCloses')}: {day}/{month}/{year} {t('clock')}: {hours}:{minutes}
    </p>
  )
}

const Homepage = () => {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.currentUser)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
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
      show: Object.keys(currentUser).length > 0,
      title: t('yearlyAssessment'),
      content: (
        <div>
          <p>{t('yearlyAssessmentText')}</p>
        </div>
      ),
      links: ['/yearly'],
      forms: [1],
      thumbnail: rypsiImage,
    },
    {
      show: Object.keys(currentUser).length > 0,
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
      show: Object.keys(currentUser).length > 0,
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
      show: Object.keys(currentUser).length > 0,
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
    {
      show: isAdmin(currentUser.data),
      title: t('adminPage'),
      content: (
        <div>
          <p>{t('adminpageText')}</p>
        </div>
      ),
    },
  ]

  const getItem = formId => {
    const item = items.find(item => item.forms && item.forms.includes(formId))
    return item
  }

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
            <Grid.Column>
              {items.map(
                (item, index) =>
                  item.show && (
                    <Fragment key={item.title}>
                      <PageItem title={item.title} content={item.content} />
                      {index !== items.length - 1 ? <Divider section /> : null}
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
                  return (
                    <ItemGroup divided key={dl.form}>
                      <Item>
                        <div
                          style={{
                            width: '150px',
                            height: '100px',
                            overflow: 'hidden',
                            position: 'relative',
                            marginRight: '10px',
                          }}
                        >
                          <img
                            src={item.thumbnail}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            alt={`Thumbnail for ${forms[dl.form - 1].name}`}
                          />
                        </div>{' '}
                        <Item.Content>
                          <ItemHeader as="h3">{forms[dl.form - 1].name}</ItemHeader>
                          <ItemMeta>
                            <span>
                              <DateItem timestamp={dl.date} t={t} />
                            </span>
                          </ItemMeta>
                          {item.links.map(link => (
                            <Button key={link} as={Link} to={link}>
                              {t('overview')}
                              <Icon name="right chevron" />
                            </Button>
                          ))}
                        </Item.Content>
                      </Item>
                    </ItemGroup>
                  )
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
