import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import ReactMarkdown from 'react-markdown'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './Textarea.scss'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'
import CurrentEditor from './CurrentEditor'

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

  // check if current user is the editor
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const readOnly =
    currentEditors &&
    currentUser &&
    currentEditors[fieldName] &&
    currentEditors[fieldName].uid !== currentUser.uid

  useEffect(() => {
    if (readOnly || (currentEditors && !currentEditors[fieldName])) {
      setEditorState(editorStateFromRedux())
    }
  }, [dataFromRedux])

  const handleChange = (value) => {
    setEditorState(value)
    const content = value.getCurrentContent()
    const rawObject = convertToRaw(content)
    const markdownStr = draftToMarkdown(rawObject)
    dispatch(updateFormField(fieldName, markdownStr))
  }

  const editorStateFromRedux = () => {
    const rawData = markdownToDraft(dataFromRedux)
    const contentState = convertFromRaw(rawData)
    return EditorState.createWithContent(contentState)
  }
  const [editorState, setEditorState] = useState(editorStateFromRedux())

  const length = dataFromRedux.length

  return (
    <div data-cy={`textarea-${id}`} style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <label
          style={{
            fontStyle: 'bolder',
            fontSize: '1.1em',
            minWidth: '50%',
          }}
        >
          {label}
          {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
        </label>
        {
          <Accordion
            previousYearsAnswers={previousYearsAnswers}
            EntityLastYearsAccordion={EntityLastYearsAccordion}
            id={id}
          />
        }
      </div>
      {viewOnly ? (
        <ReactMarkdown source={dataFromRedux} />
      ) : (
        <>
          <div style={{ marginTop: '1em' }}>
            <Editor
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              editorState={editorState}
              onEditorStateChange={handleChange}
              toolbar={{
                options: ['inline', 'list', 'history'],
                inline: {
                  options: ['bold', 'underline'],
                },
                list: {
                  options: ['unordered', 'ordered'],
                },
              }}
              readOnly={readOnly}
            />
          </div>
          <span style={{ color: length > 1000 ? 'red' : undefined }}>{length}/1000</span>
          <CurrentEditor fieldName={fieldName} />
        </>
      )}
    </div>
  )
}

export default Textarea
