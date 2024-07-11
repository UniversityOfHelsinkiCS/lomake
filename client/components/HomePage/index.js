import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import NoPermissions from 'Components/Generic/NoPermissions'
import { useTranslation } from 'react-i18next'
import { Container, Header, Grid, Divider } from 'semantic-ui-react'

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
  const header = 'tilannekuvalomake'

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
        <Header as="h2" style={{ textAlign: 'center' }}>
          {t('latest').toUpperCase()}
        </Header>
        <Grid columns={2} style={{ marginTop: '40px' }}>
          <Grid.Row>
            <Grid.Column>
              {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={`${index}-${item.title}`}>
                  <PageItem key={item.title} title={item.title} content={item.content} />
                  {index !== items.length - 1 ? <Divider section /> : null}
                </Fragment>
              ))}
            </Grid.Column>
            <Grid.Column>
              <Header as="h3">{t('timesensitive')}</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  )
}

export default HomePage
