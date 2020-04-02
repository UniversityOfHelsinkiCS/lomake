import { combineReducers } from 'redux'

import form from './formReducer'
import room from './roomReducer'
import currentUser from './currentUserReducer'
import users from './usersReducer'
import answers from './answersReducer'
import tempAnswers from './tempAnswersReducer'
import currentAnswers from './currentAnswersReducer'
import language from './languageReducer'
import accessToken from './accessTokenReducer'
import previousAnswers from './previousAnswersReducer'
import programmesTokens from './programmesTokensReducer'

export default combineReducers({
  form,
  room,
  currentUser,
  users,
  answers,
  tempAnswers,
  currentAnswers,
  language,
  accessToken,
  previousAnswers,
  programmesTokens
})
