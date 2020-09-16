import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField, getLock } from 'Utilities/redux/formReducer'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import ReactMarkdown from 'react-markdown'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './Textarea.scss'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import CurrentEditor from './CurrentEditor'
import { Loader } from 'semantic-ui-react'

const MAX_LENGTH = 1100

const deepCheck = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

const translations = {
  loading: {
    fi: 'Valmistellaan tekstieditoria, odota hetki...',
    se: '',
    en: 'Preparing the texteditor, please wait a moment...',
  },
}

const Accordion = ({ previousYearsAnswers, EntityLastYearsAccordion, id }) => {
  if (EntityLastYearsAccordion) return <EntityLastYearsAccordion />

  if (previousYearsAnswers && previousYearsAnswers[`${id}_text`])
    return (
      <LastYearsAnswersAccordion>
        <ReactMarkdown source={previousYearsAnswers[`${id}_text`]} />
      </LastYearsAnswersAccordion>
    )

  return null
}

const Textarea = ({ label, id, required, previousYearsAnswers, EntityLastYearsAccordion }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] || '')
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const ref = useRef(null)

  // check if current user is the editor
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data, deepCheck)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const languageCode = useSelector((state) => state.language)
  const [hasLock, setHasLock] = useState(true)
  const [gettingLock, setGettingLock] = useState(false)
  const someoneElseHasTheLock =
    currentEditors &&
    currentUser &&
    currentEditors[fieldName] &&
    currentEditors[fieldName].uid !== currentUser.uid

  useEffect(() => {
    const gotTheLock =
      currentEditors &&
      currentEditors[fieldName] &&
      currentEditors[fieldName].uid === currentUser.uid

    setHasLock(gotTheLock)
    if (gettingLock && currentEditors[fieldName]) {
      setGettingLock(false)
      if (gotTheLock) ref.current.focusEditor()
    }
  }, [currentEditors])

  useEffect(() => {
    if (!hasLock) {
      setEditorState(editorStateFromRedux())
    }
  }, [dataFromRedux, hasLock])

  const handleChange = (value) => {
    setEditorState(value)
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    const markdownStr = draftToMarkdown(rawObject).substring(0, 1100)
    dispatch(updateFormField(fieldName, markdownStr))
  }

  const editorStateFromRedux = () => {
    const rawData = markdownToDraft(dataFromRedux)
    const contentState = convertFromRaw(rawData)
    return EditorState.createWithContent(contentState)
  }
  const [editorState, setEditorState] = useState(editorStateFromRedux())

  const length = editorState.getCurrentContent().getPlainText().length

  const askForLock = () => {
    if (!hasLock && !gettingLock && currentEditors && !currentEditors[fieldName]) {
      setGettingLock(true)
      dispatch(getLock(fieldName))
    }
  }

  return (
    <div data-cy={`textarea-${id}`} style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <label
          style={{
            margin: '1em 0',
            fontStyle: 'bolder',
            fontSize: '1.1em',
            minWidth: '50%',
          }}
        >
          {label}
          {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
        </label>
        <Accordion
          previousYearsAnswers={previousYearsAnswers}
          EntityLastYearsAccordion={EntityLastYearsAccordion}
          id={id}
        />
      </div>
      {viewOnly ? (
        <ReactMarkdown source={dataFromRedux} />
      ) : (
        <>
          <div onClick={askForLock} style={{ marginTop: '1em' }}>
            {!hasLock && gettingLock && (
              <div style={{ marginBottom: '0.5em' }}>
                <Loader size="small" active inline />
                <span style={{ marginLeft: '1em' }}>{translations.loading[languageCode]}</span>
              </div>
            )}
            <Editor
              editorStyle={{ wordBreak: 'break-word', width: '100%' }}
              ref={ref}
              wrapperClassName="wrapper-class"
              editorClassName={!someoneElseHasTheLock ? 'editor-class' : 'editor-class disabled'}
              toolbarClassName={!someoneElseHasTheLock ? 'toolbar-class' : 'toolbar-class disabled'}
              editorState={editorState}
              onEditorStateChange={handleChange}
              handleBeforeInput={(val) => {
                const textLength = editorState.getCurrentContent().getPlainText().length
                if (val && textLength >= MAX_LENGTH) {
                  return 'handled'
                }
                return 'not-handled'
              }}
              handlePastedText={(val) => {
                const textLength = editorState.getCurrentContent().getPlainText().length
                return val.length + textLength > MAX_LENGTH
              }}
              toolbar={{
                options: ['inline', 'list', 'history'],
                inline: {
                  options: ['bold', 'underline'],
                },
                list: {
                  options: ['unordered', 'ordered'],
                },
              }}
              readOnly={!hasLock}
            />
          </div>
          <span style={{ color: length > MAX_LENGTH - 100 ? 'red' : undefined }}>
            {length}/{MAX_LENGTH - 100}
          </span>
          <CurrentEditor fieldName={fieldName} />
        </>
      )}
    </div>
  )
}

export default Textarea
