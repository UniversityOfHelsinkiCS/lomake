import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateFormField,
  getLockHttp,
  updateFormFieldExp,
  postIndividualFormPartialAnswer,
} from 'Utilities/redux/formReducer'
import { releaseFieldLocally } from 'Utilities/redux/currentEditorsReducer'
import { Loader, Button, Message } from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Sentry } from 'Utilities/sentry'

import { colors } from 'Utilities/common'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import CurrentEditor from './CurrentEditor'
import './Generic.scss'
import ProgrammeTextAnswerSummary from './ProgrammeTextAnswerSummary'

const deepCheck = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

const Accordion = ({ previousYearsAnswers, previousAnswerColor, previousAnswerText, id }) => {
  if (previousAnswerText || previousAnswerColor)
    return (
      <LastYearsAnswersAccordion>
        {previousAnswerColor && <div className={`circle-big-${previousAnswerColor}`} />}
        <ReactMarkdown>{previousAnswerText}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )

  if (previousYearsAnswers && previousYearsAnswers[`${id}_text`])
    return (
      <LastYearsAnswersAccordion>
        <ReactMarkdown>{previousYearsAnswers[`${id}_text`]}</ReactMarkdown>
      </LastYearsAnswersAccordion>
    )

  return null
}

const Textarea = ({
  label,
  id,
  required,
  previousYearsAnswers,
  previousAnswerText,
  previousAnswerColor,
  summaryData,
  form,
  maxLength,
  marginTop,
  isArviointi,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] || '')
  const room = useSelector(({ room }) => room)
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const ref = useRef(null)
  const [changes, setChanges] = useState(false)

  const formData = useSelector(({ form }) => form.data)

  const MAX_LENGTH = maxLength || form === 5 ? 1600 : 1100

  // check if current user is the editor
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [hasLock, setHasLock] = useState(true)
  const [gettingLock, setGettingLock] = useState(false)
  const [unsavedContent, setUnsavedContent] = useState(false)

  const editorLockError = useSelector(({ currentEditors }) => currentEditors.error)
  const [editorError, setEditorError] = useState()
  const lockRef = useRef(gettingLock)
  lockRef.current = gettingLock
  const [timeoutObject, setTimeoutObject] = useState(null)

  const someoneElseHasTheLock =
    currentEditors && currentUser && currentEditors[fieldName] && currentEditors[fieldName].uid !== currentUser.uid

  const hasSummaryData = Object.keys(summaryData || {}).length > 0 && id.includes('-bachelor')

  useEffect(() => {
    const gotTheLock =
      form === 3 || (currentEditors && currentEditors[fieldName] && currentEditors[fieldName].uid === currentUser.uid)

    setHasLock(gotTheLock)

    if (gettingLock && currentEditors[fieldName]) {
      setGettingLock(false)
      if (gotTheLock) {
        ref.current.focusEditor()
        if (timeoutObject) {
          clearTimeout(timeoutObject)
        }
        if (editorError) {
          setEditorError(null)
        }
      }
    }
  }, [currentEditors])

  const editorStateFromRedux = () => {
    const initialContent = dataFromRedux
    const rawData = markdownToDraft(initialContent)
    const contentState = convertFromRaw(rawData)
    return EditorState.createWithContent(contentState)
  }

  const [editorState, setEditorState] = useState(editorStateFromRedux())

  useEffect(() => {
    // due to async data load, we have to reset the field when the possible data arrives
    if (form === 3 && Object.keys(formData).length > 0) {
      setEditorState(editorStateFromRedux())
    }
  }, [Object.keys(formData).length])

  useEffect(() => {
    if (!hasLock) {
      setEditorState(editorStateFromRedux())
    }
  }, [dataFromRedux, hasLock])

  const handleChange = value => {
    setEditorState(value)
    setChanges(true)
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    const markdownStr = draftToMarkdown(rawObject).substring(0, MAX_LENGTH)
    if (markdownStr !== dataFromRedux) {
      setUnsavedContent(true)
    }

    if (form === 3 && Object.keys(formData).length > 0) {
      dispatch(updateFormFieldExp(fieldName, markdownStr, form))
    } else {
      dispatch(updateFormFieldExp(fieldName, markdownStr, form))
    }
  }

  const handleSave = () => {
    setChanges(false)
    setHasLock(false)
    setUnsavedContent(false)
    dispatch(releaseFieldLocally(fieldName))
    const value = editorState
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    const markdownStr = draftToMarkdown(rawObject).substring(0, MAX_LENGTH)
    if (form === 3) {
      dispatch(postIndividualFormPartialAnswer({ field: fieldName, value: markdownStr }))
    } else {
      dispatch(updateFormField(fieldName, markdownStr, form))
    }
  }

  const { length } = editorState.getCurrentContent().getPlainText()

  const handleLockTimeout = () => {
    if (lockRef.current) {
      setEditorError(true)
      Sentry.captureException(`hyrrä for ${currentUser.uid} room ${room} field ${fieldName}`)
    }
  }

  const askForLock = () => {
    if (form !== 3 && !hasLock && !gettingLock && currentEditors && !currentEditors[fieldName]) {
      setGettingLock(true)
      dispatch(getLockHttp(fieldName, room))
      const timeout = setTimeout(() => {
        handleLockTimeout()
      }, 20000)
      setTimeoutObject(timeout)
    }
  }

  const handlePaste = value => {
    const textLength = editorState.getCurrentContent().getPlainText().length
    const newLength = value.length + textLength
    const isTooLong = newLength > MAX_LENGTH
    // eslint-disable-next-line no-alert
    if (isTooLong) window.alert(t('generic:tooLongPaste', { newLength, MAX_LENGTH }))
    return isTooLong
  }

  const minWidth = form !== 1 ? '100%' : '50%'

  const refreshPage = () => {
    window.location.reload(false)
  }

  const saveButtonLabel = !hasLock || unsavedContent ? t('generic:kludgeButton') : t('generic:kludgeButtonRelease')
  const notSavedInfoText = unsavedContent ? t('generic:textUnsaved') : t('generic:textUnsavedRelease')
  let subTitle = null
  if (form === 6) {
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
    }
  }
  return (
    <div data-cy={`textarea-${id}`} style={{ marginTop: marginTop || 0 }}>
      <div
        className="form-text-area"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {!editorError && !editorLockError && label && (
          <div className="entity-description" style={{ display: 'flex', justifyContent: 'left', minWidth }}>
            <label
              style={{
                fontStyle: 'bolder',
                minWidth: '50%',
                height: 'auto',
              }}
            >
              {label}
              {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
              <Loader
                style={{
                  marginLeft: '1em',
                  visibility: !hasLock && gettingLock ? undefined : 'hidden',
                }}
                size="small"
                active
                inline
              />
            </label>
          </div>
        )}
        {(editorError || editorLockError) && !hasLock && (
          <Message negative>
            <Message.Header>{t('formView:formError')}</Message.Header>
            <Button style={{ marginTop: 10 }} onClick={refreshPage}>
              {t('formView:formErrorButton')}
            </Button>
          </Message>
        )}
        <Accordion
          previousYearsAnswers={previousYearsAnswers}
          previousAnswerColor={previousAnswerColor}
          previousAnswerText={previousAnswerText}
          id={id}
        />
      </div>
      {hasSummaryData && <ProgrammeTextAnswerSummary questionId={id} summaryData={summaryData} form={form} />}
      {subTitle && <h3> {subTitle}</h3>}
      {viewOnly ? (
        <ReactMarkdown>{dataFromRedux}</ReactMarkdown>
      ) : (
        <>
          <div style={{ marginTop: '1em' }}>
            <div data-cy={`editing-area-${id}`} onClick={askForLock}>
              <Editor
                editorStyle={{ wordBreak: 'break-word', width: '100%' }}
                ref={ref}
                wrapperClassName="wrapper-class"
                editorClassName={!someoneElseHasTheLock ? 'editor-class' : 'editor-class disabled'}
                toolbarClassName={!someoneElseHasTheLock ? 'toolbar-class' : 'toolbar-class disabled'}
                editorState={editorState}
                onEditorStateChange={handleChange}
                handleBeforeInput={val => {
                  const textLength = editorState.getCurrentContent().getPlainText().length
                  if (val && textLength >= MAX_LENGTH) {
                    return 'handled'
                  }
                  return 'not-handled'
                }}
                handlePastedText={handlePaste}
                toolbar={{
                  options: ['inline', 'list', 'history'],
                  inline: {
                    options: ['bold'],
                  },
                  list: {
                    options: ['unordered', 'ordered'],
                  },
                }}
                readOnly={!hasLock}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!changes}
              style={{ marginTop: 20, marginBottom: 10 }}
              data-cy={`save-button-${id}`}
            >
              {saveButtonLabel}
            </Button>
            {changes && (
              <span style={{ marginLeft: '1em', color: unsavedContent ? 'red' : '' }}>{notSavedInfoText}</span>
            )}
          </div>
          <span style={{ color: length > MAX_LENGTH - 100 ? colors.red : undefined }}>
            {length}/{MAX_LENGTH - 100}
          </span>
          <CurrentEditor fieldName={fieldName} />
        </>
      )}
    </div>
  )
}

export default Textarea
