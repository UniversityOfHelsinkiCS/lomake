import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getPreviousAnswersAction = programme => {
  const route = `/answers/${programme}/previous`
  const prefix = 'GET_PREVIOUS_ANSWERS'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_PREVIOUS_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PREVIOUS_ANSWERS_SUCCESS': {
      const formattedStrings = action.response.data
        ? Object.entries(action.response.data).reduce((prev, curr) => {
            let temp = curr[1].replace(/_x000D_\n/g, '\n\n') // for example in bsc comp science
            temp = temp.replace(/\n•/g, '\n\n•') // for example in master of arts

            return (prev = {
              ...prev,
              [curr[0]]: temp,
            })
          }, {})
        : undefined

      return {
        ...state,
        data: {
          ...action.response,
          data: formattedStrings,
        },
        pending: false,
        error: false,
      }
    }
    case 'GET_PREVIOUS_ANSWERS_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
