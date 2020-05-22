export const getEditorInputLength = (editorName) => {
  return cy
    .get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .then((input) => {
      var textarea = input.get(0)
      return textarea.textContent.length
    })
}
