import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from 'Components/Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '@root/config/common'
import { Container, Header, Grid, Divider, Message } from 'semantic-ui-react'
import { formKeys, forms } from '@root/config/data'

const PageItem = ({ title, content }) => (
  <div style={{ marginBottom: '30px' }}>
    <Header as="h3" style={{ textAlign: 'center' }}>
      {title.toUpperCase()}
    </Header>
    <Container textAlign="justified">{content}</Container>
  </div>
)

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
    },
    {
      title: t('evaluation'),
      content: (
        <div>
          <p>{t('evaluationText')}</p>
        </div>
      ),
    },
    {
      title: t('degreeReform'),
      content: (
        <div>
          <p>{t('degreeReformText')}</p>
        </div>
      ),
    },
    {
      title: t('metaevaluation'),
      content: (
        <div>
          <p>{t('metaevaluationText')}</p>
        </div>
      ),
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
        <Grid columns={2} style={{ marginTop: '40px' }}>
          <Grid.Row>
            <Grid.Column>
              {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={`${index}-${item.title}`}>
                  <PageItem key={item.title} title={item.title} content={item.content} />
                  {
                    // eslint-disable-next-line
                    !isAdmin(currentUser.data) ? (
                      index !== items.length - 1 ? (
                        <Divider section />
                      ) : null
                    ) : (
                      <Divider section />
                    )
                  }
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
              {deadlineInfo.length > 0 && <p>{t('users:openForms')}</p>}
              {deadlineInfo.length > 0 ? (
                deadlineInfo.map(dl => {
                  return (
                    <Message
                      key={dl.createdAt + dl.updatedAt}
                      icon="clock"
                      header={`${forms[dl.form - 1].name}: ${t('formView:status:open')}`}
                      content={`${t('formCloses')}: ${dl.date}`}
                    />
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

export default HomePage
