import React, { useState } from 'react'
import { Grid, Button, Card } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { formKeys } from '@root/config/data'
import ProgrammeAnswerSummaryList from './ProgrammeAnswerSummaryList'

const ProgrammeTextAnswerSummary = ({ questionId, summaryData, form }) => {
  const { t } = useTranslation()

  const lang = useSelector(state => state.language)

  const [showText, setShowText] = useState({})
  const [showSpecific, setShowSpecific] = useState([])

  const getStyleForm = level => {
    if (showText?.level === level) {
      return {
        fontStyle: 'italic',
        background: '#CDCDCD',
        padding: 10,
      }
    }
    return {
      padding: 10,
    }
  }

  const handleShowText = level => {
    if (showText.level === level) {
      setShowText({})
      return true
    }
    setShowText({ level })
    return true
  }

  const handleShowSpecific = programme => {
    if (!showSpecific[programme]) {
      setShowSpecific({ ...showSpecific, [programme]: true })
    } else {
      setShowSpecific({ ...showSpecific, [programme]: !showSpecific[programme] })
    }
  }
  const summaryTitle =
    form && form === formKeys.EVALUATION_COMMTTEES ? 'formView:universitySummaryTitle' : 'formView:facultySummaryTitle'

  return (
    <div className="summary-container">
      <h4>{t(summaryTitle)}</h4>
      <div className="summary-grid" data-cy={`${questionId}-summary`}>
        <Grid columns={4}>
          <Grid.Row className="row">
            {form === formKeys.EVALUATION_FACULTIES && (
              <>
                <Grid.Column width={5} style={getStyleForm('bachelor')}>
                  {t('bachelor')}
                </Grid.Column>
                <Grid.Column width={5} style={getStyleForm('master')}>
                  {t('master')}
                </Grid.Column>
                <Grid.Column width={5} style={getStyleForm('doctoral')}>
                  {t('doctoral')}
                </Grid.Column>
              </>
            )}
            <Grid.Column width={1} />
          </Grid.Row>

          <>
            <Grid.Row className="row">
              {form === formKeys.EVALUATION_FACULTIES && (
                <>
                  <Grid.Column width={5}>
                    <ProgrammeAnswerSummaryList
                      data={summaryData.bachelor}
                      lang={lang}
                      showText={showText.bachelor}
                      showSpecific={showSpecific}
                      handleShowSpecific={handleShowSpecific}
                    />
                    <Button onClick={() => handleShowText('bachelor', !showText.bachelor)}>
                      {showText?.level === 'bachelor' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <ProgrammeAnswerSummaryList
                      data={summaryData.master}
                      lang={lang}
                      showText={showText.master}
                      showSpecific={showSpecific}
                      handleShowSpecific={handleShowSpecific}
                    />
                    <Button onClick={() => handleShowText('master', !showText.master)}>
                      {showText?.level === 'master' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <ProgrammeAnswerSummaryList
                      data={summaryData.doctoral}
                      lang={lang}
                      showText={showText.doctoral}
                      showSpecific={showSpecific}
                      handleShowSpecific={handleShowSpecific}
                    />
                    <Button onClick={() => handleShowText('doctoral', !showText.doctoral)}>
                      {showText?.level === 'doctoral' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                    </Button>
                  </Grid.Column>
                </>
              )}
              {form === formKeys.EVALUATION_COMMTTEES && (
                <Grid.Column width={5}>
                  <ProgrammeAnswerSummaryList
                    data={summaryData.faculty}
                    lang={lang}
                    showText={showText.faculty}
                    showSpecific={showSpecific}
                    handleShowSpecific={handleShowSpecific}
                  />
                  <Button onClick={() => handleShowText('faculty', !showText.faculty)}>
                    {showText?.level === 'faculty' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                  </Button>
                </Grid.Column>
              )}
            </Grid.Row>
            <Grid.Row className="row">
              {showText.level && Object.keys(summaryData[showText.level]).length === 0 && (
                <div style={{ marginLeft: '0.5em' }}>{t('generic:noAnswerData')}</div>
              )}
              {showText.level &&
                Object.keys(summaryData[showText.level]).map(programmeKey => {
                  return (
                    <div key={programmeKey} style={{ marginRight: '1em', marginTop: '1em', flex: 1, maxWidth: '15em' }}>
                      <p style={{ height: '5em' }} key={`${summaryData[showText.level][programmeKey].programme[lang]}`}>
                        <span className="answer-circle-blue" />{' '}
                        <span
                          className="programme-list-button"
                          onClick={() => handleShowSpecific(programmeKey)}
                          style={{ marginLeft: '0.5em' }}
                        >
                          {summaryData[showText.level][programmeKey].programme[lang]}
                        </span>
                      </p>
                      {(showText || showSpecific[programmeKey]) && summaryData[showText.level][programmeKey] && (
                        <>
                          {summaryData[showText.level][programmeKey].text.map(answer => {
                            return (
                              <Card key={`${questionId}-${programmeKey}`}>
                                <Card.Content>
                                  <Card.Header>{answer.title}</Card.Header>
                                  <Card.Description>{answer.content}</Card.Description>
                                </Card.Content>
                              </Card>
                            )
                          })}
                        </>
                      )}
                    </div>
                  )
                })}
            </Grid.Row>
          </>
        </Grid>
      </div>
    </div>
  )
}

export default ProgrammeTextAnswerSummary
