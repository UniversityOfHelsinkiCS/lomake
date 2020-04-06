import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import ReactMarkdown from 'react-markdown'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './Textarea.scss'
import LastYearsAnswersAccordion from './LastYearsAnswersAccordion'

const Textarea = ({ label, id, required, previousYearsAnswers }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const dataFromRedux = useSelector(({ form }) => form.data[fieldName] || '')

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

  const previousAnswerText = previousYearsAnswers ? previousYearsAnswers[`${id}_text`] : null

  return (
    <div style={{ margin: '1em 0' }}>
      <label style={{ fontStyle: 'bold' }}>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
      </label>
      {previousAnswerText && (
        <LastYearsAnswersAccordion>
          <ReactMarkdown source={previousAnswerText} />
        </LastYearsAnswersAccordion>
      )}
      <Editor
        editorState={editorState}
        onEditorStateChange={handleChange}
        editorClassName="editor-class"
        toolbar={{
          options: ['inline', 'list', 'link', 'embedded', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline'],
          },
          list: {
            options: ['unordered', 'ordered'],
          },
        }}
      />
      <span style={{ color: length > 1000 ? 'red' : undefined }}>{length}/1000</span>
    </div>
  )
}

export default Textarea
