import { combineReducers } from 'redux'

import form from './formReducer'
import room from './roomReducer'
import currentUser from './currentUserReducer'
import filters from './filterReducer'
import users from './usersReducer'
import tempAnswers from './tempAnswersReducer'
import oldAnswers from './oldAnswersReducer'
import language from './languageReducer'
import previousAnswers from './previousAnswersReducer'
import programmesUsers from './programmesUsersReducer'
import studyProgrammes from './studyProgrammesReducer'
import deadlines from './deadlineReducer'
import currentEditors from './currentEditorsReducer'
import faculties from './facultyReducer'
import summaries from './summaryReducer'
import reformAnswers from './reformAnswerReducer'
import doctoral from './doctoralReducer'

export default combineReducers({
  form,
  room,
  currentUser,
  filters,
  users,
  tempAnswers,
  oldAnswers,
  language,
  previousAnswers,
  programmesUsers,
  studyProgrammes,
  deadlines,
  currentEditors,
  faculties,
  summaries,
  reformAnswers,
  doctoral,
})
