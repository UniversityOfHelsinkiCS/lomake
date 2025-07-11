import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Icon, Grid, Card } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { updateFormField } from '../../redux/formReducer'
import { colors } from '../../util/common'
import { formKeys } from '../../../config/data'
import ActionElement from './ActionElement'
import './Generic.scss'
import ProgrammeAnswerSummaryList from './ProgrammeAnswerSummaryList'

const Actions = ({
  id,
  label,
  description,
  form,
  required,
  extrainfo,
  programme,
  summaryData,
  questionLevel,
  isArviointi = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.data)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const actionsList = Object.keys(formData).filter(questionId => questionId.includes(id)) || []
  const actionsCount = actionsList.length
  const lang = useSelector(state => state.language)
  const [showText, setShowText] = useState({})
  const [showSpecific, setShowSpecific] = useState([])
  const onlyBc = programme === 'H74'

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

  const handleAdd = () => {
    dispatch(updateFormField(`${id}-${actionsCount + 1}-text`, { title: '', actions: '' }, form))
  }

  const previousHasContent = () => {
    if (!formData[`${id}-${actionsCount}-text`]) {
      return false
    }
    const latest = formData[`${id}-${actionsCount}-text`]
    return latest.title.length > 0 || latest.actions.length > 0
  }

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

  let subTitle = null
  if (form === formKeys.EVALUATION_COMMTTEES) {
    if (id.indexOf('-bachelor') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:bachelorUniForm')
      } else {
        subTitle = `${t('bachelor')}`
      }
    } else if (id.indexOf('-master') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:masterUniForm')
      } else {
        subTitle = `${t('master')}`
      }
    } else if (id.indexOf('-doctoral') > -1) {
      if (!isArviointi) {
        subTitle = t('formView:doctoralUniForm')
      } else {
        subTitle = `${t('doctoral')}`
      }
    } else if (id.indexOf('-overall') > -1) {
      subTitle = `${t('formView:overallActionSummaryTitle')}`
    }
  }

  const summaryTitle =
    form === formKeys.EVALUATION_COMMTTEES
      ? 'formView:universityActionSummaryTitle'
      : 'formView:facultyActionSummaryTitle'

  const showSummary =
    (form === formKeys.EVALUATION_COMMTTEES && subTitle === t('formView:bachelorUniForm')) ||
    form === formKeys.EVALUATION_FACULTIES

  const showDescription = subTitle === t('formView:bachelorUniForm') || form !== 6

  const actionRenderList = actionsList.length > 0 ? actionsList : ['action-1']

  return (
    <div
      className="form-entity-area"
      style={{
        borderLeft: isArviointi ? 0 : '5px solid',
        borderColor: colors.background_black,
        padding: '1em',
      }}
    >
      {id.indexOf('-bachelor') === -1 && <Divider />}
      {showDescription && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '1000px' }}>
              <h2>
                {label}{' '}
                {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
              </h2>
            </div>
          </div>
          <div
            className="entity-description"
            style={{
              lineHeight: 2,
              backgroundColor: colors.background_beige,
              padding: '1em',
              borderRadius: '5px',
              margin: '1em 0',
            }}
          >
            <p> {description}</p>
            <p className="form-question-extrainfo">{extrainfo}</p>
          </div>
        </>
      )}
      {questionLevel && <h3>{questionLevel[lang]}</h3>}

      {showSummary && (
        <div className="summary-container">
          <h4>{t(summaryTitle)}</h4>
          <div className="summary-grid" data-cy={`${id}-summary`}>
            <Grid columns={4}>
              <Grid.Row className="row">
                {form === formKeys.EVALUATION_FACULTIES && (
                  <>
                    <Grid.Column width={5} style={getStyleForm('bachelor')}>
                      {t('bachelor')}
                    </Grid.Column>
                    <Grid.Column width={5} style={getStyleForm('master')}>
                      {!onlyBc ? t('master') : ''}
                    </Grid.Column>
                    <Grid.Column width={5} style={getStyleForm('doctoral')}>
                      {!onlyBc ? t('doctoral') : ''}
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
                          onlyBc={false}
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
                          onlyBc={onlyBc}
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
                          onlyBc={onlyBc}
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
                        onlyBc={onlyBc}
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
                  {showText.level &&
                    Object.keys(summaryData[showText.level]).map(programmeKey => {
                      return (
                        <div
                          key={programmeKey}
                          style={{ marginRight: '1em', marginTop: '1em', flex: 1, maxWidth: '15em' }}
                        >
                          <p
                            style={{ height: '5em' }}
                            key={`${summaryData[showText.level][programmeKey].programme[lang]}`}
                          >
                            <span className="answer-circle-blue" />{' '}
                            <span
                              className="programme-list-button"
                              onClick={() => handleShowSpecific(programmeKey)}
                              style={{ marginLeft: '0.5em', fontSize: 16 }}
                            >
                              {summaryData[showText.level][programmeKey].programme[lang]}
                            </span>
                          </p>
                          {(showText || showSpecific[programmeKey]) && summaryData[showText.level][programmeKey] && (
                            <>
                              {summaryData[showText.level][programmeKey].text.map((answer, i) => {
                                if (!(answer.title.length > 2) && !(answer.content?.length > 2)) {
                                  // eslint-disable-next-line react/no-array-index-key
                                  return <div key={`${id}-${programmeKey}-${i}`}> </div>
                                }
                                return (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <Card key={`${id}-${programmeKey}-${i}`}>
                                    <Card.Content>
                                      <Card.Header style={{ fontSize: 15 }}>{answer.title}</Card.Header>
                                      <Card.Description style={{ overflowWrap: 'anywhere' }}>
                                        {answer.content}
                                      </Card.Description>
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
      )}
      {subTitle && <h3>{subTitle}</h3>}

      {actionRenderList.map((action, index) => {
        return <ActionElement key={`action-${index + 1}`} id={id} form={form} viewOnly={viewOnly} index={index + 1} />
      })}
      <div style={{ display: 'flex' }}>
        {actionsCount < 5 && !viewOnly && (
          <Button
            data-cy={`${id}-add-action-button`}
            icon
            basic
            labelPosition="left"
            color="blue"
            onClick={handleAdd}
            disabled={!previousHasContent()}
          >
            <Icon name="add" />
            {t('formView:addDevelopmentArea')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Actions
