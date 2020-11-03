import { combineReducers } from 'redux'

import form from './formReducer'
import room from './roomReducer'
import currentUser from './currentUserReducer'
import filter from './filterReducer'
import users from './usersReducer'
import tempAnswers from './tempAnswersReducer'
import oldAnswers from './oldAnswersReducer'
import language from './languageReducer'
import accessToken from './accessTokenReducer'
import previousAnswers from './previousAnswersReducer'
import programmeLevel from './programmeLevelReducer'
import programmesTokens from './programmesTokensReducer'
import programmesUsers from './programmesUsersReducer'
import studyProgrammes from './studyProgrammesReducer'
import deadlines from './deadlineReducer'
import currentEditors from './currentEditorsReducer'
import faculties from './facultyReducer'

export default combineReducers({
  form,
  room,
  currentUser,
  filter,
  users,
  tempAnswers,
  oldAnswers,
  language,
  accessToken,
  previousAnswers,
  programmeLevel,
  programmesTokens,
  programmesUsers,
  studyProgrammes,
  deadlines,
  currentEditors,
  faculties,
})
