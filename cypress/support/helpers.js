export const editorTextHelper = (editorName, textToBeTyped) => {
  cy.get(editorName)
    .find('.editor-class')
    .find('.DraftEditor-root')
    .find('.DraftEditor-editorContainer')
    .find('.public-DraftEditor-content')
    .then((input) => {
      var textarea = input.get(0)
      textarea.dispatchEvent(new Event('focus'))

      var textEvent = document.createEvent('TextEvent')
      textEvent.initTextEvent('textInput', true, true, null, textToBeTyped)
      textarea.dispatchEvent(textEvent)

      textarea.dispatchEvent(new Event('blur'))
    })
}

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
