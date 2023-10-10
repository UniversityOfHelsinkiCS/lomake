import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateFormField,
  getLock,
  updateFormFieldExp,
  postIndividualFormPartialAnswer,
} from 'Utilities/redux/formReducer'
import { Loader, Button } from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { colors } from 'Utilities/common'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import CurrentEditor from './CurrentEditor'
import './Generic.scss'

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
  form,
  maxLength,
  marginTop,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const ref = useRef(null)

  const [changes, setChanges] = useState(false)

  const formData = useSelector(({ form }) => form.data)

  const MAX_LENGTH = maxLength || 1100

  // check if current user is the editor
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const [hasLock, setHasLock] = useState(true)
  const [gettingLock, setGettingLock] = useState(false)

  const someoneElseHasTheLock =
    currentEditors && currentUser && currentEditors[fieldName] && currentEditors[fieldName].uid !== currentUser.uid

  useEffect(() => {
    const gotTheLock =
      form === 3 || (currentEditors && currentEditors[fieldName] && currentEditors[fieldName].uid === currentUser.uid)

    setHasLock(gotTheLock)

    if (gettingLock && currentEditors[fieldName]) {
      setGettingLock(false)
      if (gotTheLock) ref.current.focusEditor()
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
    const markdownStr = draftToMarkdown(rawObject).substring(0, 1100)
    // prevent a too early dispatch
    if (form === 3 && Object.keys(formData).length > 0) {
      dispatch(updateFormFieldExp(fieldName, markdownStr, form))
      // dispatch(postIndividualFormPartialAnswer({ field: fieldName, value: markdownStr }))
    } else {
      dispatch(updateFormFieldExp(fieldName, markdownStr, form))
      // dispatch(updateFormField(fieldName, markdownStr, form))
    }
  }

  // eslint-disable-next-line no-unused-vars
  const handleBlur = () => {
    // setChanges(false)
    const value = editorState
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    // eslint-disable-next-line no-unused-vars
    const markdownStr = draftToMarkdown(rawObject).substring(0, 1100)
    if (form === 3) {
      // dispatch(postIndividualFormPartialAnswer({ field: fieldName, value: markdownStr }))
    } else {
      // dispatch(updateFormField(fieldName, markdownStr, form))
    }
  }

  // we could start saving on click instead on blur, in some cases the blur does not seem to work
  // eslint-disable-next-line no-unused-vars
  const handleSave = () => {
    setChanges(false)
    const value = editorState
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    const markdownStr = draftToMarkdown(rawObject).substring(0, 1100)
    if (form === 3) {
      dispatch(postIndividualFormPartialAnswer({ field: fieldName, value: markdownStr }))
    } else {
      dispatch(updateFormField(fieldName, markdownStr, form))
    }
  }

  const { length } = editorState.getCurrentContent().getPlainText()

  const askForLock = () => {
    if (form !== 3 && !hasLock && !gettingLock && currentEditors && !currentEditors[fieldName]) {
      setGettingLock(true)
      dispatch(getLock(fieldName))
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <label
            style={{
              fontStyle: 'bolder',
              fontSize: '1.3em',
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
        <Accordion
          previousYearsAnswers={previousYearsAnswers}
          previousAnswerColor={previousAnswerColor}
          previousAnswerText={previousAnswerText}
          id={id}
        />
      </div>
      {viewOnly ? (
        <ReactMarkdown>{dataFromRedux}</ReactMarkdown>
      ) : (
        <>
          <div data-cy={`editing-area-${id}`} onClick={askForLock} style={{ marginTop: '1em' }}>
            <Editor
              // onBlur={handleBlur}
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
            <Button
              onClick={handleSave}
              disabled={!changes}
              style={{ marginTop: 20, marginBottom: 10 }}
              data-cy={`save-button-${id}`}
            >
              {t('generic:kludgeButton')}
            </Button>
            {changes && <span style={{ marginLeft: '1em', color: 'red' }}>{t('generic:textUnsaved')}</span>}
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
